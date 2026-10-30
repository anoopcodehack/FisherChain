import {
  ArrowUpRight,
  ShieldCheck,
  Activity,
  Database,
  CheckCircle,
  Anchor,
  Truck,
  Store,
  QrCode,
  AlertCircle
} from "../components/Icons";

function HomePage({ setActiveTab }) {
  const speciesCatalog = [
    {
      id: "mackerel",
      name: "Atlantic Mackerel",
      scientific: "Scomber scombrus",
      zone: "FAO Area 27 (North Atlantic)",
      method: "Hook & Line / Artisanal Fleet",
      sampleBatchId: 1,
      typicalWeight: "120 kg",
      img: "/assets/mackerel.jpg",
      description: "Fast-swimming pelagic species. Real-time cryptographic harvest timestamps eliminate false harbor landing claims.",
    },
    {
      id: "tuna",
      name: "Yellowfin Tuna",
      scientific: "Thunnus albacares",
      zone: "Pacific Oceanic Zone 71",
      method: "Deep Line Commercial Harvest",
      sampleBatchId: 1,
      typicalWeight: "85 kg",
      img: "/assets/tuna.jpg",
      description: "High-value commercial marine game fish. Vessel GPS coordinates anchored directly to smart contract state.",
    },
    {
      id: "kingfish",
      name: "Narrow-barred Kingfish",
      scientific: "Scomberomorus commerson",
      zone: "Arabian Sea Shelf / Mangaluru",
      method: "Coastal Line Marine Harvest",
      sampleBatchId: 3,
      typicalWeight: "80 kg",
      img: "/assets/kingfish.jpg",
      description: "Premium coastal catch protected against cheaper species substitution through decentralized batch passports.",
    },
    {
      id: "salmon",
      name: "Wild Pacific Salmon",
      scientific: "Oncorhynchus tshawytscha",
      zone: "FAO Area 67 (North Pacific)",
      method: "Traditional Sustainable Drift Net",
      sampleBatchId: 2,
      typicalWeight: "200 kg",
      img: "/assets/salmon.jpg",
      description: "Wild ocean-caught salmon. Cold-chain storage temperature and custody transfers strictly audited on-chain.",
    },
  ];

  const workflowStages = [
    {
      stage: "Stage 0",
      title: "Ocean Harvest",
      role: "Vessel Captain",
      img: "/assets/workflow-harvest.jpg",
      desc: "Authorized captain registers catch on-chain: vessel GPS coordinates, species, weight, and IPFS photographic proof.",
      icon: Anchor,
      badgeClass: "badge-stage-0"
    },
    {
      stage: "Stage 1",
      title: "Harbor Auction",
      role: "Port Authority / Auctioneer",
      img: "/assets/workflow-auction.jpg",
      desc: "First commercial sale transfer. First-sale settlement price is logged on-chain, ensuring transparent compensation for fishermen.",
      icon: Activity,
      badgeClass: "badge-stage-1"
    },
    {
      stage: "Stage 2",
      title: "Cold Logistics",
      role: "Logistics Distributor",
      img: "/assets/workflow-logistics.jpg",
      desc: "Fleet transport in refrigerated containers. Cold-chain custody is verified and signed before dispatching to retailers.",
      icon: Truck,
      badgeClass: "badge-stage-2"
    },
    {
      stage: "Stage 3",
      title: "Retail Storefront",
      role: "Supermarket / Fishmonger",
      img: "/assets/workflow-retail.jpg",
      desc: "Storefront receives custody and prints cryptographic GS1 packaging QR stickers directly linked to the batch passport.",
      icon: Store,
      badgeClass: "badge-stage-3"
    },
    {
      stage: "Stage 4",
      title: "Consumer Scan",
      role: "End Consumer",
      img: "/assets/workflow-consumer.jpg",
      desc: "Shoppers scan packaging QR code on mobile. Full vessel origin, catch date, and custody history displayed with zero login required.",
      icon: QrCode,
      badgeClass: "badge-stage-4"
    }
  ];

  return (
    <div>
      {/* Luxury 2-Column Hero Section */}
      <section className="overview-hero">
        {/* Left Column: Value Proposition & CTAs */}
        <div>
          <div className="hero-protocol-badge">
            <span className="pulse-dot" />
            <span>GS1-128 & EVM Certified Seafood Provenance Protocol</span>
          </div>

          <h1 className="overview-title">
            From Ocean Depth to Retail Shelf. Verified on Blockchain.
          </h1>

          <p className="overview-desc">
            FisherChain provides an immutable chain-of-custody ledger for commercial seafood. 
            Eliminate mislabeling, catch falsification, and opaque harbor pricing with forward-only cryptographic verification from vessel landing to consumer checkout.
          </p>

          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center" }}>
            <button
              type="button"
              className="btn-pill btn-pill-navy"
              onClick={() => setActiveTab("consumer")}
            >
              <span>Trace a Seafood Batch</span>
              <span className="btn-pill-icon">
                <ArrowUpRight size={16} />
              </span>
            </button>

            <button
              type="button"
              className="btn-pill btn-pill-white"
              onClick={() => setActiveTab("fisherman")}
            >
              <span>Vessel Catch Registry</span>
              <span className="btn-pill-icon">
                <Anchor size={15} />
              </span>
            </button>

            <button
              type="button"
              className="btn-pill btn-pill-white"
              onClick={() => setActiveTab("about")}
            >
              <span>System Specs</span>
              <span className="btn-pill-icon">
                <ArrowUpRight size={15} />
              </span>
            </button>
          </div>

          {/* Trust Metrics Strip */}
          <div className="hero-trust-strip">
            <div className="hero-trust-item">
              <ShieldCheck size={16} style={{ color: "var(--primary-blue)" }} />
              <span>100% Immutable EVM</span>
            </div>
            <div className="hero-trust-item">
              <CheckCircle size={16} style={{ color: "#16a34a" }} />
              <span>Zero Consumer Login</span>
            </div>
            <div className="hero-trust-item">
              <Database size={16} style={{ color: "#7c3aed" }} />
              <span>Pinata IPFS Proof</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Seafood Passport Showcase Card */}
        <div>
          <div className="hero-showcase-card">
            <div className="hero-image-wrap">
              <img
                src="/assets/hero-vessel.jpg"
                alt="Commercial Maritime Fishing Vessel"
                className="hero-showcase-img"
              />
              <div className="hero-floating-chip chip-left">
                ⚓ FAO Area 27 Verified Catch
              </div>
              <div className="hero-floating-chip chip-right">
                ❄️ Cold Chain: -18.4°C Optimal
              </div>
            </div>

            <div className="hero-card-body">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--primary-blue)", textTransform: "uppercase" }}>
                    Verified Demonstration Batch #1
                  </span>
                  <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--primary-navy)", marginTop: "2px" }}>
                    Atlantic Mackerel (120 kg)
                  </h3>
                </div>
                <span className="badge-stage badge-stage-1">
                  Harbor Auctioned
                </span>
              </div>

              <div className="spec-row">
                <span className="spec-label">Origin Captain / Vessel</span>
                <span className="spec-val" style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>
                  0xf39f...2266
                </span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Catch GPS Location</span>
                <span className="spec-val">12.9141° N, 74.8560° E</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Current Ledger Price</span>
                <span className="spec-val" style={{ color: "var(--primary-navy)", fontWeight: 700 }}>
                  ₹450 Settlement
                </span>
              </div>

              <div style={{ marginTop: "16px" }}>
                <button
                  type="button"
                  className="btn-pill btn-pill-blue"
                  style={{ width: "100%" }}
                  onClick={() => setActiveTab("consumer")}
                >
                  <span>Simulate Instant Consumer Scan</span>
                  <span className="btn-pill-icon">
                    <QrCode size={15} />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System Telemetry Stats */}
      <div className="stats-grid">
        <div className="stat-box">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="stat-label">Smart Contract State</div>
            <ShieldCheck size={18} style={{ color: "var(--primary-blue)" }} />
          </div>
          <div className="stat-number">100% Immutable</div>
          <div className="stat-caption">Strict monotonic forward state machine</div>
        </div>

        <div className="stat-box">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="stat-label">Access Model</div>
            <CheckCircle size={18} style={{ color: "#16a34a" }} />
          </div>
          <div className="stat-number">Zero-Login</div>
          <div className="stat-caption">Instant public QR code verification</div>
        </div>

        <div className="stat-box">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="stat-label">Off-Chain Storage</div>
            <Database size={18} style={{ color: "#7c3aed" }} />
          </div>
          <div className="stat-number">IPFS Pinata</div>
          <div className="stat-caption">Cryptographically hashed media</div>
        </div>

        <div className="stat-box">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="stat-label">Audit Engine</div>
            <Activity size={18} style={{ color: "#0284c7" }} />
          </div>
          <div className="stat-number">Automated</div>
          <div className="stat-caption">Detects timestamp & price gaps</div>
        </div>
      </div>

      {/* Interactive 5-Stage Supply Chain Working Flow with Real Images */}
      <div className="corp-card">
        <div className="corp-card-header">
          <div>
            <div style={{ display: "inline-block", background: "var(--bg-accent-light)", color: "var(--primary-blue)", padding: "2px 8px", borderRadius: "var(--radius-sm)", fontSize: "11px", fontWeight: 700, marginBottom: "6px" }}>
              End-to-End Custody Protocol
            </div>
            <h2 className="corp-card-title">How FisherChain Works: 5-Stage Supply Chain Protocol</h2>
            <p className="corp-card-subtitle">
              Every transition requires cryptographic validation and updates the immutable on-chain passport
            </p>
          </div>
        </div>

        <div className="workflow-grid">
          {workflowStages.map((wf, idx) => {
            const IconComponent = wf.icon;
            return (
              <div key={idx} className="workflow-card">
                <img
                  src={wf.img}
                  alt={wf.title}
                  className="workflow-img"
                />
                <div className="workflow-content">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span className={`badge-stage ${wf.badgeClass}`}>{wf.stage}</span>
                    <IconComponent size={16} style={{ color: "var(--text-muted)" }} />
                  </div>
                  <h4 style={{ fontSize: "16px", fontWeight: 800, color: "var(--primary-navy)", marginBottom: "4px" }}>
                    {wf.title}
                  </h4>
                  <div style={{ fontSize: "11px", color: "var(--primary-blue)", fontWeight: 700, marginBottom: "8px" }}>
                    {wf.role}
                  </div>
                  <p style={{ fontSize: "12.5px", color: "var(--text-muted)", lineHeight: "1.55", flex: 1 }}>
                    {wf.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Commercial Species Catalog with EXACT Marine Fish Photography */}
      <div className="corp-card">
        <div className="corp-card-header">
          <div>
            <div style={{ display: "inline-block", background: "var(--bg-accent-light)", color: "var(--primary-blue)", padding: "2px 8px", borderRadius: "var(--radius-sm)", fontSize: "11px", fontWeight: 700, marginBottom: "6px" }}>
              Maritime Registry Catalog
            </div>
            <h2 className="corp-card-title">Supported Commercial Marine Species</h2>
            <p className="corp-card-subtitle">
              Verified wild-caught marine species with pre-configured cryptographic catch profiles
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
          {speciesCatalog.map((fish) => (
            <div key={fish.id} style={{ border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", overflow: "hidden", background: "#ffffff", display: "flex", flexDirection: "column" }}>
              <img
                src={fish.img}
                alt={fish.name}
                style={{ width: "100%", height: "160px", objectFit: "cover", display: "block" }}
              />
              <div style={{ padding: "18px", flex: 1, display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "11px", color: "var(--primary-blue)", fontWeight: 700, textTransform: "uppercase" }}>
                  {fish.scientific}
                </span>
                <h3 style={{ fontSize: "17px", fontWeight: 800, color: "var(--primary-navy)", margin: "4px 0 8px" }}>
                  {fish.name}
                </h3>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.55", marginBottom: "14px", flex: 1 }}>
                  {fish.description}
                </p>

                <div className="spec-row">
                  <span className="spec-label">Harvest Zone</span>
                  <span className="spec-val">{fish.zone}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Gear Method</span>
                  <span className="spec-val">{fish.method}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Standard Lot</span>
                  <span className="spec-val">{fish.typicalWeight}</span>
                </div>

                <div style={{ marginTop: "16px" }}>
                  <button
                    type="button"
                    className="btn-pill btn-pill-sm btn-pill-white"
                    style={{ width: "100%" }}
                    onClick={() => setActiveTab("consumer")}
                  >
                    <span>Trace Active Lot</span>
                    <span className="btn-pill-icon">
                      <ArrowUpRight size={13} />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Sample Batches Table */}
      <div className="corp-card">
        <div className="corp-card-header">
          <div>
            <h2 className="corp-card-title">Live Demonstration Batches</h2>
            <p className="corp-card-subtitle">Active sample batches seeded on the local Hardhat node</p>
          </div>
          <button
            type="button"
            className="btn-pill btn-pill-sm btn-pill-white"
            onClick={() => setActiveTab("consumer")}
          >
            <span>Open Explorer</span>
            <span className="btn-pill-icon">
              <ArrowUpRight size={13} />
            </span>
          </button>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Batch ID</th>
                <th>Species</th>
                <th>Quantity</th>
                <th>Current Stage</th>
                <th>Current Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>#1</strong></td>
                <td>Atlantic Mackerel</td>
                <td>120 kg</td>
                <td><span className="badge-stage badge-stage-1">Auctioned</span></td>
                <td>₹450</td>
                <td>
                  <button
                    type="button"
                    className="btn-pill btn-pill-sm btn-pill-white"
                    onClick={() => setActiveTab("consumer")}
                  >
                    <span>Trace Batch #1</span>
                    <span className="btn-pill-icon">
                      <ArrowUpRight size={13} />
                    </span>
                  </button>
                </td>
              </tr>
              <tr>
                <td><strong>#2</strong></td>
                <td>Wild Pacific Salmon</td>
                <td>200 kg</td>
                <td><span className="badge-stage badge-stage-2">In Transit</span></td>
                <td>₹280</td>
                <td>
                  <button
                    type="button"
                    className="btn-pill btn-pill-sm btn-pill-white"
                    onClick={() => setActiveTab("consumer")}
                  >
                    <span>Trace Batch #2</span>
                    <span className="btn-pill-icon">
                      <ArrowUpRight size={13} />
                    </span>
                  </button>
                </td>
              </tr>
              <tr>
                <td><strong>#3</strong></td>
                <td>Narrow-barred Kingfish</td>
                <td>80 kg</td>
                <td><span className="badge-stage badge-stage-0">Caught</span></td>
                <td>₹900</td>
                <td>
                  <button
                    type="button"
                    className="btn-pill btn-pill-sm btn-pill-white"
                    onClick={() => setActiveTab("consumer")}
                  >
                    <span>Trace Batch #3</span>
                    <span className="btn-pill-icon">
                      <ArrowUpRight size={13} />
                    </span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Industry Comparison Matrix: Traditional vs. FishChain Protocol */}
      <div className="corp-card">
        <div className="corp-card-header">
          <div>
            <h2 className="corp-card-title">Why Blockchain for Seafood? Traditional vs. FishChain</h2>
            <p className="corp-card-subtitle">
              Comparing legacy paper manifests against Ethereum smart contract provenance
            </p>
          </div>
        </div>

        <div className="comparison-container">
          {/* Traditional System */}
          <div className="comparison-box-traditional">
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
              <AlertCircle size={20} style={{ color: "#dc2626" }} />
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#991b1b" }}>
                Traditional Seafood Supply Chain
              </h3>
            </div>
            <div className="comparison-item">
              <span style={{ color: "#dc2626", fontWeight: 700 }}>✕</span>
              <div>
                <strong>~20% Mislabeled Catch:</strong> Farmed fish sold as wild; cheap fish substituted for premium tuna and kingfish.
              </div>
            </div>
            <div className="comparison-item">
              <span style={{ color: "#dc2626", fontWeight: 700 }}>✕</span>
              <div>
                <strong>Paper Manifests Easily Altered:</strong> Origin documents, catch dates, and weights can be rewritten at any transit port.
              </div>
            </div>
            <div className="comparison-item">
              <span style={{ color: "#dc2626", fontWeight: 700 }}>✕</span>
              <div>
                <strong>3–4 Week Recall Times:</strong> In contamination events, tracing back through paper logs takes weeks.
              </div>
            </div>
            <div className="comparison-item">
              <span style={{ color: "#dc2626", fontWeight: 700 }}>✕</span>
              <div>
                <strong>Opaque Harbor Margins:</strong> Middlemen mark up seafood prices 300% while artisanal boat captains lack visibility.
              </div>
            </div>
          </div>

          {/* FisherChain Protocol */}
          <div className="comparison-box-fishchain">
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
              <ShieldCheck size={20} style={{ color: "var(--primary-blue)" }} />
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--primary-navy)" }}>
                FisherChain Decentralized Protocol
              </h3>
            </div>
            <div className="comparison-item">
              <span style={{ color: "#16a34a", fontWeight: 700 }}>✓</span>
              <div>
                <strong>Zero Species Fraud:</strong> Immutable species identity anchored to Ethereum block timestamp and GPS coordinates.
              </div>
            </div>
            <div className="comparison-item">
              <span style={{ color: "#16a34a", fontWeight: 700 }}>✓</span>
              <div>
                <strong>Cryptographic Tamper-Proofing:</strong> Strict monotonic forward state machine prevents any record alteration.
              </div>
            </div>
            <div className="comparison-item">
              <span style={{ color: "#16a34a", fontWeight: 700 }}>✓</span>
              <div>
                <strong>Instant Sub-Second Recall:</strong> Query batch ID to immediately pinpoint the origin vessel and cold-chain route.
              </div>
            </div>
            <div className="comparison-item">
              <span style={{ color: "#16a34a", fontWeight: 700 }}>✓</span>
              <div>
                <strong>Transparent Harbor Settlement:</strong> Complete on-chain transaction history showing pricing progression.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enterprise Maritime Callout Banner */}
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)", borderRadius: "var(--radius-lg)", padding: "36px 32px", color: "#ffffff", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px", marginBottom: "32px", boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.2)" }}>
        <div style={{ maxWidth: "580px" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#38bdf8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Commercial Enterprise Deployment
          </span>
          <h3 style={{ fontSize: "22px", fontWeight: 800, marginTop: "4px", marginBottom: "8px" }}>
            Ready to deploy tamper-proof traceability across your seafood fleet?
          </h3>
          <p style={{ fontSize: "13.5px", color: "#cbd5e1", lineHeight: "1.6" }}>
            Connect with our enterprise engineering team for GDST 1.2 integration, automated harbor IoT weight scales, and customized retail QR packaging.
          </p>
        </div>

        <div>
          <button
            type="button"
            className="btn-pill btn-pill-white"
            onClick={() => setActiveTab("about")}
          >
            <span>Explore Technical Specs</span>
            <span className="btn-pill-icon">
              <ArrowUpRight size={15} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
