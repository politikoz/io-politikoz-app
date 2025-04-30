"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";

interface ClaimItem {
  date: string;
  description: string;
  amount: number;
}

export default function ClaimHistory({ history }: { history: ClaimItem[] }) {
  const [page, setPage] = useState(1);
  const t = useTranslations("ClaimKoz");

  const itemsPerPage = 5;
  const paginated = history.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(history.length / itemsPerPage);

  return (
    <div className="bg-gray-900 border-4 border-yellow-500 p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold text-yellow-300 mb-2">{t("claimHistory")}</h3>
      {paginated.map((item, idx) => (
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

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded border ${
                page === i + 1
                  ? "bg-yellow-400 text-black font-bold"
                  : "bg-gray-700 text-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
