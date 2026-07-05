import { useState } from "react";
import ConnectWallet from "./components/ConnectWallet";
import FishermanDashboard from "./pages/FishermanDashboard";
import DistributorDashboard from "./pages/DistributorDashboard";
import RetailerDashboard from "./pages/RetailerDashboard";
import ConsumerLookup from "./pages/ConsumerLookup";
import AdminPanel from "./pages/AdminPanel";

function App() {
  const [account, setAccount] = useState(null);
  const [activeTab, setActiveTab] = useState("fisherman");

  const handleConnected = (signer, address) => {
    setAccount(address);
  };

  const tabs = [
    { id: "fisherman", label: "Fisherman" },
    { id: "distributor", label: "Distributor" },
    { id: "retailer", label: "Retailer" },
    { id: "consumer", label: "Trace a Fish" },
    { id: "admin", label: "Admin" },
  ];

  return (
    <div className="page-container">
      <h1 style={{ fontWeight: 900, fontSize: "36px", marginBottom: "8px", letterSpacing: "-1px" }}>
        🐟 FISHERCHAIN
      </h1>
      <p style={{ marginBottom: "32px", color: "#555", fontWeight: 700 }}>
        Blockchain-based fish supply chain traceability
      </p>

      <ConnectWallet onConnected={handleConnected} />

      {account && (
        <>
          <div className="nav-bar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
                style={{ cursor: "pointer" }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "fisherman" && <FishermanDashboard account={account} />}
          {activeTab === "distributor" && <DistributorDashboard account={account} />}
          {activeTab === "retailer" && <RetailerDashboard account={account} />}
          {activeTab === "consumer" && <ConsumerLookup />}
          {activeTab === "admin" && <AdminPanel />}
        </>
      )}
    </div>
  );
}

export default App;
