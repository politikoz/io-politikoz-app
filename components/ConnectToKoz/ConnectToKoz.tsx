"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import ConnectToKozFooter from "./ConnectToKozFooter";
import DynamicConnectWalletList from "./DynamicConnectWalletList";

interface ConnectToKozProps {
  originPage?: string;
  originDisplay?: string;
}

export default function ConnectToKoz({
  originPage = "/",
  originDisplay = "HomePage",
}: ConnectToKozProps) {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("ConnectToKoz");

  console.log('[ConnectToKoz] Render', { originPage, originDisplay, locale });

  const handleBackToOrigin = () => {
    // Remove any existing locale prefix from originPage
    const cleanOriginPage = originPage.replace(/^\/[a-z]{2}\//, '');
    
    // Add locale only if not root path
    const localizedOriginPage = cleanOriginPage === '/' 
      ? '/' 
      : `/${locale}/${cleanOriginPage}`;

    router.push(localizedOriginPage);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#3E85BB]">
      <div
        className="relative w-full max-w-xl transform overflow-hidden bg-gray-800 p-8 text-left align-middle shadow-pixel transition-all"
        style={{
          fontFamily: '"Press Start 2P", cursive',
        }}
      >
        <div className="text-center">
          <h1
            className="text-3xl font-bold mb-4 text-white leading-snug"
            dangerouslySetInnerHTML={{ __html: t.raw("connectTo") }}
          />
        </div>

        <div className="space-y-4">
          <DynamicConnectWalletList />
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={handleBackToOrigin}
            className="px-4 py-2 bg-yellow-500 text-gray-900 font-bold text-sm shadow-pixel transition-all hover:bg-yellow-400"
            style={{
              fontFamily: '"Press Start 2P", cursive',
            }}
          >
            {t("backTo", { page: originDisplay })}
          </button>
        </div>

        <ConnectToKozFooter />
      </div>
    </div>
  );
}
