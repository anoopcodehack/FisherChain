import { useState } from "react";
import { getContract } from "../utils/contract";
import { uploadFileToIPFS } from "../utils/ipfs";

function CatchForm({ onSuccess }) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      let ipfsHash = "QmPlaceholderHash123";

      if (photo) {
        setStatus({ type: "pending", message: "Uploading photo to IPFS..." });
        ipfsHash = await uploadFileToIPFS(photo);
      }

      const contract = await getContract();

      setStatus({ type: "pending", message: "Confirm the transaction in MetaMask..." });

      const tx = await contract.registerCatch(
        species,
        Number(quantity),
        location,
        ipfsHash,
        Number(price)
      );

      setStatus({ type: "pending", message: "Transaction sent, waiting for confirmation..." });
      await tx.wait();

      setStatus({ type: "success", message: `Catch registered! Tx: ${tx.hash.slice(0, 10)}...` });

      setSpecies("");
      setQuantity("");
      setLocation("");
      setPrice("");
      setPhoto(null);
      setPhotoPreview(null);

      onSuccess?.();
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: err.reason || err.message || "Transaction failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="brutal-box">
      <h2 style={{ fontWeight: 900, marginBottom: "20px", fontSize: "22px" }}>
        REGISTER A CATCH
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label className="brutal-label">Species</label>
          <input
            type="text"
            className="brutal-input"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            placeholder="e.g. Mackerel"
            required
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label className="brutal-label">Quantity (kg)</label>
          <input
            type="number"
            className="brutal-input"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="e.g. 100"
            required
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label className="brutal-label">Catch Location (GPS)</label>
          <input
            type="text"
            className="brutal-input"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="12.9141,74.8560"
            required
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label className="brutal-label">Initial Price (₹)</label>
          <input
            type="number"
            className="brutal-input"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 500"
            required
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label className="brutal-label">Catch Photo (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="brutal-input"
          />
          {photoPreview && (
            <img
              src={photoPreview}
              alt="Catch preview"
              style={{
                marginTop: "10px",
                width: "100%",
                maxHeight: "180px",
                objectFit: "cover",
                border: "2px solid var(--black)",
              }}
            />
          )}
        </div>

        <button type="submit" disabled={loading} className="brutal-btn" style={{ width: "100%" }}>
          {loading ? "PROCESSING..." : "REGISTER CATCH"}
        </button>
      </form>

      {status && (
        <div className={`status-${status.type}`} style={{ marginTop: "16px" }}>
          {status.message}
        </div>
      )}
    </div>
  );
}

export default CatchForm;