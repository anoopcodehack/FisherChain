import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

function QRGenerator({ batchId, species }) {
  const [copied, setCopied] = useState(false);
  const lookupUrl = `${window.location.origin}${window.location.pathname}?trace=${batchId}`;

  const downloadQR = () => {
    const canvas = document.getElementById(`qr-${batchId}`);
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `FisherChain-Batch-${batchId}-${species || "Catch"}.png`;
    link.click();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(lookupUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", padding: "16px", marginTop: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <strong style={{ fontSize: "13px", color: "var(--primary-navy)" }}>
          Packaging QR Code Sticker (Batch #{batchId})
        </strong>
        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
          Print or attach to shipping container
        </span>
      </div>

      <div style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ padding: "8px", background: "#ffffff", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-light)", display: "inline-block" }}>
          <QRCodeCanvas
            id={`qr-${batchId}`}
            value={lookupUrl}
            size={120}
            fgColor="#0f172a"
            bgColor="#ffffff"
            level="H"
          />
        </div>

        <div style={{ flex: 1, minWidth: "200px" }}>
          <input
            type="text"
            readOnly
            value={lookupUrl}
            className="form-input"
            style={{ fontSize: "12px", fontFamily: "var(--font-mono)", marginBottom: "10px", background: "#ffffff" }}
          />
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              className="btn-primary btn-sm"
              onClick={downloadQR}
            >
              Download PNG Sticker
            </button>
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={copyLink}
            >
              {copied ? "Copied URL!" : "Copy Scan URL"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QRGenerator;
