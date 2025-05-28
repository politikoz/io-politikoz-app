import React, { useState } from "react";
import { useTranslations } from "next-intl";
import ChangeLuckyNumberModal from './ChangeLuckyNumberModal';
import { useChangeLuckyNumber } from '@/hooks/useChangeLuckyNumber';
import AuthenticatedAction from "@/components/Auth/AuthenticatedAction";
import { Ticket } from "@/types/TicketData";

interface TicketActionsProps {
  selectedTickets: number[];
  setSelectedTickets: React.Dispatch<React.SetStateAction<number[]>>; // Adicionar esta prop
  isNextRace: boolean;
  tickets: Ticket[]; // Add this to have access to full ticket data
}

const TicketActions: React.FC<TicketActionsProps> = ({ 
  selectedTickets, 
  setSelectedTickets,
  isNextRace,
  tickets 
}) => {
  const t = useTranslations("TicketProfile");
  const [isChangeLuckyNumberOpen, setIsChangeLuckyNumberOpen] = useState(false);
  const changeLuckyNumber = useChangeLuckyNumber();

  const handleChangeLuckyNumber = async (newLuckyNumber: string) => {
    try {
      await changeLuckyNumber.mutateAsync({
        ticketIds: selectedTickets,
        luckyNumber: newLuckyNumber
      });
      
      setSelectedTickets([]);
      setIsChangeLuckyNumberOpen(false);
    } catch (error) {
      console.error('Failed to change lucky number:', error);
    }
  };

  const closeModal = () => setIsChangeLuckyNumberOpen(false);

  return (
    <div className="flex justify-center mt-4 space-x-2">
      <button
        onClick={() => setIsChangeLuckyNumberOpen(true)}
        disabled={selectedTickets.length === 0}
        className="border-2 border-white px-3 py-2 bg-yellow-600 text-white text-xs sm:text-sm hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
      >
        {t("changeLuckyNumber")}
      </button>

      {isChangeLuckyNumberOpen && (
        <AuthenticatedAction onCancel={closeModal}>
          <ChangeLuckyNumberModal
            isOpen={true}
            onClose={closeModal}
            selectedTickets={tickets.filter(ticket => selectedTickets.includes(ticket.id))}
            onSave={handleChangeLuckyNumber}
          />
        </AuthenticatedAction>
      )}
    </div>
  );
};

export default TicketActions;
