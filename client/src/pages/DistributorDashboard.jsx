import { useState, useEffect, useCallback } from "react";
import { getContract, getAllBatches, getReadOnlyContract } from "../utils/contract";
import { useWeb3 } from "../contexts/Web3Context";
import BatchCard from "../components/BatchCard";
import { RefreshCw } from "../components/Icons";

function DistributorDashboard({ account }) {
  const { contract } = useWeb3();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBatches = useCallback(async () => {
    if (!account) return;
    setLoading(true);
    try {
      const activeContract = contract || (await getContract()).catch(() => getReadOnlyContract());
      const all = await getAllBatches(activeContract);
      const mine = all.filter(
        (b) =>
          b.currentOwner &&
          b.currentOwner.toLowerCase() === account.toLowerCase() &&
          Number(b.currentStage) < 4
      );
      setBatches(mine.reverse());
    } catch (err) {
      console.error("Failed to load distributor batches:", err);
    } finally {
      setLoading(false);
    }
  }, [account, contract]);

  useEffect(() => {
    if (account) loadBatches();
  }, [account, loadBatches]);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "var(--primary-navy)" }}>
            Logistics & Cold Chain Fleet Management
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>
            Commercial batches currently held under your fleet custody awaiting retailer delivery.
          </p>
        </div>
        <button
          type="button"
          className="btn-pill btn-pill-sm btn-pill-white"
          onClick={loadBatches}
          disabled={loading}
        >
          <span>{loading ? "Syncing..." : "Sync Fleet"}</span>
          <span className="btn-pill-icon">
            <RefreshCw size={12} className={loading ? "spin-icon" : ""} />
          </span>
        </button>
      </div>

      {loading && <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>Checking fleet custody on blockchain...</p>}

      {!loading && batches.length === 0 && (
        <div className="corp-card" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)", fontSize: "14px" }}>
          No batches are currently held in your fleet custody. When a harbor auction or fisherman transfers a batch to your address, it will appear here.
        </div>
      )}

      {batches.map((batch) => (
        <BatchCard
          key={Number(batch.batchId)}
          batch={batch}
          account={account}
          onRefresh={loadBatches}
        />
      ))}
    </div>
  );
}

export default DistributorDashboard;
