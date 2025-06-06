import { useState } from 'react';
import { useWalletContext } from "@/contexts/WalletContext";

interface StatusType {
  loading: boolean;
  error?: string;
  success?: string;
}

export function MintButton() {
  const { handleMintTKOZ } = useWalletContext();
  const [status, setStatus] = useState<StatusType>({ loading: false });

  const handleMint = async () => {
    setStatus({ loading: true });
    try {
      const result = await handleMintTKOZ();
      if (result.success) {
        setStatus({
          loading: false,
          success: `Tokens minted successfully! TX: ${result.txHash}`
        });
      } else {
        setStatus({
          loading: false,
          error: result.error || 'Unknown error occurred'
        });
      }
    } catch (error: any) {
      setStatus({
        loading: false,
        error: error.message || 'Failed to mint tokens'
      });
    }
  };

  return (
    <>
      <button
        onClick={handleMint}
        disabled={status.loading}
        className="w-48 h-16 flex items-center justify-center
                 bg-gray-900 border-4 border-yellow-500 
                 shadow-[6px_6px_0px_black] 
                 hover:bg-gray-700 transition-colors
                 font-pixel text-white disabled:opacity-50
                 disabled:cursor-not-allowed"
      >
        {status.loading ? 'Minting...' : 'Mint 10M tKOZ'}
      </button>

      {status.error && (
        <div className="mt-4 p-4 bg-red-900 border-2 border-red-500 
                       rounded text-white font-pixel text-sm">
          {status.error}
        </div>
      )}

      {status.success && (
        <div className="mt-4 p-4 bg-green-900 border-2 border-green-500 
                       rounded text-white font-pixel text-sm">
          {status.success}
        </div>
      )}
    </>
  );
}