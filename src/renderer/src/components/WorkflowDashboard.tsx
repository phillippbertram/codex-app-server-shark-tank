import type {
  ArtifactSummary,
  NodeStatus,
  ProjectSnapshot,
  WorkflowNodeDefinition,
  WorkflowNodeState,
  WorkflowState,
} from "@shared/types";
import {
  AlertCircle,
  Braces,
  CalendarDays,
  Check,
  Circle,
  FileText,
  FolderOpen,
  LoaderCircle,
  Pause,
  Play,
  RotateCcw,
  Square,
  UserRound,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn, formatDuration, formatProjectDate } from "../lib";
import { useAppStore } from "../store/useAppStore";
import { ArtifactDialog } from "./ArtifactDialog";
import { HumanGate } from "./HumanGate";
import { Inspector } from "./Inspector";
import { Badge, Button, Card } from "./ui";

const stages = [
  ["market"],
  ["business", "product"],
  ["skeptic"],
  ["committee-questions"],
  ["founder-answers"],
  ["bullish", "bearish"],
  ["founder-rebuttal"],
  ["verdict"],
];

export function WorkflowDashboard({ snapshot }: { snapshot: ProjectSnapshot }) {
  const { stop, resume, retry, busy } = useAppStore();
  const [artifact, setArtifact] = useState<ArtifactSummary>();
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string>();
  const state = snapshot.state;
  const hasRunningNode = Object.values(state?.nodes ?? {}).some(
    (node) => node.status === "running",
  );
  const now = useLiveNow(hasRunningNode);
  const waiting = snapshot.workflow.nodes.find(
    (node) => state?.nodes[node.id]?.status === "waiting_for_human",
  );
  const selectedNode = snapshot.workflow.nodes.find((node) => node.id === selectedNodeId);
  const selectedState = selectedNode ? state?.nodes[selectedNode.id] : undefined;

  const completedCount = state
    ? Object.values(state.nodes).filter((node) => node.status === "completed").length
    : 0;

  return (
    <div className="flex min-w-0 flex-1 overflow-hidden">
      <main className="min-w-0 flex-1 overflow-y-auto">
        <header className="sticky top-0 z-20 border-b border-white/[0.11] bg-[#080d16]/94 px-8 py-5 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Badge className={statusBadge(state?.status)}>
                  {state?.status.replaceAll("_", " ")}
                </Badge>
                <span className="text-xs text-slate-400">
                  {completedCount}/{snapshot.workflow.nodes.length} decisions complete
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                  <CalendarDays className="size-3.5" />
                  {formatProjectDate(snapshot.project.createdAt)}
                </span>
              </div>
              <h1 className="mt-2 truncate text-2xl font-semibold tracking-tight text-white">
                {snapshot.project.name}
              </h1>
              <p className="mt-1 truncate text-sm text-slate-400">
                {snapshot.project.pitchSummary}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => void window.sharkTank.revealProject(snapshot.project.id)}
              >
                <FolderOpen className="size-4" /> Files
              </Button>
              <Button
                variant={inspectorOpen ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setInspectorOpen(!inspectorOpen)}
              >
                <Braces className="size-4" /> Inspector
              </Button>
              {state?.status === "stopped" ? (
                <Button size="sm" onClick={() => void resume()} disabled={busy}>
                  <Play className="size-4" /> Resume run
                </Button>
              ) : state?.status === "running" ? (
                <Button variant="danger" size="sm" onClick={() => void stop()} disabled={busy}>
                  <Square className="size-3.5" /> Stop
                </Button>
              ) : null}
            </div>
          </div>
          <div className="mx-auto mt-4 max-w-7xl border-t border-white/[0.08] pt-4">
            <WorkflowRoadmap
              nodes={snapshot.workflow.nodes}
              state={state}
              onSelect={(nodeId) => {
                setSelectedNodeId(nodeId);
                setInspectorOpen(true);
              }}
            />
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-8 py-8">
          {waiting ? (
            <HumanGate snapshot={snapshot} node={waiting} />
          ) : (
            <>
              <section className="mb-7 flex items-end justify-between gap-5">
                <div>
                  <p className="eyebrow">Live committee</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">
                    How the decision is built
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Every specialist gets a fresh Codex thread and shares conclusions through files.
                  </p>
                </div>
                <div className="hidden items-center gap-4 text-[11px] text-slate-400 md:flex">
                  <Legend color="bg-emerald-400" label="Complete" />
                  <Legend color="bg-sky-400" label="Running" />
                  <Legend color="bg-slate-600" label="Queued" />
                </div>
              </section>

              <div className="workflow-stages">
                {stages.map((stage, stageIndex) => (
                  <div className="workflow-stage" key={stage.join("-")}>
                    <div className="mb-3 flex items-center gap-2 px-1">
                      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                        {String(stageIndex + 1).padStart(2, "0")}
                      </span>
                      <div className="h-px flex-1 bg-white/[0.1]" />
                    </div>
                    <div className={cn("grid gap-3", stage.length === 2 && "xl:grid-cols-2")}>
                      {stage.map((nodeId) => {
                        const node = snapshot.workflow.nodes.find(
                          (candidate) => candidate.id === nodeId,
                        );
                        if (!node) return null;
                        return (
                          <NodeCard
                            key={node.id}
                            node={node}
                            state={state?.nodes[node.id]}
                            now={now}
                            artifacts={snapshot.artifacts}
                            selected={selectedNodeId === node.id && inspectorOpen}
                            onArtifact={setArtifact}
                            onInspect={() => {
                              setSelectedNodeId(node.id);
                              setInspectorOpen(true);
                            }}
                            onRetry={() => void retry(node.id)}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {inspectorOpen ? (
        <Inspector
          node={selectedNode}
          state={selectedState}
          events={snapshot.events}
          onClose={() => setInspectorOpen(false)}
        />
      ) : null}
      <ArtifactDialog
        projectId={snapshot.project.id}
        artifact={artifact ? { path: artifact.path, label: artifact.label } : undefined}
        onClose={() => setArtifact(undefined)}
      />
    </div>
  );
}

export function WorkflowRoadmap({
  nodes,
  state,
  onSelect,
  ariaLabel = "Workflow progress",
}: {
  nodes: WorkflowNodeDefinition[];
  state?: WorkflowState;
  onSelect?: (nodeId: string) => void;
  ariaLabel?: string;
}) {
  const scroller = useRef<HTMLElement>(null);
  const activeNodeId = currentNodeId(state);

  useEffect(() => {
    if (!activeNodeId) return;
    scroller.current
      ?.querySelector<HTMLElement>(`[data-node-id="${activeNodeId}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeNodeId]);

  return (
    <nav ref={scroller} className="overflow-x-auto pb-1" aria-label={ariaLabel}>
      <div className="flex min-w-max items-stretch px-1">
        {stages.map((stage, stageIndex) => {
          const stageNodes = stage.flatMap((nodeId) => {
            const node = nodes.find((candidate) => candidate.id === nodeId);
            return node ? [node] : [];
          });
          const nextStage = stages[stageIndex + 1] ?? [];
          return (
            <div className="contents" key={stage.join("-")}>
              <div className="flex w-28 shrink-0 flex-col justify-center gap-1.5">
                {stageNodes.map((node) => {
                  const status = state?.nodes[node.id]?.status ?? "pending";
                  const StatusIcon = statusIcon(status);
                  const current = node.id === activeNodeId;
                  const className = cn(
                    "flex min-h-9 w-full items-center gap-2 rounded-xl border px-2 py-1.5 text-left",
                    onSelect &&
                      "transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50",
                    roadmapNode(status, Boolean(onSelect)),
                    current &&
                      status !== "running" &&
                      status !== "waiting_for_human" &&
                      "ring-1 ring-white/25",
                  );
                  const content = (
                    <>
                      <span
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded-md",
                          statusIconBox(status),
                        )}
                      >
                        <StatusIcon
                          className={cn("size-3", status === "running" && "animate-spin")}
                        />
                      </span>
                      <span className="line-clamp-2 text-[9px] font-semibold leading-3.5">
                        {node.label}
                      </span>
                    </>
                  );

                  return onSelect ? (
                    <button
                      key={node.id}
                      type="button"
                      data-node-id={node.id}
                      aria-current={current ? "step" : undefined}
                      aria-label={`${node.label}: ${statusLabel(status)}`}
                      className={className}
                      onClick={() => onSelect(node.id)}
                    >
                      {content}
                    </button>
                  ) : (
                    <div key={node.id} data-node-id={node.id} className={className}>
                      {content}
                    </div>
                  );
                })}
              </div>
              {stageIndex < stages.length - 1 ? (
                <div className="flex w-5 shrink-0 items-center px-1">
                  <span className={cn("h-px w-full", connectorColor(stage, nextStage, state))} />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </nav>
  );
}

function NodeCard({
  node,
  state,
  now,
  artifacts,
  selected,
  onArtifact,
  onInspect,
  onRetry,
}: {
  node: WorkflowNodeDefinition;
  state?: WorkflowNodeState;
  now: number;
  artifacts: ArtifactSummary[];
  selected: boolean;
  onArtifact: (artifact: ArtifactSummary) => void;
  onInspect: () => void;
  onRetry: () => void;
}) {
  const outputArtifacts = artifacts.filter(
    (artifact) =>
      node.outputs.includes(artifact.path) && artifact.exists && !artifact.path.endsWith(".json"),
  );
  const status = state?.status ?? "pending";
  const StatusIcon = statusIcon(status);
  const duration = nodeDuration(state, now);
  return (
    <Card
      className={cn(
        "group relative overflow-hidden p-5 transition hover:border-white/[0.2]",
        selected && "border-emerald-400/25 ring-1 ring-emerald-400/15",
        statusCard(status),
      )}
    >
      <div className={cn("absolute inset-x-0 top-0 h-0.5", statusAccent(status))} />
      <button type="button" className="block w-full text-left" onClick={onInspect}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-xl",
                statusIconBox(status),
              )}
            >
              <StatusIcon className={cn("size-4", status === "running" && "animate-spin")} />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-slate-100">{node.label}</h3>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  {node.type === "agent" ? "Codex agent" : "Human gate"}
                </p>
                <span
                  className={cn(
                    "rounded-full border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em]",
                    statusPill(status),
                  )}
                >
                  {statusLabel(status)}
                </span>
              </div>
            </div>
          </div>
          <span className="text-[10px] font-medium tabular-nums text-slate-300">{duration}</span>
        </div>
        <p className="mt-4 min-h-10 text-xs leading-5 text-slate-400">
          {state?.error ?? state?.activity ?? statusDescription(status, node.type)}
        </p>
      </button>

      <div className="mt-4 flex min-h-8 flex-wrap items-center gap-2 border-t border-white/[0.1] pt-3">
        {outputArtifacts.length ? (
          outputArtifacts.map((artifact) => (
            <button
              type="button"
              key={artifact.path}
              className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.065] px-2.5 py-1.5 text-[10px] font-semibold text-slate-300 hover:border-white/[0.14] hover:bg-white/[0.11] hover:text-white"
              onClick={() => onArtifact(artifact)}
            >
              <FileText className="size-3" /> {artifact.label}
            </button>
          ))
        ) : (
          <span className="text-[10px] text-slate-400">
            {node.outputs.length} expected output{node.outputs.length === 1 ? "" : "s"}
          </span>
        )}
        {["failed", "interrupted", "cancelled"].includes(status) ? (
          <Button className="ml-auto" variant="ghost" size="sm" onClick={onRetry}>
            <RotateCcw className="size-3" /> Retry
          </Button>
        ) : null}
      </div>
    </Card>
  );
}

function useLiveNow(enabled: boolean): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!enabled) return;
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(timer);
  }, [enabled]);

  return now;
}

function nodeDuration(state: WorkflowNodeState | undefined, now: number): string {
  if (state?.status === "running" && state.startedAt) {
    const startedAt = new Date(state.startedAt).getTime();
    if (Number.isFinite(startedAt)) {
      const elapsed = Math.max(0, now - startedAt);
      return elapsed < 1_000 ? "0s" : formatDuration(elapsed);
    }
  }
  return formatDuration(state?.durationMs);
}

function currentNodeId(state?: WorkflowState): string | undefined {
  if (!state) return undefined;
  const orderedNodeIds = stages.flat();
  const priority: NodeStatus[] = [
    "running",
    "waiting_for_human",
    "failed",
    "interrupted",
    "cancelled",
    "pending",
  ];
  for (const status of priority) {
    const match = orderedNodeIds.find((nodeId) => state.nodes[nodeId]?.status === status);
    if (match) return match;
  }
  return orderedNodeIds.at(-1);
}

function connectorColor(stage: string[], nextStage: string[], state?: WorkflowState): string {
  const statuses = [...stage, ...nextStage].map(
    (nodeId) => state?.nodes[nodeId]?.status ?? "pending",
  );
  if (statuses.includes("failed")) return "bg-red-400/55";
  if (statuses.some((status) => status === "running" || status === "waiting_for_human")) {
    return "bg-sky-400/65";
  }
  if (stage.every((nodeId) => state?.nodes[nodeId]?.status === "completed")) {
    return "bg-emerald-400/55";
  }
  return "bg-white/[0.13]";
}

function roadmapNode(status: NodeStatus, interactive: boolean): string {
  if (status === "completed") {
    return cn(
      "border-emerald-400/25 bg-emerald-400/[0.07] text-emerald-100",
      interactive && "hover:bg-emerald-400/[0.11]",
    );
  }
  if (status === "running") {
    return "border-sky-400/35 bg-sky-400/[0.1] text-sky-100 ring-1 ring-sky-400/15";
  }
  if (status === "waiting_for_human") {
    return "border-amber-300/35 bg-amber-300/[0.09] text-amber-100 ring-1 ring-amber-300/10";
  }
  if (status === "failed") {
    return "border-red-400/35 bg-red-400/[0.09] text-red-100";
  }
  if (status === "interrupted" || status === "cancelled") {
    return "border-white/[0.12] bg-white/[0.04] text-slate-400";
  }
  return cn(
    "border-white/[0.1] bg-white/[0.025] text-slate-400",
    interactive && "hover:bg-white/[0.06]",
  );
}

function statusCard(status: NodeStatus): string {
  if (status === "completed") return "border-emerald-400/18 bg-emerald-400/[0.025]";
  if (status === "running") return "border-sky-400/28 bg-sky-400/[0.045]";
  if (status === "waiting_for_human") return "border-amber-300/25 bg-amber-300/[0.04]";
  if (status === "failed") return "border-red-400/28 bg-red-400/[0.04]";
  if (status === "interrupted") return "border-violet-400/18 bg-violet-400/[0.025]";
  return "";
}

function statusAccent(status: NodeStatus): string {
  if (status === "completed") return "bg-emerald-400/75";
  if (status === "running") return "animate-pulse bg-sky-300";
  if (status === "waiting_for_human") return "bg-amber-300/80";
  if (status === "failed") return "bg-red-400/80";
  if (status === "interrupted") return "bg-violet-400/60";
  if (status === "cancelled") return "bg-slate-500/50";
  return "bg-white/[0.08]";
}

function statusPill(status: NodeStatus): string {
  if (status === "completed") return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
  if (status === "running") return "border-sky-400/25 bg-sky-400/10 text-sky-300";
  if (status === "waiting_for_human") {
    return "border-amber-300/25 bg-amber-300/10 text-amber-200";
  }
  if (status === "failed") return "border-red-400/25 bg-red-400/10 text-red-300";
  if (status === "interrupted") return "border-violet-400/20 bg-violet-400/10 text-violet-300";
  return "border-white/[0.1] bg-white/[0.05] text-slate-400";
}

function statusLabel(status: NodeStatus): string {
  if (status === "completed") return "Complete";
  if (status === "running") return "Running";
  if (status === "waiting_for_human") return "Waiting";
  if (status === "failed") return "Failed";
  if (status === "interrupted") return "Interrupted";
  if (status === "cancelled") return "Cancelled";
  return "Queued";
}

function statusIcon(status: NodeStatus) {
  if (status === "completed") return Check;
  if (status === "running") return LoaderCircle;
  if (status === "waiting_for_human") return UserRound;
  if (status === "failed") return AlertCircle;
  if (status === "interrupted") return Pause;
  if (status === "cancelled") return Square;
  return Circle;
}

function statusIconBox(status: NodeStatus): string {
  if (status === "completed") return "bg-emerald-400/10 text-emerald-300";
  if (status === "running") return "bg-sky-400/10 text-sky-300";
  if (status === "waiting_for_human") return "bg-amber-300/10 text-amber-200";
  if (status === "failed") return "bg-red-400/10 text-red-300";
  if (status === "interrupted") return "bg-violet-400/10 text-violet-300";
  if (status === "cancelled") return "bg-slate-400/10 text-slate-400";
  return "bg-white/[0.08] text-slate-400";
}

function statusDescription(status: NodeStatus, type: WorkflowNodeDefinition["type"]): string {
  if (status === "pending")
    return type === "agent" ? "Waiting for dependency artifacts" : "Waiting for the committee";
  if (status === "completed") return "All expected outputs are available";
  if (status === "waiting_for_human") return "The workflow is waiting for your input";
  if (status === "interrupted") return "This node can be resumed with a fresh thread";
  if (status === "cancelled") return "Cancelled before it started";
  if (status === "failed") return "This node needs attention";
  return status;
}

function statusBadge(status?: string): string {
  if (status === "completed") return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
  if (status === "running") return "border-sky-400/20 bg-sky-400/10 text-sky-300";
  if (status === "waiting_for_human") return "border-amber-300/20 bg-amber-300/10 text-amber-200";
  if (status === "failed") return "border-red-400/20 bg-red-400/10 text-red-300";
  return "";
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`size-1.5 rounded-full ${color}`} /> {label}
    </span>
  );
}
