"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";

const MAINTENANCE_POLITIKOZ = ["06690", "08301", "06691", "08342"];
const MESSAGE_KEYS = [
  "budgetReallocation",
  "coffeeCrisis",
  "secretMeeting",
  "budgetOptimization",
  "investigation",
] as const;

const RETRY_MESSAGES = [
  "bribeButton",
  "blackmailButton",
  "lobbyButton",
  "negotiateButton",
  "pleadButton",
] as const;

export default function MaintenancePage() {
  const t = useTranslations("Maintenance");
  const router = useRouter();
  const [isRetrying, setIsRetrying] = useState(false);
  const [messageKey, setMessageKey] = useState<typeof MESSAGE_KEYS[number]>(
    "budgetReallocation"
  );
  const [retryKey, setRetryKey] = useState<typeof RETRY_MESSAGES[number]>(
    "bribeButton"
  );

  useEffect(() => {
    const messageIndex = Math.floor(Math.random() * MESSAGE_KEYS.length);
    const retryIndex = Math.floor(Math.random() * RETRY_MESSAGES.length);

    setMessageKey(MESSAGE_KEYS[messageIndex]);
    setRetryKey(RETRY_MESSAGES[retryIndex]);
  }, []);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      router.replace("/");
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-['Press_Start_2P'] text-red-600 mb-8">
          {t(`messages.${messageKey}.title`)}
        </h1>
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          {t(`messages.${messageKey}.description`)}
        </p>
        <p className="text-sm text-gray-400 italic mb-8">{t("disclaimer")}</p>
        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className="border-4 border-white bg-green-600 px-6 py-3 text-white shadow-[6px_6px_0px_black] 
                   hover:bg-green-700 transition font-['Press_Start_2P'] text-sm
                   disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
        >
          {isRetrying ? t("retrying") : t(`retryButtons.${retryKey}`)}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl">
        {MAINTENANCE_POLITIKOZ.map((id) => (
          <div
            key={id}
            className="relative w-[90px] h-[120px] border-4 border-white bg-gray-600 shadow-[6px_6px_0px_black]"
          >
            <Image
              src={`/images/assets/${id}.png`}
              alt={`Politikoz #${id}`}
              width={90}
              height={120}
              className="w-full h-full object-cover"
              style={{ imageRendering: "pixelated" }}
              priority
            />
          </div>
        ))}
      </div>
    </div>
  );
}