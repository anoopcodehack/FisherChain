import { useState } from "react";
import { getContract } from "../utils/contract";

function CatchForm() {
  const [species, setSpecies] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      const contract = await getContract();
      const placeholderIpfsHash = "QmPlaceholderHash123";

      setStatus({ type: "pending", message: "Confirm the transaction in MetaMask..." });

      const tx = await contract.registerCatch(
        species,
        Number(quantity),
        location,
        placeholderIpfsHash,
        Number(price)
      );

      setStatus({ type: "pending", message: "Transaction sent, waiting for confirmation..." });
      await tx.wait();

      setStatus({ type: "success", message: `Catch registered! Tx: ${tx.hash.slice(0, 10)}...` });
      setSpecies("");
      setQuantity("");
      setLocation("");
      setPrice("");
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

        <div style={{ marginBottom: "20px" }}>
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