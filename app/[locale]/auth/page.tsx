"use client";

import { useSearchParams } from "next/navigation";
import ConnectToKoz from "@/components/ConnectToKoz/ConnectToKoz";
import { useTour } from "@/contexts/TourContext"; // importe o contexto

export default function AuthPage() {
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin") || "/";
  const displayParam = searchParams.get("display") || "HomePage";
  const { isTourActive } = useTour(); // use o contexto

  const display = isTourActive ? "Tour" : displayParam;

  return (
    <div className="fixed inset-0 z-[9999]">
      <ConnectToKoz
        originPage={origin}
        originDisplay={display}
      />
    </div>
  );
}
