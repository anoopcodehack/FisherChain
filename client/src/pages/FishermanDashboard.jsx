import { useState, useEffect, useCallback } from "react";
import { getContract, getAllBatches, getReadOnlyContract } from "../utils/contract";
import { useWeb3 } from "../contexts/Web3Context";
import CatchForm from "../components/CatchForm";
import BatchCard from "../components/BatchCard";
import ProfileSync from "../components/ProfileSync";
import { RefreshCw } from "../components/Icons";

function FishermanDashboard({ account }) {
  const { contract } = useWeb3();
  const [myBatches, setMyBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBatches = useCallback(async () => {
    if (!account) return;
    setLoading(true);
    try {
      const activeContract = contract || (await getContract()).catch(() => getReadOnlyContract());
      const all = await getAllBatches(activeContract);
      const mine = all.filter(
        (b) => b.fisherman && b.fisherman.toLowerCase() === account.toLowerCase()
      );
      setMyBatches(mine.reverse());
    } catch (err) {
      console.error("Failed to load fisherman batches:", err);
    } finally {
      setLoading(false);
    }
  }, [account, contract]);

  useEffect(() => {
    if (account) loadBatches();
  }, [account, loadBatches]);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "var(--primary-navy)" }}>
          Harbor Catch Logging & Port Registry
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>
          Connected Captain Address: <span style={{ fontFamily: "var(--font-mono)", color: "var(--primary-blue)" }}>{account}</span>
        </p>
      </div>

      <CatchForm onSuccess={loadBatches} />

      <div style={{ marginTop: "24px" }}>
        <ProfileSync />
      </div>

      <div style={{ marginTop: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--primary-navy)" }}>
            My Registered Harvest Batches ({myBatches.length})
          </h2>
          <button
            type="button"
            className="btn-pill btn-pill-sm btn-pill-white"
            onClick={loadBatches}
            disabled={loading}
          >
            <span>{loading ? "Syncing..." : "Sync Ledger"}</span>
            <span className="btn-pill-icon">
              <RefreshCw size={12} className={loading ? "spin-icon" : ""} />
            </span>
          </button>
        </div>

        {loading && <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>Querying blockchain catch records...</p>}

        {!loading && myBatches.length === 0 && (
          <div className="corp-card" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)", fontSize: "14px" }}>
            No catch records found for your account. Log your first catch using the form above.
          </div>
        )}

        {myBatches.map((batch) => (
          <BatchCard
            key={Number(batch.batchId)}
            batch={batch}
            account={account}
            onRefresh={loadBatches}
          />
        ))}
      </div>
    </div>
  );
}

export default FishermanDashboard;
