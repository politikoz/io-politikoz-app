import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWallet } from "@meshsdk/react";
import { BlockfrostProvider, MeshTxBuilder } from '@meshsdk/core';

const BLOCKFROST_API_KEY = process.env.BLOCKFROST_API_KEY || '';
const provider = new BlockfrostProvider(BLOCKFROST_API_KEY);

interface WalletContextType {
  isConnected: boolean;
  wallet: any;
  walletName: string | null;
  connect: (walletName: string) => Promise<boolean>;
  disconnect: () => void;
  getBalance: () => Promise<number>;
  handleStake: () => Promise<string | null>;
  balance: number;
  getCollateral: () => Promise<number>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletContextProvider({ children }: { children: ReactNode }) {
  const { connect: meshConnect, disconnect: meshDisconnect, connected: meshConnected, wallet } = useWallet();
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState(0);
  const [walletName, setWalletName] = useState<string | null>(null);

  const connect = async (name: string): Promise<boolean> => {
    try {
      console.log('Attempting to connect wallet:', name);
      await meshConnect(name);
      
      // Small delay to ensure wallet is connected
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (meshConnected) {
        setIsConnected(true);
        setWalletName(name);
        localStorage.setItem("connected", "true");
        localStorage.setItem("walletName", name);
        await getBalance();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return false;
    }
  };

  const disconnect = () => {
    meshDisconnect();
    setIsConnected(false);
    setBalance(0);
    setWalletName(null);
    localStorage.removeItem("connected");
    localStorage.removeItem("walletName");
  };

  const getBalance = async (): Promise<number> => {
    if (!wallet || !isConnected) return 0;

    try {
      const lovelace = await wallet.getLovelace();
      const adaAmount = parseInt(lovelace) / 1_000_000;
      setBalance(adaAmount);
      return adaAmount;
    } catch (error) {
      console.error('Balance check failed:', error instanceof Error ? error.message : 'Unknown error');
      return 0;
    }
  };

  const getCollateral = async (): Promise<number> => {
    if (!wallet || !isConnected) {
      console.log('Cannot get collateral: wallet not connected');
      return 0;
    }

    try {
      const collateralUtxos = await wallet.getCollateral();
      const totalCollateral = collateralUtxos.reduce((sum, utxo) => {
        return sum + parseInt(utxo.output.amount[0].quantity);
      }, 0) / 1_000_000;

      console.log('Retrieved collateral in ADA:', totalCollateral);
      return totalCollateral;
    } catch (error) {
      console.error('Collateral check failed:', error instanceof Error ? error.message : 'Unknown error');
      return 0;
    }
  };

  const handleStake = async (): Promise<string | null> => {
    if (!wallet || !isConnected) {
      throw new Error("Wallet not connected");
    }
  
    let unsignedTx = null;
    
    try {
      const address = await wallet.getChangeAddress();
      const rewardAddresses = await wallet.getRewardAddresses();
      
      if (!rewardAddresses?.[0]) {
        throw new Error("No reward address available");
      }
  
      const utxos = await wallet.getUtxos();
  
      const poolId = process.env.NEXT_PUBLIC_BECH32_POOL_ID;
      if (!poolId) {
        throw new Error("Pool ID not configured");
      }
  
      const unregisteredKeys = await wallet.getUnregisteredPubStakeKeys();
      const isStakeKeyRegistered = !(unregisteredKeys && unregisteredKeys.pubStakeKeys.length > 0);
  
      console.log('Stake status:', { isStakeKeyRegistered, unregisteredKeys });
  
      const txBuilder = new MeshTxBuilder({
        fetcher: provider,
        verbose: true
      });
  
      if (isStakeKeyRegistered) {
        console.log('Delegating to pool...');
        unsignedTx = await txBuilder
          .delegateStakeCertificate(rewardAddresses[0], poolId)
          .selectUtxosFrom(utxos)    
          .changeAddress(address)
          .complete();
      } else {
        console.log('Registering stake key and delegating...');
        unsignedTx = await txBuilder
          .registerStakeCertificate(rewardAddresses[0])
          .delegateStakeCertificate(rewardAddresses[0], poolId)
          .selectUtxosFrom(utxos)
          .changeAddress(address)
          .complete();
      }
      
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
      
      console.log('Stake transaction submitted:', txHash);
      return txHash;
    } catch (error) {
      console.error('Stake Transaction Error:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        unsignedTx
      });
      throw error;
    }
  };

  // Sync wallet state on mount and when mesh connection changes
  useEffect(() => {
    const syncWalletState = async () => {
      const storedWalletName = localStorage.getItem("walletName");
      
      if (meshConnected && !isConnected && storedWalletName) {
        console.log('Restoring wallet connection...');
        setIsConnected(true);
        setWalletName(storedWalletName);
        const balance = await getBalance();
        console.log('Wallet restored with balance:', balance);
      }
      
      if (!meshConnected && isConnected) {
        console.log('Cleaning up disconnected wallet state');
        disconnect();
      }
    };

    syncWalletState();
  }, [meshConnected]);

  const value: WalletContextType = {
    isConnected,
    wallet,
    walletName,
    connect,
    disconnect,
    getBalance,
    handleStake,
    balance,
    getCollateral
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWalletContext must be used within a WalletContextProvider');
  }
  return context;
};