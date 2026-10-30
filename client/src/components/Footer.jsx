import { useState } from "react";
import { CONTRACT_ADDRESS } from "../utils/contract";
import { Copy, Check, ArrowUpRight } from "./Icons";

function Footer({ setActiveTab, onReplayLoader }) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="corp-footer">
      {/* Top Live Blockchain Telemetry Strip */}
      <div className="footer-telemetry-banner">
        <div className="footer-telemetry-inner">
          <div className="footer-telemetry-item">
            <span className="pulse-dot" />
            <strong style={{ color: "var(--primary-navy)" }}>EVM Consensus:</strong>
            <span>Localnet 31337 Online</span>
          </div>

          <div className="footer-telemetry-item">
            <strong style={{ color: "var(--primary-navy)" }}>Smart Contract:</strong>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-body)" }}>
              {CONTRACT_ADDRESS.slice(0, 10)}...{CONTRACT_ADDRESS.slice(-8)}
            </span>
            <button
              type="button"
              className="copy-badge-btn"
              onClick={handleCopyAddress}
              title="Copy verified contract address"
            >
              {copied ? (
                <>
                  <Check size={11} style={{ color: "#16a34a" }} />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={11} />
                  <span>Copy Address</span>
                </>
              )}
            </button>
          </div>

          <div className="footer-telemetry-item">
            <strong style={{ color: "var(--primary-navy)" }}>Audit Engine:</strong>
            <span style={{ color: "#16a34a", fontWeight: 600 }}>Active (Chronological & Price Anomaly Check)</span>
          </div>
        </div>
      </div>

      {/* Main 4-Column Directory */}
      <div className="footer-inner">
        {/* Brand & Mission Column */}
        <div>
          <img
            src="/assets/logo.png"
            alt="FisherChain Logo"
            className="footer-brand-logo"
          />
          <div style={{ display: "inline-block", background: "var(--bg-accent-light)", color: "var(--primary-blue)", padding: "2px 8px", borderRadius: "var(--radius-sm)", fontSize: "11px", fontWeight: 700, marginBottom: "12px", border: "1px solid #bfdbfe" }}>
            Enterprise Seafood Provenance Ledger
          </div>
          <p style={{ fontSize: "13px", lineHeight: "1.65", color: "var(--text-muted)", maxWidth: "380px", marginBottom: "16px" }}>
            Decentralized traceability infrastructure for commercial fisheries. Eliminates seafood fraud and mislabeling by enforcing forward-only cryptographic custody from ocean harvest to consumer point-of-sale.
          </p>

          {/* Corporate Pilot Program / Dispatch Box */}
          <div className="footer-dispatch-card">
            <div className="footer-dispatch-title">Enterprise Maritime Dispatch</div>
            <p className="footer-dispatch-desc">
              Get regulatory updates, GDST compliance guides, and pilot deployment releases.
            </p>
            {subscribed ? (
              <div style={{ fontSize: "12px", color: "#16a34a", fontWeight: 600 }}>
                ✓ Thank you. Your enterprise request has been registered.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="footer-dispatch-form">
                <input
                  type="email"
                  placeholder="Enter corporate email..."
                  className="footer-dispatch-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="footer-dispatch-btn" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span>Join Pilot</span>
                  <ArrowUpRight size={13} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Column 2: Platform Modules */}
        <div>
          <h4 className="footer-heading">
            Platform Modules
            <span className="footer-heading-tag">Live</span>
          </h4>
          <ul className="footer-links">
            <li>
              <button
                type="button"
                className="footer-hover-link"
                onClick={() => setActiveTab("consumer")}
              >
                <span>Public Batch Trace</span>
                <span className="footer-link-box">↗</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-hover-link"
                onClick={() => setActiveTab("fisherman")}
              >
                <span>Harbor Catch Registry</span>
                <span className="footer-link-box">↗</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-hover-link"
                onClick={() => setActiveTab("distributor")}
              >
                <span>Cold Logistics Fleet</span>
                <span className="footer-link-box">↗</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-hover-link"
                onClick={() => setActiveTab("retailer")}
              >
                <span>Retail Market Portal</span>
                <span className="footer-link-box">↗</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-hover-link"
                onClick={() => setActiveTab("admin")}
              >
                <span>Governance & Admins</span>
                <span className="footer-link-box">↗</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Architecture & Protocol */}
        <div>
          <h4 className="footer-heading">
            Architecture
            <span className="footer-heading-tag">EVM</span>
          </h4>
          <ul className="footer-links">
            <li>
              <button
                type="button"
                className="footer-hover-link"
                onClick={() => setActiveTab("about")}
              >
                <span>Smart Contract Specs</span>
                <span className="footer-link-box">↗</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-hover-link"
                onClick={() => setActiveTab("about")}
              >
                <span>Forward State Machine</span>
                <span className="footer-link-box">↗</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-hover-link"
                onClick={() => window.open("https://pinata.cloud", "_blank")}
              >
                <span>Pinata IPFS Gateway</span>
                <span className="footer-link-box">↗</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-hover-link"
                onClick={() => setActiveTab("about")}
              >
                <span>Ethers.js v6 Interface</span>
                <span className="footer-link-box">↗</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-hover-link"
                onClick={() => setActiveTab("about")}
              >
                <span>Sepolia Testnet Config</span>
                <span className="footer-link-box">↗</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Column 4: Standards & Compliance */}
        <div>
          <h4 className="footer-heading">
            Compliance
            <span className="footer-heading-tag">GS1</span>
          </h4>
          <ul className="footer-links">
            <li>
              <button
                type="button"
                className="footer-hover-link"
                onClick={() => setActiveTab("about")}
              >
                <span>GDST 1.2 Standard</span>
                <span className="footer-link-box">↗</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-hover-link"
                onClick={() => setActiveTab("about")}
              >
                <span>MSC Chain of Custody</span>
                <span className="footer-link-box">↗</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-hover-link"
                onClick={() => setActiveTab("about")}
              >
                <span>FAO Key Data Elements</span>
                <span className="footer-link-box">↗</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-hover-link"
                onClick={() => setActiveTab("consumer")}
              >
                <span>Automated Anomaly Engine</span>
                <span className="footer-link-box">↗</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-hover-link"
                onClick={() => window.open("https://github.com", "_blank")}
              >
                <span>Open Source MIT License</span>
                <span className="footer-link-box">↗</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Compliance Certification Badges & Back-to-Top Action Row */}
      <div className="footer-cert-row">
        <div className="footer-cert-badges">
          <span className="footer-cert-pill">
            <span style={{ color: "#16a34a" }}>●</span> GDST 1.2 Compliant
          </span>
          <span className="footer-cert-pill">
            <span style={{ color: "#0284c7" }}>●</span> MSC Chain of Custody
          </span>
          <span className="footer-cert-pill">
            <span style={{ color: "#7c3aed" }}>●</span> IPFS Pinata Anchored
          </span>
          <span className="footer-cert-pill">
            <span style={{ color: "#2563eb" }}>●</span> EVM Smart Contract Audited
          </span>
        </div>

        <button
          type="button"
          className="btn-pill btn-pill-sm btn-pill-white"
          onClick={scrollToTop}
          title="Scroll to top of page"
        >
          <span>Back to Top</span>
          <span className="btn-pill-icon">
            <ArrowUpRight size={12} style={{ transform: "rotate(-45deg)" }} />
          </span>
        </button>
      </div>

      {/* Bottom Legal / Versioning Bar */}
      <div className="footer-bottom">
        <div>
          © 2026 FisherChain Systems Inc. Enterprise Maritime Supply Chain Ledger.
        </div>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          {onReplayLoader && (
            <button
              type="button"
              style={{ background: "none", border: "none", color: "var(--primary-blue)", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
              onClick={onReplayLoader}
            >
              Replay Intro Animation ⚡
            </button>
          )}
          <span>99.99% Node Uptime SLA</span>
          <span style={{ color: "var(--border-medium)" }}>|</span>
          <button
            type="button"
            style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "12px", cursor: "pointer" }}
            onClick={() => setActiveTab("about")}
          >
            Privacy Documentation
          </button>
          <button
            type="button"
            style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "12px", cursor: "pointer" }}
            onClick={() => setActiveTab("about")}
          >
            Security Audit
          </button>
          <button
            type="button"
            style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "12px", cursor: "pointer" }}
            onClick={() => setActiveTab("about")}
          >
            Terms of Use
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
