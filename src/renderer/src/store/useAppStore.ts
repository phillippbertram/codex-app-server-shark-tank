import type {
  AppEvent,
  ApprovalRequest,
  CodexStatus,
  CreateProjectInput,
  HumanSubmitInput,
  ProjectSnapshot,
  ProjectSummary,
} from "@shared/types";
import { create } from "zustand";
import { errorMessage } from "../lib";

type AppState = {
  initialized: boolean;
  busy: boolean;
  error?: string;
  codex: CodexStatus;
  projects: ProjectSummary[];
  active?: ProjectSnapshot;
  approvals: ApprovalRequest[];
  initialize: () => Promise<void>;
  selectProject: (projectId: string) => Promise<void>;
  createAndStart: (input: CreateProjectInput) => Promise<void>;
  showNewPitch: () => void;
  stop: () => Promise<void>;
  resume: () => Promise<void>;
  retry: (nodeId: string) => Promise<void>;
  submitHuman: (input: Omit<HumanSubmitInput, "projectId">) => Promise<void>;
  clearError: () => void;
};

let removeListener: (() => void) | undefined;

export const useAppStore = create<AppState>((set, get) => ({
  initialized: false,
  busy: false,
  codex: { state: "starting", message: "Connecting to Codex App Server…" },
  projects: [],
  approvals: [],

  initialize: async () => {
    if (!removeListener) {
      removeListener = window.sharkTank.onEvent((event) => applyEvent(event, set, get));
    }
    try {
      const bootstrap = await window.sharkTank.bootstrap();
      set({
        initialized: true,
        codex: bootstrap.codex,
        projects: bootstrap.projects,
        active: bootstrap.activeProject,
        approvals: bootstrap.pendingApprovals,
      });
    } catch (error) {
      set({ initialized: true, error: errorMessage(error) });
    }
  },

  selectProject: async (projectId) => {
    set({ busy: true, error: undefined });
    try {
      const bootstrap = await window.sharkTank.bootstrap(projectId);
      set({
        active: bootstrap.activeProject,
        codex: bootstrap.codex,
        approvals: bootstrap.pendingApprovals,
        busy: false,
      });
    } catch (error) {
      set({ busy: false, error: errorMessage(error) });
    }
  },

  createAndStart: async (input) => {
    set({ busy: true, error: undefined });
    try {
      const created = await window.sharkTank.createProject(input);
      set({ active: created });
      const active = await window.sharkTank.startWorkflow(created.project.id);
      const projects = await window.sharkTank.listProjects();
      set({ active, projects, busy: false });
    } catch (error) {
      set({ busy: false, error: errorMessage(error) });
    }
  },

  showNewPitch: () => set({ active: undefined, error: undefined }),

  stop: async () => runActiveAction(set, get, (id) => window.sharkTank.stopWorkflow(id)),
  resume: async () => runActiveAction(set, get, (id) => window.sharkTank.resumeWorkflow(id)),
  retry: async (nodeId) =>
    runActiveAction(set, get, (id) => window.sharkTank.retryNode(id, nodeId)),
  submitHuman: async (input) =>
    runActiveAction(set, get, (id) => window.sharkTank.submitHuman({ ...input, projectId: id })),
  clearError: () => set({ error: undefined }),
}));

function applyEvent(
  event: AppEvent,
  set: (partial: Partial<AppState>) => void,
  get: () => AppState,
): void {
  if (event.type === "codex.status") {
    set({ codex: event.status });
    return;
  }
  if (event.type === "approval.requested") {
    set({ approvals: [...get().approvals, event.approval] });
    return;
  }
  if (event.type === "approval.resolved") {
    set({ approvals: get().approvals.filter((approval) => approval.id !== event.approvalId) });
    return;
  }
  if (event.type === "project.list.changed") {
    set({ projects: event.projects });
    return;
  }
  if (event.type === "snapshot" && get().active?.project.id === event.snapshot.project.id) {
    const summary: ProjectSummary = {
      ...event.snapshot.project,
      runStatus: event.snapshot.state?.status ?? "idle",
    };
    set({
      active: event.snapshot,
      projects: [summary, ...get().projects.filter((project) => project.id !== summary.id)].sort(
        (a, b) => b.updatedAt.localeCompare(a.updatedAt),
      ),
    });
  }
}

async function runActiveAction(
  set: (partial: Partial<AppState>) => void,
  get: () => AppState,
  action: (projectId: string) => Promise<ProjectSnapshot>,
): Promise<void> {
  const projectId = get().active?.project.id;
  if (!projectId) return;
  set({ busy: true, error: undefined });
  try {
    set({ active: await action(projectId), busy: false });
  } catch (error) {
    set({ busy: false, error: errorMessage(error) });
  }
}
