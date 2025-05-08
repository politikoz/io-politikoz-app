import { useTranslations } from "next-intl";
import React from "react";

interface CollateralInfoModalProps {
  onClose: () => void;
}

export default function CollateralInfoModal({ onClose }: CollateralInfoModalProps) {
  const t = useTranslations("Stake.collateralModal");

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg w-96 pixel-shadow">
        <h3 className="text-lg font-bold text-blue-300 mb-4">{t("title")}</h3>
        
        <div className="space-y-4 text-sm">
          <p>{t("description")}</p>
          
          <p>{t("explanation")}</p>

          <p className="text-blue-300 font-semibold">
            {t("walletInfo")}
          </p>
        </div>

        <button
          className="mt-6 bg-blue-600 px-4 py-2 rounded-md text-sm text-white hover:bg-blue-700 transition"
          onClick={onClose}
        >
          {t("closeButton")}
        </button>
      </div>
    </div>
  );
}