import { ethers } from "ethers";
import FisherChainABI from "./FisherChain.json";

// This will be your deployed contract address (update after Sepolia deploy)
export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa";

export const getProvider = () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
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