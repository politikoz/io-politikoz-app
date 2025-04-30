"use client";

import { useTranslations } from "next-intl";
import React from "react";

interface WaveDetailsModalProps {
  waveNumber: number;
  date: string;
  details: string;
  onClose: () => void;
}

export default function WaveDetailsModal({ waveNumber, date, details, onClose }: WaveDetailsModalProps) {
  const t = useTranslations("ElectionInfo");

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-800 text-white p-4 rounded-lg w-64 pixel-shadow">
        <h3 className="text-sm font-bold">{t("modalTitle", { number: waveNumber })}</h3>
        <p className="mt-2 text-xs">{t("modalDate")}: {new Date(date).toLocaleString()}</p>
        <p className="mt-2 text-xs">{details}</p>
        <button
          className="mt-3 bg-red-600 px-3 py-1 rounded-md text-xs text-white"
          onClick={onClose}
        >
          {t("modalClose")}
        </button>
      </div>
    </div>
  );
}
