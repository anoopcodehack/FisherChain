import { useState, useEffect } from "react";
import { getContract, getAllBatches } from "../utils/contract";
import { STAGE_LABELS } from "../utils/constants";

function DistributorDashboard({ account }) {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transferTo, setTransferTo] = useState({});
  const [transferPrice, setTransferPrice] = useState({});
  const [status, setStatus] = useState(null);

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

  const handleTransfer = async (batchId) => {
    setStatus(null);
    try {
      const contract = await getContract();
      const toAddress = transferTo[batchId];
      const price = transferPrice[batchId];
      const batch = await contract.getBatch(batchId);
      const nextStage = Number(batch.currentStage) + 1;

      setStatus({ type: "pending", message: "Confirm transfer in MetaMask..." });
      const tx = await contract.transferBatch(batchId, toAddress, Number(price), nextStage);
      await tx.wait();

      setStatus({ type: "success", message: `Batch #${batchId} transferred successfully!` });
      loadBatches();
    } catch (err) {
      setStatus({ type: "error", message: err.reason || err.message });
    }
  };

  return (
    <div>
      <h2 style={{ fontWeight: 900, marginBottom: "16px" }}>BATCHES IN MY CUSTODY</h2>

      {status && <div className={`status-${status.type}`} style={{ marginBottom: "16px" }}>{status.message}</div>}

      {loading && <p>Loading...</p>}
      {!loading && batches.length === 0 && (
        <div className="empty-state">No batches currently in your custody.</div>
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
              <label className="brutal-label">Transfer To (Address)</label>
              <input
                type="text"
                className="brutal-input"
                placeholder="0x..."
                onChange={(e) => setTransferTo({ ...transferTo, [batchId]: e.target.value })}
                style={{ marginBottom: "8px" }}
              />
              <label className="brutal-label">New Price (₹)</label>
              <input
                type="number"
                className="brutal-input"
                placeholder="e.g. 700"
                onChange={(e) => setTransferPrice({ ...transferPrice, [batchId]: e.target.value })}
                style={{ marginBottom: "8px" }}
              />
              <button className="brutal-btn" style={{ width: "100%" }} onClick={() => handleTransfer(batchId)}>
                TRANSFER TO NEXT STAGE
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DistributorDashboard;