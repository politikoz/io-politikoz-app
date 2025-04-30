"use client";

import { useTranslations } from "next-intl";
import React from "react";

interface ElectionDistributionRulesProps {
  data: Record<string, number>;
  totalAdaPerElection: number;
}

const roleColors: Record<string, string> = {
  PRESIDENT: "#6EAA5E",
  SENATOR: "#977BD0",
  MINISTER: "#88CEFA",
  GOVERNOR: "#FFFBCC",
  FEDERAL_DEPUTY: "#FF8281",
  STATE_DEPUTY: "#FFD991",
  MAYOR: "#DEB0F7",
  COUNCILOR: "#C0C0C0",
  CORRUPT: "#6EAA5E",
  LOBBYIST: "#977BD0",
  BRIBER: "#88CEFA",
  LAUNDERER: "#FFFBCC",
  FRONTMAN: "#C0C0C0"
};

const readableLabels: Record<string, string> = {
  PRESIDENT: "President",
  SENATOR: "Senator",
  MINISTER: "Minister",
  GOVERNOR: "Governor",
  FEDERAL_DEPUTY: "Federal Deputy",
  STATE_DEPUTY: "State Deputy",
  MAYOR: "Mayor",
  COUNCILOR: "Councilor",
  CORRUPT: "Corrupt",
  LOBBYIST: "Lobbyist",
  BRIBER: "Briber",
  LAUNDERER: "Launderer",
  FRONTMAN: "Frontman"
};

export default function ElectionDistributionRules({ data, totalAdaPerElection }: ElectionDistributionRulesProps) {
  const t = useTranslations("GovernanceSettings");

  // Ordena os roles conforme a ordem definida em roleColors
  const orderedRoles = Object.keys(roleColors).map(role => ({
    role,
    percentage: data[role] || 0,
    label: readableLabels[role] || role,
    bgColor: roleColors[role]
  }));

  return (
    <div className="w-full">
      <h3 className="text-lg font-bold text-yellow-300 mb-1">{t("electionPotTitle")}</h3>
      <p className="text-sm text-gray-300 mb-4">
        {t("electionPotDescription")}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {orderedRoles.map(({ role, percentage, label, bgColor }) => {
          const adaAmount = ((percentage / 100) * totalAdaPerElection).toFixed(2);

          return (
            <div
              key={role}
              className="p-4 border-2 border-white rounded shadow-md text-black"
              style={{ backgroundColor: bgColor }}
            >
              <div className="font-bold text-sm mb-1">{label}</div>

              <input
                type="range"
                min={0}
                max={100}
                value={percentage}
                readOnly
                className="w-full my-2"
              />

              <div className="text-xs flex justify-between font-bold">
                <span>{percentage}%</span>
                <span>{adaAmount} ADA</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
