import type {
  ApprovalRequest,
  BrainEvent,
  HealthSnapshot,
  PluginManifest,
  TaskRun
} from "../types/domain";
import type { Edge, Node } from "@xyflow/react";
import type { BrainNodeData } from "../types/domain";

export interface BrainService {
  getGraph(): Promise<{ nodes: Node<BrainNodeData>[]; edges: Edge[] }>;
  getEvents(): Promise<BrainEvent[]>;
  getTasks(): Promise<TaskRun[]>;
  getApprovals(): Promise<ApprovalRequest[]>;
  getPlugins(): Promise<PluginManifest[]>;
  getHealth(): Promise<HealthSnapshot>;
  subscribe(listener: (event: BrainEvent) => void): () => void;
}
