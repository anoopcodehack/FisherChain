import { ethers } from "ethers";
import FisherChainABI from "./FisherChain.json";

// Read from env if present, otherwise default to local Hardhat deployed address
export const CONTRACT_ADDRESS =
  process.env.REACT_APP_CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";

/**
 * Returns a standalone read-only provider for public queries.
 * Completely decoupled from MetaMask so public viewers never experience extension crashes.
 */
export const getReadOnlyProvider = () => {
  const rpcUrl = process.env.REACT_APP_RPC_URL || "http://127.0.0.1:8545";
  return new ethers.JsonRpcProvider(rpcUrl);
};

export const getReadOnlyContract = () => {
  const provider = getReadOnlyProvider();
  return new ethers.Contract(CONTRACT_ADDRESS, FisherChainABI.abi, provider);
};

export const getProvider = () => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask is not installed. Please install MetaMask to perform transactions.");
  }
  return new ethers.BrowserProvider(window.ethereum);
};

export const getSigner = async () => {
  const provider = getProvider();
  await provider.send("eth_requestAccounts", []); // prompts MetaMask connection
  return await provider.getSigner();
};

export const getContract = async () => {
  const signer = await getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, FisherChainABI.abi, signer);
};

export const getAllBatches = async (contract) => {
  try {
    if (!contract || typeof contract.getTotalBatches !== "function") {
      return [];
    }
    const total = await contract.getTotalBatches();
    const batches = [];
    for (let i = 1; i <= Number(total); i++) {
      const batch = await contract.getBatch(i);
      batches.push(batch);
    }
    return batches;
  } catch (error) {
    console.warn("Failed to fetch batches from contract:", error);
    return [];
  }
};
