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
    <div style={{ padding: "20px", border: "2px solid #111", marginBottom: "20px" }}>
      {account ? (
        <p><strong>Connected:</strong> {account.slice(0, 6)}...{account.slice(-4)}</p>
      ) : (
        <button onClick={connectWallet} style={{ padding: "10px 20px", fontWeight: "bold" }}>
          Connect MetaMask
        </button>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default ConnectWallet;