import { useState, useEffect, useCallback } from "react";
import { getContract, getAllBatches, getReadOnlyContract } from "../utils/contract";
import { useWeb3 } from "../contexts/Web3Context";
import BatchCard from "../components/BatchCard";
import { RefreshCw, Check } from "../components/Icons";

function RetailerDashboard({ account }) {
  const { contract } = useWeb3();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [sellPrice, setSellPrice] = useState({});
  const [sellingBatchId, setSellingBatchId] = useState(null);

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
      console.error("Failed to load retailer batches:", err);
    } finally {
      setLoading(false);
    }
  }, [account, contract]);

  useEffect(() => {
    if (account) loadBatches();
  }, [account, loadBatches]);

  const handleMarkSold = async (batchId) => {
    setStatus(null);
    const price = sellPrice[batchId];
    if (!price || Number(price) <= 0) {
      setStatus({ type: "error", message: "Please specify a valid consumer retail sale price." });
      return;
    }

    try {
      const activeContract = contract || (await getContract());
      setStatus({ type: "pending", message: "Recording consumer point-of-sale in MetaMask..." });
      // Final stage 4 = SoldToConsumer
      const tx = await activeContract.transferBatch(batchId, account, Number(price), 4);
      await tx.wait();

      setStatus({ type: "success", message: `Batch #${batchId} marked as Sold to Consumer (Stage 4)!` });
      setSellingBatchId(null);
      loadBatches();
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: err.reason || err.message || "Sale transaction failed" });
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "var(--primary-navy)" }}>
            Retail Market Inventory & Checkouts
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>
            Seafood inventory received in store. Export packaging QR stickers or record customer sales.
          </p>
        </div>
        <button
          type="button"
          className="btn-pill btn-pill-sm btn-pill-white"
          onClick={loadBatches}
          disabled={loading}
        >
          <span>{loading ? "Syncing..." : "Sync Store"}</span>
          <span className="btn-pill-icon">
            <RefreshCw size={12} className={loading ? "spin-icon" : ""} />
          </span>
        </button>
      </div>

      {status && (
        <div className={`alert-box alert-${status.type === 'error' ? 'error' : status.type === 'success' ? 'success' : 'info'}`} style={{ marginBottom: "20px" }}>
          {status.message}
        </div>
      )}

      {loading && <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>Loading storefront inventory...</p>}

      {!loading && batches.length === 0 && (
        <div className="corp-card" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)", fontSize: "14px" }}>
          No batches are currently held at your retail store. When logistics carriers deliver to your wallet, they will appear here.
        </div>
      )}

      {batches.map((batch) => {
        const batchId = Number(batch.batchId);
        const isSelling = sellingBatchId === batchId;

        return (
          <BatchCard
            key={batchId}
            batch={batch}
            account={account}
            onRefresh={loadBatches}
          >
            <div style={{ marginTop: "14px", borderTop: "1px solid var(--border-light)", paddingTop: "14px" }}>
              {!isSelling ? (
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  style={{ width: "100%" }}
                  onClick={() => setSellingBatchId(batchId)}
                >
                  Record Point of Sale (Mark Sold to Consumer) →
                </button>
              ) : (
                <div style={{ background: "var(--bg-subtle)", padding: "16px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-medium)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <label className="form-label" style={{ margin: 0 }}>
                      Final Consumer Checkout Price (₹)
                    </label>
                    <button
                      type="button"
                      onClick={() => setSellingBatchId(null)}
                      style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontWeight: 600, fontSize: "12px" }}
                    >
                      Cancel
                    </button>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 950"
                      value={sellPrice[batchId] || ""}
                      onChange={(e) => setSellPrice({ ...sellPrice, [batchId]: e.target.value })}
                    />
                    <button
                      type="button"
                      className="btn-pill btn-pill-sm btn-pill-navy"
                      onClick={() => handleMarkSold(batchId)}
                    >
                      <span>Confirm Checkout</span>
                      <span className="btn-pill-icon">
                        <Check size={12} />
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </BatchCard>
        );
      })}
    </div>
  );
}

export default RetailerDashboard;
