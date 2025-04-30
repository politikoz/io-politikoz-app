"use client";

import React from "react";
import TicketPolicySummary from "./TicketPolicySummary";
import TicketPolicyExample from "./TicketPolicyExample";
import TicketCalculator from "./TicketCalculator";
import { useTranslations } from "next-intl";
import { useTicketPolicy } from "@/hooks/useTicketPolicy";
import { TicketValue, INITIAL_TICKET_POLICY } from "@/types/TicketPolicy";

export interface TicketPolicySummaryProps {
  ticketValues: TicketValue[];
  nextRebalanceEpoch: number;
}

export default function TicketPolicyView() {
  const { data: policyData, error } = useTicketPolicy();
  const t = useTranslations("TicketPolicy");

  if (error) return <p className="text-red-500">{t("error")}</p>;

  const currentPolicy = policyData || INITIAL_TICKET_POLICY;

  return (
    <div className="w-full bg-gray-900 border-4 border-yellow-500 p-6 rounded-lg shadow-lg text-white space-y-6">
      <h3 className="text-xl font-bold text-yellow-300">{t("titlePolicyView")}</h3>

      <TicketPolicySummary
        ticketValues={currentPolicy.ticketValues}
        rebalanceEpoch={currentPolicy.nextRebalanceEpoch}
      />

      <TicketPolicyExample />

      <TicketCalculator 
        policyData={currentPolicy}
      />
    </div>
  );
}
