import type { BrainEvent } from "../types/domain";

export function EvidenceInspector({ event }: { event?: BrainEvent }) {
  return (
    <div className="evidence panel">
      <div className="panel-heading"><span>EVIDENCE</span><small>{event?.type ?? "—"}</small></div>
      {!event ? <div className="empty">Select a task event.</div> : (
        <>
          <h3>{event.title}</h3>
          <p className="muted">{event.rationale}</p>
          {(event.evidence ?? []).length === 0 ? (
            <div className="empty">No independent evidence attached yet.</div>
          ) : event.evidence!.map(ev => (
            <div className="evidence-card" key={ev.id}>
              <div className={`epistemic ${ev.state.toLowerCase()}`}>{ev.state}</div>
              <strong>{ev.claim}</strong>
              <dl>
                <dt>Source</dt><dd>{ev.source}</dd>
                <dt>Verification</dt><dd>{ev.verificationMethod}</dd>
                <dt>Timestamp</dt><dd>{new Date(ev.timestamp).toLocaleTimeString()}</dd>
              </dl>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
