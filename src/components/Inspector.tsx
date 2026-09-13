import type { BrainNodeData } from "../types/domain";

export function Inspector({ node }: { node?: BrainNodeData }) {
  return (
    <aside className="inspector panel">
      <div className="panel-heading">
        <span>NODE INSPECTOR</span>
        <small>{node ? node.status.toUpperCase() : "NO SELECTION"}</small>
      </div>
      {!node ? (
        <div className="empty">Select a node to inspect capabilities, permissions and live state.</div>
      ) : (
        <>
          <h2>{node.label}</h2>
          <p className="muted">{node.kind}</p>
          <section>
            <label>Capabilities</label>
            <div className="chips">{node.capabilities.map(x => <span key={x}>{x}</span>)}</div>
          </section>
          <section>
            <label>Permissions</label>
            <div className="chips">{node.permissions.map(x => <span key={x}>{x}</span>)}</div>
          </section>
          <section>
            <label>Current task</label>
            <p>{node.currentTask ?? "Idle"}</p>
          </section>
          <section>
            <label>Last event</label>
            <p>{node.lastEvent ?? "Waiting for event stream"}</p>
          </section>
          <section>
            <label>Health metrics</label>
            <pre>{JSON.stringify(node.metrics ?? { heartbeat: "ok" }, null, 2)}</pre>
          </section>
        </>
      )}
    </aside>
  );
}
