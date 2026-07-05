import { useState, useEffect } from "react";
import { getContract, getAllBatches } from "../utils/contract";
import { STAGE_LABELS } from "../utils/constants";

function AdminPanel() {
  const [fishermanAddress, setFishermanAddress] = useState("");
  const [status, setStatus] = useState(null);
  const [allBatches, setAllBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAllBatches = async () => {
    setLoading(true);
    try {
      const contract = await getContract();
      const all = await getAllBatches(contract);
      setAllBatches(all.reverse());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllBatches();
  }, []);

  const handleRegisterFisherman = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      const contract = await getContract();
      setStatus({ type: "pending", message: "Confirm in MetaMask..." });
      const tx = await contract.registerFisherman(fishermanAddress);
      await tx.wait();
      setStatus({ type: "success", message: "Fisherman registered successfully!" });
      setFishermanAddress("");
    } catch (err) {
      setStatus({ type: "error", message: err.reason || err.message || "Only admin can do this" });
    }
  };

  return (
    <div>
      <h2 style={{ fontWeight: 900, marginBottom: "16px" }}>ADMIN PANEL</h2>

      <form onSubmit={handleRegisterFisherman} className="brutal-box" style={{ marginBottom: "24px" }}>
        <label className="brutal-label">Register New Fisherman (Wallet Address)</label>
        <input
          type="text"
          className="brutal-input"
          value={fishermanAddress}
          onChange={(e) => setFishermanAddress(e.target.value)}
          placeholder="0x..."
          required
          style={{ marginBottom: "10px" }}
        />
        <button type="submit" className="brutal-btn" style={{ width: "100%" }}>
          REGISTER FISHERMAN
        </button>
        {status && <div className={`status-${status.type}`} style={{ marginTop: "12px" }}>{status.message}</div>}
      </form>

      <h3 style={{ fontWeight: 900, marginBottom: "12px" }}>ALL BATCHES ({allBatches.length})</h3>
      {loading && <p>Loading...</p>}
      {!loading && allBatches.length === 0 && <div className="empty-state">No batches registered yet.</div>}

      {allBatches.map((batch) => (
        <div className="batch-card" key={Number(batch.batchId)}>
          <div className="batch-card-header">
            <strong>Batch #{Number(batch.batchId)} — {batch.species}</strong>
            <span className="stage-badge">{STAGE_LABELS[Number(batch.currentStage)]}</span>
          </div>
          <div className="batch-detail-row"><span>Fisherman</span><span>{batch.fisherman.slice(0, 6)}...{batch.fisherman.slice(-4)}</span></div>
          <div className="batch-detail-row"><span>Current Owner</span><span>{batch.currentOwner.slice(0, 6)}...{batch.currentOwner.slice(-4)}</span></div>
          <div className="batch-detail-row"><span>Price</span><span>₹{Number(batch.currentPrice)}</span></div>
        </div>
      ))}
    </div>
  );
}

export default AdminPanel;