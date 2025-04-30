"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import KozDistributionChart from "./KozDistributionChart";
import KozAddressTable from "./KozAddressTable";
import MintBurnHistory from "./MintBurnHistory";
import { formatTokenAmount } from "@/types/Tokenomics";
import { ExternalLink } from "lucide-react";

export default function TokenomicsPage() {
  const t = useTranslations("Tokenomics");

  // Informações fixas
  const totalSupply = 21_000_000; // Total Supply fixo
  const mintBurnTransactions = [
    {
      type: "mint" as "mint",
      amount: totalSupply,
      txId: "fcea064cd431fdc757231b98b8b2447c86016f4cdbbdcaaeeb1b3fb544f26912",
    },
  ];

  const truncatePolicyId = (policyId: string) => {
    const fullId = "63766427b4499dd678cb8b715dec3265dd292279ce7779447e3651e54b4f5a";
    return `${fullId.slice(0, 8)}...${fullId.slice(-8)}`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto text-white p-6 space-y-8">
      <div className="flex flex-col md:flex-row items-center gap-6 border-2 border-yellow-500 p-4 rounded-lg shadow-lg bg-gray-800">
        <Image
          src="/images/KOZ.png"
          alt="KOZ Token Logo"
          width={100}
          height={100}
          className="rounded-md object-contain"
          style={{ width: "auto", height: "auto" }}
        />

        <div className="text-center md:text-left flex-1">
          <h2 className="text-3xl font-extrabold text-yellow-300 mb-2">{t("title")}</h2>
          <p className="text-sm text-gray-300 mb-2">{t("description")}</p>

          <div className="text-sm mb-1 flex items-center">
            <strong className="text-yellow-300 whitespace-nowrap">{t("policyIdLabel")}&nbsp;</strong>
            <a
              href="https://cardanoscan.io/token/63766427b4499dd678cb8b715dec3265dd292279ce7779447e3651e54b4f5a"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-mono"
            >
              <span>{truncatePolicyId("63766427b4499dd678cb8b715dec3265dd292279ce7779447e3651e54b4f5a")}</span>
              <ExternalLink size={16} />
            </a>
          </div>

          <div className="text-sm flex items-center">
            <strong className="text-yellow-300 whitespace-nowrap">{t("totalSupplyLabel")}&nbsp;</strong>
            <span className="text-green-400">{formatTokenAmount(totalSupply)} KOZ</span>
          </div>
        </div>
      </div>

      {/* PieChart Distribution */}
      <KozDistributionChart />

      {/* Wallet Addresses Table */}
      <KozAddressTable />

      {/* Mint/Burn History */}
      <div className="border-2 border-yellow-500 p-4 rounded-lg shadow-lg bg-gray-800">
        <h3 className="text-xl font-bold text-yellow-300 mb-4">{t("mintBurnHistory")}</h3>
        <MintBurnHistory transactions={mintBurnTransactions} />
      </div>
    </div>
  );
}