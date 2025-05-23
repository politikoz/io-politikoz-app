"use client";

import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { useCandidatesTable } from "@/hooks/useCandidatesTable";
import { useMediaQuery } from '@/hooks/useMediaQuery';

const roleOrder = [
  "President",
  "Senator",
  "Minister",
  "Governor",
  "Federal Deputy",
  "State Deputy",
  "Mayor",
  "Councilor",
  "Frontman",
  "Corrupt",
  "Lobbyist",
  "Briber",
  "Launderer"
] as const;

export default function PolitikozTable() {
  const t = useTranslations("ElectionResult");
  const mockStakeAddress = process.env.NEXT_PUBLIC_STAKE_ADDRESS_MOCK;
  const stakeAddress = mockStakeAddress || localStorage.getItem('stakeAddress');
  const isMobile = useMediaQuery('(max-width: 640px)');

  const formatEarnings = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 50,
    role: "All Role",
    winning: false,
    outOfStamina: false,
    stakeAddress: undefined as string | undefined
  });

  // Transform role to uppercase if it's not "All Role" and include stakeAddress
  const apiFilters = {
    page: filters.page,
    pageSize: filters.pageSize,
    role: filters.role !== "All Role" ? filters.role.toUpperCase() : filters.role,
    winning: filters.winning,
    outOfStamina: filters.outOfStamina,
    stakeAddress: filters.stakeAddress // This is undefined when unchecked
  };

  const { data, isLoading, error } = useCandidatesTable(apiFilters);

  if (isLoading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error loading data</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-2 md:p-4 text-xs md:text-sm text-white">
      <div className="flex flex-wrap gap-2 md:gap-4 mb-4">
        <select
          className="p-1 border border-gray-400 rounded-md bg-gray-800 text-white text-xs"
          onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value, page: 1 }))}
          value={filters.role}
        >
          <option value="All Role">{t("filterAllRoles")}</option>
          {roleOrder.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1 md:gap-2">
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              className="form-checkbox text-yellow-500 h-4 w-4"
              checked={filters.winning}
              onChange={() => setFilters(prev => ({ ...prev, winning: !prev.winning, page: 1 }))}
            />
            <span className="flex items-center gap-1">
              {t("filterWinning")}
            </span>
          </label>

          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              className="form-checkbox text-yellow-500 h-4 w-4"
              checked={filters.outOfStamina}
              onChange={() => setFilters(prev => ({ ...prev, outOfStamina: !prev.outOfStamina, page: 1 }))}
            />
            <span className="flex items-center gap-1">
              {t("filterNoStamina")}
            </span>
          </label>

          <label className={`flex items-center gap-1 ${!stakeAddress ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
            <input
              type="checkbox"
              className="form-checkbox text-yellow-500 h-4 w-4"
              checked={!!filters.stakeAddress}
              onChange={() => {
                if (stakeAddress) {
                  setFilters(prev => ({ 
                    ...prev, 
                    stakeAddress: prev.stakeAddress ? undefined : stakeAddress,
                    page: 1 
                  }));
                }
              }}
              disabled={!stakeAddress}
            />
            <span className="flex items-center gap-1">
               {t("filterUserOwned")}
            </span>
          </label>
        </div>
      </div>

      <div className="overflow-x-auto -mx-2 md:mx-0">
        <table className="w-full table-auto border-collapse border border-gray-600 text-[0.7rem] md:text-sm">
          <thead className="bg-gray-800">
            <tr>
              <th className="border border-gray-600 p-1 md:p-2 w-16 md:w-20 text-center">{t("status")}</th>
              <th className="border border-gray-600 p-1 md:p-2">{t("politikoz")}</th>
              <th className="border border-gray-600 p-1 md:p-2">{t("role")}</th>
              <th className="border border-gray-600 p-1 md:p-2">{t("place")}</th>
              <th className="border border-gray-600 p-1 md:p-2">{t("earnings")}</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((p) => (
              <tr key={p.name} className="odd:bg-gray-700 even:bg-gray-900">
                <td className="border border-gray-600 p-1 md:p-2 w-16 md:w-20 text-center">
                  <span className="inline-flex gap-1 md:gap-2 justify-center w-full">
                    <span className="w-4 md:w-5 text-center">{p.winningPosition ? "🏆" : "\u00A0"}</span>
                    <span className="w-4 md:w-5 text-center">{p.outOfStamina ? "⚡" : "\u00A0"}</span>
                    <span className="w-4 md:w-5 text-center">{p.isUser ? "👤" : "\u00A0"}</span>
                  </span>
                </td>
                <td className="border border-gray-600 p-1 md:p-2">{p.name}</td>
                <td className="border border-gray-600 p-1 md:p-2">{p.role}</td>
                <td className="border border-gray-600 p-1 md:p-2">{p.place}</td>
                <td className="border border-gray-600 p-1 md:p-2">
                  {formatEarnings(p.earnings)} {isMobile ? '' : 'ADA'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center mt-4 gap-1 md:gap-2">
        <button
          className="px-2 md:px-4 py-1 md:py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded disabled:opacity-50 text-xs md:text-sm"
          disabled={!data?.pagination.hasPreviousPage}
          onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
        >
          {t("prev")}
        </button>

        <span className="text-white text-xs md:text-sm">
          {t("page", { 
            current: data?.pagination.currentPage, 
            total: data?.pagination.totalPages 
          })}
        </span>

        <button
          className="px-2 md:px-4 py-1 md:py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded disabled:opacity-50 text-xs md:text-sm"
          disabled={!data?.pagination.hasNextPage}
          onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
        >
          {t("next")}
        </button>
      </div>
    </div>
  );
}
