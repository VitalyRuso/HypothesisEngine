import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { BrainNodeData } from "../types/domain";

export function BrainNode({ data, selected }: NodeProps) {
  const d = data as BrainNodeData;
  return (
    <div className={`brain-node status-${d.status} ${selected ? "selected" : ""}`}>
      <Handle type="target" position={Position.Left} />
      <div className="node-orb" />
      <div className="node-copy">
        <strong>{d.label}</strong>
        <span>{d.kind}</span>
      </div>
      <div className="status-dot" />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
