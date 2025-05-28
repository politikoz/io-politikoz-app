import { useTranslations } from "next-intl";
import ConnectToKozButton from "@/components/ConnectToKoz/ConnectToKozButton";
import { useEffect, useState } from 'react';
import { TransactionStatusType } from '@/types/transaction';

interface Props {
  kozAmount: number;
  maxKozAvailable: number;
  onSwap: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  status?: TransactionStatusType;
}

export default function SwapSummary({ 
  kozAmount, 
  maxKozAvailable, 
  onSwap,
  isLoading = false,
  disabled = false,
  status
}: Props) {
  const t = useTranslations("Swap");
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  useEffect(() => {
    const walletName = localStorage.getItem('walletName');
    setIsWalletConnected(!!walletName);
  }, []);

  const isDisabled = kozAmount < 200 || kozAmount > maxKozAvailable || disabled;
  const isProcessing = status === 'processing' || status === 'signing' || status === 'submitting' || status === 'accepting' || status === 'cancelling';

  if (!isWalletConnected) {
    return (
      <div className="mt-4">
        <ConnectToKozButton 
          label={t("connectWallet")}
          originPage="/office?section=buy-koz"
          originDisplay="Buy KOZ"
          className="w-full py-3 px-4 rounded-lg font-medium transition bg-yellow-500 text-black hover:bg-yellow-400 flex items-center justify-center"
        />
      </div>
    );
  }

  return (
    <div className="mt-4">
      <button
        onClick={onSwap}
        disabled={isDisabled || isProcessing}
        className={`w-full py-3 px-4 rounded-lg font-medium transition ${
          isDisabled || isProcessing
            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
            : "bg-yellow-500 text-black hover:bg-yellow-400"
        }`}
      >
        {isLoading || isProcessing ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full mr-2" />
            {t("processing")}
          </div>
        ) : (
          t("swapButton")
        )}
      </button>
    </div>
  );
}
