"use client";

import React, { useEffect, useState } from "react";
import TicketPolicySummary from "./TicketPolicySummary";
import TicketPolicyExample from "./TicketPolicyExample";
import TicketCalculator from "./TicketCalculator";
import { useTranslations } from "next-intl";
import { useTicketPolicy } from "@/hooks/useTicketPolicy";
import { TicketValue, INITIAL_TICKET_POLICY } from "@/types/TicketPolicy";
import { useTour } from "@/contexts/TourContext";
import TourManager from "@/components/Play/Tour/TourManager";

export interface TicketPolicySummaryProps {
  ticketValues: TicketValue[];
  nextRebalanceEpoch: number;
}

export default function TicketPolicyView() {
  const { data: policyData, error } = useTicketPolicy();
  const t = useTranslations("TicketPolicy");
  const { isTourActive, deactivateTour } = useTour();
  const [localTourActive, setLocalTourActive] = useState(false);

  useEffect(() => {
    if (isTourActive) setLocalTourActive(true);
  }, [isTourActive]);

  if (error) return <p className="text-red-500">{t("error")}</p>;

  const currentPolicy = policyData || INITIAL_TICKET_POLICY;

  return (
    <div className="w-full bg-gray-900 border-4 border-yellow-500 p-6 rounded-lg shadow-lg text-white space-y-6 relative">
      <h3 className="text-xl font-bold text-yellow-300">{t("titlePolicyView")}</h3>

      <TicketPolicySummary
        ticketValues={currentPolicy.ticketValues}
        rebalanceEpoch={currentPolicy.nextRebalanceEpoch}
      />

      <TicketPolicyExample />

      <TicketCalculator 
        policyData={currentPolicy}
      />

      {localTourActive && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-transparent pointer-events-auto"></div>
          <div className="absolute bottom-32 sm:bottom-40 left-4 sm:left-10 pointer-events-auto">
            <TourManager
              section="ticketPolicyView"
              onClose={() => {
                setLocalTourActive(false);
                deactivateTour();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
