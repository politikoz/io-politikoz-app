"use client";

import { BlockHistory } from "./types";

export default function RouletteBlockDetailModal({
  data,
  onClose,
}: {
  data: BlockHistory;
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

        <h2 className="text-xl font-bold text-yellow-300 mb-3">
          Bloco #{data.block}
        </h2>

        <p className="text-sm text-gray-300 mb-2">🕒 {data.time}</p>

        <div className="text-sm text-white mt-2 space-y-2">
          <p>
            📦 Valor sorteado da API (bloco):{" "}
            <span className="font-bold text-green-400">{data.blockValue}s</span>
          </p>
          <p>
            ➕ Tempo fixo adicionado:{" "}
            <span className="font-bold text-blue-400">2s</span>
          </p>
          <p>
            ⏱ Duração total da rotação:{" "}
            <span className="font-bold text-yellow-300">{data.duration}s</span>
          </p>
          <p>
            🎯 Número final sorteado:{" "}
            <span className="font-bold text-yellow-500 text-2xl">
              {data.resultNumber}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
