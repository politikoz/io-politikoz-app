import { useState, useEffect } from "react";
import { useWallet, useWalletList, useLovelace, useNetwork } from "@meshsdk/react";

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
      
      // Increased timeout for Eternl wallet initialization
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (meshConnected && wallet) {
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
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isConnected && name) {
      localStorage.setItem("connected", "true");
      localStorage.setItem("walletName", name);

      if (rewardAddress) {
        localStorage.setItem("stakeAddress", rewardAddress);
        
      }
    }
  }, [isConnected, name, rewardAddress]);

  useEffect(() => {
    const getStakeAddress = async () => {
      const storedStakeAddress = localStorage.getItem("stakeAddress");
      
      if (storedStakeAddress) {
        setRewardAddress(storedStakeAddress);
        return;
      }

      if (isConnected && wallet && typeof wallet.getRewardAddresses === 'function') {
        try {
          const addresses = await wallet.getRewardAddresses();
          if (addresses && addresses[0]) {
            localStorage.setItem("stakeAddress", addresses[0]);
            setRewardAddress(addresses[0]);           
          }
        } catch (error) {
          console.error("Failed to get reward addresses:", error);
        }
      }
    };

    getStakeAddress();
  }, [isConnected, wallet]);

  useEffect(() => {
    const autoConnect = async () => {
      const storedWalletName = localStorage.getItem("walletName");
      const wasConnected = localStorage.getItem("connected") === "true";
      
      if (storedWalletName && wasConnected && !isConnected && !isConnecting) {
        await connect(storedWalletName);
      }
    };

    autoConnect();
  }, []);

  useEffect(() => {
    if (meshConnected && wallet) {
      setIsConnected(true);
    } else if (!meshConnected && !localStorage.getItem("stakeAddress")) {
      // Só limpa se realmente não houver uma sessão válida
      setIsConnected(false);
      setAdaBalance(0);
      localStorage.removeItem("connected");
      localStorage.removeItem("walletName");
    }
  }, [meshConnected, wallet, name]);

  const handleDisconnect = () => {
    setIsConnected(false);
    setAdaBalance(0);
    meshDisconnect();
    
    // Limpa o localStorage apenas em um disconnect explícito
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