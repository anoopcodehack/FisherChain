import axios from "axios";

const PINATA_JWT = process.env.REACT_APP_PINATA_JWT;
const PINATA_BASE_URL = "https://api.pinata.cloud";
const PINATA_GATEWAY = "https://gateway.pinata.cloud/ipfs";

/**
 * Uploads a single file (e.g. catch photo) to IPFS via Pinata.
 * Returns the IPFS hash (CID) that gets stored on-chain.
 */
export const uploadFileToIPFS = async (file) => {
  if (!PINATA_JWT) {
    throw new Error("Pinata JWT not configured. Add REACT_APP_PINATA_JWT to your .env file.");
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
 * Useful if you want to store structured data alongside a photo.
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
 * Builds a viewable gateway URL from an IPFS hash — use this to display
 * an uploaded image/photo back in the UI.
 */
export const getIPFSUrl = (ipfsHash) => {
  if (!ipfsHash) return null;
  return `${PINATA_GATEWAY}/${ipfsHash}`;
};