import { STAGE_LABELS } from "../utils/constants";

function BatchTimeline({ history }) {
  if (!history || history.length === 0) {
    return <div className="empty-state">No transfers recorded yet — still with the fisherman.</div>;
  }

  return (
    <div>
      {history.map((transfer, index) => (
        <div className="timeline-item" key={index}>
          <strong>{STAGE_LABELS[Number(transfer.stageAtTransfer)]}</strong>
          <p style={{ fontSize: "13px", marginTop: "4px" }}>
            {transfer.from.slice(0, 6)}...{transfer.from.slice(-4)}
            {" → "}
            {transfer.to.slice(0, 6)}...{transfer.to.slice(-4)}
          </p>
          <p style={{ fontSize: "13px", color: "#666" }}>
            ₹{Number(transfer.price)} · {new Date(Number(transfer.timestamp) * 1000).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default BatchTimeline;