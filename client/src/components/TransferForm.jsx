import { useState } from "react";
import { getContract } from "../utils/contract";

function TransferForm({ batchId, currentStage, onSuccess }) {
  const [toAddress, setToAddress] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTransfer = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      const contract = await getContract();
      const nextStage = Number(currentStage) + 1;

      setStatus({ type: "pending", message: "Confirm transfer in MetaMask..." });
      const tx = await contract.transferBatch(batchId, toAddress, Number(price), nextStage);
      await tx.wait();

      setStatus({ type: "success", message: `Batch #${batchId} transferred successfully!` });
      setToAddress("");
      setPrice("");
      onSuccess?.();
    } catch (err) {
      setStatus({ type: "error", message: err.reason || err.message || "Transfer failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleTransfer}>
      <label className="brutal-label">Transfer To (Wallet Address)</label>
      <input
        type="text"
        className="brutal-input"
        value={toAddress}
        onChange={(e) => setToAddress(e.target.value)}
        placeholder="0x..."
        required
        style={{ marginBottom: "8px" }}
      />

      <label className="brutal-label">New Price (₹)</label>
      <input
        type="number"
        className="brutal-input"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="e.g. 700"
        required
        style={{ marginBottom: "8px" }}
      />

      <button type="submit" className="brutal-btn" style={{ width: "100%" }} disabled={loading}>
        {loading ? "PROCESSING..." : "TRANSFER TO NEXT STAGE"}
      </button>

      {status && (
        <div className={`status-${status.type}`} style={{ marginTop: "10px" }}>
          {status.message}
        </div>
      )}
    </form>
  );
}

export default TransferForm;