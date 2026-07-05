import { useState, useEffect } from "react";
import { getContract, getAllBatches } from "../utils/contract";
import { STAGE_LABELS } from "../utils/constants";
import CatchForm from "../components/CatchForm";

function FishermanDashboard({ account }) {
  const [myBatches, setMyBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBatches = async () => {
    setLoading(true);
    try {
      const contract = await getContract();
      const all = await getAllBatches(contract);
      const mine = all.filter(
        (b) => b.fisherman.toLowerCase() === account.toLowerCase()
      );
      setMyBatches(mine.reverse());
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

  return (
    <div>
      <CatchForm onSuccess={loadBatches} />

      <div style={{ marginTop: "30px" }}>
        <h2 style={{ fontWeight: 900, marginBottom: "16px" }}>MY REGISTERED CATCHES</h2>

        {loading && <p>Loading your batches...</p>}

        {!loading && myBatches.length === 0 && (
          <div className="empty-state">No catches registered yet. Log your first one above.</div>
        )}

        {myBatches.map((batch) => (
          <div className="batch-card" key={Number(batch.batchId)}>
            <div className="batch-card-header">
              <strong>Batch #{Number(batch.batchId)} — {batch.species}</strong>
              <span className="stage-badge">{STAGE_LABELS[Number(batch.currentStage)]}</span>
            </div>
            <div className="batch-detail-row"><span>Quantity</span><span>{Number(batch.quantity)} kg</span></div>
            <div className="batch-detail-row"><span>Location</span><span>{batch.catchLocation}</span></div>
            <div className="batch-detail-row"><span>Current Price</span><span>₹{Number(batch.currentPrice)}</span></div>
            <div className="batch-detail-row"><span>Current Owner</span><span>{batch.currentOwner.slice(0, 6)}...{batch.currentOwner.slice(-4)}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FishermanDashboard;