import { contextBridge, ipcRenderer } from "electron";
import { IPC } from "../shared/ipc.js";
import type {
  AppBootstrap,
  AppEvent,
  ApprovalDecision,
  ArtifactContent,
  CreateProjectInput,
  HumanSubmitInput,
  ProjectSnapshot,
  ProjectSummary,
  SharkTankApi,
} from "../shared/types.js";

const api: SharkTankApi = {
  bootstrap: (projectId?: string) =>
    ipcRenderer.invoke(IPC.bootstrap, projectId) as Promise<AppBootstrap>,
  listProjects: () => ipcRenderer.invoke(IPC.projectList) as Promise<ProjectSummary[]>,
  createProject: (input: CreateProjectInput) =>
    ipcRenderer.invoke(IPC.projectCreate, input) as Promise<ProjectSnapshot>,
  startWorkflow: (projectId: string) =>
    ipcRenderer.invoke(IPC.workflowStart, projectId) as Promise<ProjectSnapshot>,
  stopWorkflow: (projectId: string) =>
    ipcRenderer.invoke(IPC.workflowStop, projectId) as Promise<ProjectSnapshot>,
  resumeWorkflow: (projectId: string) =>
    ipcRenderer.invoke(IPC.workflowResume, projectId) as Promise<ProjectSnapshot>,
  retryNode: (projectId: string, nodeId: string) =>
    ipcRenderer.invoke(IPC.workflowRetryNode, { projectId, nodeId }) as Promise<ProjectSnapshot>,
  submitHuman: (input: HumanSubmitInput) =>
    ipcRenderer.invoke(IPC.humanSubmit, input) as Promise<ProjectSnapshot>,
  readArtifact: (projectId: string, path: string) =>
    ipcRenderer.invoke(IPC.artifactRead, { projectId, path }) as Promise<ArtifactContent>,
  revealProject: (projectId: string) => ipcRenderer.invoke(IPC.projectReveal, projectId),
  respondToApproval: (approvalId: string, decision: ApprovalDecision) =>
    ipcRenderer.invoke(IPC.approvalRespond, { approvalId, decision }),
  onEvent: (listener: (event: AppEvent) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, appEvent: AppEvent) => listener(appEvent);
    ipcRenderer.on(IPC.appEvent, handler);
    return () => ipcRenderer.removeListener(IPC.appEvent, handler);
  },
};

contextBridge.exposeInMainWorld("sharkTank", api);

declare global {
  interface Window {
    sharkTank: SharkTankApi;
  }
}
