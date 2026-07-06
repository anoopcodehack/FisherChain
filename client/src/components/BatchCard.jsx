import { STAGE_LABELS } from "../utils/constants";

function BatchCard({ batch, children }) {
  if (!batch) return null;

  return (
    <div className="batch-card">
      <div className="batch-card-header">
        <strong>Batch #{Number(batch.batchId)} — {batch.species}</strong>
        <span className="stage-badge">{STAGE_LABELS[Number(batch.currentStage)]}</span>
      </div>

      <div className="batch-detail-row">
        <span>Quantity</span>
        <span>{Number(batch.quantity)} kg</span>
      </div>

      <div className="batch-detail-row">
        <span>Catch Location</span>
        <span>{batch.catchLocation}</span>
      </div>

      <div className="batch-detail-row">
        <span>Catch Date</span>
        <span>{new Date(Number(batch.catchTimestamp) * 1000).toLocaleDateString()}</span>
      </div>

      <div className="batch-detail-row">
        <span>Current Price</span>
        <span>₹{Number(batch.currentPrice)}</span>
      </div>

      <div className="batch-detail-row">
        <span>Current Owner</span>
        <span>{batch.currentOwner.slice(0, 6)}...{batch.currentOwner.slice(-4)}</span>
      </div>

      {/* Slot for action buttons (transfer form, QR button, etc.) passed in by parent */}
      {children && <div style={{ marginTop: "12px" }}>{children}</div>}
    </div>
  );
}

export default BatchCard;