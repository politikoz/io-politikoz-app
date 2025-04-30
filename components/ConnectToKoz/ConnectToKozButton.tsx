"use client";

import React, { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

// Define custom event
declare global {
  interface WindowEventMap {
    'walletConnectionChange': CustomEvent<{ connected: boolean }>;
  }
}

interface ConnectToKozButtonProps {
  label?: string;
  originPage?: string;
  originDisplay?: string;
}

export default function ConnectToKozButton({
  label,
  originPage = "/",
  originDisplay
}: ConnectToKozButtonProps) {
  const t = useTranslations("Header");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initial check
    if (typeof window !== "undefined") {
      const storedConnected = localStorage.getItem("connected");
      setIsConnected(storedConnected === "true");
    }

    // Handler for connection changes
    const handleConnectionChange = (event: CustomEvent<{ connected: boolean }> | StorageEvent) => {
      if ('detail' in event) {
        // Custom event
        setIsConnected(event.detail.connected);
      } else if (event.key === "connected") {
        // Storage event
        setIsConnected(event.newValue === "true");
      }
    };

    // Add both event listeners
    window.addEventListener("walletConnectionChange", handleConnectionChange as EventListener);
    window.addEventListener("storage", handleConnectionChange as EventListener);

    return () => {
      window.removeEventListener("walletConnectionChange", handleConnectionChange as EventListener);
      window.removeEventListener("storage", handleConnectionChange as EventListener);
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
      className="flex items-center px-4 py-2 bg-gray-900 text-yellow-400 border-2 border-yellow-500 hover:bg-yellow-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-none transition-all duration-200 cursor-pointer shadow-pixel-art"
      style={{
        fontFamily: '"Press Start 2P", cursive',
        boxShadow: "0px 0px 0px 2px #FFD700",
      }}
    >
      <span className="flex-1 text-sm font-bold">
        {isConnected ? t("connected") : label || t("connect")}
      </span>
    </Link>
  );
}
