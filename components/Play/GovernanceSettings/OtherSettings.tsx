"use client";

import { useTranslations } from "next-intl";
import React from "react";

interface OtherSettingsProps {
  epochs: number;
  bestDay: string;
  luckPrecision: number;
  jailPrecision: number;
  bail: number;
}

const weekDays = [
  "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY",
  "THURSDAY", "FRIDAY", "SATURDAY"
];

export default function OtherSettings({
  epochs,
  bestDay,
  luckPrecision,
  jailPrecision,
  bail
}: OtherSettingsProps) {
  const t = useTranslations("GovernanceSettings");

  return (
    <div className="w-full">
      <h3 className="text-lg font-bold text-yellow-300 mb-1">{t("otherSettingsTitle")}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div className="p-4 border-2 border-white rounded shadow-md bg-gray-800 text-white">
          <div className="font-bold text-sm mb-2">{t("intervalTitle")}</div>
          <p className="text-xs text-gray-400 mb-1">{t("intervalDescription")}</p>
          <input
            type="range"
            min={1}
            max={10}
            value={epochs}
            readOnly
            className="w-full mb-2"
          />
          <div className="text-xs text-gray-300">{t("intervalEvery", { epochs })}</div>
        </div>

        <div className="p-4 border-2 border-white rounded shadow-md bg-gray-800 text-white">
          <div className="font-bold text-sm mb-2">{t("luckTitle")}</div>
          <p className="text-xs text-gray-400 mb-1">{t("luckDescription")}</p>
          <input
            type="range"
            min={1}
            max={6}
            value={luckPrecision}
            readOnly
            className="w-full mb-2"
          />
          <div className="text-xs text-gray-300">{t("luckDigits", { count: luckPrecision })}</div>
        </div>

        <div className="p-4 border-2 border-white rounded shadow-md bg-gray-800 text-white">
          <div className="font-bold text-sm mb-2">{t("jailTitle")}</div>
          <p className="text-xs text-gray-400 mb-1">{t("jailDescription")}</p>
          <input
            type="range"
            min={0}
            max={100}
            value={jailPrecision}
            readOnly
            className="w-full mb-2"
          />
          <div className="text-xs text-gray-300">{t("jailChance", { percent: jailPrecision })}</div>
        </div>

        <div className="p-4 border-2 border-white rounded shadow-md bg-gray-800 text-white">
          <div className="font-bold text-sm mb-2">{t("bailTitle")}</div>
          <p className="text-xs text-gray-400 mb-1">{t("bailDescription")}</p>
          <input
            type="range"
            min={0}
            max={1000}
            value={bail}
            readOnly
            className="w-full mb-2"
          />
          <div className="text-xs text-gray-300">{t("bailValue", { amount: bail })}</div>
        </div>

        <div className="p-4 border-2 border-white rounded shadow-md bg-gray-800 text-white">
          <div className="font-bold text-sm mb-2">{t("bestDayTitle")}</div>
          <p className="text-xs text-gray-400 mb-1">{t("bestDayDescription")}</p>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className={`text-xs text-center py-1 px-2 border-2 rounded ${
                  day === bestDay
                    ? "border-yellow-300 bg-yellow-300 text-black font-bold"
                    : "border-white text-white"
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>        

      </div>
    </div>
  );
}
