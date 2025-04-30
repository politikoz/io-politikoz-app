import { calculateTickets } from "@/utils/ticketCalculations";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTicketPolicy } from "@/hooks/useTicketPolicy";
import { INITIAL_TICKET_POLICY } from "@/types/TicketPolicy";
import ConnectToKozButton from "@/components/ConnectToKoz/ConnectToKozButton";
import StakeRewardCard from './StakeRewardCard';
import { useWalletContext } from "@/contexts/WalletContext"; // Add this import
import CollateralInfoModal from "./CollateralInfoModal";

// Define status type with all possible values
type StakeStatus = 'idle' | 'loading' | 'success' | 'error';

const LoadingState = () => (
  <div className="flex flex-col items-center space-y-6 py-8">
    <div className="relative w-24 h-24">
      <Image
        src="/images/cardano-logo.gif"
        alt="Cardano Loading"
        fill
        className="object-contain"
        priority
        unoptimized // Add this prop for GIF support
      />
    </div>
    <p className="text-white text-center text-lg font-medium">
      Waiting for transaction signature...<br />
      Please confirm in your wallet to complete staking
    </p>
  </div>
);

export default function StakePage() {  
  const { data: policyData } = useTicketPolicy();
  const { 
    isConnected,
    balance: walletBalance, 
    handleStake, 
    getBalance,
    getCollateral, // Add this
    connect 
  } = useWalletContext();
  
  const [status, setStatus] = useState<StakeStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [ticketCalculation, setTicketCalculation] = useState<ReturnType<typeof calculateTickets> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [collateralAmount, setCollateralAmount] = useState(0); // Add collateral state
  const [showCollateralInfo, setShowCollateralInfo] = useState(false); // Add state for modal

  const currentPolicy = policyData || INITIAL_TICKET_POLICY;

  // Add debug logs for initial render and state changes
  console.log('StakePage Render:', {
    isConnected,
    walletBalance,
    ticketCalculation,
    status,
    isLoading
  });

  // Add mount tracking ref
  const isMounted = useRef(false);

  // Add initialization effect
  useEffect(() => {
    const initializeConnection = async () => {
      if (isMounted.current) {
        console.log('Already initialized, skipping');
        return;
      }
      
      console.log('Initializing connection check');
      const storedWalletName = localStorage.getItem("walletName");
      
      console.log('Initial connection state:', {
        storedWalletName,
        isConnected,
        currentBalance: walletBalance
      });

      if (storedWalletName && !isConnected) {
        try {
          setIsLoading(true);
          console.log('Found stored wallet, attempting to connect:', storedWalletName);
          
          const connected = await connect(storedWalletName);
          console.log('Connection attempt result:', { connected });

          if (connected) {
            const balance = await getBalance();
            console.log('Retrieved balance:', balance);
            
            if (balance > 0) {
              const result = calculateTickets(balance, currentPolicy);
              console.log('Calculated tickets:', result);
              setTicketCalculation(result);
            }
          }
        } catch (error) {
          console.log('Connection attempt ended:', error instanceof Error ? error.message : 'Unknown error');
          setIsLoading(false);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
      
      isMounted.current = true;
    };

    initializeConnection();
  }, []); // Run only on mount

  // Add balance update effect
  useEffect(() => {
    const updateBalanceAndTickets = async () => {
      if (isConnected) {
        try {
          const currentBalance = await getBalance();
          const currentCollateral = await getCollateral();
          setCollateralAmount(currentCollateral);
          
          if (currentBalance > 0) {
            const result = calculateTickets(currentBalance, currentPolicy);
            console.log('Updating tickets:', result);
            setTicketCalculation(result);
          }
        } catch (error) {
          console.log('Balance update ended:', error instanceof Error ? error.message : 'Unknown error');
        }
      }
    };

    updateBalanceAndTickets();
  }, [isConnected, walletBalance]); // Update when connection or balance changes

  const onStake = async () => {
    console.log('Stake initiated');
    try {
      setStatus('loading');
      setError(null);
      
      const balance = await getBalance();
      console.log('Current balance before stake:', balance);
      
      const txHash = await handleStake();
      console.log('Stake transaction result:', { txHash });
      
      if (txHash) {
        setStatus('success');
      } else {
        console.log('Transaction was canceled');
        setStatus('idle');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('Stake action ended:', error.message);
        setStatus('error');
        
        // User friendly error messages
        if (error.message.includes('user declined sign tx')) {
          setError('Transaction was declined by user');
          setStatus('idle');
        } else if (error.message.includes('TxSignError')) {
          setError('Transaction signing was canceled');
          setStatus('idle');
        } else if (error.message.includes('Insufficient fee')) {
          // Extract minimum required fee if available
          const match = error.message.match(/minimumRequiredFee.*?lovelace":(\d+)}/);
          if (match) {
            const requiredAda = parseInt(match[1]) / 1_000_000;
            setError(`Insufficient funds in your wallet. Required minimum: ${requiredAda.toFixed(2)} ADA`);
          } else {
            setError('Insufficient funds in your wallet');
          }
          setStatus('error'); // Keep error status for insufficient funds
        } else {
          setError('Transaction failed. Please try again');
        }
      } else {
        setError('An unexpected error occurred. Please try again');
        setStatus('error');
      }
    }
  };

  // Add loading state to the render condition
  if (isLoading) {
    console.log('Rendering loading state');
    return <LoadingState />;
  }

  // Update the render condition to be more explicit
  if (!isConnected) {
    console.log('Not connected - showing connect button');
    return (
      <div className="w-full max-w-3xl mx-auto p-6 bg-gray-900 border-4 border-white shadow-[6px_6px_0px_black]">
        <h2 className="text-xl font-bold text-center text-yellow-400 mb-6">
          Connect to Start Staking
        </h2>
        <div className="flex justify-center">
          <ConnectToKozButton 
            label="Connect to Start Staking" 
            originPage="/laundry?section=stake-plkoz"
            originDisplay="Stake PLKOZ"
          />
        </div>
      </div>
    );
  }

  console.log('Rendering stake interface:', {
    hasBalance: walletBalance > 0,
    hasTickets: !!ticketCalculation,
    currentStatus: status
  });

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-gray-900 border-4 border-white shadow-[6px_6px_0px_black]">
      <h2 className="text-xl font-bold text-center text-yellow-400 mb-6">
        Stake Your ADA with PLKOZ
      </h2>

      <div className="space-y-6 text-white">
        {/* Type-safe status comparisons */}
        {(status as StakeStatus) === 'loading' ? (
          <LoadingState />
        ) : (
          <>
            <div className="text-center space-y-4">
              <p>
                When you join our PLKOZ pool, you can earn ADA rewards like any other pool. Additionally, you'll get tickets and KOZ token that let you participate in a monthly lottery for a chance to win more ADA and further increase your earnings.
              </p>
              
              {walletBalance > 0 && (
                <div className="p-4 bg-gray-800 rounded-lg relative">
                  {/* Collateral at top right */}
                  {collateralAmount > 0 && (
                    <div className="absolute top-2 right-2">
                      <div className="flex items-center gap-2">
                        <span className="text-white bg-green-700 px-2 py-0.5 rounded-full text-xs flex items-center whitespace-nowrap">
                          +{collateralAmount} ADA collateral
                        </span>
                        <button 
                          onClick={() => setShowCollateralInfo(true)}
                          className="text-green-300 hover:text-green-400 transition flex-shrink-0"
                          title="Learn about collateral"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Centered balance */}
                  <div className="flex flex-col items-center pt-6">
                    <p className="font-bold text-yellow-400 mb-2">Your Avaliable Balance:</p>
                    <p className="text-2xl font-bold">{walletBalance.toLocaleString()} ADA</p>
                  </div>

                  {/* Modal stays within the card but positioned absolutely */}
                  {showCollateralInfo && (
                    <CollateralInfoModal onClose={() => setShowCollateralInfo(false)} />
                  )}
                </div>
              )}

              {ticketCalculation && (
                <div className="mt-4 space-y-4">
                  <h3 className="text-lg font-bold text-yellow-200">Estimated Tickets</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {ticketCalculation.tickets.map(({ role, quantity }) => (
                      <StakeRewardCard
                        key={role}
                        name={role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
                        amount={quantity}
                        image={`/images/${role.toLowerCase()}.png`}
                      />
                    ))}
                  </div>

                  {ticketCalculation.estimatedKozRewards > 0 && (
                    <div className="mt-4 p-4 bg-green-900 border-2 border-green-500 rounded">
                      <h4 className="text-md font-bold text-green-300">💰 KOZ Bonus</h4>
                      <p>You can claim up to {ticketCalculation.estimatedKozRewards} KOZ rewards through monthly claims</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {status === 'success' && (
              <div className="text-center text-green-400 font-bold">
                Stake delegation successful!
              </div>
            )}

            {status === 'error' && error && (
              <div className="p-4 bg-red-900/50 border-2 border-red-500 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <h4 className="text-red-400 font-bold">Transaction Failed</h4>
                </div>
                <p className="text-red-100 text-sm">{error}</p>
              </div>
            )}
            
            <div className="flex justify-center">
              <button
                onClick={onStake}
                disabled={!isConnected || status === 'loading'}
                className={`px-6 py-3 rounded-lg font-bold text-lg transition
                  ${isConnected 
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-black' 
                    : 'bg-gray-600 cursor-not-allowed text-gray-400'
                  } ${status === 'loading' ? 'opacity-50 cursor-wait' : ''}`}
              >
                {status === 'loading' 
                  ? 'Staking...' 
                  : isConnected 
                    ? 'Stake Now' 
                    : 'Connect Wallet First'
                }
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}