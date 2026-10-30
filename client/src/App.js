import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageLoader from "./components/PageLoader";
import HomePage from "./pages/HomePage";
import FishermanDashboard from "./pages/FishermanDashboard";
import DistributorDashboard from "./pages/DistributorDashboard";
import RetailerDashboard from "./pages/RetailerDashboard";
import ConsumerLookup from "./pages/ConsumerLookup";
import AdminPanel from "./pages/AdminPanel";
import AboutPage from "./pages/AboutPage";
import { useWeb3 } from "./contexts/Web3Context";

function App() {
  const { account, connectWallet } = useWeb3();
  const [activeTab, setActiveTab] = useState("home");
  const [urlTraceBatchId, setUrlTraceBatchId] = useState("");
  const [showLoader, setShowLoader] = useState(true);

  // Inspect URL parameters on first load (e.g. from QR scan: ?trace=1)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const traceId = params.get("trace");
      if (traceId) {
        setUrlTraceBatchId(traceId);
        setActiveTab("consumer");
      }
    }
  }, []);

  return (
    <div className="app-shell">
      {/* Intro Animation Loader */}
      {showLoader && (
        <PageLoader onFinish={() => setShowLoader(false)} />
      )}

      {/* Official Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onReplayLoader={() => setShowLoader(true)} />

      {/* Main Container */}
      <main className="main-content">
        {/* Tab Pages */}
        {activeTab === "home" && (
          <HomePage setActiveTab={setActiveTab} />
        )}

        {activeTab === "consumer" && (
          <ConsumerLookup initialBatchId={urlTraceBatchId} />
        )}

        {activeTab === "fisherman" && (
          account ? (
            <FishermanDashboard account={account} />
          ) : (
            <div className="corp-card" style={{ maxWidth: "560px", margin: "40px auto", textAlign: "center", padding: "40px 24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--primary-navy)", marginBottom: "8px" }}>
                Vessel Wallet Authentication Required
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>
                A registered Web3 wallet is required to sign, authenticate, and commit new ocean catch batches to the blockchain ledger.
              </p>
              <button type="button" className="btn-blue" onClick={connectWallet}>
                Connect MetaMask Wallet →
              </button>
            </div>
          )
        )}

        {activeTab === "distributor" && (
          account ? (
            <DistributorDashboard account={account} />
          ) : (
            <div className="corp-card" style={{ maxWidth: "560px", margin: "40px auto", textAlign: "center", padding: "40px 24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--primary-navy)", marginBottom: "8px" }}>
                Logistics Wallet Authentication Required
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>
                Please connect your fleet wallet to verify current custody holdings and sign downstream handoffs to retailers.
              </p>
              <button type="button" className="btn-blue" onClick={connectWallet}>
                Connect MetaMask Wallet →
              </button>
            </div>
          )
        )}

        {activeTab === "retailer" && (
          account ? (
            <RetailerDashboard account={account} />
          ) : (
            <div className="corp-card" style={{ maxWidth: "560px", margin: "40px auto", textAlign: "center", padding: "40px 24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--primary-navy)", marginBottom: "8px" }}>
                Storefront Wallet Authentication Required
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>
                Connect your store's wallet to manage physical fish inventory, export packaging QR passports, and record final consumer checkouts.
              </p>
              <button type="button" className="btn-blue" onClick={connectWallet}>
                Connect MetaMask Wallet →
              </button>
            </div>
          )
        )}

        {activeTab === "admin" && (
          account ? (
            <AdminPanel />
          ) : (
            <div className="corp-card" style={{ maxWidth: "560px", margin: "40px auto", textAlign: "center", padding: "40px 24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--primary-navy)", marginBottom: "8px" }}>
                Governance Deployer Authentication Required
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>
                Connect the protocol deployer address to authorize new fishermen on the smart contract and review global ledger telemetry.
              </p>
              <button type="button" className="btn-blue" onClick={connectWallet}>
                Connect Admin Wallet →
              </button>
            </div>
          )
        )}

        {activeTab === "about" && (
          <AboutPage setActiveTab={setActiveTab} />
        )}
      </main>

      {/* Official Enterprise Footer */}
      <Footer setActiveTab={setActiveTab} onReplayLoader={() => setShowLoader(true)} />
    </div>
  );
}

export default App;
