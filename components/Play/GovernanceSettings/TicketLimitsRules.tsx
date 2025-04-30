"use client";

import { useTranslations } from "next-intl";
import React from "react";

interface TicketLimitsRulesProps {
  data: Record<string, { min: number; max: number; current: number }>;
  rebalanceEpoch: number;
}

const ticketColors: Record<string, string> = {
  CORRUPT: "#6EAA5E",
  LOBBYIST: "#977BD0",
  BRIBER: "#88CEFA",
  LAUNDERER: "#FFFBCC",
  FRONTMAN: "#C0C0C0"
};

const formatTicket = (ticket: string) => {
  return ticket.charAt(0).toUpperCase() + ticket.slice(1).toLowerCase();
};

export default function TicketLimitsRules({ data, rebalanceEpoch }: TicketLimitsRulesProps) {
  const t = useTranslations("GovernanceSettings");

  // Ordena os tickets conforme a ordem definida em ticketColors
  const orderedTickets = Object.keys(ticketColors).map(ticket => ({
    ticket,
    limits: data[ticket] || { min: 0, max: 0, current: 0 },
    bgColor: ticketColors[ticket]
  }));

  return (
    <div className="w-full">
      <h3 className="text-lg font-bold text-yellow-300 mb-1">{t("ticketLimitsTitle")}</h3>
      <p className="text-sm text-gray-300 mb-2">{t("ticketLimitsDescription")}</p>
      <p className="text-sm text-yellow-300 mb-4 font-bold">
        {t("ticketLimitsNextRebalance", { epoch: rebalanceEpoch })}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {orderedTickets.map(({ ticket, limits, bgColor }) => (
          <div
            key={ticket}
            className="p-4 border-2 border-white rounded shadow-md text-black"
            style={{ backgroundColor: bgColor }}
          >
            <div className="font-bold text-sm mb-2">{formatTicket(ticket)}</div>

            <div className="text-xs font-bold mb-1">
              {t("ticketLimitsMin", { amount: limits.min })}
            </div>
            <input
              type="range"
              min={0}
              max={200000}
              value={limits.min}
              readOnly
              className="w-full mb-3"
            />

            <div className="text-xs font-bold mb-1">
              {t("ticketLimitsMax", { amount: limits.max })}
            </div>
            <input
              type="range"
              min={0}
              max={200000}
              value={limits.max}
              readOnly
              className="w-full mb-3"
            />

            <div className="text-xs font-bold">
              {t("ticketLimitsCurrent", { amount: limits.current })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
