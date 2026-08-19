import { randomUUID } from "node:crypto";
import { appendFile, mkdir, readdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import { basename, dirname, resolve, sep } from "node:path";
import matter from "gray-matter";
import { committeeQuestionsSchema } from "../../shared/schemas.js";
import type {
  ArtifactContent,
  ArtifactSummary,
  InspectorEvent,
  ProjectMetadata,
  ProjectSnapshot,
  ProjectSummary,
  Question,
  WorkflowDefinition,
  WorkflowState,
} from "../../shared/types.js";
import { redact } from "../codex/redact.js";

const artifactLabels: Record<string, string> = {
  "pitch.md": "Founder pitch",
  "artifacts/market.md": "Market analysis",
  "artifacts/business.md": "Business model",
  "artifacts/product.md": "Product review",
  "artifacts/risks.md": "Risk assessment",
  "committee/questions.md": "Committee questions",
  "human/founder-answers.md": "Founder answers",
  "artifacts/bullish.md": "Bull case",
  "artifacts/bearish.md": "Bear case",
  "human/founder-rebuttal.md": "Founder rebuttal",
  "investment-memo.md": "Investment memo",
};

export class ProjectStore {
  readonly projectsRoot: string;
  private readonly stateQueues = new Map<string, Promise<void>>();

  constructor(
    root: string,
    private readonly workflow: WorkflowDefinition,
  ) {
    this.projectsRoot = resolve(root, "projects");
  }

  async initialize(): Promise<void> {
    await mkdir(this.projectsRoot, { recursive: true });
    for (const project of await this.list()) {
      const state = await this.readState(project.id);
      if (!state) continue;
      let changed = false;
      for (const node of Object.values(state.nodes)) {
        if (node.status === "running") {
          node.status = "interrupted";
          node.completedAt = new Date().toISOString();
          node.error = "The application closed while this node was running.";
          changed = true;
        }
      }
      if (changed) {
        state.status = "stopped";
        state.updatedAt = new Date().toISOString();
        await this.writeState(project.id, state);
      }
    }
  }

  getWorkflow(): WorkflowDefinition {
    return this.workflow;
  }

  async create(name: string, pitch: string, targetMarket: string): Promise<ProjectSnapshot> {
    const baseId = slugify(name) || "startup";
    let id = baseId;
    let suffix = 2;
    while (await exists(resolve(this.projectsRoot, id))) id = `${baseId}-${suffix++}`;

    const projectRoot = resolve(this.projectsRoot, id);
    await Promise.all([
      mkdir(resolve(projectRoot, "artifacts"), { recursive: true }),
      mkdir(resolve(projectRoot, "committee"), { recursive: true }),
      mkdir(resolve(projectRoot, "human"), { recursive: true }),
      mkdir(resolve(projectRoot, ".sharktank", "runs"), { recursive: true }),
    ]);

    const now = new Date().toISOString();
    const project: ProjectMetadata = {
      id,
      name,
      pitchSummary: firstSentence(pitch),
      targetMarket,
      workflow: this.workflow.id,
      createdAt: now,
      updatedAt: now,
    };
    await this.writeJson(resolve(projectRoot, "project.json"), project);
    await this.atomicWrite(
      resolve(projectRoot, "pitch.md"),
      `# ${name}\n\n**Target market:** ${targetMarket}\n\n${pitch.trim()}\n`,
    );
    return this.snapshot(id);
  }

  async list(): Promise<ProjectSummary[]> {
    const entries = await readdir(this.projectsRoot, { withFileTypes: true });
    const projects: ProjectSummary[] = [];
    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
      try {
        const metadata = await this.readMetadata(entry.name);
        const state = await this.readState(entry.name);
        projects.push({ ...metadata, runStatus: state?.status ?? "idle" });
      } catch {
        // A malformed project should not prevent the rest of the portfolio from loading.
      }
    }
    return projects.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async snapshot(projectId: string): Promise<ProjectSnapshot> {
    const [project, state, artifacts, questions, events] = await Promise.all([
      this.readMetadata(projectId),
      this.readState(projectId),
      this.listArtifacts(projectId),
      this.readQuestions(projectId),
      this.readEvents(projectId),
    ]);
    return {
      project,
      workflow: this.workflow,
      ...(state ? { state } : {}),
      artifacts,
      questions,
      events,
    };
  }

  projectRoot(projectId: string): string {
    return this.safeProjectRoot(projectId);
  }

  resolveProjectPath(projectId: string, relativePath: string): string {
    const projectRoot = this.safeProjectRoot(projectId);
    const target = resolve(projectRoot, relativePath);
    if (target !== projectRoot && !target.startsWith(`${projectRoot}${sep}`)) {
      throw new Error("Path leaves the pitch project");
    }
    return target;
  }

  async readArtifact(projectId: string, path: string): Promise<ArtifactContent> {
    if (!(path in artifactLabels)) throw new Error("Unknown artifact");
    const parsed = matter(await readFile(this.resolveProjectPath(projectId, path), "utf8"));
    return { path, content: parsed.content.trim(), frontmatter: parsed.data };
  }

  async writeArtifact(projectId: string, path: string, content: string): Promise<void> {
    if (!(path in artifactLabels)) throw new Error(`Unknown output artifact: ${path}`);
    await this.atomicWrite(this.resolveProjectPath(projectId, path), content);
    await this.touchProject(projectId);
  }

  async readState(projectId: string): Promise<WorkflowState | undefined> {
    try {
      return JSON.parse(
        await readFile(
          this.resolveProjectPath(projectId, ".sharktank/workflow-state.json"),
          "utf8",
        ),
      ) as WorkflowState;
    } catch (error) {
      if (isMissing(error)) return undefined;
      throw error;
    }
  }

  async writeState(projectId: string, state: WorkflowState): Promise<void> {
    await this.enqueueState(projectId, () => this.writeStateUnlocked(projectId, state));
  }

  async updateState(
    projectId: string,
    update: (state: WorkflowState) => void | Promise<void>,
  ): Promise<WorkflowState> {
    return this.enqueueState(projectId, async () => {
      const state = await this.readState(projectId);
      if (!state) throw new Error("This pitch has not started a workflow yet");
      await update(state);
      await this.writeStateUnlocked(projectId, state);
      return state;
    });
  }

  async appendEvent(projectId: string, runId: string, event: InspectorEvent): Promise<void> {
    const path = this.resolveProjectPath(projectId, `.sharktank/runs/${runId}/events.jsonl`);
    await mkdir(dirname(path), { recursive: true });
    await appendFile(path, `${JSON.stringify(redact(event))}\n`, "utf8");
  }

  private async readMetadata(projectId: string): Promise<ProjectMetadata> {
    return JSON.parse(
      await readFile(this.resolveProjectPath(projectId, "project.json"), "utf8"),
    ) as ProjectMetadata;
  }

  private async listArtifacts(projectId: string): Promise<ArtifactSummary[]> {
    return Promise.all(
      Object.entries(artifactLabels).map(async ([path, label]) => {
        try {
          const file = await stat(this.resolveProjectPath(projectId, path));
          return { path, label, exists: true, updatedAt: file.mtime.toISOString() };
        } catch {
          return { path, label, exists: false };
        }
      }),
    );
  }

  private async readQuestions(projectId: string): Promise<Question[]> {
    try {
      const raw = JSON.parse(
        await readFile(this.resolveProjectPath(projectId, "committee/questions.json"), "utf8"),
      );
      return committeeQuestionsSchema.parse(raw).questions;
    } catch {
      return [];
    }
  }

  private async readEvents(projectId: string): Promise<InspectorEvent[]> {
    const state = await this.readState(projectId);
    if (!state) return [];
    try {
      const raw = await readFile(
        this.resolveProjectPath(projectId, `.sharktank/runs/${state.runId}/events.jsonl`),
        "utf8",
      );
      return raw
        .split("\n")
        .filter(Boolean)
        .slice(-600)
        .map((line) => JSON.parse(line) as InspectorEvent);
    } catch {
      return [];
    }
  }

  private async touchProject(projectId: string): Promise<void> {
    const project = await this.readMetadata(projectId);
    project.updatedAt = new Date().toISOString();
    await this.writeJson(this.resolveProjectPath(projectId, "project.json"), project);
  }

  private safeProjectRoot(projectId: string): string {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(projectId)) throw new Error("Invalid project ID");
    const projectRoot = resolve(this.projectsRoot, projectId);
    if (
      basename(projectRoot) !== projectId ||
      !projectRoot.startsWith(`${this.projectsRoot}${sep}`)
    ) {
      throw new Error("Invalid project path");
    }
    return projectRoot;
  }

  private async writeJson(path: string, value: unknown): Promise<void> {
    await this.atomicWrite(path, `${JSON.stringify(value, null, 2)}\n`);
  }

  private async atomicWrite(path: string, content: string): Promise<void> {
    await mkdir(dirname(path), { recursive: true });
    const temporary = `${path}.${process.pid}.${randomUUID()}.tmp`;
    await writeFile(temporary, content, "utf8");
    await rename(temporary, path);
  }

  private async writeStateUnlocked(projectId: string, state: WorkflowState): Promise<void> {
    await this.writeJson(
      this.resolveProjectPath(projectId, ".sharktank/workflow-state.json"),
      state,
    );
    await this.touchProject(projectId);
  }

  private async enqueueState<T>(projectId: string, operation: () => Promise<T>): Promise<T> {
    const previous = this.stateQueues.get(projectId) ?? Promise.resolve();
    const current = previous.catch(() => undefined).then(operation);
    const tail = current.then(
      () => undefined,
      () => undefined,
    );
    this.stateQueues.set(projectId, tail);
    try {
      return await current;
    } finally {
      if (this.stateQueues.get(projectId) === tail) this.stateQueues.delete(projectId);
    }
  }
}

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 54);
}

function firstSentence(value: string): string {
  const compact = value.replace(/\s+/g, " ").trim();
  const sentence = compact.match(/^.*?[.!?](?:\s|$)/)?.[0] ?? compact;
  return sentence.slice(0, 240);
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

function isMissing(error: unknown): boolean {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
