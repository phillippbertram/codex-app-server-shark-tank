import {
  AlertTriangle,
  CirclePlus,
  FishSymbol,
  LoaderCircle,
  RotateCcw,
  Settings2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ApprovalModal } from "./components/ApprovalModal";
import { CreatePitch } from "./components/CreatePitch";
import { SettingsDialog } from "./components/SettingsDialog";
import { Badge, Button } from "./components/ui";
import { Verdict } from "./components/Verdict";
import { WorkflowDashboard } from "./components/WorkflowDashboard";
import { cn } from "./lib";
import { useAppStore } from "./store/useAppStore";

export function App() {
  const {
    initialized,
    initialize,
    codex,
    workflow,
    projects,
    active,
    selectProject,
    showNewPitch,
    error,
    clearError,
  } = useAppStore();
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  if (!initialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#080d16] text-slate-400">
        <LoaderCircle className="mr-3 size-5 animate-spin text-emerald-300" /> Preparing the
        committee…
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#080d16] text-slate-200">
      <aside className="flex w-64 shrink-0 flex-col border-r border-white/[0.11] bg-[#080d15] pt-6">
        <div className="flex items-center gap-3 px-5 pb-6">
          <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-400 text-slate-950 shadow-[0_0_30px_rgba(52,211,153,0.18)]">
            <FishSymbol className="size-5" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white">Startup Shark Tank</div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
              Codex App Server
            </div>
          </div>
        </div>

        <div className="px-3">
          <Button className="w-full justify-start" variant="secondary" onClick={showNewPitch}>
            <CirclePlus className="size-4 text-emerald-300" /> New pitch
          </Button>
        </div>

        <nav className="mt-6 flex-1 overflow-y-auto px-3">
          <p className="px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Pitch projects
          </p>
          <div className="mt-2 space-y-1">
            {projects.map((project) => (
              <button
                type="button"
                key={project.id}
                onClick={() => void selectProject(project.id)}
                className={cn(
                  "w-full rounded-xl border border-transparent px-3 py-3 text-left transition hover:border-white/[0.08] hover:bg-white/[0.06]",
                  active?.project.id === project.id && "border-white/[0.11] bg-white/[0.08]",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs font-semibold text-slate-200">
                    {project.name}
                  </span>
                  <span
                    className={cn(
                      "size-1.5 shrink-0 rounded-full",
                      projectStatusColor(project.runStatus),
                    )}
                  />
                </div>
                <p className="mt-1.5 line-clamp-2 text-[10px] leading-4 text-slate-400">
                  {project.targetMarket}
                </p>
              </button>
            ))}
          </div>
        </nav>

        <div className="border-t border-white/[0.11] px-3 pb-1 pt-3">
          <Button
            className="w-full justify-start"
            variant="ghost"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings2 className="size-4" /> Configuration
          </Button>
        </div>

        <div className="p-4 pt-2">
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.045] p-3">
            <span
              className={cn(
                "size-2 shrink-0 rounded-full",
                codex.state === "ready"
                  ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.55)]"
                  : codex.state === "starting"
                    ? "animate-pulse bg-sky-400"
                    : "bg-red-400",
              )}
            />
            <div className="min-w-0">
              <p className="truncate text-[11px] font-semibold text-slate-200">
                {codex.state === "ready" ? "App Server connected" : "App Server unavailable"}
              </p>
              <p className="mt-0.5 truncate text-[9px] text-slate-400">
                {codex.userAgent ?? codex.message}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {codex.state === "not_authenticated" || codex.state === "error" ? (
        <main className="flex flex-1 items-center justify-center p-10">
          <div className="max-w-lg text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-400/10 text-red-300">
              <AlertTriangle className="size-6" />
            </div>
            <Badge className="mt-6 border-red-400/20 bg-red-400/10 text-red-300">
              Setup needed
            </Badge>
            <h1 className="mt-4 text-3xl font-semibold text-white">Codex is not ready yet</h1>
            <p className="mt-3 text-sm leading-7 text-slate-300">{codex.message}</p>
            <Button className="mt-6" variant="secondary" onClick={() => void initialize()}>
              <RotateCcw className="size-4" /> Check again
            </Button>
          </div>
        </main>
      ) : active?.state?.status === "completed" ? (
        <Verdict snapshot={active} />
      ) : active ? (
        <WorkflowDashboard snapshot={active} />
      ) : (
        <CreatePitch />
      )}

      {error ? (
        <div className="fixed bottom-5 left-1/2 z-[70] flex max-w-xl -translate-x-1/2 items-center gap-3 rounded-2xl border border-red-400/20 bg-[#201015] px-4 py-3 text-sm text-red-200 shadow-2xl">
          <AlertTriangle className="size-4 shrink-0" />
          <span>{error}</span>
          <button type="button" onClick={clearError} aria-label="Dismiss error">
            <X className="size-4" />
          </button>
        </div>
      ) : null}
      <ApprovalModal />
      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        workflow={workflow}
        models={codex.models ?? []}
      />
    </div>
  );
}

function projectStatusColor(status: string): string {
  if (status === "completed") return "bg-emerald-400";
  if (status === "running") return "bg-sky-400";
  if (status === "waiting_for_human") return "bg-amber-300";
  if (status === "failed") return "bg-red-400";
  return "bg-slate-500";
}
