"use client";

import React from "react";
import TicketCard from "./TicketCard";
import { useTranslations } from "next-intl";
import { TicketValue } from "@/types/TicketPolicy";

interface TicketPolicySummaryProps {
  ticketValues: TicketValue[];
  rebalanceEpoch: number;
}

export default function TicketPolicySummary({ ticketValues, rebalanceEpoch }: TicketPolicySummaryProps) {
  const t = useTranslations("TicketPolicy");

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-300">
        {t("policyExplanation")}
        <span className="text-green-300 font-semibold"> Corrupt → Lobbyist → Briber → Launderer</span>.
        {t("policyRollover")}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {ticketValues.map(({ role, value }) => (
          <TicketCard key={role} ticket={role} amount={value} />
        ))}
      </div>

      <div className="text-sm text-yellow-300 font-semibold">
        {t("nextRebalance")}: <span className="text-white">{rebalanceEpoch}</span>
      </div>
    </div>
  );
}
