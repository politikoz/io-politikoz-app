"use client";

import React, { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useCreateUser } from "@/hooks/useCreateUser";

declare global {
  interface WindowEventMap {
    'walletConnectionChange': CustomEvent<{ connected: boolean }>;
  }
}

interface ConnectToKozButtonProps {
  label?: string;
  originPage?: string;
  originDisplay?: string;
  className?: string;
}

export default function ConnectToKozButton({
  label,
  originPage = "/",
  originDisplay,
  className
}: ConnectToKozButtonProps) {
  const t = useTranslations("Header");
  const [isConnected, setIsConnected] = useState(false);
  const { createUser } = useCreateUser();

  // Initial connection check and user creation
  useEffect(() => {
    console.log("[ConnectToKozButton] useEffect mount");
    const storedConnected = localStorage.getItem("connected") === "true";
    const storedWalletName = localStorage.getItem("walletName");
    const storedStakeAddress = localStorage.getItem("stakeAddress");

    setIsConnected(storedConnected && !!storedWalletName);

    if (storedStakeAddress && storedConnected) {
      createUser(storedStakeAddress).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Connection change handler
  useEffect(() => {
    const handleConnectionChange = (event: Event) => {
      if (event instanceof CustomEvent) {
        setIsConnected(event.detail.connected);
        
        // Se conectou, criar/atualizar usuário
        if (event.detail.connected) {
          const stakeAddress = localStorage.getItem("stakeAddress");
          if (stakeAddress) {
            createUser(stakeAddress).catch(() => {
              // Silent fail in production
              // You could add error tracking here if needed
            });
          }
        }
      } else if (event instanceof StorageEvent) {
        if (event.key === "connected" || event.key === "walletName") {
          const storedConnected = localStorage.getItem("connected") === "true";
          const storedWalletName = localStorage.getItem("walletName");
          setIsConnected(storedConnected && !!storedWalletName);
        }
      }
    };

    // Listen to both custom event and storage changes
    window.addEventListener("walletConnectionChange", handleConnectionChange);
    window.addEventListener("storage", handleConnectionChange);

    return () => {
      window.removeEventListener("walletConnectionChange", handleConnectionChange);
      window.removeEventListener("storage", handleConnectionChange);
    };
  }, []); // Run only once to set up listeners

  return (
    <Link
      href={{
        pathname: "/auth",
        query: { 
          origin: originPage,
          display: originDisplay 
        }
      }}
      className={className || "flex items-center px-4 py-2 bg-gray-900 text-yellow-400 border-2 border-yellow-500 hover:bg-yellow-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-none transition-all duration-200 cursor-pointer shadow-pixel-art"}
      style={{
        fontFamily: '"Press Start 2P", cursive',
        boxShadow: "0px 0px 0px 2px #FFD700",
      }}
    >
      <span className="w-full text-center text-sm font-bold">
        {isConnected ? t("connected") : label || t("connect")}
      </span>
    </Link>
  );
}
