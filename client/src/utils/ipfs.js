import axios from "axios";

const PINATA_JWT = process.env.REACT_APP_PINATA_JWT;
const PINATA_BASE_URL = "https://api.pinata.cloud";
const PINATA_GATEWAY = process.env.REACT_APP_PINATA_GATEWAY || "https://gateway.pinata.cloud/ipfs";

/**
 * Uploads a single file (e.g. catch photo) to IPFS via Pinata.
 * Returns the IPFS hash (CID) that gets stored on-chain.
 */
export const uploadFileToIPFS = async (file) => {
  if (!PINATA_JWT) {
    console.warn("Pinata JWT not configured in REACT_APP_PINATA_JWT. Using placeholder CID.");
    return `QmDemo${Date.now()}`;
  }

  const formData = new FormData();
  formData.append("file", file);

  const metadata = JSON.stringify({
    name: `fisherchain-${Date.now()}-${file.name}`,
  });
  formData.append("pinataMetadata", metadata);

  const options = JSON.stringify({ cidVersion: 1 });
  formData.append("pinataOptions", options);

  try {
    const response = await axios.post(
      `${PINATA_BASE_URL}/pinning/pinFileToIPFS`,
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": `multipart/form-data;`,
          Authorization: `Bearer ${PINATA_JWT}`,
        },
      }
    );

    return response.data.IpfsHash; // this is your CID — store this on-chain
  } catch (error) {
    console.error("IPFS upload failed:", error);
    throw new Error(
      error.response?.data?.error?.details || "Failed to upload file to IPFS"
    );
  }
};

/**
 * Uploads JSON metadata (e.g. batch details, certificates) to IPFS via Pinata.
 */
export const uploadJSONToIPFS = async (jsonData) => {
  if (!PINATA_JWT) {
    throw new Error("Pinata JWT not configured. Add REACT_APP_PINATA_JWT to your .env file.");
  }

  try {
    const response = await axios.post(
      `${PINATA_BASE_URL}/pinning/pinJSONToIPFS`,
      jsonData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PINATA_JWT}`,
        },
      }
    );

    return response.data.IpfsHash;
  } catch (error) {
    console.error("IPFS JSON upload failed:", error);
    throw new Error(
      error.response?.data?.error?.details || "Failed to upload JSON to IPFS"
    );
  }
};

/**
 * High-resolution authentic seafood species photography fallbacks.
 * Ensures that product cards and public batch provenance cards always
 * display beautiful real marine species imagery instead of empty white boxes.
 */
export const getSpeciesFallbackImage = (species) => {
  const s = (species || "").toLowerCase();
  if (s.includes("mackerel")) return "/assets/mackerel.jpg";
  if (s.includes("kingfish")) return "/assets/kingfish.jpg";
  if (s.includes("salmon")) return "/assets/salmon.jpg";
  if (s.includes("tuna")) return "/assets/tuna.jpg";
  if (s.includes("sardine") || s.includes("pomfret")) return "/assets/mackerel.jpg";
  return "/assets/workflow-retail.jpg";
};

/**
 * Builds a viewable gateway URL from an IPFS hash — use this to display
 * an uploaded image/photo back in the UI.
 */
export const getIPFSUrl = (ipfsHash) => {
  if (!ipfsHash || ipfsHash === "QmPlaceholderHash123") return null;
  const clean = ipfsHash.replace(/^ipfs:\/\//, "").trim();
  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }
  // If it's a simulated/mock test hash that won't resolve on Pinata's public gateway,
  // return null so UI renders the local authentic species photography immediately.
  if (clean.startsWith("QmDemo") || clean.startsWith("QmTest") || clean.startsWith("QmHash") || clean.startsWith("QmFake")) {
    return null;
  }
  return `${PINATA_GATEWAY}/${clean}`;
};
