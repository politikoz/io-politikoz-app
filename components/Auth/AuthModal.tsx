"use client";

import { useTranslations } from "next-intl";

export default function AuthModal() {
  const t = useTranslations("AuthModal");

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-[#2A2A2A] border-2 border-white p-6 rounded-lg max-w-md mx-4 shadow-xl">
        <h2 className="text-white font-['Press_Start_2P'] text-lg mb-4">
          {t("title")}
        </h2>
        
        <div className="space-y-4 text-white font-['Press_Start_2P'] text-sm">
          <p>{t("description")}</p>
          <p className="text-yellow-300 mt-4 text-xs">
            {t("walletPrompt")}
          </p>
          <p className="text-gray-400 text-xs italic mt-6">
            {t("sessionInfo")}
          </p>
        </div>
      </div>
    </div>
  );
}