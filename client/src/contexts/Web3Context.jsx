import { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import { ethers } from "ethers";
import FisherChainABI from "../utils/FisherChain.json";
import { CONTRACT_ADDRESS, getReadOnlyContract } from "../utils/contract";

const Web3Context = createContext(null);

export function Web3Provider({ children }) {
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [error, setError] = useState("");
  const [connecting, setConnecting] = useState(false);

  // Read-only contract available at all times (no wallet or extension needed)
  const readOnlyContract = useMemo(() => {
    try {
      return getReadOnlyContract();
    } catch (e) {
      console.warn("Could not create read-only contract:", e);
      return null;
    }
  }, []);

  const connectWallet = useCallback(async () => {
    setError("");
    if (connecting) return;
    setConnecting(true);

    try {
      if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("MetaMask is not installed. Please install the MetaMask extension to sign transactions.");
      }

      // Handle multi-wallet collisions (e.g. Phantom, Coinbase Wallet alongside MetaMask)
      let providerObj = window.ethereum;
      if (window.ethereum?.providers?.length) {
        providerObj = window.ethereum.providers.find((p) => p.isMetaMask) || window.ethereum;
      }

      let accounts = [];
      try {
        accounts = await providerObj.request({ method: "eth_requestAccounts" });
      } catch (reqErr) {
        if (reqErr.code === 4001) {
          throw new Error("Connection request was rejected in MetaMask.");
        }
        if (reqErr.code === -32002) {
          throw new Error("A connection prompt is already open in MetaMask. Click the MetaMask fox icon in your browser toolbar to approve.");
        }
        if (reqErr.message && reqErr.message.includes("Failed to connect")) {
          throw new Error("MetaMask extension is currently locked or sleeping. Click your MetaMask toolbar icon, unlock your wallet, then try again.");
        }
        throw reqErr;
      }

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found. Please unlock your MetaMask wallet.");
      }

      const provider = new ethers.BrowserProvider(providerObj);
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
      setError("");
    } catch (err) {
      console.warn("Wallet connection attempt handled:", err);
      setError(err.message || "Failed to connect to MetaMask.");
    } finally {
      setConnecting(false);
    }
  }, [connecting]);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setSigner(null);
    setContract(null);
    setError("");
  }, []);

  // Safe silent check for existing connection on mount (never prompts or errors)
  useEffect(() => {
    let isMounted = true;

    const checkSilentConnection = async () => {
      if (typeof window === "undefined" || !window.ethereum || !window.ethereum.request) {
        return;
      }

      try {
        let providerObj = window.ethereum;
        if (window.ethereum?.providers?.length) {
          providerObj = window.ethereum.providers.find((p) => p.isMetaMask) || window.ethereum;
        }

        const accounts = await providerObj.request({ method: "eth_accounts" });
        if (isMounted && accounts && accounts.length > 0) {
          const provider = new ethers.BrowserProvider(providerObj);
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
        }
      } catch (e) {
        console.warn("Silent account check suppressed:", e);
      }
    };

    checkSilentConnection();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle account & chain changes in MetaMask safely
  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum || !window.ethereum.on) return;

    const handleAccountsChanged = (accounts) => {
      if (!accounts || accounts.length === 0) {
        disconnectWallet();
      } else {
        connectWallet();
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    try {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    } catch (e) {
      console.warn("MetaMask event listener registration skipped:", e);
    }

    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        try {
          window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
          window.ethereum.removeListener("chainChanged", handleChainChanged);
        } catch {
          // ignore
        }
      }
    };
  }, [connectWallet, disconnectWallet]);

  const value = {
    account,
    signer,
    contract,
    readOnlyContract,
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
