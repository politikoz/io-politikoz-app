"use client";

import { useTranslations } from "next-intl";
import React from "react";

interface Props {
  percentage: number;
  treasuryBalance: number;
}

export default function ElectionPotShareRules({ percentage, treasuryBalance }: Props) {
  const t = useTranslations("GovernanceSettings");
  const electionCostADA = (percentage * treasuryBalance).toFixed(2);

  return (
    <div className="w-full bg-gray-800 p-4 border border-yellow-400 rounded shadow mb-6">
      <h3 className="text-lg font-bold text-yellow-300 mb-3">{t("potShareTitle")}</h3>

      <div className="relative w-full h-4 bg-gray-600 rounded-full mb-2">
        <div
          className="absolute top-0 left-0 h-4 bg-yellow-400 rounded-full"
          style={{ width: `${percentage * 100}%` }}
        />
        <span className="absolute top-[-20px] right-0 text-xs text-white font-bold">
          {(percentage * 100).toFixed(2)}%
        </span>
      </div>

      <p className="text-sm text-white">
        {t("potShareDescription")}
      </p>

      <div className="mt-3 space-y-2 text-sm text-white">
        <p>
          <span className="font-bold text-yellow-300">{t("potShareTotal")}</span> {electionCostADA} ADA
        </p>
        <p>
          <span className="font-bold text-yellow-300">{t("potShareTreasury")}</span> {treasuryBalance} ADA
        </p>
      </div>
    </div>
  );
}
