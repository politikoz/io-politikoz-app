"use client";

import { useTranslations } from "next-intl";
import React from "react";

interface PolitikozElectedRulesProps {
  data: Record<string, number>;
  distribution: Record<string, number>;
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
  COUNCILOR: "#C0C0C0"
};

const formatRole = (role: string) => {
  return role.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

export default function PolitikozElectedRules({
  data,
  distribution,
  totalAdaPerElection,
}: PolitikozElectedRulesProps) {
  const t = useTranslations("GovernanceSettings");

  // Ordena os roles conforme a ordem definida em roleColors
  const orderedRoles = Object.keys(roleColors).map(role => ({
    role,
    electedQty: data[role] || 0,
    roleDistribution: distribution[role] || 0,
    bgColor: roleColors[role]
  }));

  return (
    <div className="w-full">
      <h3 className="text-lg font-bold text-yellow-300 mb-1">{t("politikozTitle")}</h3>
      <p className="text-sm text-gray-300 mb-4">{t("politikozDescription")}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {orderedRoles.map(({ role, electedQty, roleDistribution, bgColor }) => {
          const totalAdaForRole = (roleDistribution / 100) * totalAdaPerElection;
          const adaPerElected = electedQty > 0 ? (totalAdaForRole / electedQty).toFixed(2) : "0.00";

          return (
            <div
              key={role}
              className="p-4 border-2 border-white rounded shadow-md text-black"
              style={{ backgroundColor: bgColor }}
            >
              <div className="font-bold text-sm mb-2">{formatRole(role)}</div>

              <input
                type="range"
                min={1}
                max={10}
                value={electedQty}
                readOnly
                className="w-full mb-2"
              />

              <div className="text-xs font-bold mb-1">
                {t("electedLabel", { count: electedQty })}
              </div>
              <div className="text-xs font-bold">
                {t("perElectedLabel", { amount: adaPerElected })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
