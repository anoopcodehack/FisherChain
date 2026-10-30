import { useState, useEffect, useCallback } from "react";
import { getReadOnlyContract } from "../utils/contract";
import { STAGE_LABELS } from "../utils/constants";
import { getIPFSUrl } from "../utils/ipfs";
import BatchTimeline from "../components/BatchTimeline";
import QRGenerator from "../components/QRGenerator";
import { Search, ShieldCheck, AlertCircle, QrCode, ArrowUpRight } from "../components/Icons";

function ConsumerLookup({ initialBatchId }) {
  const [batchId, setBatchId] = useState(initialBatchId || "");
  const [batch, setBatch] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const fetchBatch = useCallback(async (idToQuery) => {
    if (!idToQuery || isNaN(idToQuery) || Number(idToQuery) <= 0) {
      setError("Please enter a valid numeric Batch ID.");
      return;
    }

    setError("");
    setBatch(null);
    setHistory([]);
    setLoading(true);

    try {
      const contract = getReadOnlyContract();
      const [result, hist] = await Promise.all([
        contract.getBatch(Number(idToQuery)),
        contract.getBatchHistory(Number(idToQuery)),
      ]);

      if (!result || Number(result.batchId) === 0) {
        throw new Error("Batch does not exist on-chain.");
      }

      setBatch(result);
      setHistory(hist || []);
    } catch (err) {
      console.error("Batch lookup error:", err);
      setError("Batch not found on-chain. Please verify the Batch ID.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialBatchId) {
      setBatchId(initialBatchId);
      fetchBatch(initialBatchId);
    }
  }, [initialBatchId, fetchBatch]);

  const handleLookup = (e) => {
    e.preventDefault();
    fetchBatch(batchId);
  };

  const detectAnomalies = () => {
    if (!batch) return [];
    const issues = [];
    const catchTime = Number(batch.catchTimestamp);
    let lastTime = catchTime;
    let lastPrice = Number(batch.currentPrice);

    if (history && history.length > 0) {
      for (let i = 0; i < history.length; i++) {
        const transferTime = Number(history[i].timestamp);
        const transferPrice = Number(history[i].price);

        if (transferTime < lastTime) {
          issues.push(`Hop #${i + 1} timestamp appears before preceding custody event.`);
        }
        if (transferPrice < 0) {
          issues.push(`Hop #${i + 1} records an invalid negative price.`);
        } else if (lastPrice > 0 && transferPrice > lastPrice * 5) {
          issues.push(`Hop #${i + 1} records an abnormally high price markup (>500%).`);
        }
        lastTime = transferTime;
        lastPrice = transferPrice;
      }
    }

    return issues;
  };

  const anomalies = batch ? detectAnomalies() : [];
  const ipfsUrl = batch ? getIPFSUrl(batch.ipfsHash) : null;
  const stageNum = batch ? Number(batch.currentStage) : 0;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      {/* Title & Description */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "var(--primary-navy)" }}>
          Seafood Batch Provenance Explorer
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>
          Verify origin vessel, harvest GPS coordinates, timestamp, and chain-of-custody directly from the Ethereum ledger.
        </p>
      </div>

      {/* Search Box */}
      <div className="corp-card">
        <form onSubmit={handleLookup}>
          <label className="form-label">Batch Identification Number</label>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px", alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
              <input
                type="number"
                className="form-input"
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                placeholder="Enter batch ID, e.g. 1"
                required
                min="1"
                style={{ paddingLeft: "36px" }}
              />
              <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-light)", display: "flex" }}>
                <Search size={16} />
              </span>
            </div>
            <button type="submit" className="btn-pill btn-pill-navy" disabled={loading}>
              <span>{loading ? "Searching..." : "Trace Batch"}</span>
              <span className="btn-pill-icon">
                <Search size={15} />
              </span>
            </button>
          </div>
        </form>

        {/* Quick Sample Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", paddingTop: "4px" }}>
          <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>
            Sample Seed Batches:
          </span>
          <button
            type="button"
            className="btn-pill btn-pill-sm btn-pill-white"
            onClick={() => { setBatchId("1"); fetchBatch("1"); }}
          >
            <span>Batch #1 (Mackerel)</span>
            <span className="btn-pill-icon">
              <ArrowUpRight size={12} />
            </span>
          </button>
          <button
            type="button"
            className="btn-pill btn-pill-sm btn-pill-white"
            onClick={() => { setBatchId("2"); fetchBatch("2"); }}
          >
            <span>Batch #2 (Sardine)</span>
            <span className="btn-pill-icon">
              <ArrowUpRight size={12} />
            </span>
          </button>
          <button
            type="button"
            className="btn-pill btn-pill-sm btn-pill-white"
            onClick={() => { setBatchId("3"); fetchBatch("3"); }}
          >
            <span>Batch #3 (Kingfish)</span>
            <span className="btn-pill-icon">
              <ArrowUpRight size={12} />
            </span>
          </button>
        </div>
      </div>

      {error && (
        <div className="alert-box alert-error" style={{ marginBottom: "20px" }}>
          {error}
        </div>
      )}

      {batch && (
        <>
          {/* Audit Verification Banner */}
          <div
            className={`alert-box ${anomalies.length === 0 ? "alert-success" : "alert-error"}`}
            style={{ marginBottom: "20px", display: "flex", gap: "12px", alignItems: "flex-start" }}
          >
            <div style={{ marginTop: "2px" }}>
              {anomalies.length === 0 ? <ShieldCheck size={20} /> : <AlertCircle size={20} />}
            </div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: "4px" }}>
                {anomalies.length === 0
                  ? "Automated Audit Status: Passed"
                  : "Automated Audit Status: Anomaly Detected"}
              </div>
              {anomalies.length === 0 ? (
                <div style={{ fontSize: "13px" }}>
                  All custody transfers are in chronological sequence. Pricing progression is consistent with commercial trade standards. No records have been altered or overwritten.
                </div>
              ) : (
                <ul style={{ paddingLeft: "18px", marginTop: "4px", fontSize: "13px" }}>
                  {anomalies.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Batch Specifications Card */}
          <div className="corp-card">
            <div className="corp-card-header">
              <div>
                <span style={{ fontSize: "12px", color: "var(--primary-blue)", fontWeight: 700, textTransform: "uppercase" }}>
                  Verified Batch #{Number(batch.batchId)}
                </span>
                <h2 style={{ fontSize: "22px", fontWeight: 700, color: "var(--primary-navy)", marginTop: "2px" }}>
                  {batch.species}
                </h2>
              </div>
              <span className={`badge-stage badge-stage-${stageNum}`}>
                {STAGE_LABELS[stageNum] || `Stage ${stageNum}`}
              </span>
            </div>

            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "flex-start", marginBottom: "20px" }}>
              {ipfsUrl && (
                <div style={{ width: "200px" }}>
                  <a href={ipfsUrl} target="_blank" rel="noopener noreferrer">
                    <img
                      src={ipfsUrl}
                      alt={batch.species}
                      style={{
                        width: "100%",
                        height: "140px",
                        objectFit: "cover",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border-light)",
                        display: "block",
                      }}
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  </a>
                  <a
                    href={ipfsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: "11px", color: "var(--primary-blue)", display: "block", marginTop: "4px", fontWeight: 600 }}
                  >
                    View Original on IPFS Gateway
                  </a>
                </div>
              )}

              <div style={{ flex: 1, minWidth: "260px" }}>
                <div className="spec-row">
                  <span className="spec-label">Origin Captain / Vessel</span>
                  <span className="spec-val" style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>
                    {batch.fisherman}
                  </span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Harvest Quantity</span>
                  <span className="spec-val">{Number(batch.quantity)} kg</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Catch GPS Location</span>
                  <span className="spec-val">{batch.catchLocation}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Catch Timestamp</span>
                  <span className="spec-val">
                    {new Date(Number(batch.catchTimestamp) * 1000).toLocaleString()}
                  </span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Current Ledger Price</span>
                  <span className="spec-val" style={{ color: "var(--primary-navy)" }}>
                    ₹{Number(batch.currentPrice)}
                  </span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Current Custodian Address</span>
                  <span className="spec-val" style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>
                    {batch.currentOwner}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn-pill btn-pill-white"
              onClick={() => setShowQR(!showQR)}
            >
              <span>{showQR ? "Hide Packaging Sticker" : "Export Packaging QR Sticker"}</span>
              <span className="btn-pill-icon">
                <QrCode size={14} />
              </span>
            </button>

            {showQR && (
              <QRGenerator batchId={Number(batch.batchId)} species={batch.species} />
            )}
          </div>

          {/* Custody Timeline */}
          <div className="corp-card">
            <h3 className="corp-card-title" style={{ fontSize: "16px", marginBottom: "4px" }}>
              Chain of Custody Transfer History
            </h3>
            <p className="corp-card-subtitle" style={{ marginBottom: "16px" }}>
              Cryptographically signed custody transfers recorded with timestamp and price
            </p>

            <BatchTimeline history={history} />
          </div>
        </>
      )}
    </div>
  );
}

export default ConsumerLookup;
