"use client";

import { BlockHistory } from "./types";

export default function RouletteBlockHistory({
  history,
  onSelect,
}: {
  history: BlockHistory[];
  onSelect: (entry: BlockHistory) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full mt-6">
      {history.map((entry) => (
        <div
          key={entry.block}
          className="bg-gray-800 border border-yellow-400 p-3 rounded cursor-pointer hover:bg-gray-700 transition"
          onClick={() => onSelect(entry)}
        >
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-bold text-yellow-300">
              Bloco #{entry.block}
            </h3>
            <span className="text-xs text-white">🕒 {entry.time}</span>
          </div>
          <p className="text-sm mt-2 text-green-400">
            {entry.blockValue}s + 2s ={" "}
            <span className="font-bold text-yellow-300">{entry.duration}s</span>
          </p>
          <p className="text-sm text-white mt-1">
            🎯 {entry.resultNumber}
          </p>
        </div>
      ))}
    </div>
  );
}
