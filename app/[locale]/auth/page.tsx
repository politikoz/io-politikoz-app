"use client";

import { useSearchParams } from "next/navigation";
import ConnectToKoz from "@/components/ConnectToKoz/ConnectToKoz";

export default function AuthPage() {
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin") || "/";
  const display = searchParams.get("display") || "HomePage";

  return (
    <div className="fixed inset-0 z-[9999]">
      <ConnectToKoz
        originPage={origin}
        originDisplay={display}
      />
    </div>
  );
}
