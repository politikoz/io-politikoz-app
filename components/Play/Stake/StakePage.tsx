import { calculateTickets } from "@/utils/ticketCalculations";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTicketPolicy } from "@/hooks/useTicketPolicy";
import { INITIAL_TICKET_POLICY } from "@/types/TicketPolicy";
import ConnectToKozButton from "@/components/ConnectToKoz/ConnectToKozButton";
import StakeRewardCard from './StakeRewardCard';
import { useWalletContext } from "@/contexts/WalletContext";
import CollateralInfoModal from "./CollateralInfoModal";
import { useTranslations } from "next-intl";


type StakeStatus = 'idle' | 'loading' | 'success' | 'error';

const LoadingState = () => {
  const t = useTranslations("Stake");
  return (
    <div className="flex flex-col items-center space-y-6 py-8">
      <div className="relative w-24 h-24">
        <Image
          src="/images/cardano-logo.gif"
          alt="Cardano Loading"
          fill
          className="object-contain"
          priority
          unoptimized
        />
      </div>
      <p className="text-white text-center text-lg font-medium">
        {t("status.waitingSignature")}<br />
        {t("status.pleaseConfirm")}
      </p>
    </div>
  );
};

export default function StakePage() {
  const t = useTranslations("Stake");
  const { data: policyData } = useTicketPolicy();
  const { 
    isConnected,
    balance: walletBalance, 
    handleStake, 
    getBalance,
    getCollateral
  } = useWalletContext();
  
  const [status, setStatus] = useState<StakeStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [ticketCalculation, setTicketCalculation] = useState<ReturnType<typeof calculateTickets> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [collateralAmount, setCollateralAmount] = useState(0);
  const [showCollateralInfo, setShowCollateralInfo] = useState(false);

  const currentPolicy = policyData || INITIAL_TICKET_POLICY;
  const isMounted = useRef(false);

  const initialize = async () => {
    if (isMounted.current) return;  
    isMounted.current = true;
  };

  useEffect(() => {
    const init = async () => {
      await initialize();
    };
    init();
  }, [isConnected]); // Add isConnected dependency

  useEffect(() => {
    if (!isConnected) {
      setTicketCalculation(null);
      setStatus('idle');
      setError(null);
    }
  }, [isConnected]);

  useEffect(() => {
    const updateBalanceAndTickets = async () => {
      if (!isConnected) return;

      try {
        const currentBalance = await getBalance();
        const currentCollateral = await getCollateral();
        
        setCollateralAmount(currentCollateral);
        
        if (currentBalance > 0) {
          const result = calculateTickets(currentBalance, currentPolicy);
          setTicketCalculation(result);
        }
      } catch (error) {
        console.error('Balance update failed:', error);
      }
    };

    updateBalanceAndTickets();
  }, [isConnected, walletBalance, currentPolicy]);

  const onStake = async () => {
    if (!isConnected || !walletBalance) return;

    try {
      setStatus('loading');
      setError(null);
      
      const txHash = await handleStake();
      
      if (txHash) {
        setStatus('success');
      } else {
        setStatus('idle');
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('user declined sign tx')) {
          setError(t("errors.transactionDeclined"));
          setStatus('idle');
        } else if (error.message.includes('TxSignError')) {
          setError(t("errors.signingCanceled"));
          setStatus('idle');
        } else if (error.message.includes('Insufficient fee')) {
          const match = error.message.match(/minimumRequiredFee.*?lovelace":(\d+)}/);
          if (match) {
            const requiredAda = parseInt(match[1]) / 1_000_000;
            setError(t("errors.insufficientFundsWithAmount", { amount: requiredAda.toFixed(2) }));
          } else {
            setError(t("errors.insufficientFunds"));
          }
          setStatus('error');
        } else {
          setError(t("errors.transactionFailed"));
          setStatus('error');
        }
      } else {
        setError(t("errors.unexpected"));
        setStatus('error');
      }
    }
  };

  if (!localStorage.getItem("walletName")) {
    return (
      <div className="w-full max-w-3xl mx-auto p-6 bg-gray-900 border-4 border-white shadow-[6px_6px_0px_black]">
        <h2 className="text-xl font-bold text-center text-yellow-400 mb-6">
          {t("connectToStart")}
        </h2>
        <div className="flex justify-center">
          <ConnectToKozButton 
            label={t("connectButtonLabel")}
            originPage="/laundry?section=stake-plkoz"
            originDisplay="Stake PLKOZ"
          />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto p-6 bg-gray-900 border-4 border-white shadow-[6px_6px_0px_black]">
        <h2 className="text-xl font-bold text-center text-yellow-400 mb-6">
          {t("title")}
        </h2>

        <div className="space-y-6 text-white">
          <div className="text-center space-y-4">
            <p>{t("description")}</p>
            
            <div className="p-4 bg-gray-800 rounded-lg relative">
              <div className="absolute top-2 right-2">
                <div className="flex items-center gap-2">
                  <span className="text-white bg-green-700/50 px-2 py-0.5 rounded-full text-xs flex items-center whitespace-nowrap">
                    {t("collateral.amount", { amount: 5 })}
                  </span>
                  <button className="text-green-300/50 flex-shrink-0 cursor-not-allowed">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center pt-6">
                <p className="font-bold text-yellow-400 mb-2">{t("availableBalance")}</p>
                <p className="text-2xl font-bold text-gray-500">- ADA</p>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <h3 className="text-lg font-bold text-yellow-200">{t("estimatedTickets")}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {["BRIBER", "CORRUPT", "FRONTMAN", "LAUNDERER", "LOBBYIST"].map((role) => (
                  <StakeRewardCard
                    key={role}
                    name={role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
                    amount="-"
                    image={`/images/assets/${role.toLowerCase()}.png`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              disabled
              className="px-6 py-3 rounded-lg font-bold text-lg bg-gray-600 cursor-not-allowed text-gray-400"
            >
              {t("stakeButtonLabel")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-gray-900 border-4 border-white shadow-[6px_6px_0px_black]">
      <h2 className="text-xl font-bold text-center text-yellow-400 mb-6">
        {t("title")}
      </h2>

      <div className="space-y-6 text-white">
        {status === 'loading' ? (
          <LoadingState />
        ) : (
          <>
            <div className="text-center space-y-4">
              <p>{t("description")}</p>
              
              {walletBalance > 0 && (
                <div className="p-4 bg-gray-800 rounded-lg relative">
                  {collateralAmount > 0 && (
                    <div className="absolute top-2 right-2">
                      <div className="flex items-center gap-2">
                        <span className="text-white bg-green-700 px-2 py-0.5 rounded-full text-xs flex items-center whitespace-nowrap">
                          {t("collateral.amount", { amount: collateralAmount })}
                        </span>
                        <button 
                          onClick={() => setShowCollateralInfo(true)}
                          className="text-green-300 hover:text-green-400 transition flex-shrink-0"
                          title={t("collateral.info")}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col items-center pt-6">
                    <p className="font-bold text-yellow-400 mb-2">{t("availableBalance")}</p>
                    <p className="text-2xl font-bold">{walletBalance.toLocaleString()} ADA</p>
                  </div>
                </div>
              )}

              {ticketCalculation && (
                <div className="mt-4 space-y-4">
                  <h3 className="text-lg font-bold text-yellow-200">{t("estimatedTickets")}</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {ticketCalculation.tickets.map(({ role, quantity }) => (
                      <StakeRewardCard
                        key={role}
                        name={role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
                        amount={quantity}
                        image={`/images/assets/${role.toLowerCase()}.png`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-center mt-6">
                <button
                  onClick={onStake}
                  disabled={!walletBalance || status === 'loading' as StakeStatus}
                  className={`px-6 py-3 rounded-lg font-bold text-lg transition ${
                    !walletBalance || status === 'loading' as StakeStatus
                      ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                      : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                  }`}
                >
                  {status === 'loading' as StakeStatus ? t("status.staking") : t("stakeButtonLabel")}
                </button>
              </div>
            </div>

            {status === 'success' && (
              <div className="text-center text-green-400 font-bold">
                {t("stakeSuccess")}
              </div>
            )}

            {status === 'error' && error && (
              <div className="p-4 bg-red-900/50 border-2 border-red-500 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <h4 className="text-red-400 font-bold">{t("errors.title")}</h4>
                </div>
                <p className="text-red-100 text-sm">{error}</p>
              </div>
            )}
          </>
        )}
      </div>

      {showCollateralInfo && (
        <CollateralInfoModal onClose={() => setShowCollateralInfo(false)} />
      )}
    </div>
  );
}