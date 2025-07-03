import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWallet } from "@meshsdk/react";
import { MeshSwapContract } from "@meshsdk/contract";
import { BlockfrostProvider, MeshTxBuilder, ForgeScript, resolveScriptHash, stringToHex } from '@meshsdk/core';
import { TransactionStatus } from '@/types/transaction';
import { useOfficeSwap } from '@/hooks/useOfficeSwap';
import { useSwapStatus } from '@/hooks/useSwapStatus';
import { SwapHistoryDTO, SwapStatus } from '@/types/swap';

const BLOCKFROST_API_KEY = process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY || '';
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
    setTxStatus: React.Dispatch<React.SetStateAction<TransactionStatus | null>>,
    referralCode?: string // Add optional referral code
  ) => Promise<{ success: boolean; error?: string; txHash?: string; swapHistory?: SwapHistoryDTO }>;
  handleAcceptSwap: (txHash: string, swapId: number, tier: number) => Promise<{ success: boolean; error?: string }>;
  handleCancelSwap: (txHash: string, swapId: number) => Promise<{ success: boolean; error?: string; txHash?: string }>;
  handleBuyTickets: (
    ticketAmount: number,
    kozAmount: number,
    serviceFee: number
  ) => Promise<{ success: boolean; error?: string; txHash?: string }>;
  handleReleasePrisoner: (
    kozAmount: number,
    assetNames: string[]
  ) => Promise<{ success: boolean; error?: string; txHash?: string }>;
  handleMintTKOZ: () => Promise<{ success: boolean; error?: string; txHash?: string }>;
  getKozBalance: () => Promise<number>;
  kozBalance: number;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletContextProvider({ children }: { children: ReactNode }) {
  const { connect: meshConnect, disconnect: meshDisconnect, connected: meshConnected, wallet } = useWallet();
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState(0);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [kozBalance, setKozBalance] = useState(0);
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
  
      const txBuilder = new MeshTxBuilder({
        fetcher: provider,
        verbose: true
      });
  
      if (isStakeKeyRegistered) {   
        unsignedTx = await txBuilder
          .delegateStakeCertificate(rewardAddresses[0], poolId)
          .selectUtxosFrom(utxos)    
          .changeAddress(address)
          .complete();
      } else {
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
    setTxStatus: React.Dispatch<React.SetStateAction<TransactionStatus | null>>,
    referralCode?: string // Add optional referral code
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
          unit: process.env.NEXT_PUBLIC_KOZ_TOKEN_UNIT || '',
          quantity: kozAmount.toString()
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
            tierId: tierId, // Pass number directly
            ada: adaAmount.toString(),
            koz: kozAmount.toString(),
            referralCode // Include referral code in API call
          });

          swapHistory = response || undefined;
        } catch (officeError) {
          
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

  const handleAcceptSwap = async (txHash: string, swapId: number, tier: number): Promise<{ success: boolean; error?: string }> => {
    const url = `${process.env.NEXT_PUBLIC_VALIDATOR_API_URL}/swap/accept/${txHash}/${tier}/${swapId}`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.message || 'Failed to queue swap'
            };
        }


        // If the swap was successfully queued
        if (data.success) {
            // Update the status to PENDING since it's in the queue
            await updateStatus({ id: swapId, status: SwapStatus.QUEUED });
            return { 
                success: true 
            };
        }

        return {
            success: false,
            error: data.message || 'Failed to queue swap'
        };
    } catch (error: any) {
        return {
            success: false,
            error: error?.message || 'Failed to queue swap'
        };
    }
};

  const handleCancelSwap = async (txHash: string, swapId: number): Promise<{ success: boolean; error?: string; txHash?: string }> => {
    try {
      if (!wallet || !isConnected) {
        throw new Error('Wallet not connected');
      }

      const blockfrostKey = process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY_PREFIX || '';
      const localProvider = new BlockfrostProvider(blockfrostKey);
      
      const meshTxBuilder = new MeshTxBuilder({
          fetcher: localProvider,
          submitter: localProvider
      });

      const contract = new MeshSwapContract({
          mesh: meshTxBuilder,
          fetcher: localProvider,
          wallet: wallet,
          networkId: 0
      });

      // Improved UTxO search with better error handling
      let attempts = 0;
      const maxAttempts = 5; // Reduced from 20 to fail faster
      const delayBetweenAttempts = 60000; // 5 seconds
      let swapUtxo = null;

      while (!swapUtxo && attempts < maxAttempts) {
          try {
                                  
              // Then try through contract
              swapUtxo = await contract.getUtxoByTxHash(txHash);

              if (swapUtxo) {                  
                  break;
              }
          } catch (utxoError) {
              
          }
          
          attempts++;
          if (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, delayBetweenAttempts));
          }
      }

      if (!swapUtxo) {
          throw new Error(`UTxO not found after ${maxAttempts} attempts. The transaction may still be processing or may not exist.`);
      }

      // Create and sign cancellation transaction 
      const unsignedTx = await contract.cancelSwap(swapUtxo);

      const signedTx = await wallet.signTx(unsignedTx);

      if (!signedTx) {
          throw new Error('Failed to sign cancellation transaction');
      }

      const cancelTxHash = await wallet.submitTx(signedTx);

      // Update swap status to CANCELED using the provided swapId
      await updateStatus({ id: swapId, status: SwapStatus.CANCELED });

      return {
          success: true,
          txHash: cancelTxHash
      };

    } catch (error: any) {        

        return {
            success: false,
            error: error?.info || (error instanceof Error ? error.message : 'Failed to cancel swap')
        };
    }
};

  const handleBuyTickets = async (
    ticketAmount: number,
    kozAmount: number,
    serviceFee: number
  ): Promise<{ success: boolean; error?: string; txHash?: string }> => {
    try {
      if (!wallet || !isConnected) {
        throw new Error('Wallet not connected');
      }

      const utxos = await wallet.getUtxos();
      const changeAddress = await wallet.getChangeAddress();

      // Convert amounts to lovelace (1 ADA = 1,000,000 lovelace)
      const serviceFeeQuantity = (serviceFee * 1_000_000).toString();
      const kozQuantity = kozAmount.toString();

      const txBuilder = new MeshTxBuilder({
        fetcher: provider,
        submitter: provider,
        verbose: true,
      });

      const unsignedTx = await txBuilder
        // Send KOZ tokens
        .txOut(process.env.NEXT_PUBLIC_TICKET_TREASURY || '', [
          { 
            unit: process.env.NEXT_PUBLIC_KOZ_TOKEN_UNIT || '', 
            quantity: kozQuantity 
          }
        ])
        // Send service fee in ADA
        .txOut(process.env.NEXT_PUBLIC_TICKET_TREASURY || '', [
          { 
            unit: "lovelace", 
            quantity: serviceFeeQuantity 
          }
        ])    
        .changeAddress(changeAddress)  
        .selectUtxosFrom(utxos)
        .complete();

      const signedTx = await wallet.signTx(unsignedTx);

      if (!signedTx) {
        throw new Error('Failed to sign transaction');
      }

      const txHash = await wallet.submitTx(signedTx);

      return {
        success: true,
        txHash
      };

    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to process transaction'
      };
    }
  };

  const handleReleasePrisoner = async (
    kozAmount: number,
    assetNames: string[]
  ): Promise<{ success: boolean; error?: string; txHash?: string }> => {
    try {
      if (!wallet || !isConnected) {
        return {
          success: false,
          error: 'walletNotConnected'
        };
      }

      const lovelace = await wallet.getLovelace();
      const adaBalance = parseInt(lovelace) / 1_000_000;
      
      if (adaBalance < 1) {
        return {
          success: false,
          error: 'insufficientAda'
        };
      }

      const utxos = await wallet.getUtxos();
      const changeAddress = await wallet.getChangeAddress();
      const serviceFeeQuantity = "1000000";
      const kozQuantity = kozAmount.toString();

      try {
        const txBuilder = new MeshTxBuilder({
          fetcher: provider,
          submitter: provider,
          verbose: true,
        });

        const unsignedTx = await txBuilder
          .txOut(process.env.NEXT_PUBLIC_TICKET_TREASURY || '', [
            { 
              unit: process.env.NEXT_PUBLIC_KOZ_TOKEN_UNIT || '', 
              quantity: kozQuantity 
            }
          ])
          .txOut(process.env.NEXT_PUBLIC_TICKET_TREASURY || '', [
            { 
              unit: "lovelace", 
              quantity: serviceFeeQuantity 
            }
          ])    
          .changeAddress(changeAddress)
          .selectUtxosFrom(utxos)
          .complete();

        const signedTx = await wallet.signTx(unsignedTx);

        if (!signedTx) {
          return {
            success: false,
            error: 'transactionDeclined'
          };
        }

        const txHash = await wallet.submitTx(signedTx);

        return {
          success: true,
          txHash
        };

      } catch (txError: any) {
        if (
          txError?.message?.includes('UTxO Balance Insufficient') || 
          txError?.error?.failure === 'UTxO Balance Insufficient'
        ) {
          return {
            success: false,
            error: 'insufficientFunds'
          };
        }

        if (txError?.message?.includes('declined') || txError?.message?.includes('rejected')) {
          return {
            success: false,
            error: 'transactionDeclined'
          };
        }

        throw txError;
      }

    } catch (error: any) {
      if (error?.message?.includes('UTxO Balance Insufficient')) {
        return {
          success: false,
          error: 'insufficientFunds'
        };
      }

      return {
        success: false,
        error: 'transactionFailed'
      };
    }
  };

  const handleMintTKOZ = async (): Promise<{ success: boolean; error?: string; txHash?: string }> => {
    try {
      if (!wallet || !isConnected) {
        throw new Error('Wallet not connected');
      }

      const utxos = await wallet.getUtxos();
      const changeAddress = await wallet.getChangeAddress();
      
      // Create forging script with change address
      const forgingScript = ForgeScript.withOneSignature(changeAddress);
      
      // tKOZ metadata
      const tKozMetadata = {
        name: "tKOZ",
        image: "images/KOZ.png",
        mediaType: "image/png",
        description: "Test KOZ token for Politikoz Platform",
      };

      // Generate policy ID from script
      const policyId = resolveScriptHash(forgingScript);
      const tokenName = "tKOZ";
      const tokenNameHex = stringToHex(tokenName);
      
      // Metadata structure following CIP-721
      const metadata = {
        [policyId]: {
          [tokenName]: {
            ...tKozMetadata
          }
        }
      };

      // Create transaction builder
      const txBuilder = new MeshTxBuilder({
        fetcher: provider,
        submitter: provider,
        verbose: true,
      });

      // Build unsigned transaction
      // Mint 10 million tokens (10_000_000)
      const unsignedTx = await txBuilder
        .mint("10000000", policyId, tokenNameHex)
        .mintingScript(forgingScript)
        .metadataValue(721, metadata)
        .changeAddress(changeAddress)
        .selectUtxosFrom(utxos)
        .complete();

      // Sign transaction
      const signedTx = await wallet.signTx(unsignedTx);
      
      if (!signedTx) {
        throw new Error('Failed to sign minting transaction');
      }

      // Submit transaction
      const txHash = await wallet.submitTx(signedTx);

      return {
        success: true,
        txHash
      };

    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to mint tokens'
      };
    }
  };

  const getKozBalance = async (): Promise<number> => {
    if (!wallet || !isConnected) return 0;

    try {
      const kozTokenId = process.env.NEXT_PUBLIC_KOZ_TOKEN_UNIT || '';
      if (!kozTokenId) {
        return 0;
      }

      const assets = await wallet.getAssets();
      
      // Find KOZ token in the assets list
      const kozAsset = assets.find(asset => 
        asset.unit === kozTokenId || // Exact match
        asset.unit.startsWith(kozTokenId) // Policy ID match with any asset name
      );
      
      if (kozAsset) {
        const kozAmount = parseInt(kozAsset.quantity);
        setKozBalance(kozAmount);
        return kozAmount;
      }
      
      // If no KOZ tokens found, return 0
      setKozBalance(0);
      return 0;
    } catch (error) {
      // Silent error in production
      setKozBalance(0);
      return 0;
    }
  };

  // Update value object to include the new method and state
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
    handleCancelSwap,
    handleBuyTickets,
    handleReleasePrisoner,
    handleMintTKOZ,
    getKozBalance,
    kozBalance,
  };

  // Sync wallet state on mount and when mesh connection changes
  useEffect(() => {
    const syncWalletState = async () => {
      const storedWalletName = localStorage.getItem("walletName");
      
      if (meshConnected && !isConnected && storedWalletName) {    
        setIsConnected(true);
        setWalletName(storedWalletName);
        const balance = await getBalance();
        await getKozBalance(); // Also get KOZ balance when restoring wallet    
      }
      
      if (!meshConnected && isConnected) {
        disconnect();
      }
    };

    syncWalletState();
  }, [meshConnected]);

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