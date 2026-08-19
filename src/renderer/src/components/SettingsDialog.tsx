import type { CodexModelSummary, WorkflowDefinition, WorkflowNodeDefinition } from "@shared/types";
import { Bot, BrainCircuit, FileCode2, GitBranch, LockKeyhole, UsersRound } from "lucide-react";
import { Badge, Card, Dialog } from "./ui";
import { WorkflowRoadmap } from "./WorkflowDashboard";

export function SettingsDialog({
  open,
  onOpenChange,
  workflow,
  models,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflow?: WorkflowDefinition;
  models: CodexModelSummary[];
}) {
  const agents = workflow?.nodes.filter((node) => node.type === "agent") ?? [];
  const humanGates = workflow?.nodes.filter((node) => node.type === "human-input") ?? [];
  const modelById = new Map(models.map((model) => [model.id, model]));

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Workflow & agent configuration"
      description="Read-only settings loaded from the workflow YAML and agent Markdown files."
      className="w-[min(1080px,calc(100vw-40px))]"
    >
      <div className="max-h-[calc(88vh-101px)] overflow-y-auto p-7">
        {!workflow ? (
          <p className="text-sm text-slate-400">Workflow configuration is loading…</p>
        ) : (
          <div className="space-y-8">
            <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <Card className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-300">
                      <GitBranch className="size-4" />
                      <span className="text-xs font-bold uppercase tracking-[0.16em]">
                        Workflow
                      </span>
                    </div>
                    <h2 className="mt-3 text-xl font-semibold text-white">{workflow.name}</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                      {workflow.description}
                    </p>
                  </div>
                  <Badge>
                    <LockKeyhole className="mr-1 size-3" /> Read only
                  </Badge>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Setting label="Source" value={workflow.source} mono />
                  <Setting label="Workflow ID" value={workflow.id} mono />
                  <Setting label="Default model" value={workflow.defaults.model} mono />
                  <Setting
                    label="Parallel agents"
                    value={String(workflow.defaults.maxParallelAgents)}
                  />
                  <Setting label="Agent nodes" value={String(agents.length)} />
                  <Setting label="Human gates" value={String(humanGates.length)} />
                </div>
                <div className="mt-5 border-t border-white/[0.1] pt-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    Human gates
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {humanGates.map((node) => (
                      <span
                        key={node.id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.05] px-2.5 py-1.5 text-xs text-slate-300"
                      >
                        <UsersRound className="size-3.5 text-amber-200" /> {node.label}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 text-sky-300">
                  <BrainCircuit className="size-4" />
                  <span className="text-xs font-bold uppercase tracking-[0.16em]">
                    Available models
                  </span>
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-400">
                  Picker-visible models reported by this Codex App Server installation.
                </p>
                <div className="mt-4 space-y-2">
                  {models.length ? (
                    models.map((model) => <ModelRow key={model.id} model={model} />)
                  ) : (
                    <p className="rounded-xl border border-dashed border-white/[0.12] p-4 text-xs leading-5 text-slate-400">
                      The catalog appears after the App Server connects.
                    </p>
                  )}
                </div>
              </Card>
            </section>

            <section>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
                    Workflow structure
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-white">
                    How the agents work together
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Steps run from left to right. Stacked steps can run in parallel once their
                    dependencies are complete.
                  </p>
                </div>
                <span className="hidden text-xs text-slate-400 sm:block">
                  {workflow.nodes.length} steps
                </span>
              </div>
              <Card className="p-5">
                <WorkflowRoadmap nodes={workflow.nodes} ariaLabel="Configured workflow structure" />
              </Card>
            </section>

            <section>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
                    Agent definitions
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-white">
                    Effective model and instructions
                  </h2>
                </div>
                <span className="text-xs text-slate-400">{agents.length} Codex agents</span>
              </div>
              <div className="grid gap-3 lg:grid-cols-2">
                {agents.map((agent) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    defaultModel={workflow.defaults.model}
                    modelStatus={
                      models.length === 0
                        ? "unknown"
                        : modelById.has(agent.model ?? workflow.defaults.model)
                          ? "available"
                          : "unavailable"
                    }
                  />
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </Dialog>
  );
}

function AgentCard({
  agent,
  defaultModel,
  modelStatus,
}: {
  agent: WorkflowNodeDefinition;
  defaultModel: string;
  modelStatus: "available" | "unavailable" | "unknown";
}) {
  const effectiveModel = agent.model ?? defaultModel;
  return (
    <Card className="overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
              <Bot className="size-4" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-white">{agent.label}</h3>
              <code className="mt-1 block truncate text-[10px] text-slate-400">{agent.agent}</code>
            </div>
          </div>
          <Badge
            className={
              agent.model
                ? "border-violet-400/20 bg-violet-400/10 text-violet-200"
                : "border-sky-400/20 bg-sky-400/10 text-sky-200"
            }
          >
            {agent.model ? "Override" : "Inherited"}
          </Badge>
        </div>

        <div className="mt-5 grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-xs">
          <span className="text-slate-400">Effective model</span>
          <span className="flex min-w-0 items-center justify-end gap-2 text-right">
            <code className="truncate font-semibold text-slate-200">{effectiveModel}</code>
            <span
              className={`size-1.5 shrink-0 rounded-full ${modelStatus === "available" ? "bg-emerald-400" : modelStatus === "unavailable" ? "bg-red-400" : "bg-amber-300"}`}
              title={
                modelStatus === "available"
                  ? "Available"
                  : modelStatus === "unavailable"
                    ? "Not reported by model/list"
                    : "Model catalog is still loading"
              }
            />
          </span>
          <span className="text-slate-400">Depends on</span>
          <code className="text-right text-slate-300">
            {agent.dependsOn.length ? agent.dependsOn.join(", ") : "—"}
          </code>
          <span className="text-slate-400">Outputs</span>
          <code className="break-all text-right text-slate-300">{agent.outputs.join(", ")}</code>
        </div>
      </div>

      <details className="group border-t border-white/[0.1]">
        <summary className="flex cursor-pointer list-none items-center gap-2 px-5 py-3 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.045] hover:text-white">
          <FileCode2 className="size-3.5 text-emerald-300" /> Developer instructions
          <span className="ml-auto text-[10px] font-normal text-slate-400 group-open:hidden">
            Show
          </span>
          <span className="ml-auto hidden text-[10px] font-normal text-slate-400 group-open:inline">
            Hide
          </span>
        </summary>
        <pre className="max-h-72 overflow-auto border-t border-white/[0.08] bg-black/20 p-5 whitespace-pre-wrap text-[11px] leading-5 text-slate-300">
          {agent.instructions}
        </pre>
      </details>
    </Card>
  );
}

function ModelRow({ model }: { model: CodexModelSummary }) {
  return (
    <div className="rounded-xl border border-white/[0.09] bg-white/[0.035] px-3 py-2.5">
      <div className="flex items-center justify-between gap-3">
        <code className="text-xs font-semibold text-slate-200">{model.id}</code>
        {model.isDefault ? (
          <span className="text-[9px] font-bold uppercase tracking-[0.13em] text-emerald-300">
            Codex default
          </span>
        ) : null}
      </div>
      <p className="mt-1 line-clamp-1 text-[10px] text-slate-400">{model.description}</p>
      <p className="mt-1 text-[9px] text-slate-400">
        Reasoning default: {model.defaultReasoningEffort}
      </p>
    </div>
  );
}

function Setting({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-white/[0.09] bg-white/[0.035] p-3">
      <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
        {label}
      </span>
      <span className={`mt-1 block truncate text-sm text-slate-200 ${mono ? "font-mono" : ""}`}>
        {value}
      </span>
    </div>
  );
}
