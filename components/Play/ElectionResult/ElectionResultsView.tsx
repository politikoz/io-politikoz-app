"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ElectoralMap from "./ElectoralMap";
import UserCandidates from "./UserCandidates";
import PolitikozUserGrid from "./PolitikozUserGrid";
import PolitikozTable from "./PolitikozTable";

const electionSections = [
  { key: "map", labelKey: "map" },
  { key: "candidates", labelKey: "candidates" },
  { key: "grid", labelKey: "grid" },
  { key: "table", labelKey: "table" },
];

export default function ElectionResultsView() {
  const [selectedView, setSelectedView] = useState<string>("map");
  const t = useTranslations("ElectionResult");

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full flex flex-col items-center p-4">
        {selectedView === "map" && <ElectoralMap />}
        {selectedView === "candidates" && <UserCandidates />}
        {selectedView === "grid" && <PolitikozUserGrid/>}
        {selectedView === "table" && <PolitikozTable />}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
        {electionSections.map((option, index) => (
          <button
            key={index}
            onClick={() => setSelectedView(option.key)}
            className={`border-2 border-white px-4 py-2 bg-gray-800 text-white shadow-[4px_4px_0px_black] 
              hover:bg-gray-700 transition font-['Press_Start_2P'] text-sm ${
                selectedView === option.key ? "bg-yellow-500 text-black" : ""
              }`}
          >
            {t(option.labelKey)}
          </button>
        ))}
      </div>
    </div>
  );
}
