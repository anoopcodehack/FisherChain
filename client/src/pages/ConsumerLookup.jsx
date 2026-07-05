import { useState } from "react";
import { getContract } from "../utils/contract";
import { STAGE_LABELS } from "../utils/constants";

function ConsumerLookup() {
  const [batchId, setBatchId] = useState("");
  const [batch, setBatch] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLookup = async (e) => {
    e.preventDefault();
    setError("");
    setBatch(null);
    setLoading(true);

    try {
      const contract = await getContract();
      const result = await contract.getBatch(Number(batchId));
      const hist = await contract.getBatchHistory(Number(batchId));
      setBatch(result);
      setHistory(hist);
    } catch (err) {
      setError("Batch not found. Double-check the batch ID.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontWeight: 900, marginBottom: "16px" }}>TRACE YOUR FISH</h2>

      <form onSubmit={handleLookup} className="brutal-box" style={{ marginBottom: "24px" }}>
        <label className="brutal-label">Enter Batch ID (from QR code)</label>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="number"
            className="brutal-input"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            placeholder="e.g. 1"
            required
          />
          <button type="submit" className="brutal-btn" disabled={loading}>
            {loading ? "..." : "TRACE"}
          </button>
        </div>
      </form>

      {error && <div className="status-error">{error}</div>}

      {batch && (
        <>
          <div className="brutal-box" style={{ marginBottom: "20px" }}>
            <h3 style={{ fontWeight: 900, marginBottom: "12px" }}>
              🐟 {batch.species} — Batch #{Number(batch.batchId)}
            </h3>
            <div className="batch-detail-row"><span>Caught by</span><span>{batch.fisherman.slice(0, 6)}...{batch.fisherman.slice(-4)}</span></div>
            <div className="batch-detail-row"><span>Quantity</span><span>{Number(batch.quantity)} kg</span></div>
            <div className="batch-detail-row"><span>Catch Location</span><span>{batch.catchLocation}</span></div>
            <div className="batch-detail-row"><span>Catch Date</span><span>{new Date(Number(batch.catchTimestamp) * 1000).toLocaleString()}</span></div>
            <div className="batch-detail-row"><span>Current Stage</span><span className="stage-badge">{STAGE_LABELS[Number(batch.currentStage)]}</span></div>
            <div className="batch-detail-row"><span>Current Price</span><span>₹{Number(batch.currentPrice)}</span></div>
          </div>

          <h3 style={{ fontWeight: 900, marginBottom: "12px" }}>CHAIN OF CUSTODY</h3>
          {history.length === 0 && <div className="empty-state">No transfers recorded yet — still with the fisherman.</div>}
          {history.map((t, i) => (
            <div className="timeline-item" key={i}>
              <strong>{STAGE_LABELS[Number(t.stageAtTransfer)]}</strong>
              <p style={{ fontSize: "13px" }}>
                {t.from.slice(0, 6)}...{t.from.slice(-4)} → {t.to.slice(0, 6)}...{t.to.slice(-4)}
              </p>
              <p style={{ fontSize: "13px" }}>Price: ₹{Number(t.price)} · {new Date(Number(t.timestamp) * 1000).toLocaleString()}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default ConsumerLookup;