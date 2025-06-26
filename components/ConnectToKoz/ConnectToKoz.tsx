"use client";

import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import ConnectToKozFooter from "./ConnectToKozFooter";
import DynamicConnectWalletList from "./DynamicConnectWalletList";
import { initializeWallet } from './MeshWallet';

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
  const [popupBlocked, setPopupBlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Detecta bloqueador de pop-up
  useEffect(() => {
    const testPopup = () => {
      const test = window.open("", "", "width=100,height=100");
      if (!test || test.closed || typeof test.closed === "undefined") {
        setPopupBlocked(true);
      } else {
        test.close();
        setPopupBlocked(false);
      }
    };
    testPopup();
  }, []);
  
  const handleSocialConnect = async () => {
    setLoading(true);
    try {
      await initializeWallet();
    } catch {}
    setLoading(false);
  };

  const handleBackToOrigin = () => {
    const cleanOriginPage = originPage.replace(/^\/[a-z]{2}\//, '');
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

        {/* Botão de conexão Socials */}
        <div className="mb-4 flex flex-col items-center">
          <button
            onClick={handleSocialConnect}
            disabled={popupBlocked || loading}
            className={`px-4 py-2 bg-green-500 text-white font-bold text-sm shadow-pixel transition-all hover:bg-green-400 disabled:bg-gray-500 disabled:cursor-not-allowed`}
            style={{
              fontFamily: '"Press Start 2P", cursive',
            }}
          >
            {popupBlocked
              ? "Desative o bloqueador de pop-up para conectar via Socials"
              : loading
                ? "Conectando Socials..."
                : "Conectar via Socials (Mesh Web3Wallet)"}
          </button>
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
