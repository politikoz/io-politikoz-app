"use client";

import { useTranslations } from "next-intl";
import React, { useState, useEffect } from "react";
import { useWaveData } from "@/hooks/useWaveData";
import WaveDetailsModal from "./WaveDetailsModal";
import { Wave } from "@/types/WaveData";

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
  const { data: waves = [] } = useWaveData();

  const [countdown, setCountdown] = useState<string>("");
  const [selectedWave, setSelectedWave] = useState<Wave | null>(null);

  const nextWaveIndex = waves.findIndex((wave) => wave.nextWave);
  const nextWave = waves[nextWaveIndex] || null;
  const isElectionEnded = waves.length > 0 && !waves.some(wave => wave.nextWave);

  const renderTurnCard = (turnType: string) => (
    <div className="relative w-20 h-24 md:w-24 md:h-28 p-2 border-2 border-purple-500 rounded-md flex flex-col items-center justify-center bg-purple-700 pixel-shadow">
      <span className="text-white text-xs font-bold text-center">
        {t(turnType)}
      </span>
      <div className="absolute w-full h-full top-0 left-0 border-2 border-black"></div>
    </div>
  );

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
        {/* First Turn Card */}
        {renderTurnCard("firstTurn")}

        {/* Wave Cards */}
        {waves.map((wave, index) => {
          const isNextWave = wave.nextWave;
          const isSecondTurnStart = wave.detail.electionWaveTurn === "SECOND_TURN" && 
                                  (index === 0 || waves[index - 1].detail.electionWaveTurn === "FIRST_TURN");

          // Insert Second Turn Card before the first wave of second turn
          if (isSecondTurnStart) {
            return (
              <React.Fragment key={`turn-${wave.waveNumber}`}>
                {renderTurnCard("secondTurn")}
                {/* Regular Wave Card */}
                <div
                  className={`relative w-20 h-24 md:w-24 md:h-28 p-2 border-2 ${getBorderColor(index, nextWaveIndex)} rounded-md flex flex-col items-center justify-center
                  ${isNextWave ? "bg-yellow-500 animate-pulse" : "bg-gray-700"} pixel-shadow cursor-pointer transition-transform duration-200 hover:scale-105`}
                  onClick={() => setSelectedWave(wave)}
                >
                  <span className="text-white text-sm font-bold">
                    {t("waveLabel", { number: wave.waveNumber })}
                  </span>

                  {isNextWave ? (
                    <div className="text-black text-xs font-bold bg-yellow-300 p-1 rounded-md mt-1">
                      {countdown}
                    </div>
                  ) : (
                    <span className="text-white text-xs mt-1">
                      {new Date(wave.date).toLocaleDateString()}
                    </span>
                  )}

                  <div className="absolute w-full h-full top-0 left-0 border-2 border-black"></div>
                </div>
              </React.Fragment>
            );
          }

          return (
            // Regular Wave Card (Same as before)
            <div
              key={wave.waveNumber}
              className={`relative w-20 h-24 md:w-24 md:h-28 p-2 border-2 ${getBorderColor(index, nextWaveIndex)} rounded-md flex flex-col items-center justify-center
              ${isNextWave ? "bg-yellow-500 animate-pulse" : "bg-gray-700"} pixel-shadow cursor-pointer transition-transform duration-200 hover:scale-105`}
              onClick={() => setSelectedWave(wave)}
            >
              <span className="text-white text-sm font-bold">
                {t("waveLabel", { number: wave.waveNumber })}
              </span>

              {isNextWave ? (
                <div className="text-black text-xs font-bold bg-yellow-300 p-1 rounded-md mt-1">
                  {countdown}
                </div>
              ) : (
                <span className="text-white text-xs mt-1">
                  {new Date(wave.date).toLocaleDateString()}
                </span>
              )}

              <div className="absolute w-full h-full top-0 left-0 border-2 border-black"></div>
            </div>
          );
        })}

        {/* End of Election Card */}
        {isElectionEnded && renderTurnCard("electionEnd")}
      </div>

      {selectedWave && (
        <WaveDetailsModal
          wave={selectedWave}
          onClose={() => setSelectedWave(null)}
        />
      )}
    </div>
  );
}

// Helper function for border colors
const getBorderColor = (index: number, nextWaveIndex: number) => {
  if (index < nextWaveIndex) return "border-green-500";
  if (index === nextWaveIndex) return "border-yellow-400";
  if (index > nextWaveIndex) return "border-blue-500";
  return "border-gray-500";
};
