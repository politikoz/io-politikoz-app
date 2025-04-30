"use client";

interface BlockDrawRecord {
  block: number;
  time: string;
  number: number;
}

export default function HistoryCards({
  history,
  onSelect,
}: {
  history: BlockDrawRecord[];
  onSelect: (entry: BlockDrawRecord) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-full mt-6">
      {history.map((entry) => (
        <div
          key={entry.block}
          className="bg-gray-800 border border-yellow-400 p-3 rounded cursor-pointer hover:bg-gray-700 transition"
          onClick={() => onSelect(entry)}
        >
          <h3 className="text-sm font-bold text-yellow-300 mb-1">Block #{entry.block}</h3>
          <p className="text-xs text-white">🕒 {entry.time}</p>
          <p className="text-sm mt-2 font-mono text-green-400">
            Número: <span className="font-bold text-white">{entry.number}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
