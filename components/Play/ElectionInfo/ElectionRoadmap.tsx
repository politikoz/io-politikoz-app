"use client";

import { useTranslations } from "next-intl";
import React, { useState, useEffect } from "react";
import { wavesData } from "./wavesData";
import WaveDetailsModal from "./WaveDetailsModal";

interface Wave {
  waveNumber: number;
  date: string;
  details: string;
  nextWave: boolean;
}

const getCountdown = (date: string) => {
  const targetDate = new Date(date).getTime();
  const now = new Date().getTime();
  const diff = targetDate - now;

  if (diff <= 0) return "00:00:00";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export default function ElectionRoadmap() {
  const t = useTranslations("ElectionInfo");

  const [countdown, setCountdown] = useState<string>("");
  const [selectedWave, setSelectedWave] = useState<Wave | null>(null);

  const nextWaveIndex = wavesData.findIndex((wave) => wave.nextWave);
  const nextWave = wavesData[nextWaveIndex] || null;

  useEffect(() => {
    if (nextWave) {
      const interval = setInterval(() => {
        setCountdown(getCountdown(nextWave.date));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [nextWave]);

  return (
    <div className="w-full flex flex-col items-center p-4 bg-gray-900">
      <h2 className="text-sm font-bold text-center text-yellow-400 mb-4">{t("roadmapTitle")}</h2>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {wavesData.map((wave, index) => {
          const isNextWave = wave.nextWave;

          let borderColor = "border-gray-500";
          if (index < nextWaveIndex) borderColor = "border-green-500";
          if (index === nextWaveIndex) borderColor = "border-yellow-400";
          if (index > nextWaveIndex) borderColor = "border-blue-500";

          return (
            <div
              key={wave.waveNumber}
              className={`relative w-20 h-24 md:w-24 md:h-28 p-2 border-2 ${borderColor} rounded-md flex flex-col items-center justify-center
              ${isNextWave ? "bg-yellow-500 animate-pulse" : "bg-gray-700"} pixel-shadow cursor-pointer transition-transform duration-200 hover:scale-105`}
              onClick={() => setSelectedWave(wave)}
            >
              <span className="text-white text-sm font-bold">{t("waveLabel", { number: wave.waveNumber })}</span>

              {isNextWave ? (
                <div className="text-black text-xs font-bold bg-yellow-300 p-1 rounded-md mt-1">
                  {countdown}
                </div>
              ) : (
                <span className="text-white text-xs mt-1">{new Date(wave.date).toLocaleDateString()}</span>
              )}

              <div className="absolute w-full h-full top-0 left-0 border-2 border-black"></div>
            </div>
          );
        })}
      </div>

      {selectedWave && (
        <WaveDetailsModal
          waveNumber={selectedWave.waveNumber}
          date={selectedWave.date}
          details={selectedWave.details}
          onClose={() => setSelectedWave(null)}
        />
      )}
    </div>
  );
}
