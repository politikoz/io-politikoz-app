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
import { useValidateReferralCode } from '@/hooks/useValidateReferralCode';

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
  const validateReferralMutation = useValidateReferralCode();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kozAmount, setKozAmount] = useState(0);
  const [adaAmount, setAdaAmount] = useState(0);
  const [txStatus, setTxStatus] = useState<TransactionStatus | null>(null);
  const [referralCode, setReferralCode] = useState<string>("");
  const [isOwnerReferral, setIsOwnerReferral] = useState<boolean>(false);
  const [stakeAddress, setStakeAddress] = useState<string>('');
  const [walletBalance, setWalletBalance] = useState(0);
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

  // Manter initialize simples, apenas para configuração inicial
  const initialize = async () => {
    if (isMounted.current) return;
    
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
      
      if (!showHistory) {
        await fetchHistory();
      }
    } catch (error) {
      // Erro silencioso em produção
    } finally {
      setIsLoading(false);
      setError(null);
      setTxStatus(null);
    }
    
    isMounted.current = true;
  };

  // Efeito apenas para montagem
  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Efeito para mudanças em isConnected
  useEffect(() => {
    if (isConnected) {
      initialize();
    }
  }, [isConnected]);

  // Adicionar um useEffect separado para lidar com obtenção de saldo e endereço
  useEffect(() => {
    const updateWalletData = async () => {
      if (isConnected && wallet) {
        try {
          // Obter o stakeAddress
          const rewardAddresses = await wallet.getRewardAddresses();
          const address = rewardAddresses?.[0] || '';
          setStakeAddress(address);

          // Obter o saldo
          const balance = await getBalance();
          setWalletBalance(balance);
        } catch (error) {
          // Erro silencioso em produção
        }
      }
    };

    updateWalletData();
  }, [isConnected, wallet, getBalance]);

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

  // Atualizar a função para aceitar o parâmetro isOwner
  const handleReferralCodeChange = (code: string, isOwner: boolean = false) => {
    setReferralCode(code);
    setIsOwnerReferral(isOwner);
  };

  const onSwap = async () => {
    setTxStatus(null);
    setError(null);

    // Validate referral code first if present
    if (referralCode && stakeAddress) {
      try {
        const { valid, isOwner } = await validateReferralMutation.mutateAsync({
          referralCode,
          stakeAddress
        });
        
        if (!valid) {
          setError(t("errors.invalidReferralCode"));
          return;
        }
        
        // Atualizar o estado de autorreferência
        setIsOwnerReferral(isOwner);
      } catch (error) {
        setError(t("errors.referralValidationFailed"));
        return;
      }
    }

    if (!tiersDashboard?.currentTier) {
      setError(t("errors.tierNotAvailable"));
      return;
    }

    if (kozAmount < MIN_KOZ_AMOUNT) {
        setError(t("errors.minimumKozRequired", { amount: MIN_KOZ_AMOUNT }));
        return;
    }

    // Adicionar a taxa de bribe se for autorreferência
    const bribeFee = isOwnerReferral ? 1.5 : 0;
    
    // Show connecting status com a taxa de bribe
    setTxStatus({
        status: 'connecting',
        details: {
            adaAmount: adaAmount,
            kozAmount: kozAmount,
            returnAmount: 2,
            serviceFee: 0.5,
            networkFee: 0.18,
            bribeFee: bribeFee, // Adicionar a taxa de bribe
            total: adaAmount + 2.5 + bribeFee // Incluir a taxa no total
        }
    });

    if (!isConnected) {
        setError(t("errors.walletNotConnected"));
        return;
    }

    try {
        const { success, error, txHash, swapHistory } = await handleSubmitSwap(
            adaAmount + bribeFee, 
            kozAmount,
            tiersDashboard.currentTier.id,
            setTxStatus,
            referralCode
        );

        if (success && txHash && swapHistory) {
          await fetchHistory();
          setShowHistory(true);
        
          try {
            const acceptResult = await handleAcceptSwap(txHash, swapHistory.id, swapHistory.tierId);
            
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
      await fetchHistory();
      setShowHistory(true);
    } catch (error) {
      // Erro silencioso em produção
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
                walletBalance={walletBalance}
                conversionRate={conversionRate}
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
                isOwnerReferral={isOwnerReferral}
                onReferralCodeChange={handleReferralCodeChange}
                stakeAddress={stakeAddress}
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
