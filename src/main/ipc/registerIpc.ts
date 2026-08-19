import { ipcMain, shell } from "electron";
import { IPC } from "../../shared/ipc.js";
import {
  approvalRespondSchema,
  artifactReadSchema,
  createProjectSchema,
  humanSubmitSchema,
  projectIdSchema,
  projectNodeSchema,
} from "../../shared/schemas.js";
import type { CodexAppServer } from "../codex/CodexAppServer.js";
import type { ProjectStore } from "../projects/ProjectStore.js";
import type { WorkflowEngine } from "../workflow/WorkflowEngine.js";

export function registerIpc(
  store: ProjectStore,
  workflow: WorkflowEngine,
  codex: CodexAppServer,
): void {
  ipcMain.handle(IPC.bootstrap, async (_event, activeProjectId?: unknown) => {
    const projects = await store.list();
    const requested =
      typeof activeProjectId === "string" ? projectIdSchema.safeParse(activeProjectId) : null;
    const activeId = requested?.success ? requested.data : projects[0]?.id;
    return {
      codex: codex.getStatus(),
      projects,
      ...(activeId ? { activeProject: await store.snapshot(activeId) } : {}),
      pendingApprovals: workflow.getApprovals(),
    };
  });
  ipcMain.handle(IPC.projectList, () => store.list());
  ipcMain.handle(IPC.projectCreate, async (_event, raw: unknown) => {
    const input = createProjectSchema.parse(raw);
    return store.create(input.name, input.pitch, input.targetMarket);
  });
  ipcMain.handle(IPC.workflowStart, (_event, raw: unknown) =>
    workflow.start(projectIdSchema.parse(raw)),
  );
  ipcMain.handle(IPC.workflowStop, (_event, raw: unknown) =>
    workflow.stop(projectIdSchema.parse(raw)),
  );
  ipcMain.handle(IPC.workflowResume, (_event, raw: unknown) =>
    workflow.resume(projectIdSchema.parse(raw)),
  );
  ipcMain.handle(IPC.workflowRetryNode, (_event, raw: unknown) => {
    const input = projectNodeSchema.parse(raw);
    return workflow.retryNode(input.projectId, input.nodeId);
  });
  ipcMain.handle(IPC.humanSubmit, (_event, raw: unknown) =>
    workflow.submitHuman(humanSubmitSchema.parse(raw)),
  );
  ipcMain.handle(IPC.artifactRead, (_event, raw: unknown) => {
    const input = artifactReadSchema.parse(raw);
    return store.readArtifact(input.projectId, input.path);
  });
  ipcMain.handle(IPC.projectReveal, async (_event, raw: unknown) => {
    const projectId = projectIdSchema.parse(raw);
    shell.showItemInFolder(store.resolveProjectPath(projectId, "project.json"));
  });
  ipcMain.handle(IPC.approvalRespond, (_event, raw: unknown) => {
    const input = approvalRespondSchema.parse(raw);
    workflow.respondToApproval(input.approvalId, input.decision);
  });
}
