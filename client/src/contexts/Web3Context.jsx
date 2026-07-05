import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import FisherChainABI from "../utils/FisherChain.json";
import { CONTRACT_ADDRESS } from "../utils/contract";

const Web3Context = createContext(null);

export function Web3Provider({ children }) {
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [error, setError] = useState("");
  const [connecting, setConnecting] = useState(false);

  const connectWallet = useCallback(async () => {
    setError("");
    setConnecting(true);
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signerInstance = await provider.getSigner();
      const address = await signerInstance.getAddress();

      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        FisherChainABI.abi,
        signerInstance
      );

      setSigner(signerInstance);
      setAccount(address);
      setContract(contractInstance);
    } catch (err) {
      setError(err.message);
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setSigner(null);
    setContract(null);
  }, []);

  // Auto-reconnect if MetaMask is already connected (page refresh case)
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          connectWallet();
        }
      }
    };
    checkConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle account switching in MetaMask
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        connectWallet();
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [connectWallet, disconnectWallet]);

  const value = {
    account,
    signer,
    contract,
    error,
    connecting,
    connectWallet,
    disconnectWallet,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}