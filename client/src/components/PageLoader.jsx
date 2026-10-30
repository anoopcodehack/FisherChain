import { useState, useEffect } from "react";

function PageLoader({ onFinish }) {
  const [stage, setStage] = useState("animating"); // animating -> completed -> unmounted
  const [statusText, setStatusText] = useState("Initializing Maritime Ledger...");
  const [progress, setProgress] = useState(10);

  const lettersFisher = ["F", "i", "s", "h", "e", "r"];
  const lettersChain = ["C", "h", "a", "i", "n"];

  useEffect(() => {
    // Stage 1: Progress updates
    const t1 = setTimeout(() => {
      setProgress(45);
      setStatusText("Connecting Ethereum Node (Chain ID 31337)...");
    }, 700);

    const t2 = setTimeout(() => {
      setProgress(85);
      setStatusText("Anchoring Chain-of-Custody Smart Contract...");
    }, 1400);

    const t3 = setTimeout(() => {
      setProgress(100);
      setStatusText("Decentralized Provenance Verified");
      setStage("completed");
    }, 2100);

    const t4 = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onFinish]);

  const handleSkip = () => {
    setStage("completed");
    setTimeout(() => {
      if (onFinish) onFinish();
    }, 200);
  };

  return (
    <div className={`loader-overlay ${stage === "completed" ? "loader-fade-out" : ""}`}>
      {/* Skip button in corner */}
      <button type="button" className="loader-skip-btn" onClick={handleSkip}>
        <span>Skip Intro</span>
        <span>→</span>
      </button>

      <div className="loader-content-box">
        {/* Animated Brand Stage */}
        <div className="loader-stage">
          {/* Logo Drops from Top & Bounces */}
          <div className="loader-logo-drop">
            <img
              src="/assets/logo.png"
              alt="FisherChain Logo"
              className="loader-logo-img"
            />
          </div>

          {/* Left and Right Chain Links Connecting */}
          <div className="chain-connect-container">
            {/* Left Chain Loop */}
            <div className="chain-link-left">
              <svg width="42" height="28" viewBox="0 0 42 28" fill="none">
                <rect
                  x="2"
                  y="2"
                  width="38"
                  height="24"
                  rx="12"
                  stroke="#1d4ed8"
                  strokeWidth="4"
                />
              </svg>
            </div>

            {/* Spark / Lock Flash at intersection */}
            <div className="chain-spark-ring" />

            {/* Right Chain Loop */}
            <div className="chain-link-right">
              <svg width="42" height="28" viewBox="0 0 42 28" fill="none">
                <rect
                  x="2"
                  y="2"
                  width="38"
                  height="24"
                  rx="12"
                  stroke="#0284c7"
                  strokeWidth="4"
                />
              </svg>
            </div>
          </div>

          {/* Letter by Letter "FisherChain" Staggered Appearance */}
          <div className="loader-brand-letters">
            {/* FISHER (Navy) */}
            <div className="letter-word-fish">
              {lettersFisher.map((char, index) => (
                <span
                  key={`fisher-${index}`}
                  className="loader-letter"
                  style={{ animationDelay: `${0.8 + index * 0.07}s` }}
                >
                  {char}
                </span>
              ))}
            </div>

            {/* CHAIN (Tech Light Blue) */}
            <div className="letter-word-chain">
              {lettersChain.map((char, index) => (
                <span
                  key={`chain-${index}`}
                  className="loader-letter"
                  style={{ animationDelay: `${1.22 + index * 0.07}s` }}
                >
                  {char}
                </span>
              ))}
            </div>
          </div>

          <div className="loader-tagline">
            Enterprise Seafood Provenance Protocol
          </div>
        </div>

        {/* Progress Bar & Status Line */}
        <div className="loader-progress-area">
          <div className="loader-progress-track">
            <div
              className="loader-progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="loader-status-row">
            <div className="loader-status-text">
              <span className="pulse-dot" style={{ display: "inline-block", marginRight: "6px" }} />
              {statusText}
            </div>
            <div className="loader-status-pct">{progress}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageLoader;
