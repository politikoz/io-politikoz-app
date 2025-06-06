"use client";

import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { useWaveData } from "@/hooks/useWaveData";
import { Wave } from "@/types/WaveData";
import WaveDetailsModal from "./WaveDetailsModal";

export default function WaveDrawResults() {
  const t = useTranslations("ElectionInfo");
  const { data: waves = [] } = useWaveData();
  const [selectedWave, setSelectedWave] = useState<Wave | null>(null);

  const completedWaves = waves
    .filter((wave) => wave.drawNumbers && wave.drawNumbers.length > 0)
    .sort((a, b) => b.waveNumber - a.waveNumber);

  const firstTurnWaves = completedWaves
    .filter(wave => wave.detail.electionWaveTurn === 'FIRST_TURN')
    .sort((a, b) => b.waveNumber - a.waveNumber);

  const secondTurnWaves = completedWaves
    .filter(wave => wave.detail.electionWaveTurn === 'SECOND_TURN')
    .sort((a, b) => b.waveNumber - a.waveNumber);

  const WaveSeparator = ({ label }: { label: string }) => (
    <div className="w-full flex items-center gap-4 my-6">
      <div className="flex-1 h-0.5 bg-gray-700"></div>
      <span className="text-gray-400 font-bold px-4">{label}</span>
      <div className="flex-1 h-0.5 bg-gray-700"></div>
    </div>
  );

  const WaveItem = ({ wave }: { wave: Wave }) => (
    <div 
      key={wave.waveNumber} 
      className="flex flex-col items-center mb-4 cursor-pointer hover:opacity-80"
      onClick={() => setSelectedWave(wave)}
    >
      <h3 className="text-white font-bold text-md mb-2">
        {t("waveLabel", { number: wave.waveNumber })}
      </h3>

      <div className="flex gap-2">
        {wave.drawNumbers.map((num, index) => (
          <div
            key={index}
            className="flex items-center justify-center rounded-full border-4 border-white bg-gray-700"
            style={{
              fontFamily: "'Press Start 2P'",
              imageRendering: "pixelated",
              width: "60px",
              height: "60px",
              minWidth: "60px",
              minHeight: "60px",
              padding: "6px"
            }}
          >
            <span className="text-yellow-300 text-md font-bold text-center leading-none flex-shrink-0">
              {num}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center p-4 bg-gray-900">
      <h2 className="text-lg font-bold text-center text-yellow-400 mb-6">{t("drawTitle")}</h2>

      {completedWaves.length > 0 ? (
        <>
          {secondTurnWaves.length > 0 && (
            <>
              <WaveSeparator label={t("secondTurn")} />
              {secondTurnWaves.map(wave => (
                <WaveItem key={wave.waveNumber} wave={wave} />
              ))}
            </>
          )}
          
          {firstTurnWaves.length > 0 && (
            <>
              {secondTurnWaves.length > 0 && <WaveSeparator label={t("firstTurn")} />}
              {firstTurnWaves.map(wave => (
                <WaveItem key={wave.waveNumber} wave={wave} />
              ))}
            </>
          )}
        </>
      ) : (
        <div className="text-gray-400 text-sm italic">
          {t("noDrawsYet")}
        </div>
      )}

      {selectedWave && (
        <WaveDetailsModal
          wave={selectedWave}
          onClose={() => setSelectedWave(null)}
        />
      )}
    </div>
  );
}
