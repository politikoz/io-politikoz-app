"use client";

import { useTranslations } from "next-intl";
import React from "react";

interface ElectionWaveSettingsProps {
  waves: Record<string, Record<string, number>>;
}

export default function ElectionWaveSettings({ waves }: ElectionWaveSettingsProps) {
  const t = useTranslations("GovernanceSettings");

  return (
    <div className="w-full">
      <h3 className="text-lg font-bold text-yellow-300 mb-1">{t("waveSettingsTitle")}</h3>
      <p className="text-sm text-gray-300 mb-4">
        {t("waveSettingsDescription")}
      </p>

      <div className="space-y-4">
        {Object.entries(waves).map(([wave, data]) => (
          <div
            key={wave}
            className="border-2 border-white rounded-md bg-gray-800 p-4 shadow-md"
          >
            <h4 className="text-yellow-400 font-bold text-sm mb-2 underline">{wave}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {Object.entries(data).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b border-gray-700 py-1">
                  <span className="text-gray-300">{t(key)}</span>
                  <span className="text-yellow-400 font-mono">{value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
