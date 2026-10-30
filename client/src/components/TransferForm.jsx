import { useState } from "react";
import { getContract } from "../utils/contract";
import { STAGE_LABELS } from "../utils/constants";
import { useWeb3 } from "../contexts/Web3Context";

function TransferForm({ batchId, currentStage, onSuccess, onCancel }) {
  const { contract: web3Contract } = useWeb3();
  const currentStageNum = Number(currentStage);
  const defaultTargetStage = Math.min(currentStageNum + 1, 4);

  const [toAddress, setToAddress] = useState("");
  const [price, setPrice] = useState("");
  const [targetStage, setTargetStage] = useState(defaultTargetStage);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const validStages = [
    { value: 1, label: STAGE_LABELS[1] },
    { value: 2, label: STAGE_LABELS[2] },
    { value: 3, label: STAGE_LABELS[3] },
    { value: 4, label: STAGE_LABELS[4] },
  ].filter((s) => s.value > currentStageNum);

  const handleTransfer = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!toAddress || !toAddress.startsWith("0x") || toAddress.length !== 42) {
      setStatus({ type: "error", message: "Please provide a valid 42-character Ethereum address (0x...)" });
      return;
    }

    setLoading(true);

    try {
      const activeContract = web3Contract || (await getContract());

      setStatus({ type: "pending", message: "Confirm custody handoff transaction in MetaMask..." });
      const tx = await activeContract.transferBatch(
        batchId,
        toAddress,
        Number(price),
        Number(targetStage)
      );

      setStatus({ type: "pending", message: `Broadcasting to ledger: ${tx.hash.slice(0, 10)}...` });
      await tx.wait();

      setStatus({ type: "success", message: `Batch #${batchId} custody transferred to ${STAGE_LABELS[targetStage]}!` });
      setToAddress("");
      setPrice("");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message: err.reason || err.data?.message || err.message || "Custody transfer failed or rejected",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleTransfer} style={{ background: "var(--bg-accent-light)", border: "1px solid #bfdbfe", borderRadius: "var(--radius-md)", padding: "18px", marginTop: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
        <strong style={{ fontSize: "14px", color: "var(--primary-navy)" }}>
          Transfer Ownership & Custody — Batch #{batchId}
        </strong>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontWeight: 600, fontSize: "12px" }}
          >
            Cancel
          </button>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Recipient Wallet Address (0x...)</label>
        <input
          type="text"
          className="form-input"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value.trim())}
          placeholder="Enter 42-character address, e.g. 0x..."
          required
        />
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "14px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "150px" }}>
          <label className="form-label">Next Supply Chain Stage</label>
          <select
            className="form-input"
            value={targetStage}
            onChange={(e) => setTargetStage(Number(e.target.value))}
            style={{ cursor: "pointer" }}
          >
            {validStages.map((s) => (
              <option key={s.value} value={s.value}>
                Stage {s.value}: {s.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: 1, minWidth: "150px" }}>
          <label className="form-label">Transfer Settlement Price (₹)</label>
          <input
            type="number"
            className="form-input"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 750"
            required
            min="0"
          />
        </div>
      </div>

      <button
        type="submit"
        className="btn-blue"
        style={{ width: "100%" }}
        disabled={loading || validStages.length === 0}
      >
        {loading ? "Signing Transaction..." : "Confirm Handoff on Blockchain"}
      </button>

      {status && (
        <div className={`alert-box alert-${status.type === 'error' ? 'error' : status.type === 'success' ? 'success' : 'info'}`}>
          {status.message}
        </div>
      )}
    </form>
  );
}

export default TransferForm;
