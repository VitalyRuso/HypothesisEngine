export type NodeStatus = "online" | "busy" | "waiting" | "error" | "offline";
export type EpistemicState = "VERIFIED" | "ASSUMED" | "UNKNOWN" | "CONFLICTED";
export type TaskStatus =
  | "RUNNING"
  | "SUCCESS"
  | "FAILED"
  | "WAITING_APPROVAL"
  | "INCONCLUSIVE";

export interface BrainNodeData {
  label: string;
  kind: string;
  status: NodeStatus;
  capabilities: string[];
  permissions: string[];
  currentTask?: string;
  lastEvent?: string;
  metrics?: Record<string, string | number>;
}

export interface BrainEvent {
  id: string;
  taskId: string;
  timestamp: string;
  type: string;
  nodeId: string;
  targetNodeId?: string;
  title: string;
  rationale: string;
  evidence?: Evidence[];
}

export interface Evidence {
  id: string;
  claim: string;
  state: EpistemicState;
  source: string;
  verificationMethod: string;
  timestamp: string;
}

export interface TaskRun {
  id: string;
  title: string;
  status: TaskStatus;
  duration: string;
  steps: number;
  verifier: string;
}

export interface ApprovalRequest {
  id: string;
  action: string;
  risk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  capability: string;
  target: string;
  reason: string;
}

export interface PluginManifest {
  id: string;
  name: string;
  type: string;
  health: NodeStatus;
  configured: boolean;
  capabilities: string[];
  permissions: string[];
}

export interface HealthSnapshot {
  localModel: { status: NodeStatus; vramUsedGb: number; vramTotalGb: number; tokensPerSecond: number };
  codex: NodeStatus;
  analysisExpert: NodeStatus;
  memoryRecords: number;
  toolsHealthy: number;
  toolsTotal: number;
  activeTasks: number;
  pendingApprovals: number;
  failedToday: number;
  evalScore: number;
}
