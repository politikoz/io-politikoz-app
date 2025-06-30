"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ConnectToKoz from "@/components/ConnectToKoz/ConnectToKoz";
import { useTour } from "@/contexts/TourContext";
import { useTranslations } from "next-intl";

export default function AuthPage() {
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin") || "/";
  const displayParam = searchParams.get("display") || "HomePage";
  const { isTourActive } = useTour();
  const t = useTranslations("AuthPage");

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(localStorage.getItem("connected") === "true");
    };
    checkConnection();
    window.addEventListener("focus", checkConnection);

    // Polling para detectar conexão em tempo real
    const interval = setInterval(checkConnection, 500);

    return () => {
      window.removeEventListener("focus", checkConnection);
      clearInterval(interval);
    };
  }, []);

  let display = displayParam;
  if (isTourActive) {
    display = isConnected ? t("tour") : t("exploreWithoutConnecting");
  }

  return (
    <div className="fixed inset-0 z-[9999]">
      <ConnectToKoz
        originPage={origin}
        originDisplay={display}
      />
    </div>
  );
}
