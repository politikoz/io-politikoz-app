"use client";

import React from "react";
import TreasuryOverview from "./TreasuryOverview";
import TreasuryChart from "./TreasuryChart";
import { useTreasuryData } from "@/hooks/useTreasuryData";

export default function TreasuryPage() {
  const { data, error } = useTreasuryData();

  if (error) {
    return (
      <div className="w-full max-w-5xl mx-auto text-white p-6">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto text-white p-6 space-y-8">
      <TreasuryOverview 
        adaAmount={data.treasuryPot.adaAmount} 
        usdAmount={data.treasuryPot.usdAmount} 
      />
      <TreasuryChart data={data.treasuryHistory} />
    </div>
  );
}
