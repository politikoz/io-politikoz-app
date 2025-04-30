"use client";

import { useTranslations } from "next-intl";
import React from "react";

interface VotingPowerSummaryProps {
  total: number;
  used: number;
}

export default function VotingPowerSummary({ total, used }: VotingPowerSummaryProps) {
  const t = useTranslations("GovernanceSettings");
  const remaining = total - used;
  const usedPercent = ((used / total) * 100).toFixed(1);
  const remainingPercent = ((remaining / total) * 100).toFixed(1);

  return (
    <div className="w-full bg-gray-800 border-2 border-white rounded-md shadow-md p-4 text-white mb-4">
      <h3 className="text-lg font-bold text-yellow-300 mb-1">{t("votingPowerTitle")}</h3>
      <p className="text-sm text-gray-300 mb-3">
        {t("votingPowerDescription")}
      </p>

      <div className="relative w-full h-4 bg-gray-600 rounded overflow-hidden mb-3">
        <div
          className="absolute top-0 left-0 h-full bg-green-500"
          style={{ width: `${(used / total) * 100}%` }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 text-sm gap-2">
        <div className="flex flex-col items-start sm:items-center">
          <span className="text-gray-400">{t("votingPowerTotal")}</span>
          <span className="font-bold">{total}</span>
        </div>
        <div className="flex flex-col items-start sm:items-center">
          <span className="text-gray-400">{t("votingPowerUsed")}</span>
          <span className="text-green-300 font-bold">
            {t("votingPowerUsedFormatted", { used, percent: usedPercent })}
          </span>
        </div>
        <div className="flex flex-col items-start sm:items-center">
          <span className="text-gray-400">{t("votingPowerRemaining")}</span>
          <span className="text-yellow-300 font-bold">
            {t("votingPowerRemainingFormatted", { remaining, percent: remainingPercent })}
          </span>
        </div>
      </div>
    </div>
  );
}
