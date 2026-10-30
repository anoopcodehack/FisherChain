import { useState, useEffect, useCallback } from "react";
import { getContract, getAllBatches, getReadOnlyContract } from "../utils/contract";
import { useWeb3 } from "../contexts/Web3Context";
import BatchCard from "../components/BatchCard";
import { RefreshCw, ShieldCheck } from "../components/Icons";

function AdminPanel() {
  const { account, contract } = useWeb3();
  const [contractAdmin, setContractAdmin] = useState(null);
  const [fishermanAddress, setFishermanAddress] = useState("");
  const [status, setStatus] = useState(null);
  const [allBatches, setAllBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const activeContract = contract || (await getContract()).catch(() => getReadOnlyContract());
      const [adminAddr, batches] = await Promise.all([
        activeContract.admin().catch(() => null),
        getAllBatches(activeContract),
      ]);
      setContractAdmin(adminAddr);
      setAllBatches(batches.reverse());
    } catch (err) {
      console.error("Admin data load error:", err);
    } finally {
      setLoading(false);
    }
  }, [contract]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRegisterFisherman = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!fishermanAddress.startsWith("0x") || fishermanAddress.length !== 42) {
      setStatus({ type: "error", message: "Please provide a valid 42-character Ethereum address (0x...)" });
      return;
    }

    try {
      const activeContract = contract || (await getContract());
      setStatus({ type: "pending", message: "Submitting authorization transaction to MetaMask..." });
      const tx = await activeContract.registerFisherman(fishermanAddress);
      await tx.wait();
      setStatus({ type: "success", message: `Wallet ${fishermanAddress} authorized as registered Fisherman!` });
      setFishermanAddress("");
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message: err.reason || err.message || "Only the contract admin can authorize fishermen",
      });
    }
  };

  const isAdmin =
    account && contractAdmin && account.toLowerCase() === contractAdmin.toLowerCase();

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "var(--primary-navy)" }}>
            Protocol Governance & Permissions
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>
            Authorize registered boat captains and inspect global ledger telemetry.
          </p>
        </div>
        <button
          type="button"
          className="btn-pill btn-pill-sm btn-pill-white"
          onClick={loadData}
          disabled={loading}
        >
          <span>{loading ? "Syncing..." : "Sync Ledger"}</span>
          <span className="btn-pill-icon">
            <RefreshCw size={12} className={loading ? "spin-icon" : ""} />
          </span>
        </button>
      </div>

      {contractAdmin && (
        <div className="corp-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <span className="spec-label" style={{ fontSize: "12px", textTransform: "uppercase", fontWeight: 600 }}>
                On-Chain Contract Deployer Admin
              </span>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--primary-navy)", fontWeight: 600, marginTop: "4px" }}>
                {contractAdmin}
              </p>
            </div>
            <div>
              {isAdmin ? (
                <span className="badge-stage badge-stage-0">
                  Admin Permissions Active
                </span>
              ) : (
                <span className="badge-stage badge-stage-4">
                  View-Only (Non-Admin Account)
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fisherman Authorization Form */}
      <form onSubmit={handleRegisterFisherman} className="corp-card">
        <h3 className="corp-card-title" style={{ fontSize: "16px", marginBottom: "4px" }}>
          Authorize New Fisherman Vessel
        </h3>
        <p className="corp-card-subtitle" style={{ marginBottom: "16px" }}>
          Authorized fishermen obtain cryptographic permission on the smart contract to register and anchor ocean harvests.
        </p>

        <div className="form-group">
          <label className="form-label">Fisherman Wallet Address (0x...)</label>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input
              type="text"
              className="form-input"
              value={fishermanAddress}
              onChange={(e) => setFishermanAddress(e.target.value.trim())}
              placeholder="Enter 42-character address, e.g. 0x..."
              required
              style={{ flex: 1, minWidth: "260px" }}
            />
            <button
              type="submit"
              className="btn-pill btn-pill-navy"
              disabled={!isAdmin}
              style={{ opacity: isAdmin ? 1 : 0.5 }}
            >
              <span>Authorize on Contract</span>
              <span className="btn-pill-icon">
                <ShieldCheck size={14} />
              </span>
            </button>
          </div>
        </div>

        {status && (
          <div className={`alert-box alert-${status.type === 'error' ? 'error' : status.type === 'success' ? 'success' : 'info'}`}>
            {status.message}
          </div>
        )}
      </form>

      {/* Global Batches Inspector */}
      <div style={{ marginTop: "32px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--primary-navy)", marginBottom: "16px" }}>
          Global Catch Ledger ({allBatches.length} Total Batches)
        </h3>

        {loading && <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>Loading global ledger data...</p>}
        {!loading && allBatches.length === 0 && (
          <div className="corp-card" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)", fontSize: "14px" }}>
            No batches have been registered on the blockchain yet.
          </div>
        )}

        {allBatches.map((batch) => (
          <BatchCard
            key={Number(batch.batchId)}
            batch={batch}
            account={account}
            onRefresh={loadData}
          />
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;
