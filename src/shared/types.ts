export type CodexStatus = {
  state: "stopped" | "starting" | "ready" | "not_authenticated" | "error";
  message: string;
  userAgent?: string;
  models?: CodexModelSummary[];
};

export type CodexModelSummary = {
  id: string;
  displayName: string;
  description: string;
  isDefault: boolean;
  defaultReasoningEffort: string;
  supportedReasoningEfforts: string[];
};

export type NodeStatus =
  | "pending"
  | "running"
  | "waiting_for_human"
  | "completed"
  | "failed"
  | "interrupted"
  | "cancelled";

export type WorkflowNodeDefinition = {
  id: string;
  label: string;
  type: "agent" | "human-input";
  agent?: string;
  model?: string;
  instructions?: string;
  dependsOn: string[];
  outputs: string[];
  webSearch?: {
    allowed: true;
    defaultEnabled: boolean;
  };
  form?: {
    kind: "question-set" | "long-text";
    source?: string;
    context?: string[];
    skippable?: boolean;
  };
};

export type WorkflowDefinition = {
  id: string;
  name: string;
  description: string;
  source: string;
  defaults: {
    model: string;
    maxParallelAgents: number;
    webSearchMode: WebSearchMode;
  };
  nodes: WorkflowNodeDefinition[];
};

export type WebSearchMode = "cached" | "live";

export type ProjectWebSearch = {
  mode: WebSearchMode;
  agentIds: string[];
};

export type WorkflowNodeState = {
  id: string;
  status: NodeStatus;
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  attempt: number;
  threadId?: string;
  turnId?: string;
  model?: string;
  reasoningEffort?: string;
  webSearchMode?: WebSearchMode | "disabled";
  activity?: string;
  error?: string;
};

export type WorkflowState = {
  runId: string;
  projectId: string;
  workflowId: string;
  status: "idle" | "running" | "waiting_for_human" | "completed" | "failed" | "stopped";
  createdAt: string;
  updatedAt: string;
  nodes: Record<string, WorkflowNodeState>;
};

export type ProjectMetadata = {
  id: string;
  name: string;
  pitchSummary: string;
  targetMarket: string;
  workflow: string;
  createdAt: string;
  updatedAt: string;
  webSearch?: ProjectWebSearch;
};

export type ProjectSummary = ProjectMetadata & {
  runStatus: WorkflowState["status"];
  finalScore?: number;
};

export type ArtifactSummary = {
  path: string;
  label: string;
  exists: boolean;
  updatedAt?: string;
};

export type Question = {
  id: string;
  question: string;
  reason: string;
  suggestions?: {
    confident: string;
    cautious: string;
  };
};

export type ArtifactContent = {
  path: string;
  content: string;
  frontmatter: Record<string, unknown>;
};

export type InspectorEvent = {
  id: string;
  timestamp: string;
  direction: "client" | "server" | "workflow";
  method: string;
  summary: string;
  nodeId?: string;
  threadId?: string;
  turnId?: string;
  data?: unknown;
};

export type ApprovalRequest = {
  id: string;
  requestId: number | string;
  kind: "command" | "file-change";
  nodeId?: string;
  title: string;
  detail: string;
  decisions: string[];
};

export type ProjectSnapshot = {
  project: ProjectMetadata;
  workflow: WorkflowDefinition;
  state?: WorkflowState;
  finalScore?: number;
  artifacts: ArtifactSummary[];
  questions: Question[];
  events: InspectorEvent[];
};

export type AppBootstrap = {
  codex: CodexStatus;
  workflow: WorkflowDefinition;
  projects: ProjectSummary[];
  activeProject?: ProjectSnapshot;
  pendingApprovals: ApprovalRequest[];
};

export type AppEvent =
  | { type: "snapshot"; snapshot: ProjectSnapshot }
  | { type: "codex.status"; status: CodexStatus }
  | { type: "approval.requested"; approval: ApprovalRequest }
  | { type: "approval.resolved"; approvalId: string }
  | { type: "project.list.changed"; projects: ProjectSummary[] };

export type CreateProjectInput = {
  name: string;
  pitch: string;
  targetMarket: string;
  webSearch: ProjectWebSearch;
};

export type HumanSubmitInput = {
  projectId: string;
  nodeId: string;
  answers?: Record<string, string>;
  text?: string;
  skipped?: boolean;
};

export type ApprovalDecision = "accept" | "acceptForSession" | "decline" | "cancel";

export interface SharkTankApi {
  bootstrap(projectId?: string): Promise<AppBootstrap>;
  listProjects(): Promise<ProjectSummary[]>;
  createProject(input: CreateProjectInput): Promise<ProjectSnapshot>;
  deleteProject(projectId: string): Promise<ProjectSummary[]>;
  startWorkflow(projectId: string): Promise<ProjectSnapshot>;
  stopWorkflow(projectId: string): Promise<ProjectSnapshot>;
  resumeWorkflow(projectId: string): Promise<ProjectSnapshot>;
  retryNode(projectId: string, nodeId: string): Promise<ProjectSnapshot>;
  submitHuman(input: HumanSubmitInput): Promise<ProjectSnapshot>;
  readArtifact(projectId: string, path: string): Promise<ArtifactContent>;
  revealProject(projectId: string): Promise<void>;
  respondToApproval(approvalId: string, decision: ApprovalDecision): Promise<void>;
  onEvent(listener: (event: AppEvent) => void): () => void;
}
