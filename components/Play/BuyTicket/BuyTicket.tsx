"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useWalletContext } from "@/contexts/WalletContext";
import BuyTicketHeader from "./BuyTicketHeader";
import BuyTicketInput from "./BuyTicketInput";
import BuyTicketSummary from "./BuyTicketSummary";
import BuyTicketDetails from "./BuyTicketDetails";
import BuyTicketHistory from "./BuyTicketHistory";
import BuyTicketHistoryPlaceholder from "./BuyTicketHistoryPlaceholder";
import { TransactionDetails } from "./types";
import ConnectToKozButton from "@/components/ConnectToKoz/ConnectToKozButton";

const MOCK_KOZ_BALANCE = 10000000;
const KOZ_PER_TICKET = 200;
const NETWORK_FEE = 0.18;
const SERVICE_FEE_PER_TICKET = 0.1;
const MINIMUM_ADA_FEE = 2.5;
const TICKETS_FOR_MIN_FEE = Math.ceil(MINIMUM_ADA_FEE / SERVICE_FEE_PER_TICKET); 

export default function BuyTicket() {
  const t = useTranslations("BuyTicket");
  const { isConnected, handleBuyTickets: handleBuyTicketsFromContext } = useWalletContext();
  const [ticketAmount, setTicketAmount] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [txStatus, setTxStatus] = useState<string | undefined>(undefined);
  const [txHash, setTxHash] = useState<string | undefined>(undefined);

  const calculateTransactionDetails = (tickets: number): TransactionDetails => {
    const kozAmount = tickets * KOZ_PER_TICKET;
    // Usuário sempre recebe +1 ticket grátis pelo pagamento do minimum fee
    const actualTicketAmount = tickets + 3;
    
    // Calculate service fee based on minimum fee logic
    let serviceFee = 0;
    if (tickets <= TICKETS_FOR_MIN_FEE) {
      serviceFee = MINIMUM_ADA_FEE;
    } else {
      serviceFee = tickets * SERVICE_FEE_PER_TICKET;
    }
    
    return {
      ticketAmount: tickets,
      actualTicketAmount: actualTicketAmount, // Inclui o ticket grátis
      kozAmount: kozAmount,
      serviceFee: serviceFee,
      networkFee: NETWORK_FEE,
      total: kozAmount // Total is only KOZ amount
    };
  };

  const handleBuyTickets = async () => {
    if (!isConnected) {
      setError(t("errors.walletNotConnected"));
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      const details = calculateTransactionDetails(ticketAmount);
      
      const result = await handleBuyTicketsFromContext(
        ticketAmount,
        details.kozAmount,
        details.serviceFee - 1.16, // Adjusted service fee to account for the UTXO sent with KOZ + ADA
      );

      if (result.success && result.txHash) {
        setTxHash(result.txHash);
        setTxStatus('success');
        setShowHistory(true);
      } else {
        setError(result.error);
        setTxStatus('error');
      }
    } catch (error: any) {
      setError(error?.message || 'Transaction failed');
      setTxStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto bg-gray-900 text-white border-2 border-yellow-500 rounded-lg shadow-lg">
      <BuyTicketHeader kozBalance={MOCK_KOZ_BALANCE} />
      
      <BuyTicketInput 
        ticketAmount={ticketAmount}
        setTicketAmount={setTicketAmount}
        maxTickets={Math.floor(MOCK_KOZ_BALANCE / KOZ_PER_TICKET)}
      />

      <BuyTicketDetails 
        details={calculateTransactionDetails(ticketAmount)}
        status={txStatus}
        txHash={txHash}
        isLoading={isLoading}
        error={error}
      />

      {isConnected ? (
        <BuyTicketSummary
          ticketAmount={ticketAmount}
          onBuy={handleBuyTickets}
          isLoading={isLoading}
          disabled={ticketAmount === 0 || isLoading}
        />
      ) : (
        <div className="mt-4">
          <ConnectToKozButton 
            label={t("connectWalletFirst")}
            originPage="/office?section=buy-tickets"
            originDisplay="Buy Tickets"
            className="w-full py-3 px-4 rounded-lg font-medium transition bg-yellow-500 text-black hover:bg-yellow-400 flex items-center justify-center"
          />
        </div>
      )}

      {!showHistory ? (
        <BuyTicketHistoryPlaceholder 
          onShowHistory={() => setShowHistory(true)} 
        />
      ) : (
        <BuyTicketHistory 
          history={[]}
          isLoading={isLoading}
          onCancel={async () => {}}
        />
      )}
    </div>
  );
}