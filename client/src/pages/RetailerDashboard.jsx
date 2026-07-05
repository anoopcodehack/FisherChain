import { useState, useEffect } from "react";
import { getContract, getAllBatches } from "../utils/contract";
import { STAGE_LABELS } from "../utils/constants";

function RetailerDashboard({ account }) {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [sellPrice, setSellPrice] = useState({});

  const loadBatches = async () => {
    setLoading(true);
    try {
      const contract = await getContract();
      const all = await getAllBatches(contract);
      const mine = all.filter(
        (b) => b.currentOwner.toLowerCase() === account.toLowerCase() && Number(b.currentStage) < 4
      );
      setBatches(mine.reverse());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (account) loadBatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const handleMarkSold = async (batchId) => {
    setStatus(null);
    try {
      const contract = await getContract();
      const price = sellPrice[batchId];

      setStatus({ type: "pending", message: "Confirm in MetaMask..." });
      // Mark sold to consumer — transfer to a zero-ish "sold" marker (self, stage 4)
      const tx = await contract.transferBatch(batchId, account, Number(price), 4);
      await tx.wait();

      setStatus({ type: "success", message: `Batch #${batchId} marked as sold to consumer!` });
      loadBatches();
    } catch (err) {
      setStatus({ type: "error", message: err.reason || err.message });
    }
  };

  return (
    <div>
      <h2 style={{ fontWeight: 900, marginBottom: "16px" }}>BATCHES READY FOR SALE</h2>

      {status && <div className={`status-${status.type}`} style={{ marginBottom: "16px" }}>{status.message}</div>}

      {loading && <p>Loading...</p>}
      {!loading && batches.length === 0 && (
        <div className="empty-state">No batches currently at your store.</div>
      )}

      {batches.map((batch) => {
        const batchId = Number(batch.batchId);
        return (
          <div className="batch-card" key={batchId}>
            <div className="batch-card-header">
              <strong>Batch #{batchId} — {batch.species}</strong>
              <span className="stage-badge">{STAGE_LABELS[Number(batch.currentStage)]}</span>
            </div>
            <div className="batch-detail-row"><span>Quantity</span><span>{Number(batch.quantity)} kg</span></div>
            <div className="batch-detail-row"><span>Current Price</span><span>₹{Number(batch.currentPrice)}</span></div>

            <div style={{ marginTop: "12px" }}>
              <label className="brutal-label">Final Sale Price (₹)</label>
              <input
                type="number"
                className="brutal-input"
                placeholder="e.g. 900"
                onChange={(e) => setSellPrice({ ...sellPrice, [batchId]: e.target.value })}
                style={{ marginBottom: "8px" }}
              />
              <button className="brutal-btn" style={{ width: "100%" }} onClick={() => handleMarkSold(batchId)}>
                MARK AS SOLD TO CONSUMER
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default RetailerDashboard;