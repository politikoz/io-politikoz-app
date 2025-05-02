import { useState, useEffect } from "react";
import { useWallet, useWalletList, useLovelace, useNetwork } from "@meshsdk/react";
import { MeshTxBuilder, BlockfrostProvider } from "@meshsdk/core";
import CryptoJS from "crypto-js";

// Environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "";
const BLOCKFROST_API_KEY = process.env.BLOCKFROST_API_KEY || "";

// Initialize BlockfrostProvider
const provider = new BlockfrostProvider(BLOCKFROST_API_KEY);

// Update error interface to handle full API response
interface TransactionError {
  status: number;
  success: boolean;
  msg: string;
  data: {
    okList: string[];
    failedList: string[];
    errors: Array<{
      code: number;
      message: string;
      data: {
        minimumRequiredFee: { ada: { lovelace: number } };
        providedFee: { ada: { lovelace: number } };
      };
    }>;
  };
}

// Add interface for error data structure
interface FeeErrorData {
  data: {
    errors: Array<{
      code: number;
      data: {
        minimumRequiredFee: { ada: { lovelace: number } };
        providedFee: { ada: { lovelace: number } };
      };
    }>;
  };
}

export function useConnectWallet() {
  const { connect: meshConnect, disconnect: meshDisconnect, connected: meshConnected, name, wallet } = useWallet();
  const wallets = useWalletList();
  const lovelace = useLovelace() || "0";
  const network = useNetwork();

  const [rewardAddress, setRewardAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [adaBalance, setAdaBalance] = useState<number>(0);

  // Move connect function definition up
  const connect = async (walletName: string) => {
    try {
      await meshConnect(walletName);
      
      localStorage.setItem("connected", "true");
      localStorage.setItem("walletName", walletName);
      
      window.dispatchEvent(new CustomEvent('walletConnectionChange', {
        detail: { connected: true }
      }));
      
      return true;
    } catch (error) {
      console.error('❌ Failed to connect wallet:', error);
      throw new Error("Could not connect to wallet");
    }
  };

  // Função para criptografar dados
  const encryptData = (data: string) => {
    const ciphertext = CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
    return ciphertext;
  };

   /**
   * 2) Efeito que "espelha" o estado conectado/nome
   *    da carteira e o endereço stake no localStorage
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isConnected && name) {  // Changed connected to isConnected
      console.log("Salvando no localStorage: conectado =", isConnected, "walletName =", name);
      localStorage.setItem("connected", "true");
      localStorage.setItem("walletName", name);

      // Obtém e criptografa o endereço stake
      if (rewardAddress) {
        const encryptedStakeAddress = encryptData(rewardAddress);
        localStorage.setItem("stakeAddress", encryptedStakeAddress);

        // Exibe o valor criptografado no console apenas no localhost
        if (window.location.hostname === "localhost") {
          console.log("Endereço stake criptografado:", encryptedStakeAddress);
        }
      }
    }
  }, [isConnected, name, rewardAddress]);  // Changed connected to isConnected

  /**
   * 3) Efeito para buscar o reward address
   *    sempre que o usuário estiver conectado
   *    e a carteira mudar.
   */
  useEffect(() => {
    if (isConnected && wallet) {  // Changed connected to isConnected
      wallet.getRewardAddresses().then((addresses) => {
        console.log("Reward address obtido:", addresses[0]);
        setRewardAddress(addresses[0] || null);
      });
    } else {
      setRewardAddress(null);
    }
  }, [isConnected, wallet]);  // Changed connected to isConnected

  /**
   * 4) Função para desconectar explicitamente
   */
  const handleDisconnect = () => {
    console.log("Desconectando manualmente...");
    setIsConnected(false); // Set this first
    setAdaBalance(0); // Reset balance
    meshDisconnect();
    localStorage.removeItem("connected");
    localStorage.removeItem("walletName");
    localStorage.removeItem("stakeAddress");

    // Dispatch custom event with connection state
    window.dispatchEvent(new CustomEvent('walletConnectionChange', {
      detail: { connected: false }
    }));
  };

  const handleStake = async () => {
    // 1. Check localStorage first
    const storedWalletName = localStorage.getItem("walletName");
    console.log('🔍 Checking stored wallet:', {
      storedWalletName,
      hasStoredWallet: !!storedWalletName
    });
  
    if (!storedWalletName) {
      console.error("❌ No wallet name stored in localStorage");
      throw new Error("No wallet information found");
    }
  
    // 2. Connect to wallet if needed
    if (!meshConnected || !wallet) {
      console.log('🔌 Connecting to stored wallet:', storedWalletName);
      try {
        await connect(storedWalletName);
        
        // Wait for wallet to be available
        let attempts = 0;
        while (!wallet && attempts < 5) {
          await new Promise(resolve => setTimeout(resolve, 500));
          attempts++;
          console.log(`⏳ Waiting for wallet connection... Attempt ${attempts}`);
        }
      } catch (error) {
        console.error('❌ Failed to connect wallet:', error);
        throw new Error("Could not connect to stored wallet");
      }
    }
  
    // 3. Verify wallet is properly connected
    if (!wallet) {
      console.error('❌ Wallet not available after connection');
      throw new Error("Wallet connection failed");
    }
  
    try {
      // Get wallet balance
      console.log('💰 Fetching wallet balance...');
      const balance = await wallet.getLovelace();
      console.log(`GETLOVELACE: ${await wallet.getLovelace()}`);
      console.log(`GETBALANCE: ${await wallet.getBalance()}`);
      const adaAmount = parseInt(balance) / 1_000_000;
      setAdaBalance(adaAmount);
      console.log('Current ADA balance:', adaAmount);
  
      // Get UTXOs
      console.log('📥 Fetching UTXOs...');
      const utxos = await wallet.getUtxos();
      console.log('UTXOs retrieved:', {
        count: utxos?.length,
        utxos: JSON.stringify(utxos, null, 2)
      });

      // Get addresses
      console.log('🔑 Fetching addresses...');
      const address = await wallet.getChangeAddress();
      const rewardAddresses = await wallet.getRewardAddresses();
      console.log('Addresses obtained:', {
        changeAddress: address,
        rewardAddresses
      });
  
      if (!rewardAddresses?.[0]) {
        throw new Error("No reward address available");
      }
  
      // Simplified pool ID handling
      const poolId = process.env.BECH32_POOL_ID;
      if (!poolId) {
        throw new Error("Pool ID not configured in environment variables");
      }
      console.log('🏊 Using pool ID:', poolId);
  
      // Build and submit transaction
      console.log('🏗️ Building transaction...');
      const txBuilder = new MeshTxBuilder({
        fetcher: provider,
        verbose: process.env.NODE_ENV === 'development',
      });
  
      const unsignedTx = await txBuilder
        .registerStakeCertificate(rewardAddresses[0])
        .delegateStakeCertificate(rewardAddresses[0], poolId)
        .selectUtxosFrom(utxos)
        .changeAddress(address)        
        .complete();
  
      console.log('✍️ Signing transaction...');
      const signedTx = await wallet.signTx(unsignedTx);
  
      console.log('📤 Submitting transaction...');
      const txHash = await wallet.submitTx(signedTx);
  
      console.log("✅ Stake delegation successful:", {
        txHash,
        rewardAddress: rewardAddresses[0],
        poolId
      });
  
      return txHash;
    } catch (unknownError: unknown) {
      // First check for user cancellation
      const error = unknownError as Error;
      const errorMessage = error?.message?.toLowerCase() ?? '';
      
      // Handle user cancellations
      if (isCancellationError(errorMessage)) {
        console.log('ℹ️ Transaction cancelled by user:', errorMessage);
        return null;
      }

      // Handle transaction errors
      try {
        const txError = JSON.parse(error.message) as TransactionError;
        
        if (txError.status === 400 && txError.data?.errors?.length > 0) {
          const firstError = txError.data.errors[0];

          switch (firstError.code) {
            case 3122: {
              const minimumFee = firstError.data.minimumRequiredFee.ada.lovelace / 1_000_000;
              const providedFee = firstError.data.providedFee.ada.lovelace / 1_000_000;
              const additionalFee = minimumFee - providedFee;
              
              const formattedError = `Transaction requires additional fee of ${additionalFee.toFixed(6)} ADA\n` +
                                   `Required: ${minimumFee.toFixed(6)} ADA\n` +
                                   `Provided: ${providedFee.toFixed(6)} ADA`;
              console.error("❌ Fee Error:", formattedError);
              throw new Error(formattedError);
            }
            default: {
              const errorDetails = `Transaction failed: ${firstError.message}`;
              console.error("❌ Transaction Error:", errorDetails);
              throw new Error(errorDetails);
            }
          }
        }
      } catch (parseError) {
        // If error parsing fails, throw original error with more context
        console.error("❌ Unexpected error during stake delegation:", {
          error: unknownError,
          message: error.message,
          parseError
        });
        throw new Error(`Stake delegation failed: ${error.message}`);
      }

      // If we get here, throw original error
      throw error;
    }
  };

  // Helper function to check for cancellation
  const isCancellationError = (errorMessage: string): boolean => {
    const cancellationMessages = [
      'cancel',
      'reject',
      'refused',
      'declined',
      'user declined sign tx',
      'user declined to sign tx',
      'denied',
      'user rejected',
      'GWalletError#3'
    ];
    return cancellationMessages.some(msg => errorMessage.includes(msg));
  };

  // Effect to sync connection state
  useEffect(() => {
    if (meshConnected && wallet) {
      setIsConnected(true);
      console.log('Wallet connected:', { name, meshConnected });
    } else {
      setIsConnected(false);
      setAdaBalance(0); // Reset balance when disconnecting
      console.log('Wallet disconnected');
    }
  }, [meshConnected, wallet, name]);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const getAdaBalance = async () => {
    try {
      const storedWalletName = localStorage.getItem("walletName");
      if (!storedWalletName) {
        throw new Error("No wallet information found");
      }
  
      // Exponential backoff settings
      const maxAttempts = 3;
      const initialDelay = 1000; // Start with 2 second
      let currentAttempt = 0;
  
      while (currentAttempt < maxAttempts) {
        try {
          // Make sure wallet is connected and initialized
          if (!wallet?.getLovelace) {
            await connect(storedWalletName);
            await delay(1000); // Wait for wallet initialization
          }
  
          const balance = await wallet.getLovelace();
          const adaAmount = parseInt(balance) / 1_000_000;
          setAdaBalance(adaAmount);
          return adaAmount;
  
        } catch (error) {
          currentAttempt++;
          const isRateLimit = error instanceof Error && 
            (error.message.includes('too many requests') || 
             error.message.includes('rate limit'));
  
          if (isRateLimit && currentAttempt < maxAttempts) {
            // Exponential backoff: 1s, 2s, 4s
            const waitTime = initialDelay * Math.pow(2, currentAttempt - 1);
            console.log(`⏳ Rate limit hit. Waiting ${waitTime}ms before retry...`);
            await delay(waitTime);
            continue;
          }
  
          throw error;
        }
      }
  
      throw new Error("Failed to get balance after max attempts");
    } catch (error) {
      console.error('❌ Failed to fetch balance:', error);
      setAdaBalance(0);
      throw error;
    }
  };

  return {
    wallets,
    connect,
    disconnect: handleDisconnect, // Usa a função personalizada para desconectar
    connected: isConnected, // Use our managed state
    rewardAddress,
    name,
    lovelace,
    network,
    wallet, // Add wallet to the returned object
    handleStake,
    adaBalance,
    getAdaBalance, // Add the new function
  };
}
