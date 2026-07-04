import { useState } from "react";
import { getSigner } from "../utils/contract";

function ConnectWallet({ onConnected }) {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState("");

  const connectWallet = async () => {
    try {
      const signer = await getSigner();
      const address = await signer.getAddress();
      setAccount(address);
      setError("");
      if (onConnected) onConnected(signer, address);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="brutal-box" style={{ marginBottom: "24px" }}>
      {account ? (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "10px", height: "10px", background: "var(--lime)", border: "2px solid var(--black)", borderRadius: "50%" }} />
          <p style={{ fontWeight: 900 }}>
            CONNECTED: {account.slice(0, 6)}...{account.slice(-4)}
          </p>
        </div>
      ) : (
        <button onClick={connectWallet} className="brutal-btn">
          CONNECT METAMASK
        </button>
      )}
      {error && <p className="status-error" style={{ marginTop: "10px" }}>{error}</p>}
    </div>
  );
}

export default ConnectWallet;