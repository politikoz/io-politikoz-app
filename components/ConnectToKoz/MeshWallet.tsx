import { EnableWeb3WalletOptions, Web3Wallet } from "@meshsdk/web3-sdk";
import { BlockfrostProvider } from "@meshsdk/provider";
 
const provider = new BlockfrostProvider('previewESGvuLyddDE2OYbwq8eBmGrsVSs3CTry');
 
const _options: EnableWeb3WalletOptions = {
  networkId: 0, 
  fetcher: provider,
  submitter: provider,
  projectId: "23f7ed8d-3ba5-40d1-908c-7fb84c3292b3",
};
 
export const initializeWallet = async () => {
  try {
    const wallet = await Web3Wallet.enable(_options);
    
    // Get wallet information
    const rewardAddress = await wallet.getRewardAddresses();
    const stakeAddress = rewardAddress[0]; // First reward address is the stake address    
    // Save to localStorage similar to ConnectWalletList
    localStorage.setItem('connected', 'true');
    localStorage.setItem('walletName', 'mesh'); // or any identifier you want to use
    localStorage.setItem('stakeAddress', stakeAddress);

    // Dispatch custom event to match ConnectWalletList pattern
    window.dispatchEvent(
      new CustomEvent('walletConnectionChange', {
        detail: { 
          connected: true,
          walletName: 'mesh',
          stakeAddress
        }
      })
    );

    return { wallet, stakeAddress };
  } catch (error) {
    // On error, ensure localStorage is cleared
    localStorage.removeItem('connected');
    localStorage.removeItem('walletName');
    localStorage.removeItem('stakeAddress');
    
    // Dispatch disconnection event
    window.dispatchEvent(
      new CustomEvent('walletConnectionChange', {
        detail: { 
          connected: false,
          walletName: null,
          stakeAddress: null
        }
      })
    );

    throw error; // Re-throw to be handled by caller
  }
};

