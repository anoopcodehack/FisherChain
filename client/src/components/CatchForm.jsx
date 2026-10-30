import { useState } from "react";
import { getContract } from "../utils/contract";
import { uploadFileToIPFS } from "../utils/ipfs";
import { useWeb3 } from "../contexts/Web3Context";
import { MapPin, Anchor } from "./Icons";

function CatchForm({ onSuccess }) {
  const { contract } = useWeb3();
  const [species, setSpecies] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const getGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = `${pos.coords.latitude.toFixed(4)},${pos.coords.longitude.toFixed(4)}`;
          setLocation(coords);
        },
        () => {
          setStatus({ type: "error", message: "GPS access denied or unavailable. Please enter coordinates manually." });
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      let ipfsHash = "QmPlaceholderHash123";

      if (photo) {
        setStatus({ type: "pending", message: "Pinning catch photo & quality documentation to IPFS..." });
        ipfsHash = await uploadFileToIPFS(photo);
      }

      const activeContract = contract || (await getContract());

      setStatus({ type: "pending", message: "Broadcasting catch to Ethereum — approve in MetaMask..." });

      const tx = await activeContract.registerCatch(
        species,
        Number(quantity),
        location,
        ipfsHash,
        Number(price)
      );

      setStatus({ type: "pending", message: `Broadcasting block transaction: ${tx.hash.slice(0, 10)}...` });
      await tx.wait();

      setStatus({ type: "success", message: `Catch cryptographically recorded on ledger! Tx: ${tx.hash.slice(0, 10)}...` });

      setSpecies("");
      setQuantity("");
      setLocation("");
      setPrice("");
      setPhoto(null);
      setPhotoPreview(null);

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message: err.reason || err.data?.message || err.message || "Catch registration transaction failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="corp-card">
      <div className="corp-card-header">
        <div>
          <h2 className="corp-card-title">Register New Maritime Harvest</h2>
          <p className="corp-card-subtitle">
            Creates an immutable on-chain batch identity. Timestamp, vessel address, and GPS coordinates will be anchored permanently.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Fish Species</label>
          <input
            type="text"
            className="form-input"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            placeholder="e.g. Yellowfin Tuna, Atlantic Mackerel, Indian Salmon"
            required
          />
        </div>

        <div style={{ display: "flex", gap: "16px", marginBottom: "16px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "160px" }}>
            <label className="form-label">Batch Weight (kg)</label>
            <input
              type="number"
              className="form-input"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 150"
              required
              min="1"
            />
          </div>

          <div style={{ flex: 1, minWidth: "160px" }}>
            <label className="form-label">Initial Harbor Price (₹)</label>
            <input
              type="number"
              className="form-input"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 450"
              required
              min="0"
            />
          </div>
        </div>

        <div className="form-group">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <label className="form-label" style={{ margin: 0 }}>Vessel Catch Coordinates (GPS)</label>
            <button
              type="button"
              className="btn-pill btn-pill-sm btn-pill-white"
              onClick={getGPS}
            >
              <span>Auto-Detect GPS</span>
              <span className="btn-pill-icon">
                <MapPin size={12} />
              </span>
            </button>
          </div>
          <input
            type="text"
            className="form-input"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. 12.9141,74.8560"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Catch Photograph / Certificate (IPFS Pinata)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="form-input"
            style={{ padding: "6px" }}
          />
          {photoPreview && (
            <div style={{ marginTop: "12px" }}>
              <img
                src={photoPreview}
                alt="Catch preview"
                style={{
                  width: "100%",
                  maxHeight: "180px",
                  objectFit: "cover",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-light)",
                }}
              />
            </div>
          )}
        </div>

        <div style={{ marginTop: "24px" }}>
          <button type="submit" disabled={loading} className="btn-pill btn-pill-navy" style={{ width: "100%" }}>
            <span>{loading ? "Recording on Ethereum..." : "Commit Catch to Immutable Ledger"}</span>
            <span className="btn-pill-icon">
              <Anchor size={16} />
            </span>
          </button>
        </div>
      </form>

      {status && (
        <div className={`alert-box alert-${status.type === 'error' ? 'error' : status.type === 'success' ? 'success' : 'info'}`}>
          {status.message}
        </div>
      )}
    </div>
  );
}

export default CatchForm;
