"use client";

import React, { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

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

  useEffect(() => {
    const checkConnection = () => {
      const storedConnected = localStorage.getItem("connected") === "true";
      const storedWalletName = localStorage.getItem("walletName");
      setIsConnected(storedConnected && !!storedWalletName);
    };

    // Initial check
    checkConnection();

    // Handler for connection changes
    const handleConnectionChange = (event: Event) => {
      if (event instanceof CustomEvent) {
        setIsConnected(event.detail.connected);
      } else if (event instanceof StorageEvent) {
        if (event.key === "connected" || event.key === "walletName") {
          checkConnection();
        }
      }
    };

    // Add event listeners
    window.addEventListener("walletConnectionChange", handleConnectionChange);
    window.addEventListener("storage", handleConnectionChange);

    // Poll for changes every second (as backup)
    const interval = setInterval(checkConnection, 1000);

    return () => {
      window.removeEventListener("walletConnectionChange", handleConnectionChange);
      window.removeEventListener("storage", handleConnectionChange);
      clearInterval(interval);
    };
  }, []);

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
