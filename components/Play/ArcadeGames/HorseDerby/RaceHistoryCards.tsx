"use client";

import { useState } from "react";
import RaceDetailModal from "./RaceDetailModal";

export default function RaceHistoryCards({
  history,
  selectedHorse,
}: {
  history: { block: number; horses: number[]; time: string }[];
  selectedHorse: number | null;
}) {
  const [selectedBlock, setSelectedBlock] = useState<null | {
    block: number;
    horses: number[];
    time: string;
  }>(null);

  return (
    <>
      <div className="w-full mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {history.map((entry) => (
          <div
            key={entry.block}
            className="bg-gray-800 border border-yellow-400 p-3 rounded cursor-pointer hover:bg-gray-700 transition"
            onClick={() => setSelectedBlock(entry)}
          >
            <h3 className="text-base font-bold text-yellow-300">
              Block #{entry.block}
            </h3>
            <div className="mt-2 text-sm text-white">
              <p className="text-yellow-300 font-semibold">Horses:</p>
              <div className="flex flex-wrap gap-1 mt-1 font-mono text-sm">
                {entry.horses.map((h) => (
                  <span
                    key={h}
                    className={`px-2 py-0.5 rounded ${
                      selectedHorse === h
                        ? "bg-green-500 text-black font-bold"
                        : "bg-gray-700"
                    }`}
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedBlock && (
        <RaceDetailModal
          block={selectedBlock}
          onClose={() => setSelectedBlock(null)}
        />
      )}
    </>
  );
}
