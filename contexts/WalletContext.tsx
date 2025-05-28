import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWallet } from "@meshsdk/react";
import { MeshSwapContract } from "@meshsdk/contract";
import { BlockfrostProvider, MeshTxBuilder } from '@meshsdk/core';
import { SwapService } from '@/services/SwapService';
import { TransactionStatus } from '@/types/transaction';
import { useOfficeSwap } from '@/hooks/useOfficeSwap';
import { useSwapStatus } from '@/hooks/useSwapStatus';
import { SwapHistoryDTO, SwapStatus } from '@/types/swap';

const BLOCKFROST_API_KEY = process.env.BLOCKFROST_API_KEY_PREFIX || '';
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
  handleSubmitSwap: (
    adaAmount: number, 
    kozAmount: number,
    tierId: number, // Add tierId parameter
    setTxStatus: React.Dispatch<React.SetStateAction<TransactionStatus | null>>
  ) => Promise<{ success: boolean; error?: string; txHash?: string; swapHistory?: SwapHistoryDTO }>;
  handleAcceptSwap: (txHash: string, swapId: number) => Promise<{ success: boolean; error?: string }>;
  handleCancelSwap: (txHash: string, swapId: number) => Promise<{ success: boolean; error?: string; txHash?: string }>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletContextProvider({ children }: { children: ReactNode }) {
  const { connect: meshConnect, disconnect: meshDisconnect, connected: meshConnected, wallet } = useWallet();
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState(0);
  const [walletName, setWalletName] = useState<string | null>(null);
  const { createSwap } = useOfficeSwap();
  const { updateStatus } = useSwapStatus();

  const connect = async (name: string): Promise<boolean> => {
    try {
      await meshConnect(name);
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
      wallet.signData
      const adaAmount = parseInt(lovelace) / 1_000_000;
      setBalance(adaAmount);
      return adaAmount;
    } catch (error) {
      return 0;
    }
  };

  const getCollateral = async (): Promise<number> => {
    if (!wallet || !isConnected) return 0;

    try {
      const collateralUtxos = await wallet.getCollateral();
      const totalCollateral = collateralUtxos.reduce((sum, utxo) => {
        return sum + parseInt(utxo.output.amount[0].quantity);
      }, 0) / 1_000_000;

      return totalCollateral;
    } catch (error) {
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
      return txHash;
    } catch (error) {
      return null;
    }
  };

  const handleSubmitSwap = async (
    adaAmount: number, 
    kozAmount: number,
    tierId: number,
    setTxStatus: React.Dispatch<React.SetStateAction<TransactionStatus | null>>
): Promise<{ success: boolean; error?: string; txHash?: string; swapHistory?: SwapHistoryDTO }> => {
    let submittedTxHash: string | undefined;
    let swapHistory: SwapHistoryDTO | undefined;
    
    try {
      if (!wallet || !isConnected) {
        throw new Error('Wallet not connected');
      }

      setTxStatus({
        status: 'signing',
        details: {
          adaAmount: adaAmount,
          kozAmount: kozAmount,
          returnAmount: 2,
          serviceFee: 0.5,
          networkFee: 0.18,
          total: adaAmount + 2.5
        }
      });

      const meshTxBuilder = new MeshTxBuilder({
        fetcher: provider,
        submitter: provider,
      });

      const contract = new MeshSwapContract({
        mesh: meshTxBuilder,
        fetcher: provider,
        wallet: wallet,
        networkId: 0
      });        

      const assetToProvide = [
        {
          unit: 'lovelace',
          quantity: (adaAmount * 1000000 + 2500000).toString()
        }
      ];

      const assetToReceive = [
        {
          unit: 'd9312da562da182b02322fd8acb536f37eb9d29fba7c49dc172555274d657368546f6b656e',
          quantity: "1"
        },
        {
          unit: 'lovelace',
          quantity: "2000000"
        }
      ];

      const unsignedTx = await contract.initiateSwap(assetToProvide, assetToReceive);
      const signedTx = await wallet.signTx(unsignedTx);

      if (!signedTx) {
        throw new Error('Signing returned null or undefined');
      }

      setTxStatus(prev => prev ? {
        ...prev,
        status: 'submitting'
      } : null);

      const txHash = await wallet.submitTx(signedTx);
      submittedTxHash = txHash;

      setTxStatus(prev => prev ? {
        ...prev,
        status: 'processing',
        txHash
      } : null);

      if (txHash) {
        try {
          const rewardAddress = await wallet.getRewardAddresses();
          const response = await createSwap({
            stakeAddress: rewardAddress[0],
            transactionHash: txHash,
            tier: tierId, // Pass number directly
            ada: adaAmount.toString(),
            koz: kozAmount.toString()
          });

          swapHistory = response || undefined;
        } catch (officeError) {
          console.error('Failed to record swap in office:', officeError);
        }
      }

      return { 
        success: true, 
        txHash: submittedTxHash,
        swapHistory 
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.info || (error instanceof Error ? error.message : 'Failed to perform swap'),
        txHash: submittedTxHash
      };
    }
  };

  const handleAcceptSwap = async (txHash: string, swapId: number): Promise<{ success: boolean; error?: string }> => {
    try {
        const { success, error } = await SwapService.acceptSwap(txHash);

        if (!success || error) {
            return {
                success: false,
                error: error || 'Backend swap acceptance failed'
            };
        }

        await updateStatus(swapId, SwapStatus.COMPLETED);
        return { success: true };
    } catch (error: any) {
        return {
            success: false,
            error: error?.message || 'Failed to accept swap'
        };
    }
  };

  const handleCancelSwap = async (txHash: string, swapId: number): Promise<{ success: boolean; error?: string; txHash?: string }> => {
    try {
      if (!wallet || !isConnected) {
        throw new Error('Wallet not connected');
      }

      const meshTxBuilder = new MeshTxBuilder({
          fetcher: provider,
          submitter: provider
      });

      const contract = new MeshSwapContract({
          mesh: meshTxBuilder,
          fetcher: provider,
          wallet: wallet,
          networkId: 0
      });

      // Improved UTxO search with better error handling
      let attempts = 0;
      const maxAttempts = 5; // Reduced from 20 to fail faster
      const delayBetweenAttempts = 20000; // 5 seconds
      let swapUtxo = null;

      while (!swapUtxo && attempts < maxAttempts) {
          try {
              console.log(`Attempt ${attempts + 1}/${maxAttempts} to find UTxO for tx: ${txHash}`);
                                  
              // Then try through contract
              swapUtxo = await contract.getUtxoByTxHash(txHash);

              if (swapUtxo) {
                  console.log('UTxO found:', {
                      attempt: attempts + 1,
                      txHash: swapUtxo.input.txHash,
                      outputIndex: swapUtxo.input.outputIndex,
                      amount: swapUtxo.output.amount,
                      timestamp: new Date().toISOString()
                  });
                  break;
              }
          } catch (utxoError) {
              console.warn('UTxO search attempt failed:', {
                  attempt: attempts + 1,
                  error: utxoError instanceof Error ? utxoError.message : 'Unknown error'
              });
          }
          
          attempts++;
          if (attempts < maxAttempts) {
              console.log(`Waiting ${delayBetweenAttempts/1000} seconds before next attempt...`);
              await new Promise(resolve => setTimeout(resolve, delayBetweenAttempts));
          }
      }

      if (!swapUtxo) {
          throw new Error(`UTxO not found after ${maxAttempts} attempts. The transaction may still be processing or may not exist.`);
      }

      // Create and sign cancellation transaction
      console.log('Creating unsigned cancel transaction...');
      const unsignedTx = await contract.cancelSwap(swapUtxo);

      console.log('Signing cancel transaction...');
      const signedTx = await wallet.signTx(unsignedTx);

      if (!signedTx) {
          throw new Error('Failed to sign cancellation transaction');
      }

      console.log('Submitting cancel transaction...');
      const cancelTxHash = await wallet.submitTx(signedTx);

      // Update swap status to CANCELED using the provided swapId
      await updateStatus(swapId, SwapStatus.CANCELED);

      return {
          success: true,
          txHash: cancelTxHash
      };

    } catch (error: any) {
        console.error('Swap cancellation failed:', {
            error,
            code: error?.code,
            info: error?.info,
            message: error instanceof Error ? error.message : 'Unknown error',
            originalTxHash: txHash,
            timestamp: new Date().toISOString()
        });

        return {
            success: false,
            error: error?.info || (error instanceof Error ? error.message : 'Failed to cancel swap')
        };
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
    getCollateral,
    handleSubmitSwap,
    handleAcceptSwap,
    handleCancelSwap
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