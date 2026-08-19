import { readFile } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";
import matter from "gray-matter";
import YAML from "yaml";
import { z } from "zod";
import type { WorkflowDefinition } from "../../shared/types.js";

const nodeBase = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  label: z.string().min(2),
  dependsOn: z.array(z.string()).default([]),
  outputs: z.array(z.string()).default([]),
});

const agentNode = nodeBase.extend({
  type: z.literal("agent"),
  agent: z.string().min(1),
  webSearch: z
    .object({
      allowed: z.literal(true),
      defaultEnabled: z.boolean(),
    })
    .optional(),
});

const humanNode = nodeBase.extend({
  type: z.literal("human-input"),
  form: z.object({
    kind: z.enum(["question-set", "long-text"]),
    source: z.string().optional(),
    context: z.array(z.string()).optional(),
    skippable: z.boolean().optional(),
  }),
});

const workflowSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  source: z.string().min(1),
  defaults: z.object({
    model: z.string().min(1),
    maxParallelAgents: z.number().int().min(1).max(8),
    webSearchMode: z.enum(["cached", "live"]),
  }),
  nodes: z.array(z.discriminatedUnion("type", [agentNode, humanNode])).min(1),
});

const agentSettingsSchema = z.object({
  model: z.string().min(1).optional(),
});

export async function loadWorkflow(root: string, file = "workflows/shark-tank.yaml") {
  const parsed = workflowSchema.parse(YAML.parse(await readFile(resolve(root, file), "utf8")));
  const ids = new Set<string>();
  assertSafeRelativePath(parsed.source);

  for (const node of parsed.nodes) {
    if (ids.has(node.id)) throw new Error(`Duplicate workflow node: ${node.id}`);
    ids.add(node.id);
  }
  for (const node of parsed.nodes) {
    for (const dependency of node.dependsOn) {
      if (!ids.has(dependency)) throw new Error(`Unknown dependency ${dependency} in ${node.id}`);
    }
    for (const output of node.outputs) assertSafeRelativePath(output);
    if (node.type === "agent") {
      assertSafeRelativePath(node.agent);
      const agentPath = resolve(root, "agents", node.agent);
      const document = matter(await readFile(agentPath, "utf8"));
      agentSettingsSchema.parse(document.data);
      if (!document.content.trim()) throw new Error(`Agent instructions are empty: ${node.agent}`);
    } else {
      if (node.form.source) assertSafeRelativePath(node.form.source);
      for (const context of node.form.context ?? []) assertSafeRelativePath(context);
    }
  }
  assertAcyclic(parsed.nodes);
  const nodes = await Promise.all(
    parsed.nodes.map(async (node) => {
      if (node.type !== "agent") return node;
      const document = matter(await readFile(resolve(root, "agents", node.agent), "utf8"));
      const settings = agentSettingsSchema.parse(document.data);
      return {
        ...node,
        ...(settings.model ? { model: settings.model } : {}),
        instructions: document.content.trim(),
      };
    }),
  );
  return { ...parsed, nodes } as WorkflowDefinition;
}

export function assertSafeRelativePath(path: string): void {
  const normalized = path.replaceAll("\\", "/");
  if (
    !normalized ||
    isAbsolute(normalized) ||
    normalized === ".." ||
    normalized.startsWith("../") ||
    normalized.includes("/../") ||
    relative(".", normalized).startsWith("..")
  ) {
    throw new Error(`Unsafe project-relative path: ${path}`);
  }
}

function assertAcyclic(nodes: Array<{ id: string; dependsOn: string[] }>): void {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const visiting = new Set<string>();
  const visited = new Set<string>();

  const visit = (id: string) => {
    if (visiting.has(id)) throw new Error(`Workflow contains a cycle at ${id}`);
    if (visited.has(id)) return;
    visiting.add(id);
    for (const dependency of byId.get(id)?.dependsOn ?? []) visit(dependency);
    visiting.delete(id);
    visited.add(id);
  };

  for (const node of nodes) visit(node.id);
}
