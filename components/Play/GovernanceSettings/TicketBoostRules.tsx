"use client";

import { useTranslations } from "next-intl";
import React from "react";

interface TicketBoostRulesProps {
  data: Record<string, number>;
}

const ticketColors: Record<string, string> = {
  FRONTMAN: "#C0C0C0",
  CORRUPT: "#6EAA5E",
  LOBBYIST: "#977BD0",
  BRIBER: "#88CEFA",
  LAUNDERER: "#FFFBCC"
};

const formatTicket = (ticket: string) => {
  return ticket.charAt(0).toUpperCase() + ticket.slice(1).toLowerCase();
};

export default function TicketBoostRules({ data }: TicketBoostRulesProps) {
  const t = useTranslations("GovernanceSettings");

  // Order tickets according to ticketColors
  const orderedTickets = Object.keys(ticketColors).map(ticket => ({
    ticket,
    boost: data[ticket] || 0,
    bgColor: ticketColors[ticket]
  }));

  return (
    <div className="w-full">
      <h3 className="text-lg font-bold text-yellow-300 mb-1">{t("ticketBoostTitle")}</h3>
      <p className="text-sm text-gray-300 mb-4">{t("ticketBoostDescription")}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {orderedTickets.map(({ ticket, boost, bgColor }) => (
          <div
            key={ticket}
            className="p-4 border-2 border-white rounded shadow-md text-black"
            style={{ backgroundColor: bgColor }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-sm">{formatTicket(ticket)}</span>
              <span className="text-sm font-bold">
                {t("ticketBoostValue", { value: (boost * 100).toFixed(1) })}
              </span>
            </div>

            <div className="relative pt-1">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-300">
                <div
                  style={{ width: `${boost * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-black bg-opacity-30"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}