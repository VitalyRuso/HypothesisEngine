import type { BrainEvent } from "../types/domain";

export function TaskFlow({
  events,
  activeId,
  onSelect
}: {
  events: BrainEvent[];
  activeId?: string;
  onSelect: (event: BrainEvent) => void;
}) {
  return (
    <div className="task-flow panel">
      <div className="panel-heading">
        <span>LIVE TASK FLOW</span>
        <small>task-184</small>
      </div>
      <div className="flow-list">
        {events.map((e, i) => (
          <button
            key={e.id}
            className={`flow-event ${activeId === e.id ? "active" : ""}`}
            onClick={() => onSelect(e)}
          >
            <span className="flow-index">{String(i + 1).padStart(2, "0")}</span>
            <span>
              <strong>{e.title}</strong>
              <small>{e.rationale}</small>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
