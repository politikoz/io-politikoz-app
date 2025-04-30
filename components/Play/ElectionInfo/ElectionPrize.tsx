"use client";

import { useTranslations } from "next-intl";
import React from "react";
import { useGovernanceData } from "@/hooks/useGovernanceData";
import { INITIAL_GOVERNANCE_DATA } from "@/types/GovernanceData";
import { formatTokenAmount } from "@/utils/formatters";

const formatRole = (role: string) => {
  return role.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

const POLITIKOZ_ORDER = {
  'President': 1,
  'Senator': 2,
  'Minister': 3,
  'Governor': 4,
  'Federal Deputy': 5,
  'State Deputy': 6,
  'Mayor': 7,
  'Councilor': 8
};

const TICKETS_ORDER = {
  'Frontman': 1,
  'Corrupt': 2,
  'Lobbyist': 3,
  'Briber': 4,
  'Launderer': 5
};

const sortByOrder = (a: { role: string }, b: { role: string }, orderMap: Record<string, number>) => {
  return (orderMap[a.role] || 999) - (orderMap[b.role] || 999);
};

export default function ElectionPrize() {
  const t = useTranslations("ElectionInfo");
  const { data = INITIAL_GOVERNANCE_DATA } = useGovernanceData();

  // Calculate total prizes and shares
  const totalAdaPerElection = data.potShare.totalAdaPerElection;
  
  const politikozPrizes = Object.entries(data.politikozElected)
    .filter(([_, count]) => count > 0)
    .map(([role, count]) => {
      const roleShare = data.distribution[role];
      const totalRoleAda = (totalAdaPerElection * roleShare) / 100;
      const unitPrize = count > 0 ? totalRoleAda / count : 0;

      return {
        role: formatRole(role),
        count,
        unitPrize,
        totalPrize: totalRoleAda
      };
    });

  const ticketsPrizes = Object.entries(data.ticketElected)
    .filter(([_, count]) => count > 0)
    .map(([role, count]) => {
      const roleShare = data.distribution[role];
      const totalRoleAda = (totalAdaPerElection * roleShare) / 100;
      const unitPrize = count > 0 ? totalRoleAda / count : 0;

      return {
        role: formatRole(role),
        count,
        unitPrize,
        totalPrize: totalRoleAda
      };
    });

  // Calculate actual shares based on total prizes
  const totalPolitikozPrize = politikozPrizes.reduce((sum, p) => sum + p.totalPrize, 0);
  const totalTicketsPrize = ticketsPrizes.reduce((sum, t) => sum + t.totalPrize, 0);
  const politikozShare = Math.round((totalPolitikozPrize / totalAdaPerElection) * 100);
  const ticketsShare = Math.round((totalTicketsPrize / totalAdaPerElection) * 100);

  const sortedPolitikozPrizes = [...politikozPrizes].sort((a, b) => 
    sortByOrder(a, b, POLITIKOZ_ORDER)
  );

  const sortedTicketsPrizes = [...ticketsPrizes].sort((a, b) => 
    sortByOrder(a, b, TICKETS_ORDER)
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gray-900 border-4 border-white shadow-[6px_6px_0px_black]">
      <h2 className="text-xl font-bold text-center text-yellow-400 mb-6">{t("prizeTitle")}</h2>

      <div className="text-center text-white font-['Press_Start_2P'] mb-6">
        <p className="text-xl">{t("totalPrize")}: <span className="text-green-400">₳{formatTokenAmount(totalAdaPerElection)}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Politikoz Section */}
        <div className="bg-gray-800/50 p-4 rounded-lg border-2 border-yellow-500">
          <div className="text-center mb-4">
            <h3 className="text-lg text-yellow-300 font-bold">{t("politikoz")}</h3>
            <p className="text-green-400 font-bold text-xl">₳{formatTokenAmount(totalPolitikozPrize)}</p>
            <p className="text-gray-400 text-sm">({politikozShare}% of total)</p>
          </div>
          
          <div className="space-y-3">
            {sortedPolitikozPrizes.map((p, index) => (
              <div key={index} className="bg-gray-900/50 p-3 rounded border border-gray-700">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-yellow-200 font-semibold">{p.role}</span>
                  <span className="text-white bg-green-800 px-2 py-0.5 rounded-full text-xs">
                    {p.count} {t("elected")}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">{t("prizePerWinner")}</span>
                  <span className="text-green-400 font-mono">₳{formatTokenAmount(p.unitPrize)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">{t("totalForRole")}</span>
                  <span className="text-green-400 font-mono">₳{formatTokenAmount(p.totalPrize)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tickets Section */}
        <div className="bg-gray-800/50 p-4 rounded-lg border-2 border-blue-500">
          <div className="text-center mb-4">
            <h3 className="text-lg text-blue-300 font-bold">{t("tickets")}</h3>
            <p className="text-blue-400 font-bold text-xl">₳{formatTokenAmount(totalTicketsPrize)}</p>
            <p className="text-gray-400 text-sm">({ticketsShare}% of total)</p>
          </div>
          
          <div className="space-y-3">
            {sortedTicketsPrizes.map((ticket, index) => (
              <div key={index} className="bg-gray-900/50 p-3 rounded border border-gray-700">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-blue-200 font-semibold">{ticket.role}</span>
                  <span className="text-white bg-blue-800 px-2 py-0.5 rounded-full text-xs">
                    {ticket.count} {ticket.count === 1 ? t("winner") : t("winners")}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">{t("prizePerWinner")}</span>
                  <span className="text-blue-400 font-mono">₳{formatTokenAmount(ticket.unitPrize)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">{t("totalForType")}</span>
                  <span className="text-blue-400 font-mono">₳{formatTokenAmount(ticket.totalPrize)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
