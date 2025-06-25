"use client";

import { useTicketPurchase } from "@/hooks/useTicketPurchase";
import { useTicketPurchaseHistory } from "@/hooks/useTicketPurchaseHistory";
import { useState, useEffect, useRef } from "react";
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

const KOZ_PER_TICKET = 200;
const NETWORK_FEE = 0.18;
const SERVICE_FEE_PER_TICKET = 0.1;
const MINIMUM_ADA_FEE = 2.5;
const TICKETS_FOR_MIN_FEE = Math.ceil(MINIMUM_ADA_FEE / SERVICE_FEE_PER_TICKET); 

export default function BuyTicket() {
  const t = useTranslations("BuyTicket");
  const { 
    isConnected, 
    handleBuyTickets: handleBuyTicketsFromContext,
    getKozBalance, // Adicionar getKozBalance
    kozBalance,     // Adicionar kozBalance do contexto
    wallet
  } = useWalletContext();
  const { createTicketPurchase } = useTicketPurchase();
  
  // Adicione uma referência ao hook do histórico para acessar a função de refetch
  const historyQueryRef = useRef<any>(null);
  
  const [ticketAmount, setTicketAmount] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [txStatus, setTxStatus] = useState<string | undefined>(undefined);
  const [txHash, setTxHash] = useState<string | undefined>(undefined);
  const [purchaseHistory, setPurchaseHistory] = useState<any[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const stakeAddressRef = useRef<string>('');

  // Adicionar useEffect para buscar o saldo de KOZ quando conectado
  useEffect(() => {
    const updateKozBalance = async () => {
      if (isConnected) {
        await getKozBalance();
      }
    };
    
    updateKozBalance();
  }, [isConnected, getKozBalance]);

  // Obter o stakeAddress quando conectado
  useEffect(() => {
    const getStakeAddress = async () => {
      if (isConnected && wallet) {
        try {
          const rewardAddresses = await wallet.getRewardAddresses();
          const address = rewardAddresses?.[0] || '';
          stakeAddressRef.current = address;
        } catch (error) {
          
        }
      }
    };
    
    getStakeAddress();
  }, [isConnected, wallet]);

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

  // Função para carregar o histórico
  const loadHistory = async () => {
    setShowHistory(true);
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
        
        // Registrar a compra na API
        if (stakeAddressRef.current) {
          try {
            await createTicketPurchase({
              stakeAddress: stakeAddressRef.current,
              quantity: ticketAmount,
              kozAmount: details.kozAmount.toString(),
              adaAmount: (details.serviceFee).toFixed(2),
              transactionHash: result.txHash
            });
            
            // Mostrar mensagem de sucesso
            setSuccessMessage(t("ticketsAddedSoon"));
            
            // Recarregar o histórico se o componente estiver sendo exibido
            if (showHistory && historyQueryRef.current?.forceRefresh) {
              // Adicionar um pequeno atraso para garantir que o backend processou os dados
              setTimeout(() => {
                historyQueryRef.current.forceRefresh(); // Usar forceRefresh em vez de refetch
              }, 2000);
            }
            
          } catch (apiError: any) {
            // Exibir mensagem de erro da API, sem logs no console
            setSuccessMessage(
              t("ticketTransactionSuccessButApiError", {
                defaultValue: "Transaction completed, but there was an issue registering your purchase. Your tickets will still be added, but it might take longer than usual."
              })
            );
          }
        }
        
        // Atualizar o saldo de KOZ após a compra de tickets
        await getKozBalance();
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

  // Calcular o máximo de tickets que podem ser comprados com o saldo atual
  const maxTickets = Math.floor(kozBalance / KOZ_PER_TICKET);

  return (
    <div className="p-4 sm:p-6 w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto bg-gray-900 text-white border-2 border-yellow-500 rounded-lg shadow-lg">
      <BuyTicketHeader kozBalance={kozBalance} />
      
      <BuyTicketInput 
        ticketAmount={ticketAmount}
        setTicketAmount={setTicketAmount}
        maxTickets={maxTickets}
      />

      <BuyTicketDetails 
        details={calculateTransactionDetails(ticketAmount)}
        status={txStatus}
        txHash={txHash}
        isLoading={isLoading}
        error={error}
        successMessage={successMessage}
      />

      {isConnected ? (
        <BuyTicketSummary
          ticketAmount={ticketAmount}
          onBuy={handleBuyTickets}
          isLoading={isLoading}
          disabled={ticketAmount === 0 || isLoading || kozBalance < (ticketAmount * KOZ_PER_TICKET)}
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
          onShowHistory={loadHistory} 
        />
      ) : (
        <BuyTicketHistory 
          stakeAddress={stakeAddressRef.current}
          isLoading={isLoadingHistory}
          queryRef={historyQueryRef}
        />
      )}
    </div>
  );
}