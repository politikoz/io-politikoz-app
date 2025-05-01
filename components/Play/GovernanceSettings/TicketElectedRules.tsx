"use client";

import { useTranslations } from "next-intl";
import React from "react";

interface TicketElectedRulesProps {
  data: Record<string, number>;
  distribution: Record<string, number>;
  totalAdaPerElection: number;
}

const ticketColors: Record<string, string> = {
  FRONTMAN: "#C0C0C0",
  CORRUPT: "#6EAA5E",
  LOBBYIST: "#977BD0",
  BRIBER: "#88CEFA",
  LAUNDERER: "#FFFBCC",  
};

const formatTicket = (ticket: string) => {
  return ticket.charAt(0).toUpperCase() + ticket.slice(1).toLowerCase();
};

export default function TicketElectedRules({
  data,
  distribution,
  totalAdaPerElection,
}: TicketElectedRulesProps) {
  const t = useTranslations("GovernanceSettings");

  // Ordena os tickets conforme a ordem definida em ticketColors
  const orderedTickets = Object.keys(ticketColors).map(ticket => ({
    ticket,
    count: data[ticket] || 0,
    percentage: distribution[ticket] || 0,
    bgColor: ticketColors[ticket]
  }));

  return (
    <div className="w-full">
      <h3 className="text-lg font-bold text-yellow-300 mb-1">{t("ticketTitle")}</h3>
      <p className="text-sm text-gray-300 mb-4">{t("ticketDescription")}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {orderedTickets.map(({ ticket, count, percentage, bgColor }) => {
          const totalAdaForTicket = (percentage / 100) * totalAdaPerElection;
          const adaPerTicket = count > 0 ? (totalAdaForTicket / count).toFixed(2) : "0.00";

          return (
            <div
              key={ticket}
              className="p-4 border-2 border-white rounded shadow-md text-black"
              style={{ backgroundColor: bgColor }}
            >
              <div className="font-bold text-sm mb-2">{formatTicket(ticket)}</div>

              <input
                type="range"
                min={1}
                max={10}
                value={count}
                readOnly
                className="w-full mb-2"
              />

              <div className="text-xs font-bold mb-1">
                {t("ticketElectedLabel", { count })}
              </div>
              <div className="text-xs font-bold">
                {t("ticketAdaLabel", { amount: adaPerTicket })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
