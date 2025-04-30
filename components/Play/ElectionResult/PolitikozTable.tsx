"use client";

import { useTranslations } from "next-intl";
import React, { useState, useEffect } from "react";
import { Politikoz } from "./politikozFullData";

const PAGE_SIZE = 50;

const roleOrder = [
  "President",
  "Senator",
  "Minister",
  "Governor",
  "Federal Deputy",
  "State Deputy",
  "Mayor",
  "Councilor"
];

const sortByRoleAndPlace = (a: Politikoz, b: Politikoz) => {
  const roleComparison = roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role);
  if (roleComparison !== 0) return roleComparison;
  return a.place - b.place;
};

export default function PolitikozTable({ politikozData }: { politikozData: Politikoz[] }) {
  const t = useTranslations("ElectionResult");

  const [filteredData, setFilteredData] = useState<Politikoz[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("");
  const [winningFilter, setWinningFilter] = useState(false);
  const [staminaFilter, setStaminaFilter] = useState(false);
  const [userFilter, setUserFilter] = useState(false);

  useEffect(() => {
    let filtered = politikozData;

    if (roleFilter) {
      filtered = filtered.filter((p) => p.role === roleFilter);
    }
    if (winningFilter) {
      filtered = filtered.filter((p) => p.winningPosition);
    }
    if (staminaFilter) {
      filtered = filtered.filter((p) => p.outOfStamina);
    }
    if (userFilter) {
      filtered = filtered.filter((p) => p.isUser);
    }

    setFilteredData(filtered.sort(sortByRoleAndPlace));
    setCurrentPage(1);
  }, [roleFilter, winningFilter, staminaFilter, userFilter, politikozData]);

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
  const currentData = filteredData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 text-sm text-white">
      <h2 className="text-lg font-bold text-center mb-6">{t("tableTitle")}</h2>

      <div className="flex flex-wrap gap-4 mb-4">
        <select
          className="p-1 border border-gray-400 rounded-md bg-gray-800 text-white text-xs"
          onChange={(e) => setRoleFilter(e.target.value)}
          value={roleFilter}
        >
          <option value="">{t("filterAllRoles")}</option>
          {roleOrder.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              className="form-checkbox text-yellow-500 h-4 w-4"
              checked={winningFilter}
              onChange={() => setWinningFilter(!winningFilter)}
            />
            {t("filterWinning")}
          </label>

          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              className="form-checkbox text-yellow-500 h-4 w-4"
              checked={staminaFilter}
              onChange={() => setStaminaFilter(!staminaFilter)}
            />
            {t("filterNoStamina")}
          </label>

          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              className="form-checkbox text-yellow-500 h-4 w-4"
              checked={userFilter}
              onChange={() => setUserFilter(!userFilter)}
            />
            {t("filterUserOwned")}
          </label>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-600 text-sm text-white">
          <thead className="bg-gray-800">
            <tr>
              <th className="border border-gray-600 p-1 w-20 text-center">{t("status")}</th>
              <th className="border border-gray-600 p-1">{t("politikoz")}</th>
              <th className="border border-gray-600 p-1">{t("role")}</th>
              <th className="border border-gray-600 p-1">{t("place")}</th>
              <th className="border border-gray-600 p-1">{t("earnings")}</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((p) => (
              <tr key={p.name} className="odd:bg-gray-700 even:bg-gray-900">
                <td className="border border-gray-600 p-1 w-20 text-center">
                  <span className="inline-flex gap-2 justify-center w-full">
                    <span className="w-5 text-center">{p.winningPosition ? "🏆" : "\u00A0"}</span>
                    <span className="w-5 text-center">{p.outOfStamina ? "⚡" : "\u00A0"}</span>
                    <span className="w-5 text-center">{p.isUser ? "👤" : "\u00A0"}</span>
                  </span>
                </td>
                <td className="border border-gray-600 p-1">{p.name}</td>
                <td className="border border-gray-600 p-1">{p.role}</td>
                <td className="border border-gray-600 p-1">{p.place}</td>
                <td className="border border-gray-600 p-1">${p.earnings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center mt-4 gap-2">
        <button
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          {t("prev")}
        </button>

        <span className="text-white">
          {t("page", { current: currentPage, total: totalPages })}
        </span>

        <button
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          {t("next")}
        </button>
      </div>
    </div>
  );
}
