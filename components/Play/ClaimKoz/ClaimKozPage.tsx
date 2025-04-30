"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import ClaimList from "./ClaimList";
import ClaimHistory from "./ClaimHistory";
import ClaimModal from "./ClaimModal";

interface ClaimItem {
  date: string;
  description: string;
  amount: number;
}

interface ClaimSummary {
  amount: number;
  fee: number;
  destination: string;
}

export default function ClaimKozPage() {
  const [claims, setClaims] = useState<ClaimItem[]>([]);
  const [history, setHistory] = useState<ClaimItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [claimSummary, setClaimSummary] = useState<ClaimSummary | null>(null);
  const [totalClaimable, setTotalClaimable] = useState(0);

  const t = useTranslations("ClaimKoz");

  useEffect(() => {
    const mockClaims: ClaimItem[] = [
      { date: "2025-02-20", description: "Staking Rewards", amount: 150 },
      { date: "2025-02-18", description: "Participation Bonus", amount: 80 }
    ];

    const total = mockClaims.reduce((sum, item) => sum + item.amount, 0);
    setClaims(mockClaims);
    setTotalClaimable(total);

    setClaimSummary({
      amount: total,
      fee: 1.5,
      destination: "addr1q9exampleaddresskozdeposit123456789"
    });

    setHistory([
      { date: "2025-01-20", description: "Staking Rewards", amount: 120 },
      { date: "2025-01-10", description: "Participation Bonus", amount: 90 },
      { date: "2024-12-20", description: "Referral Bonus", amount: 100 }
    ]);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto text-white p-6 space-y-6">
      <div className="flex items-center gap-4 bg-gray-800 border-4 border-yellow-500 p-4 rounded-lg shadow-lg">
        <Image
          src="/images/KOZ.png"
          alt="$KOZ Token"
          width={60}
          height={60}
          className="rounded-md"
        />
        <div>
          <h2 className="text-2xl font-bold text-yellow-300">{t("title")}</h2>
          <p className="text-sm text-gray-300">{t("description")}</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-yellow-300 rounded p-4 text-center shadow flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <p className="text-sm text-gray-300">{t("totalAvailable")}</p>
          <p className="text-3xl font-extrabold text-green-400">{totalClaimable} KOZ</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded border-2 border-white shadow"
        >
          {t("claimNow")}
        </button>
      </div>

      <ClaimList items={claims} />

      {claimSummary && (
        <ClaimModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          summary={claimSummary}
        />
      )}

      <ClaimHistory history={history} />
    </div>
  );
}
