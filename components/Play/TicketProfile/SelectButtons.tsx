import React from "react";
import { useTranslations } from "next-intl";
import { Ticket } from "@/types/TicketData";

interface SelectButtonsProps {
  selectedTickets: number[];
  setSelectedTickets: React.Dispatch<React.SetStateAction<number[]>>;
  paginatedTickets: Ticket[];
  filteredTickets: Ticket[]; // Adicionar todos os tickets filtrados
}

const SelectButtons: React.FC<SelectButtonsProps> = ({
  selectedTickets,
  setSelectedTickets,
  paginatedTickets,
  filteredTickets, // Novo prop
}) => {
  const t = useTranslations("TicketProfile");

  const selectAllTickets = () => {
    // Seleciona todos os tickets de todas as páginas
    setSelectedTickets(filteredTickets.map((ticket) => ticket.id));
  };

  const deselectAllTickets = () => {
    setSelectedTickets([]);
  };

  return (
    <div className="flex justify-between w-full mt-4 px-2 sm:px-4">
      <button
        onClick={selectAllTickets}
        className="border-2 border-white px-2 sm:px-4 py-2 bg-green-600 text-white text-xs sm:text-sm font-['Press_Start_2P'] shadow-[4px_4px_0px_black] hover:bg-green-700 transition"
      >
        {t("selectAll")}
      </button>
      <button
        onClick={deselectAllTickets}
        disabled={selectedTickets.length === 0}
        className={`border-2 border-white px-2 sm:px-4 py-2 text-white text-xs sm:text-sm font-['Press_Start_2P'] shadow-[4px_4px_0px_black] transition 
          ${selectedTickets.length === 0 ? "bg-gray-600 opacity-50 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
      >
        {t("deselectAll")}
      </button>
    </div>
  );
};

export default SelectButtons;
