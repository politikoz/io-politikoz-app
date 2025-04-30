"use client";

interface BlockDrawRecord {
  block: number;
  time: string;
  number: number;
}

export default function HistoryDetailModal({
  data,
  onClose,
}: {
  data: BlockDrawRecord;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-gray-900 text-white p-6 rounded-lg border-4 border-yellow-400 w-full max-w-md relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-xl font-bold text-yellow-300 mb-2">
          Sorteio do Bloco #{data.block}
        </h2>

        <p className="text-sm text-gray-300 mb-2">🕒 {data.time}</p>

        <div className="text-lg font-mono text-white mt-4 text-center">
          Número Sorteado:{" "}
          <span className="text-green-400 font-extrabold text-2xl">
            {data.number}
          </span>
        </div>
      </div>
    </div>
  );
}
