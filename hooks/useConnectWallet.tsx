import { useState, useEffect } from "react";
import { useWallet, useWalletList, useLovelace, useNetwork } from "@meshsdk/react";
import CryptoJS from "crypto-js";

// Environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "";

export function useConnectWallet() {
  const { connect: meshConnect, disconnect: meshDisconnect, connected: meshConnected, name, wallet } = useWallet();
  const wallets = useWalletList();
  const lovelace = useLovelace() || "0";
  const network = useNetwork();

  const [rewardAddress, setRewardAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("connected") === "true";
    }
    return false;
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [adaBalance, setAdaBalance] = useState<number>(0);

  const connect = async (walletName: string): Promise<boolean> => {
    try {
      setIsConnecting(true);
      await meshConnect(walletName);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (meshConnected) {
        localStorage.setItem("connected", "true");
        localStorage.setItem("walletName", walletName);
        setIsConnected(true);
        
        window.dispatchEvent(new CustomEvent('walletConnectionChange', {
          detail: { connected: true }
        }));
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const encryptData = (data: string) => {
    return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isConnected && name) {
      localStorage.setItem("connected", "true");
      localStorage.setItem("walletName", name);

      if (rewardAddress) {
        const encryptedStakeAddress = encryptData(rewardAddress);
        localStorage.setItem("stakeAddress", encryptedStakeAddress);

        if (process.env.NODE_ENV === "development") {
          console.log("Encrypted stake address:", encryptedStakeAddress);
        }
      }
    }
  }, [isConnected, name, rewardAddress]);

  useEffect(() => {
    if (isConnected && wallet) {
      wallet.getRewardAddresses().then((addresses) => {
        console.log("Reward address obtained:", addresses[0]);
        setRewardAddress(addresses[0] || null);
      });
    } else {
      setRewardAddress(null);
    }
  }, [isConnected, wallet]);

  useEffect(() => {
    const autoConnect = async () => {
      const storedWalletName = localStorage.getItem("walletName");
      const wasConnected = localStorage.getItem("connected") === "true";
      
      if (storedWalletName && wasConnected && !isConnected && !isConnecting) {
        console.log("Attempting to reconnect to stored wallet:", storedWalletName);
        await connect(storedWalletName);
      }
    };

    autoConnect();
  }, []);

  useEffect(() => {
    if (meshConnected && wallet) {
      setIsConnected(true);
      console.log('Wallet connected:', { name, meshConnected });
    } else if (!meshConnected) {
      setIsConnected(false);
      setAdaBalance(0);
      localStorage.removeItem("connected");
      localStorage.removeItem("walletName");
      console.log('Wallet disconnected');
    }
  }, [meshConnected, wallet, name]);

  const handleDisconnect = () => {
    console.log("Disconnecting wallet...");
    setIsConnected(false);
    setAdaBalance(0);
    meshDisconnect();
    
    localStorage.removeItem("connected");
    localStorage.removeItem("walletName");
    localStorage.removeItem("stakeAddress");

    window.dispatchEvent(new CustomEvent('walletConnectionChange', {
      detail: { connected: false }
    }));
  };
  
  return {
    wallets,
    connect,
    disconnect: handleDisconnect,
    connected: isConnected,
    isConnecting,
    rewardAddress,
    name,
    lovelace,
    network,
    wallet,
    adaBalance,
  };
}