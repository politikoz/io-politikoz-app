"use client";

import React from "react";
import { useTranslations } from "next-intl";

interface ClaimSummary {
  amount: number;
  fee: number;
  destination: string;
}

export default function ClaimModal({
  isOpen,
  onClose,
  summary
}: {
  isOpen: boolean;
  onClose: () => void;
  summary: ClaimSummary;
}) {
  const t = useTranslations("ClaimKoz");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-4 border-yellow-500 rounded-lg p-6 max-w-md w-full text-white">
        <h4 className="text-lg font-bold text-yellow-300 mb-4">{t("claimSummary")}</h4>

        <div className="text-sm space-y-2">
          <p><strong>{t("totalClaim")}:</strong> <span className="text-green-300 font-bold">{summary.amount} KOZ</span></p>
          <p><strong>{t("fee")}:</strong> <span className="text-red-300 font-bold">{summary.fee} KOZ</span></p>
          <p><strong>{t("destination")}:</strong><br />
            <span className="text-blue-400 break-all">{summary.destination}</span>
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-gray-700 text-white px-4 py-2 rounded border border-white hover:bg-gray-600"
          >
            {t("cancel")}
          </button>
          <button
            onClick={() => {}}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded border border-white"
          >
            {t("confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
