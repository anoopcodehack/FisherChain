import { ArrowUpRight } from "../components/Icons";

function AboutPage({ setActiveTab }) {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "var(--primary-navy)" }}>
          FisherChain Protocol & System Architecture
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>
          Technical specifications, cryptographic verification models, and smart contract data structures.
        </p>
      </div>

      {/* Problem Summary */}
      <div className="corp-card">
        <h2 className="corp-card-title" style={{ fontSize: "18px", color: "var(--primary-navy)", marginBottom: "8px" }}>
          The Industry Challenge: Paper Manifests & ~20% Mislabeled Seafood
        </h2>
        <p style={{ color: "var(--text-body)", fontSize: "14px", lineHeight: "1.7", marginBottom: "12px" }}>
          Studies by Oceana, WWF, and global academic researchers indicate that approximately <strong>20% of seafood worldwide is mislabeled</strong>. Farmed fish is misidentified as wild-caught, cheaper species are substituted for high-value catches, and illegal or overfished stocks penetrate global distribution channels without verification.
        </p>
        <div style={{ background: "var(--bg-subtle)", padding: "16px", borderRadius: "var(--radius-md)", fontSize: "13px", color: "var(--text-body)" }}>
          <p style={{ marginBottom: "6px" }}><strong>1. Opaque Pricing:</strong> Harbor boat captains receive minimal compensation while middlemen mark up prices 3–4x with zero historical transparency back to harvest origin.</p>
          <p style={{ marginBottom: "6px" }}><strong>2. Slow Contamination Recalls:</strong> In food safety incidents, paper handoff records require weeks to isolate the origin vessel and harvest zone.</p>
          <p><strong>3. Tamperable Records:</strong> Traditional paper inspection certificates and transport logs can be quietly rewritten at any transit point.</p>
        </div>
      </div>

      {/* Smart Contract Architecture */}
      <div className="corp-card">
        <h2 className="corp-card-title" style={{ fontSize: "18px", color: "var(--primary-navy)", marginBottom: "8px" }}>
          Ethereum Smart Contract Architecture (Solidity ^0.8.19)
        </h2>
        <p style={{ color: "var(--text-body)", fontSize: "14px", lineHeight: "1.7", marginBottom: "14px" }}>
          FisherChain implements role-based state machine transitions directly on the Ethereum Virtual Machine (EVM):
        </p>

        <div style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-light)", padding: "16px", borderRadius: "var(--radius-md)", fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--primary-navy)", overflowX: "auto", marginBottom: "16px" }}>
          <pre>{`enum Stage { Caught, Auctioned, InTransit, AtRetailer, SoldToConsumer }

struct Batch {
    uint256 batchId;
    address fisherman;
    string species;
    uint256 quantity;       // in kg
    string catchLocation;   // GPS string
    uint256 catchTimestamp;
    string ipfsHash;        // IPFS Photo/Certificate reference
    uint256 currentPrice;
    address currentOwner;
    Stage currentStage;
}`}</pre>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={{ background: "var(--bg-accent-light)", padding: "14px", borderRadius: "var(--radius-md)", border: "1px solid #bfdbfe" }}>
            <strong style={{ fontSize: "13px", color: "var(--primary-navy)" }}>registerCatch()</strong>
            <p style={{ fontSize: "12px", color: "var(--text-body)", marginTop: "4px" }}>
              Restricted to authorized fishermen via cryptographic modifier. Generates unique incremental batch ID.
            </p>
          </div>
          <div style={{ background: "var(--bg-accent-light)", padding: "14px", borderRadius: "var(--radius-md)", border: "1px solid #bfdbfe" }}>
            <strong style={{ fontSize: "13px", color: "var(--primary-navy)" }}>transferBatch()</strong>
            <p style={{ fontSize: "12px", color: "var(--text-body)", marginTop: "4px" }}>
              Enforces current ownership and monotonic forward stage progression. Emits BatchTransferred event.
            </p>
          </div>
        </div>
      </div>

      {/* Tech Specifications */}
      <div className="corp-card">
        <h2 className="corp-card-title" style={{ fontSize: "18px", marginBottom: "12px" }}>
          Technology Stack Specifications
        </h2>
        <div className="spec-row">
          <span className="spec-label">Smart Contracts</span>
          <span className="spec-val">Solidity ^0.8.19 / Hardhat Framework</span>
        </div>
        <div className="spec-row">
          <span className="spec-label">Contract Address</span>
          <span className="spec-val" style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>0x5FbDB2315678afecb367f032d93F642f64180aa3</span>
        </div>
        <div className="spec-row">
          <span className="spec-label">Client Library</span>
          <span className="spec-val">Ethers.js v6 with BrowserProvider + JsonRpcProvider</span>
        </div>
        <div className="spec-row">
          <span className="spec-label">Storage Layer</span>
          <span className="spec-val">Decentralized IPFS via Pinata Gateway</span>
        </div>
        <div className="spec-row">
          <span className="spec-label">Automated Unit Testing</span>
          <span className="spec-val">7 / 7 Passing Test Cases (Mocha & Chai)</span>
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <button
          type="button"
          className="btn-pill btn-pill-navy"
          onClick={() => setActiveTab("consumer")}
        >
          <span>Open Batch Trace Explorer</span>
          <span className="btn-pill-icon">
            <ArrowUpRight size={16} />
          </span>
        </button>
      </div>
    </div>
  );
}

export default AboutPage;
