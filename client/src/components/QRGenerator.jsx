import { QRCodeCanvas } from "qrcode.react";

function QRGenerator({ batchId }) {
  // In production this would be your deployed app's URL + batch ID
  // For local testing, this just encodes the batch ID itself
  const lookupUrl = `${window.location.origin}?trace=${batchId}`;

  const downloadQR = () => {
    const canvas = document.getElementById(`qr-${batchId}`);
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `FisherChain-Batch-${batchId}.png`;
    link.click();
  };

  return (
    <div className="brutal-box" style={{ textAlign: "center", maxWidth: "220px" }}>
      <p className="brutal-label" style={{ marginBottom: "12px" }}>
        Batch #{batchId} QR Code
      </p>

      <QRCodeCanvas
        id={`qr-${batchId}`}
        value={lookupUrl}
        size={160}
        fgColor="#111111"
        bgColor="#ffffff"
        level="H"
      />

      <button
        className="brutal-btn"
        style={{ width: "100%", marginTop: "12px" }}
        onClick={downloadQR}
      >
        DOWNLOAD QR
      </button>
    </div>
  );
}

export default QRGenerator;