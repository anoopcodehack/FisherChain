import { useState } from "react";
import ConnectWallet from "./components/ConnectWallet";
import CatchForm from "./components/CatchForm";

function App() {
  const [connected, setConnected] = useState(false);

  const handleConnected = () => {
    setConnected(true);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "60px 20px" }}>
      <h1 style={{ fontWeight: 900, fontSize: "36px", marginBottom: "8px", letterSpacing: "-1px" }}>
        🐟 FISHERCHAIN
      </h1>
      <p style={{ marginBottom: "32px", color: "#555", fontWeight: 700 }}>
        Blockchain-based fish supply chain traceability
      </p>

      <ConnectWallet onConnected={handleConnected} />
      {connected && <CatchForm />}
    </div>
  );
}

export default App;
