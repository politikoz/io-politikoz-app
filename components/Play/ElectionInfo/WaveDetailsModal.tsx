"use client";

import { useTranslations } from "next-intl";
import React from "react";
import { Wave } from "@/types/WaveData";

interface WaveDetailsModalProps {
  wave: Wave;
  onClose: () => void;
}

export default function WaveDetailsModal({ wave, onClose }: WaveDetailsModalProps) {
  const t = useTranslations("ElectionInfo");

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg w-[480px] pixel-shadow">
        <h3 className="text-lg font-bold text-yellow-400">
          {t("modalTitle", { number: wave.waveNumber })}
        </h3>
        
        <div className="mt-4 space-y-2 text-sm">
          <p>{t("modalDate")}: {new Date(wave.date).toLocaleString()}</p>
          <p>{t("modalExecutedAt")}: {new Date(wave.executedAt).toLocaleString()}</p>
          
          <div className="mt-4 pt-4 border-t border-gray-700">
            <h4 className="font-bold mb-2 text-blue-300">{t("modalDetails")}</h4>
            <div className="grid grid-cols-2 gap-2">
              <p>{t("modalEpoch")}: {wave.detail.blockEpoch}</p>
              <p>{t("modalHeight")}: {wave.detail.blockHeight}</p>
              <p>{t("modalStaminaDecrease")}: {wave.detail.decreaseInStamina}</p>
              <p>{t("modalMinStamina")}: {wave.detail.minimumStamina}</p>
              <p>{t("modalDrawPrecision")}: {wave.detail.numberDrawnPrecision}</p>
              <p>{t("modalFeePrecision")}: {wave.detail.numberFeePrecision}</p>
              <p>{t("modalNumbersToDraw")}: {wave.detail.numbersToBeDraw}</p>
              <p>{t("modalBonus")}: {wave.detail.percentBonusTopRanking * 100}%</p>
              <p>{t("modalBaseVote")}: {wave.detail.baseVote}</p>
              <p>{t("modalBlockFee")}: {wave.detail.blockFee}</p>
              <p>{t("modalBlockOutput")}: {wave.detail.blockOutput}</p>
              <p>{t("modalTurn")}: {wave.detail.electionWaveTurn}</p>
            </div>
          </div>
        </div>

        <button
          className="mt-6 bg-red-600 px-4 py-2 rounded-md text-sm text-white hover:bg-red-700 transition"
          onClick={onClose}
        >
          {t("modalClose")}
        </button>
      </div>
    </div>
  );
}
