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

export default function TicketProfile() {
  // 1. All useState hooks
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedTickets, setSelectedTickets] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 2. Constants and translations
  const itemsPerPage = 5;
  const t = useTranslations("TicketProfile");

  // 3. Data fetching
  const { data: tickets, isLoading, error } = useTicketData();

  // 4. All useMemo hooks
  const selectedTab = useMemo(() => tabs[selectedIndex], [selectedIndex]);
  const isOnTheRace = selectedTab.name === "On the Race";
  const isAutoLink = selectedTab.name === "Auto Link";

  const filteredTickets = useMemo(() => {
    if (!tickets) return [];
    
    if (isOnTheRace) {
      return tickets.filter((ticket) => ticket.inElection);
    } else {
      return tickets.filter((ticket) => 
        ticket.type.toLowerCase() === selectedTab.name.toLowerCase() && 
        !ticket.inElection
      );
    }
  }, [selectedTab, tickets, isOnTheRace]);

  const totalPages = useMemo(() => 
    Math.ceil(filteredTickets.length / itemsPerPage),
    [filteredTickets.length, itemsPerPage]
  );

  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTickets.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredTickets, itemsPerPage]);

  // 5. useEffect hooks
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedIndex]);

  // Loading state check - after hooks, before render
  if (isLoading || !tickets) {
    return (
      <div className="relative flex flex-col w-full max-w-4xl mx-auto border-4 border-black bg-gray-900 text-white p-2 shadow-[6px_6px_0px_black]">
        <div className="flex items-center justify-center h-[600px]">
          <div className="w-8 h-8 border-4 border-yellow-300 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Error state check
  if (error) {
    return (
      <div className="relative flex flex-col w-full max-w-4xl mx-auto border-4 border-black bg-gray-900 text-white p-2 shadow-[6px_6px_0px_black]">
        <div className="flex items-center justify-center h-[600px]">
          <div className="text-center p-4">
            <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
            <p className="text-gray-400">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="relative flex flex-col w-full max-w-4xl mx-auto border-4 border-black bg-gray-900 text-white p-2 shadow-[6px_6px_0px_black]">
      <div className="w-full flex flex-col flex-1">
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
                        filteredTickets={filteredTickets}
                      />
                    )}

                    <TicketTable
                      paginatedTickets={paginatedTickets}
                      selectedTickets={selectedTickets}
                      setSelectedTickets={setSelectedTickets}
                      isOnTheRace={isOnTheRace}
                      isAutoLink={isAutoLink}
                    />

                    {!isOnTheRace && !isAutoLink && (
                      <TicketActions 
                        selectedTickets={selectedTickets} 
                        setSelectedTickets={setSelectedTickets}
                        tickets={filteredTickets}
                      />
                    )}

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
    </div>
  );
}
