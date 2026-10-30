import { useState } from "react";
import { STAGE_LABELS } from "../utils/constants";
import { getIPFSUrl } from "../utils/ipfs";
import QRGenerator from "./QRGenerator";
import TransferForm from "./TransferForm";
import { QrCode, ArrowUpRight } from "./Icons";

function BatchCard({ batch, account, onRefresh, children }) {
  const [showQR, setShowQR] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);

  if (!batch) return null;

  const batchId = Number(batch.batchId);
  const stageNum = Number(batch.currentStage);

  const isOwner =
    account &&
    batch.currentOwner &&
    batch.currentOwner.toLowerCase() === account.toLowerCase();

  const ipfsUrl = getIPFSUrl(batch.ipfsHash);

  return (
    <div className="corp-card" style={{ marginBottom: "16px" }}>
      <div className="corp-card-header">
        <div>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
            Batch Identification #{batchId}
          </span>
          <h3 className="corp-card-title" style={{ marginTop: "2px" }}>
            {batch.species}
          </h3>
        </div>
        <span className={`badge-stage badge-stage-${stageNum}`}>
          {STAGE_LABELS[stageNum] || `Stage ${stageNum}`}
        </span>
      </div>

      <div style={{ display: "flex", gap: "20px", margin: "14px 0", flexWrap: "wrap", alignItems: "flex-start" }}>
        {ipfsUrl && (
          <div style={{ width: "120px" }}>
            <a href={ipfsUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={ipfsUrl}
                alt={batch.species}
                style={{
                  width: "100%",
                  height: "85px",
                  objectFit: "cover",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-light)",
                  display: "block",
                }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
            </a>
            <span style={{ fontSize: "11px", color: "var(--primary-blue)", display: "block", marginTop: "4px", fontWeight: 600 }}>
              IPFS Certified
            </span>
          </div>
        )}

        <div style={{ flex: 1, minWidth: "220px" }}>
          <div className="spec-row">
            <span className="spec-label">Quantity Harvested</span>
            <span className="spec-val">{Number(batch.quantity)} kg</span>
          </div>
          <div className="spec-row">
            <span className="spec-label">Catch Coordinates</span>
            <span className="spec-val">{batch.catchLocation}</span>
          </div>
          <div className="spec-row">
            <span className="spec-label">Catch Date</span>
            <span className="spec-val">
              {new Date(Number(batch.catchTimestamp) * 1000).toLocaleDateString()}
            </span>
          </div>
          <div className="spec-row">
            <span className="spec-label">Current Ledger Price</span>
            <span className="spec-val" style={{ color: "var(--primary-navy)" }}>
              ₹{Number(batch.currentPrice)}
            </span>
          </div>
          <div className="spec-row">
            <span className="spec-label">Current Custodian</span>
            <span className="spec-val" style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>
              {batch.currentOwner.slice(0, 8)}...{batch.currentOwner.slice(-6)}
              {isOwner && " (Your Account)"}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons Toolbar with Modern Pill System */}
      <div style={{ display: "flex", gap: "12px", marginTop: "16px", flexWrap: "wrap", alignItems: "center" }}>
        <button
          type="button"
          className="btn-pill btn-pill-sm btn-pill-white"
          onClick={() => {
            setShowQR(!showQR);
            if (!showQR) setShowTransfer(false);
          }}
        >
          <span>{showQR ? "Hide QR Code" : "QR Packaging Sticker"}</span>
          <span className="btn-pill-icon">
            <QrCode size={13} />
          </span>
        </button>

        {isOwner && stageNum < 4 && (
          <button
            type="button"
            className="btn-pill btn-pill-sm btn-pill-navy"
            onClick={() => {
              setShowTransfer(!showTransfer);
              if (!showTransfer) setShowQR(false);
            }}
          >
            <span>{showTransfer ? "Cancel Handoff" : "Transfer Custody"}</span>
            <span className="btn-pill-icon">
              <ArrowUpRight size={13} />
            </span>
          </button>
        )}
      </div>

      {children && <div style={{ marginTop: "14px" }}>{children}</div>}

      {showQR && <QRGenerator batchId={batchId} species={batch.species} />}

      {showTransfer && (
        <TransferForm
          batchId={batchId}
          currentStage={stageNum}
          onSuccess={() => {
            setShowTransfer(false);
            if (onRefresh) onRefresh();
          }}
          onCancel={() => setShowTransfer(false)}
        />
      )}
    </div>
  );
}

export default BatchCard;
