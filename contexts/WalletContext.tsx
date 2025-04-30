import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWallet } from "@meshsdk/react";
import { BlockfrostProvider } from '@meshsdk/core';
import { MeshTxBuilder } from '@meshsdk/core';

// Add at the top with other environment variables
const BLOCKFROST_API_KEY = process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY || '';
const provider = new BlockfrostProvider(BLOCKFROST_API_KEY);

interface WalletContextType {
  isConnected: boolean;
  wallet: any;
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

  const getBalance = async () => {
    if (!wallet || !isConnected) return 0;

    try {
      const lovelace = await wallet.getLovelace();
      const adaAmount = parseInt(lovelace) / 1_000_000;
      setBalance(adaAmount);
      return adaAmount;
    } catch (error) {
      console.log('Balance check ended:', error instanceof Error ? error.message : 'Unknown error');
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
      // Sum up all collateral UTXOs and convert from lovelace to ADA
      const totalCollateral = collateralUtxos.reduce((sum, utxo) => {
        return sum + parseInt(utxo.output.amount[0].quantity);
      }, 0) / 1_000_000;

      console.log('Retrieved collateral in ADA:', totalCollateral);
      return totalCollateral;
    } catch (error) {
      console.log('Collateral check ended:', error instanceof Error ? error.message : 'Unknown error');
      return 0;
    }
  };

  // Update connection check effect
  useEffect(() => {
    const syncConnection = async () => {
      const storedWalletName = localStorage.getItem("walletName");
      
      // If mesh is connected but local state isn't synced
      if (meshConnected && !isConnected && storedWalletName) {
        console.log('Syncing connection state with Mesh');
        setIsConnected(true);
        const balance = await getBalance();
        console.log('Synced balance:', balance);
      }
      
      // If mesh is disconnected but local state thinks we're connected
      if (!meshConnected && isConnected) {
        console.log('Cleaning up disconnected state');
        setIsConnected(false);
        setBalance(0);
        localStorage.removeItem("connected");
        localStorage.removeItem("walletName");
      }
    };

    syncConnection();
  }, [meshConnected]);

  const connect = async (walletName: string) => {
    try {
      console.log('Attempting to connect wallet:', walletName);
      await meshConnect(walletName);
      
      // Wait briefly for meshConnected to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (meshConnected) {
        console.log('Wallet connected successfully');
        setIsConnected(true);
        localStorage.setItem("connected", "true");
        localStorage.setItem("walletName", walletName);
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
    localStorage.removeItem("connected");
    localStorage.removeItem("walletName");
  };

  const handleStake = async (): Promise<string | null> => {
    if (!wallet || !isConnected) {
      throw new Error("Wallet not connected");
    }
  
    let unsignedTx = null;
    
    try {
      // Get addresses
      const address = await wallet.getChangeAddress();
      const rewardAddresses = await wallet.getRewardAddresses();
      
      if (!rewardAddresses?.[0]) {
        throw new Error("No reward address available");
      }
  
      // Get UTXOs
      const utxos = await wallet.getUtxos();
  
      // Get pool ID
      const poolId = process.env.NEXT_PUBLIC_BECH32_POOL_ID;
      if (!poolId) {
        throw new Error("Pool ID not configured");
      }
  
      // Build transaction
      const txBuilder = new MeshTxBuilder({
        fetcher: provider,
        verbose: true
      });
  
      console.log('Building stake transaction...');
      const tx = txBuilder
        .registerStakeCertificate(rewardAddresses[0])
        .delegateStakeCertificate(rewardAddresses[0], poolId)
        .selectUtxosFrom(utxos)    
        .changeAddress(address);

      // Log transaction build state before completion
      console.log('=== Transaction Build State ===');
      console.log('Transaction before complete:', tx);
      
      // Now complete the transaction
      unsignedTx = await tx.complete();
      
      // Sign and submit
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
  
      return txHash;
    } catch (error) {
      // Log error with unsigned transaction details
      console.log('=== Stake Transaction Error ===');
      console.log('Error:', error instanceof Error ? error.message : 'Unknown error');
      console.log('Unsigned Transaction:', unsignedTx);
 
      throw error;
    }
  };

  return (
    <WalletContext.Provider value={{ 
      isConnected, 
      wallet, 
      connect, 
      disconnect,
      getBalance,
      handleStake,
      balance,
      getCollateral // Add the new function
    }}>
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