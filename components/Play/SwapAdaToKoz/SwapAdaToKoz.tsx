"use client";

import { useState, useEffect, useRef } from "react";
import { useWalletContext } from "@/contexts/WalletContext";
import SwapHeader from "./SwapHeader";
import SwapInput from "./SwapInput";
import SwapSummary from "./SwapSummary";
import SwapHistory from "./SwapHistory";
import SwapDetails from './SwapDetails';
import SwapHistoryPlaceholder from './SwapHistoryPlaceholder';
import { useTranslations } from 'next-intl';
import { TransactionStatus } from '@/types/transaction';
import { useSwapHistory } from '@/hooks/useSwapHistory';
import { useTiersDashboard } from '@/hooks/useTiersDashboard';
import NextTierCountdown from "./NextTierCountdown";
import AllTiersCompleted from "./AllTiersCompleted";

export default function SwapAdaToKoz() {
  const t = useTranslations("Swap");
  const { 
    handleSubmitSwap, 
    handleAcceptSwap, 
    handleCancelSwap,
    isConnected, 
    getBalance, 
    wallet 
  } = useWalletContext();
  const { 
    data: history, 
    isLoading: isHistoryLoading, 
    refetch: fetchHistory,
    error: historyError 
  } = useSwapHistory();
  const { data: tiersDashboard, isLoading: isTiersDashboardLoading } = useTiersDashboard();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kozAmount, setKozAmount] = useState(0);
  const [adaAmount, setAdaAmount] = useState(0);
  const [txStatus, setTxStatus] = useState<TransactionStatus | null>(null);
  const [referralCode, setReferralCode] = useState<string>("");
  const isMounted = useRef(false);
  const MIN_KOZ_AMOUNT = 200;
  const [showHistory, setShowHistory] = useState(false);

  const isSwapEnabled = () => {
    return tiersDashboard?.currentTier?.status === 'PENDING';
  };

  // Safe type checking for conversion rate
  const conversionRate = tiersDashboard?.currentTier?.adaPerKoz 
    ? parseFloat((1 / tiersDashboard.currentTier.adaPerKoz).toFixed(6)) 
    : 0;

  // Safe type checking for koz available
  const kozAvailable = tiersDashboard?.currentTier?.remainingKozSupply ?? 0;

  const initialize = async () => {
    if (isMounted.current) return;
    
    if (isConnected) {
      try {
        setIsLoading(true);
        setTxStatus({
          status: 'connecting',
          details: {
            adaAmount: 0,
            kozAmount: 0,
            returnAmount: 2,
            serviceFee: 0.5,
            networkFee: 0.18,
            total: 2.68
          }
        });

        await new Promise(resolve => setTimeout(resolve, 500));
        await getBalance();
        
        if (!showHistory) {
          await fetchHistory();
        }
      } catch (error) {
        console.error(t('errors.initializationFailed'));
      } finally {
        setIsLoading(false);
        setError(null);
        setTxStatus(null);
      }
    }
    
    isMounted.current = true;
  };

  // Update effect to use new initialize function
  useEffect(() => {
    initialize();
  }, [isConnected]); // Run when connection status changes

  useEffect(() => {
    const cost = kozAmount > 0 ? kozAmount / conversionRate : 0;
    setAdaAmount(parseFloat(cost.toFixed(6)));
  }, [kozAmount, conversionRate]);

  useEffect(() => {
    if (kozAmount > 0) {
      const exactAdaAmount = kozAmount / conversionRate;
      const roundedAdaAmount = Math.ceil(exactAdaAmount * 100) / 100; // Round up to 2 decimal places
      if (roundedAdaAmount !== adaAmount) {
        setAdaAmount(roundedAdaAmount);
      }
    }
  }, [kozAmount, conversionRate]);

  const onSwap = async () => {
    setTxStatus(null);
    setError(null);

    if (!tiersDashboard?.currentTier) {
        setError(t("errors.tierNotAvailable"));
        return;
    }

    if (kozAmount < MIN_KOZ_AMOUNT) {
        setError(t("errors.minimumKozRequired", { amount: MIN_KOZ_AMOUNT }));
        return;
    }

    // Show connecting status
    setTxStatus({
        status: 'connecting',
        details: {
            adaAmount: adaAmount,
            kozAmount: kozAmount,
            returnAmount: 2,
            serviceFee: 0.5,
            networkFee: 0.18,
            total: adaAmount + 2.5
        }
    });

    if (!isConnected) {
        setError(t("errors.walletNotConnected"));
        return;
    }

    try {
        const { success, error, txHash, swapHistory } = await handleSubmitSwap(
            adaAmount, 
            kozAmount,
            tiersDashboard.currentTier.id,
            setTxStatus,
            referralCode // Add referral code to swap submission
        );
        
        if (success && txHash && swapHistory) {
          await fetchHistory();
          setShowHistory(true);

          try {
            const acceptResult = await handleAcceptSwap(txHash, swapHistory.id);
            
            if (acceptResult.success) {
              setKozAmount(0);
              setTxStatus(prev => prev ? {
                ...prev,
                status: 'completed'
              } : null);
            } else {
              // Start cancellation process
              setTxStatus(prev => prev ? {
                ...prev,
                status: 'cancelling',
                message: t('messages.cancelingSwap')
              } : null);

              if (!txHash) {
                throw new Error(t("errors.missingTxHash"));
              }
              
              const cancelResult = await handleCancelSwap(txHash, swapHistory.id);
              if (cancelResult.success) {
                setTxStatus(prev => prev ? {
                  ...prev,
                  status: 'cancelled',
                  error: t("errors.swapCancelled")
                } : null);
              }
            }
          } catch (acceptError) {
            // If acceptance process fails, attempt cancellation
            setTxStatus(prev => prev ? {
              ...prev,
              status: 'cancelling',
              message: t('messages.cancelingSwap')
            } : null);

            try {
              if (!txHash) throw new Error(t("errors.missingTxHash"));
              const cancelResult = await handleCancelSwap(txHash, swapHistory.id);
              if (cancelResult.success) {
                setTxStatus(prev => prev ? {
                  ...prev,
                  status: 'cancelled',
                  error: t("errors.swapCancelled")
                } : null);
              }
            } catch (cancelError) {
              setTxStatus(prev => prev ? {
                ...prev,
                status: 'failed',
                error: t("errors.cancellationFailed")
              } : null);
            }
          }
        } else {
          const isSignatureDeclined = error?.toLowerCase().includes('declined') || 
                                     error?.toLowerCase().includes('rejected') || 
                                     error?.toLowerCase().includes('denied');

          setTxStatus(prev => prev ? {
            ...prev,
            status: 'failed',
            error: isSignatureDeclined ? t("errors.signatureDeclined") : error
          } : null);
        }
      } catch (err) {
        // Generic error for unexpected submission errors
        setTxStatus(prev => prev ? {
          ...prev,
          status: 'failed',
          error: t("errors.submissionFailed")
        } : null);
      } finally {
        await fetchHistory();
      }
  };

  const handleCancelHistorySwap = async (txHash: string, swapId: number) => {
    try {
      await handleCancelSwap(txHash, swapId);
      await fetchHistory();
    } catch (error) {
      setError(t('errors.cancelSwapFailed'));
    }
  };

  const handleShowHistory = async () => {
    try {
      await fetchHistory(); // Add this line to fetch history before showing
      setShowHistory(true);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  // Main return - update the conditional rendering
  return (
    <div className="p-4 sm:p-6 w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto bg-gray-900 text-white border-2 border-yellow-500 rounded-lg shadow-lg">
      {isTiersDashboardLoading ? (
        // Loading state
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-800 rounded"></div>
          <div className="h-40 bg-gray-800 rounded"></div>
        </div>
      ) : !tiersDashboard?.currentTier ? (
        // All tiers completed state
        <>
          <SwapHeader 
            conversionRate={0} 
            kozAvailable={0}
            currentTier={null}
            allTiers={tiersDashboard?.allTiers ?? []}
            electionInfo={null}
          />
          <AllTiersCompleted />
        </>
      ) : (
        // Normal swap state
        <>
          <SwapHeader 
            conversionRate={conversionRate} 
            kozAvailable={kozAvailable}
            currentTier={tiersDashboard.currentTier}
            allTiers={tiersDashboard?.allTiers ?? []}
            electionInfo={tiersDashboard?.electionInfo ?? null}
          />

          {isSwapEnabled() ? (
            <>
              <SwapInput 
                kozAmount={kozAmount} 
                setKozAmount={setKozAmount} 
                max={kozAvailable}
                min={MIN_KOZ_AMOUNT}
              />
              
              <SwapDetails 
                kozAmount={kozAmount} 
                adaAmount={adaAmount}
                status={txStatus?.status}
                txHash={txStatus?.txHash}
                isLoading={isLoading}
                error={error || undefined}
                message={txStatus?.message}
                referralCode={referralCode}
                onReferralCodeChange={setReferralCode}
              />
              
              <SwapSummary
                kozAmount={kozAmount}
                onSwap={onSwap}
                maxKozAvailable={kozAvailable}
                isLoading={isLoading}
                disabled={!isConnected || isLoading}
                status={txStatus?.status}
              />
            </>
          ) : (
            <NextTierCountdown 
              targetDate={tiersDashboard.electionInfo?.electionStartDate || ''} 
              tierId={tiersDashboard.currentTier.tierId}
            />
          )}
        </>
      )}

      {!showHistory ? (
        <SwapHistoryPlaceholder onShowHistory={handleShowHistory} />
      ) : (
        <SwapHistory 
          history={history} 
          isLoading={isHistoryLoading}
          onCancelSwap={handleCancelHistorySwap}
        />
      )}
    </div>
  );
}
