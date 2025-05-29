import React from "react";
import { useTranslations } from "next-intl";
import { Ticket } from "@/types/TicketData";

interface TicketTableProps {
  paginatedTickets: Ticket[];
  selectedTickets: number[];
  setSelectedTickets: React.Dispatch<React.SetStateAction<number[]>>;
  isOnTheRace: boolean;
  isAutoLink: boolean;
}

const TicketTable: React.FC<TicketTableProps> = ({
  paginatedTickets,
  selectedTickets,
  setSelectedTickets,
  isOnTheRace,
  isAutoLink,
}) => {
  const t = useTranslations("TicketProfile");

  const toggleTicketSelection = (ticketId: number) => {
    setSelectedTickets((prev) =>
      prev.includes(ticketId)
        ? prev.filter((id) => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  return (
    <div className="w-full mt-4 px-2 sm:px-4 flex flex-col items-center overflow-x-auto">
      <div className="w-full overflow-x-auto">
        <table className="w-full border-4 border-white text-[10px] sm:text-xs md:text-sm lg:text-base">
          <thead>
            <tr className="bg-gray-700 text-white">
              {!isOnTheRace && !isAutoLink && (
                <th className="border-2 border-white px-2 sm:px-4 py-2">{t("select")}</th>
              )}
              {isOnTheRace && (
                <th className="border-2 border-white px-2 sm:px-4 py-2">{t("role")}</th>
              )}
              <th className="border-2 border-white px-2 sm:px-4 py-2">{t("ticket")}</th>
              {isOnTheRace && (
                <th className="border-2 border-white px-2 sm:px-4 py-2">{t("linkedPolitikoz")}</th>
              )}
              {isOnTheRace ? (
                <th className="border-2 border-white px-2 sm:px-4 py-2">{t("estimatedEarnings")}</th>
              ) : (
                <th className="border-2 border-white px-2 sm:px-4 py-2">{t("singleUse")}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedTickets.map((ticket) => (
              <tr key={ticket.id} className="text-center bg-gray-800 text-white">
                {!isOnTheRace && !isAutoLink && (
                  <td className="border-2 border-white px-2 sm:px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedTickets.includes(ticket.id)}
                      onChange={() => toggleTicketSelection(ticket.id)}
                      className="w-4 h-4"
                    />
                  </td>
                )}
                {isOnTheRace && (
                  <td className="border-2 border-white px-2 sm:px-4 py-2">
                    {ticket.type}
                  </td>
                )}
                <td className="border-2 border-white px-2 sm:px-4 py-2">
                  <span className="text-white">{ticket.name}</span>
                  <span className="text-green-400">{ticket.luckyNumber}</span>
                </td>
                {isOnTheRace && (
                  <td className="border-2 border-white px-2 sm:px-4 py-2">
                    {ticket.politikozLinked || t("notAvailable")}
                  </td>
                )}
                {isOnTheRace ? (
                  <td className="border-2 border-white px-2 sm:px-4 py-2">
                    {ticket.estimatedEarnings} ₳
                  </td>
                ) : (
                  <td className="border-2 border-white px-2 sm:px-4 py-2">
                    {ticket.singleUse ? t("yes") : t("no")}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketTable;
