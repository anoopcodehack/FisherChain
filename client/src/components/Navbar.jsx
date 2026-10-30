import { useWeb3 } from "../contexts/Web3Context";
import { Wallet } from "./Icons";

function Navbar({ activeTab, setActiveTab }) {
  const { account, connectWallet, disconnectWallet, connecting } = useWeb3();

  const navLinks = [
    { id: "home", label: "Overview" },
    { id: "consumer", label: "Trace Batch" },
    { id: "fisherman", label: "Catch Registry" },
    { id: "distributor", label: "Logistics" },
    { id: "retailer", label: "Retail Inventory" },
    { id: "admin", label: "Governance" },
    { id: "about", label: "System Specs" },
  ];

  return (
    <header className="header-nav">
      <div className="header-container">
        {/* Brand Logo & Name with Swimming Wave, Water Ripple & Sheen Physics */}
        <div
          className="brand-container"
          onClick={() => setActiveTab("home")}
          title="Return to Protocol Overview"
        >
          {/* Animated Water Ripple Effect on Hover */}
          <div className="brand-water-ripple" />
          
          {/* Fluid Color Wave / Sheen Sweep */}
          <div className="brand-sheen-ray" />

          {/* Official Full Brand Logo (Icon + FisherChain Lettering) */}
          <img
            src="/assets/logo.png"
            alt="FisherChain Enterprise Protocol"
            className="brand-logo-img"
          />

          <span className="brand-tag">Enterprise</span>
        </div>

        {/* Centered Modern Floating Island Nav Capsule */}
        <nav className="nav-capsule-island" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              className={`nav-link-btn ${activeTab === link.id ? "active" : ""}`}
              onClick={() => setActiveTab(link.id)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right Status & Wallet Actions */}
        <div className="nav-actions">
          <div className="network-pill" title="Local Hardhat Node (Chain ID 31337) Online">
            <span className="network-dot pulse-dot" />
            <span className="network-text">RPC 8545 Online</span>
          </div>

          {account ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div className="wallet-connected-pill">
                <span className="wallet-dot" />
                <span>{account.slice(0, 6)}...{account.slice(-4)}</span>
              </div>
              <button
                type="button"
                className="btn-pill btn-pill-sm btn-pill-white"
                onClick={disconnectWallet}
                title="Disconnect connected wallet"
              >
                <span>Disconnect</span>
                <span className="btn-pill-icon">×</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn-pill btn-pill-sm btn-pill-navy"
              onClick={connectWallet}
              disabled={connecting}
            >
              <span>{connecting ? "Connecting..." : "Connect MetaMask"}</span>
              <span className="btn-pill-icon">
                <Wallet size={12} />
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
