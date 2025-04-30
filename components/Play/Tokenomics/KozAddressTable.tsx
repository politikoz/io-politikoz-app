"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { ExternalLink } from "lucide-react";
import { formatTokenAmount } from "@/types/Tokenomics";

interface WalletInfo {
  categoryKey: string;
  amount: number;
  notesKey: string;
  address: string;
}

const walletData: WalletInfo[] = [
  {
    categoryKey: "politikozHolderDrop",
    amount: 6_302_300,
    notesKey: "holderDrop",
    address: "addr1v87la5h87lcerdjdu6atj40xwca8qjgyl4wcky3k65s6rtslpf0h2"
  },
  {
    categoryKey: "socialClaimTreasury",
    amount: 2_100_000,
    notesKey: "socialClaims",
    address: "addr1vy0adajpzkcfhk39hh8rtgnge8kk9efrfavl0y72qppvg6c7rytd5"
  },
  {
    categoryKey: "liquidityReserve",
    amount: 4_200_000,
    notesKey: "liquidity",
    address: "addr1vy6d892cswmxh9g9rm4kwp4s70vkl3wp7rz56ehgqz20t9skqthnn"
  },
  {
    categoryKey: "coinMachine",
    amount: 2_100_000,
    notesKey: "coinMachine",
    address: "addr1v98fshldgwm5lxz556t6mqft90e0q5gq072q5f5anw2de6s7lgtdu"
  },
  {
    categoryKey: "projectTreasury",
    amount: 1_260_000,
    notesKey: "projectTreasury",
    address: "addr1v8cvlg27z3dnlq08munapdfsv5hqn8xnsyd69nqr3p9hggszkvkcu"
  },
  {
    categoryKey: "coreTeam",
    amount: 837_700,
    notesKey: "coreTeam",
    address: "611275706ffe41793e4f08d3e5aee39bfb60beaa1fc8e9dd42551a7c4a"
  },
  {
    categoryKey: "advisors",
    amount: 1_050_000,
    notesKey: "advisors",
    address: "addr1v94vqsjn4sjx2p7sty8zqjt4cvzzrt8grnzp0vrpfj3r38s0eyrg2"
  },
  {
    categoryKey: "projectTreasury",
    amount: 3_000_000,
    notesKey: "projectTreasury",
    address: "addr1v9projecttreasuryaddress"
  }
];

export default function KozAddressTable() {
  const t = useTranslations("Tokenomics");

  const truncateAddress = (address: string) => {
    if (address.length <= 20) return address;
    return `${address.slice(0, 10)}...${address.slice(-10)}`;
  };

  return (
    <div className="w-full bg-gray-900 border-4 border-yellow-500 p-4 sm:p-6 rounded-lg shadow-lg">
      <h3 className="text-base sm:text-lg font-bold text-yellow-300 mb-4">{t("walletAddressesTitle")}</h3>
      
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-yellow-500">
              <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-yellow-300 text-xs sm:text-sm">{t("tableHeaders.category")}</th>
              <th className="text-right py-2 sm:py-3 px-3 sm:px-4 text-yellow-300 text-xs sm:text-sm">{t("tableHeaders.amount")}</th>
              <th className="hidden sm:table-cell text-left py-2 sm:py-3 px-3 sm:px-4 text-yellow-300 text-xs sm:text-sm">{t("tableHeaders.notes")}</th>
              <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-yellow-300 text-xs sm:text-sm">{t("tableHeaders.walletAddress")}</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {walletData.map((item, index) => (
              <tr 
                key={index}
                className="border-b border-gray-700 hover:bg-gray-800"
              >
                <td className="py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm">
                  {t(`categories.${item.categoryKey}`)}
                </td>
                <td className="py-2 sm:py-3 px-3 sm:px-4 text-right font-mono text-xs sm:text-sm">
                  {formatTokenAmount(item.amount)}
                </td>
                <td className="hidden sm:table-cell py-2 sm:py-3 px-3 sm:px-4 text-gray-300 text-xs sm:text-sm">
                  {t(`notes.${item.notesKey}`)}
                </td>
                <td className="py-2 sm:py-3 px-3 sm:px-4">
                  {item.address ? (
                    <a
                      href={`https://cardanoscan.io/address/${item.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 sm:gap-2 text-blue-400 hover:text-blue-300"
                    >
                      <span className="font-mono text-xs sm:text-sm">{truncateAddress(item.address)}</span>
                      <ExternalLink size={14} className="hidden sm:inline" />
                    </a>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}