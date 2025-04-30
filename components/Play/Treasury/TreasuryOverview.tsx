"use client";

import React from "react";
import { useTranslations } from "next-intl";

interface TreasuryOverviewProps {
  adaAmount: number;
  usdAmount: number;
}

export default function TreasuryOverview({ adaAmount, usdAmount }: TreasuryOverviewProps) {
  const t = useTranslations("Treasury");

  return (
    <div className="bg-gray-900 border-4 border-yellow-500 p-6 rounded-lg shadow-lg text-white w-full">
      <h3 className="text-lg font-bold text-yellow-300 mb-2">{t("overviewTitle")}</h3>
      <p className="text-sm text-gray-300 mb-4">{t("overviewDescription")}</p>

      <div className="text-center space-y-2">
        <a
          href="https://pool.pm/$electionpot"
          target="_blank"
          rel="noopener noreferrer"
          className="text-3xl font-bold text-green-400 underline hover:text-green-300 transition block"
        >
          {adaAmount.toLocaleString()} ADA
        </a>
        <p className="text-xl text-gray-400">
          ${usdAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
        </p>
      </div>
    </div>
  );
}
