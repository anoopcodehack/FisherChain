import { useEffect } from "react";
import { useWeb3 } from "../contexts/Web3Context";

function ConnectWallet({ onConnected }) {
  const { account, signer, connectWallet, disconnectWallet, connecting, error } = useWeb3();

  useEffect(() => {
    if (account && onConnected) {
      onConnected(signer, account);
    }
  }, [account, signer, onConnected]);

  return (
    <div className="brutal-box" style={{ marginBottom: "24px" }}>
      {account ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                background: "var(--lime)",
                border: "2px solid var(--black)",
                borderRadius: "50%",
              }}
            />
            <div>
              <span className="brutal-label" style={{ margin: 0, fontSize: "11px", color: "#666" }}>
                WALLET CONNECTED
              </span>
              <p style={{ fontWeight: 900, fontFamily: "monospace", fontSize: "15px" }}>
                {account.slice(0, 6)}...{account.slice(-4)}
              </p>
            </div>
          </div>
          <button
            onClick={disconnectWallet}
            className="brutal-btn"
            style={{ background: "#ffffff", padding: "8px 16px", fontSize: "13px" }}
          >
            DISCONNECT
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <p style={{ fontWeight: 900, fontSize: "15px" }}>SUPPLY CHAIN WALLET</p>
            <p style={{ fontSize: "13px", color: "#666" }}>
              Connect MetaMask to register catches, transfer batches, or administer roles.
            </p>
          </div>
          <button
            onClick={connectWallet}
            className="brutal-btn"
            disabled={connecting}
          >
            {connecting ? "CONNECTING..." : "CONNECT METAMASK"}
          </button>
        </div>
      )}
      {error && <p className="status-error" style={{ marginTop: "12px" }}>{error}</p>}
    </div>
  );
}

export default ConnectWallet;
