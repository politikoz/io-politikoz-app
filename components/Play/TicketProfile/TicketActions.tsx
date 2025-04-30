import React, { useState } from "react";
import { useTranslations } from "next-intl";
import ChangeLuckyNumberModal from './ChangeLuckyNumberModal';
import { useChangeLuckyNumber } from '@/hooks/useChangeLuckyNumber';
import { Ticket } from "@/types/TicketData";

interface TicketActionsProps {
  selectedTickets: number[];
  setSelectedTickets: React.Dispatch<React.SetStateAction<number[]>>; // Adicionar esta prop
  isNextRace: boolean;
  tickets: Ticket[]; // Add this to have access to full ticket data
}

const TicketActions: React.FC<TicketActionsProps> = ({ 
  selectedTickets, 
  setSelectedTickets, // Adicionar esta prop
  isNextRace,
  tickets 
}) => {
  const t = useTranslations("TicketProfile");
  const [isChangeLuckyNumberOpen, setIsChangeLuckyNumberOpen] = useState(false);
  const changeLuckyNumber = useChangeLuckyNumber();

  const handleChangeLuckyNumber = async (newLuckyNumber: string) => {
    try {
      // Log para debug
      console.log('Total tickets available:', tickets.length);
      console.log('Selected ticket IDs:', selectedTickets);
      console.log('Selected tickets detail:', tickets.filter(ticket => selectedTickets.includes(ticket.id)));
      
      await changeLuckyNumber.mutateAsync({
        ticketIds: selectedTickets, // Envia apenas os IDs dos tickets selecionados
        luckyNumber: newLuckyNumber
      });
      
      setSelectedTickets([]); // Limpa os tickets selecionados após sucesso
      setIsChangeLuckyNumberOpen(false);
    } catch (error) {
      console.error('Failed to change lucky number:', error);
    }
  };

  // Get full ticket objects for selected tickets
  const selectedTicketObjects = tickets.filter(ticket => selectedTickets.includes(ticket.id));

  return (
    <>
      <div className="w-full flex justify-center mt-4 space-x-4">
        <button
          disabled={selectedTickets.length === 0}
          className="border-2 border-white px-3 py-2 bg-blue-600 text-white text-xs sm:text-sm hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isNextRace ? t("changePolitikoz") : t("linkTicket")}
        </button>
        <button
          onClick={() => setIsChangeLuckyNumberOpen(true)}
          disabled={selectedTickets.length === 0}
          className="border-2 border-white px-3 py-2 bg-yellow-600 text-white text-xs sm:text-sm hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {t("changeLuckyNumber")}
        </button>
      </div>

      <ChangeLuckyNumberModal
        isOpen={isChangeLuckyNumberOpen}
        onClose={() => setIsChangeLuckyNumberOpen(false)}
        selectedTickets={selectedTicketObjects} // Passa apenas os tickets selecionados
        onSave={handleChangeLuckyNumber}
      />
    </>
  );
};

export default TicketActions;
