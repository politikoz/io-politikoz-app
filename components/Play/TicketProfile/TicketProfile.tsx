"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import TabNavigation from "./TabNavigation";
import ProfileHeader from "./ProfileHeader";
import TicketTable from "./TicketTable";
import TicketActions from "./TicketActions";
import Pagination from "./Pagination";
import SelectButtons from "./SelectButtons";
import { useTicketData } from '@/hooks/useTicketData';
import { tabs } from "./tabs";
import AutoLinkConfig from "../AutoLink/AutoLinkConfig";
import ChangeLuckyNumberModal from "./ChangeLuckyNumberModal";
import { Ticket } from '@/types/TicketData';
import { useChangeLuckyNumber } from '@/hooks/useChangeLuckyNumber';

interface ChangeLuckyNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTickets: Ticket[]; // Use the Ticket type from TicketData
  onSave: (newValue: string) => void;
}

export default function TicketProfile() {
  const t = useTranslations("TicketProfile");
  const { data: tickets, error } = useTicketData();
  const changeLuckyNumber = useChangeLuckyNumber();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedTickets, setSelectedTickets] = useState<number[]>([]); // Changed from string[] to number[]
  const [currentPage, setCurrentPage] = useState(1);
  const [isChangeLuckyNumberOpen, setIsChangeLuckyNumberOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const itemsPerPage = 5;

  const selectedTab = useMemo(() => tabs[selectedIndex], [selectedIndex]);
  const isOnTheRace = selectedTab.name === "On the Race";
  const isNextRace = selectedTab.name === "Next Race";
  const isAutoLink = selectedTab.name === "Auto Link";

  const filteredTickets = useMemo(() => {
    if (!tickets) return [];
    
    if (isOnTheRace) {
      return tickets.filter((ticket) => ticket.inElection);
    } else if (isNextRace) {
      return tickets.filter((ticket) => ticket.nextElection);
    } else {
      // Para as tabs de tipo (Corrupt, Launderer, etc), não mostrar tickets que estão em eleição ou na próxima eleição
      return tickets.filter((ticket) => 
        ticket.type.toLowerCase() === selectedTab.name.toLowerCase() && 
        !ticket.inElection && 
        !ticket.nextElection
      );
    }
  }, [selectedTab, tickets]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedIndex]);

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTickets.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredTickets]);

  const handleLuckyNumberChange = async (newLuckyNumber: string) => {
    // Log selected tickets and filtered tickets
    console.log('Selected Ticket IDs:', selectedTickets);
    console.log('Filtered Tickets:', filteredTickets);
    console.log('Selected Tickets Detail:', filteredTickets.filter(ticket => selectedTickets.includes(ticket.id)));

    try {
      const payload = {
        ticketIds: selectedTickets,
        luckyNumber: newLuckyNumber
      };
      
      // Log the payload being sent to API
      console.log('Payload being sent to API:', payload);

      await changeLuckyNumber.mutateAsync(payload);
      setSelectedTickets([]); // Clear selected tickets after success

    } catch (error) {
      console.error('Failed to change lucky number:', error);
      console.error('Error details:', {
        status: (error as any)?.response?.status,
        data: (error as any)?.response?.data,
        message: (error as any)?.message
      });
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-4">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col w-full max-w-4xl mx-auto border-4 border-black bg-gray-900 text-white p-2 shadow-[6px_6px_0px_black]">
      {/* Show success message if exists */}
      {successMessage && (
        <div className="absolute top-0 right-0 m-4 p-2 bg-green-600 text-white text-sm rounded animate-fade-out">
          {successMessage}
        </div>
      )}
      
      <div className="relative flex flex-col md:flex-row h-auto w-full">
        <TabNavigation selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />

        <div className="flex-1 flex flex-col border-4 border-black bg-gray-800 p-4 shadow-[4px_4px_0px_black]">
          {isAutoLink ? (
            <AutoLinkConfig />
          ) : (
            <>
              <div className="flex justify-start w-full">
                <ProfileHeader cargo={selectedTab.name} />
              </div>

              {filteredTickets.length > 0 ? (
                <>
                  {!isOnTheRace && !isAutoLink && (
                  <SelectButtons
                  selectedTickets={selectedTickets}
                  setSelectedTickets={setSelectedTickets}
                  paginatedTickets={paginatedTickets}
                  filteredTickets={filteredTickets} // Passar todos os tickets filtrados
                  />
                  )}

                  <TicketTable
                  paginatedTickets={paginatedTickets}
                  selectedTickets={selectedTickets}
                  setSelectedTickets={setSelectedTickets}
                  isOnTheRace={isOnTheRace}
                  isNextRace={isNextRace}
                  isAutoLink={isAutoLink}
                  />

                  {!isOnTheRace && !isAutoLink && (
                  <TicketActions 
                    selectedTickets={selectedTickets} 
                    setSelectedTickets={setSelectedTickets} // Adicionar esta prop
                    isNextRace={isNextRace}
                    tickets={filteredTickets} // Pass the tickets array
                  />
                  )}

                  <ChangeLuckyNumberModal
                  isOpen={isChangeLuckyNumberOpen}
                  onClose={() => setIsChangeLuckyNumberOpen(false)}
                  selectedTickets={filteredTickets.filter(ticket => selectedTickets.includes(ticket.id))}
                  onSave={handleLuckyNumberChange}
                  />

                  <div className="mt-auto">
                  <Pagination
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPages={totalPages}
                  />
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-400 mt-4">{t("noTickets")}</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
