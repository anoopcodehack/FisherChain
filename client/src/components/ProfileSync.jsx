import { useState, useEffect, useCallback } from "react";
import { registerUserProfile, loginUserProfile, getMyProfile, logoutUserProfile } from "../utils/api";
import { useWeb3 } from "../contexts/Web3Context";

function ProfileSync() {
  const { account } = useWeb3();
  const [profile, setProfile] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("fisherman");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serverOnline, setServerOnline] = useState(true);

  const checkProfile = useCallback(async () => {
    try {
      const data = await getMyProfile();
      setProfile(data);
      setServerOnline(true);
    } catch {
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    checkProfile();
  }, [checkProfile, account]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account) {
      setStatus({ type: "error", message: "Please connect your MetaMask wallet first." });
      return;
    }

    setStatus(null);
    setLoading(true);

    try {
      if (isRegistering) {
        await registerUserProfile({
          walletAddress: account,
          name,
          password,
          role,
          phone,
          location,
        });
        setStatus({ type: "success", message: "Organization profile registered successfully with backend!" });
      } else {
        await loginUserProfile({
          walletAddress: account,
          password,
        });
        setStatus({ type: "success", message: "Logged in to organization profile!" });
      }
      setPassword("");
      await checkProfile();
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || "Failed to communicate with auth server";
      setStatus({ type: "error", message: msg });
      if (err.code === "ERR_NETWORK" || err.message.includes("Network Error")) {
        setServerOnline(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUserProfile();
    setProfile(null);
  };

  if (!account) return null;

  return (
    <div style={{ marginBottom: "20px" }}>
      {profile ? (
        <div className="corp-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", background: "var(--bg-accent-light)", borderColor: "#bfdbfe", padding: "16px 20px" }}>
          <div>
            <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--primary-blue)" }}>
              Authenticated Organization Identity
            </span>
            <p style={{ fontWeight: 700, fontSize: "14px", marginTop: "2px", color: "var(--primary-navy)" }}>
              {profile.name} <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>({profile.role.toUpperCase()})</span> · {profile.location || "Harbor Office"}
            </p>
          </div>
          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={handleLogout}
          >
            Logout Profile
          </button>
        </div>
      ) : (
        <div className="corp-card" style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <strong style={{ fontSize: "14px", color: "var(--primary-navy)" }}>
                Organization Profile Sync (MongoDB)
              </strong>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>
                Link this connected wallet to your verified company name, phone, and harbor port.
              </p>
            </div>
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? "Close Form" : "Sync Profile →"}
            </button>
          </div>

          {!serverOnline && (
            <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px" }}>
              Note: Local API server (port 5000) is optional. Decentralized smart contracts execute independently on Ethereum.
            </p>
          )}

          {isOpen && (
            <form onSubmit={handleSubmit} style={{ marginTop: "16px", borderTop: "1px solid var(--border-light)", paddingTop: "16px" }}>
              <div style={{ display: "flex", gap: "10px", marginBottom: "14px" }}>
                <button
                  type="button"
                  className={!isRegistering ? "btn-blue btn-sm" : "btn-secondary btn-sm"}
                  style={{ flex: 1 }}
                  onClick={() => setIsRegistering(false)}
                >
                  Log In Existing
                </button>
                <button
                  type="button"
                  className={isRegistering ? "btn-blue btn-sm" : "btn-secondary btn-sm"}
                  style={{ flex: 1 }}
                  onClick={() => setIsRegistering(true)}
                >
                  Register New Organization
                </button>
              </div>

              {isRegistering && (
                <>
                  <div className="form-group">
                    <label className="form-label">Organization / Vessel Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Pacific Blue Fisheries / Captain Ahab"
                      required
                    />
                  </div>

                  <div style={{ display: "flex", gap: "12px", marginBottom: "14px", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: "140px" }}>
                      <label className="form-label">Supply Chain Role</label>
                      <select
                        className="form-input"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        style={{ cursor: "pointer" }}
                      >
                        <option value="fisherman">Fisherman</option>
                        <option value="distributor">Distributor</option>
                        <option value="retailer">Retailer</option>
                        <option value="consumer">Consumer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <div style={{ flex: 1, minWidth: "140px" }}>
                      <label className="form-label">Harbor / Port Location</label>
                      <input
                        type="text"
                        className="form-input"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Mangaluru Harbor"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Phone</label>
                    <input
                      type="text"
                      className="form-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label className="form-label">Account Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-blue btn-sm"
                style={{ width: "100%" }}
                disabled={loading}
              >
                {loading ? "Authenticating..." : isRegistering ? "Register Organization Profile" : "Login to Profile"}
              </button>

              {status && (
                <div className={`alert-box alert-${status.type === 'error' ? 'error' : status.type === 'success' ? 'success' : 'info'}`}>
                  {status.message}
                </div>
              )}
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfileSync;
