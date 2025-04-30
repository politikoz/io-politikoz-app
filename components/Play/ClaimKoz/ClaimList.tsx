"use client";

import React from "react";
import { useTranslations } from "next-intl";

interface ClaimItem {
  date: string;
  description: string;
  amount: number;
}

export default function ClaimList({ items }: { items: ClaimItem[] }) {
  const t = useTranslations("ClaimKoz");

  return (
    <div className="bg-gray-900 border-4 border-yellow-500 p-4 rounded-lg shadow-lg mb-6">
      <h3 className="text-lg font-bold text-yellow-300 mb-2">{t("availableRewards")}</h3>
      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex justify-between items-center border-b border-gray-700 py-2 text-sm"
        >
          <div>
            <div className="font-semibold text-white">{item.description}</div>
            <div className="text-gray-400">{item.date}</div>
          </div>
          <div className="text-green-400 font-bold">{item.amount} KOZ</div>
        </div>
      ))}
    </div>
  );
}
