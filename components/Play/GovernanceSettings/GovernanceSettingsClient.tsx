"use client";

import { useTranslations } from "next-intl";
import React from "react";
import VotingPowerSummary from "./VotingPowerSummary";
import PolitikozElectedRules from "./PolitikozElectedRules";
import TicketElectedRules from "./TicketElectedRules";
import TicketLimitsRules from "./TicketLimitsRules";
import ElectionPotShareRules from "./ElectionPotShareRules";
import ElectionDistributionRules from "./ElectionDistributionRules";
import OtherSettings from "./OtherSettings";
import ElectionWaveSettings from "./ElectionWaveSettings";
import { useGovernanceData } from "@/hooks/useGovernanceData";

export default function GovernanceSettingsClient() {
  const t = useTranslations("GovernanceSettings");
  const { data, error } = useGovernanceData();

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
    <div className="w-full max-w-4xl mx-auto bg-gray-900 text-white p-6 border-4 border-yellow-500 shadow-lg">
      <h2 className="text-xl font-bold text-yellow-300 mb-6">{t("title")}</h2>

      <VotingPowerSummary 
        total={data.votingPower.total} 
        used={data.votingPower.used} 
      />

      <div className="space-y-6 text-sm mt-6">
        <ElectionPotShareRules
          percentage={data.potShare.percentage}
          treasuryBalance={data.potShare.treasuryBalance}
        />

        <ElectionDistributionRules
          data={data.distribution}
          totalAdaPerElection={data.potShare.totalAdaPerElection}
        />

        <PolitikozElectedRules
          data={data.politikozElected}
          distribution={data.distribution}
          totalAdaPerElection={data.potShare.totalAdaPerElection}
        />

        <TicketElectedRules
          data={data.ticketElected}
          distribution={data.distribution}
          totalAdaPerElection={data.potShare.totalAdaPerElection}
        />

        <TicketLimitsRules
          data={data.ticketLimits}
          rebalanceEpoch={data.other.nextRebalanceEpoch}
        />

        <OtherSettings
          epochs={data.other.electionEveryXEpochs}
          bestDay={data.other.bestDayOfTheWeek}
          luckPrecision={data.other.luckNumberPrecision}
          jailPrecision={data.other.jailNumberPrecisionPercent}
          bail={data.other.bailPerEpochInKoz}
        />

        <ElectionWaveSettings waves={data.waves} />
      </div>
    </div>
  );
}