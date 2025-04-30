"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatTokenAmount } from "@/types/Tokenomics";

interface Transaction {
  type: "mint" | "burn";
  amount: number;
  txId: string;
}

interface MintBurnHistoryProps {
  transactions: Transaction[];
}

export default function MintBurnHistory({ transactions }: MintBurnHistoryProps) {
  const t = useTranslations("Tokenomics");

  const truncateTxId = (txId: string) => {
    return `${txId.slice(0, 8)}...${txId.slice(-8)}`;
  };

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-yellow-500">
            <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-yellow-300 text-xs sm:text-sm">{t("mintBurnType")}</th>
            <th className="text-right py-2 sm:py-3 px-3 sm:px-4 text-yellow-300 text-xs sm:text-sm">{t("amount")}</th>
            <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-yellow-300 text-xs sm:text-sm">{t("transactionId")}</th>
          </tr>
        </thead>
        <tbody className="text-white">
          {transactions.map((tx, index) => (
            <tr key={index} className="border-b border-gray-700 hover:bg-gray-800">
              <td className="py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm">
                <span className={tx.type === "mint" ? "text-green-400" : "text-red-400"}>
                  {t(tx.type)}
                </span>
              </td>
              <td className="py-2 sm:py-3 px-3 sm:px-4 text-right font-mono text-xs sm:text-sm">
                {formatTokenAmount(tx.amount)} KOZ
              </td>
              <td className="py-2 sm:py-3 px-3 sm:px-4">
                <a
                  href={`https://cardanoscan.io/transaction/${tx.txId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 sm:gap-2 text-blue-400 hover:text-blue-300"
                >
                  <span className="font-mono text-xs sm:text-sm">{truncateTxId(tx.txId)}</span>
                  <ExternalLink size={12} className="hidden sm:inline sm:w-4 sm:h-4" />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
