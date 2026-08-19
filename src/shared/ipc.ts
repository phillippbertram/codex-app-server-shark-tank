export const IPC = {
  bootstrap: "app.bootstrap",
  projectList: "project.list",
  projectCreate: "project.create",
  workflowStart: "workflow.start",
  workflowStop: "workflow.stop",
  workflowResume: "workflow.resume",
  workflowRetryNode: "workflow.retryNode",
  humanSubmit: "human.submit",
  artifactRead: "artifact.read",
  projectReveal: "project.reveal",
  approvalRespond: "approval.respond",
  appEvent: "app.event",
} as const;
