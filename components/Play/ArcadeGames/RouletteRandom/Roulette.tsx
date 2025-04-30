"use client";

import { useState } from "react";
import { getRandomRouletteNumber } from "./getRandomRouletteNumber";
import RouletteResultModal from "./RouletteResultModal";
import RouletteWheel from "./RouletteWheel";
import RouletteBlockHistory from "./RouletteBlockHistory";
import RouletteBlockDetailModal from "./RouletteBlockDetailModal";
import { BlockHistory } from "./types";

export default function Roulette() {
  const [betNumber, setBetNumber] = useState<number | null>(null);
  const [resultNumber, setResultNumber] = useState<number | null>(null);
  const [won, setWon] = useState<boolean | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [rotationDuration, setRotationDuration] = useState(3);
  const [history, setHistory] = useState<BlockHistory[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<BlockHistory | null>(null);

  const handleSpin = () => {
    if (betNumber === null || spinning) {
      alert("Escolha um número para apostar.");
      return;
    }

    const blockValue = getRandomRouletteNumber(); // ex: 3s vindo da API
    const duration = 2 + blockValue;
    const finalResult = getRandomRouletteNumber(); // número que vai parar
    setRotationDuration(duration);
    setResultNumber(finalResult);
    setSpinning(true);

    setTimeout(() => {
      setWon(finalResult === betNumber);
      setSpinning(false);

      const newBlock: BlockHistory = {
        block: (history[0]?.block || 1000) + 1,
        time: new Date().toLocaleTimeString(),
        duration,
        resultNumber: finalResult,
        blockValue,
      };

      setHistory([newBlock, ...history]);
    }, duration * 1000);
  };

  const reset = () => {
    setBetNumber(null);
    setResultNumber(null);
    setWon(null);
    setRotationDuration(3);
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white border-4 border-yellow-500 rounded-lg p-6 max-w-md mx-auto mt-8 shadow-lg">
      <h2 className="text-2xl font-bold text-yellow-300 mb-4">🎯 Roleta Arcade</h2>

      <RouletteWheel
        resultNumber={resultNumber}
        spinning={spinning}
        duration={rotationDuration}
      />

      <div className="mt-6 w-full">
        <h3 className="text-lg font-bold text-yellow-400 mb-2">Escolha seu número:</h3>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setBetNumber(i)}
              disabled={spinning}
              className={`p-2 font-mono font-bold rounded ${
                betNumber === i ? "bg-yellow-400 text-black" : "bg-gray-800"
              }`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSpin}
        disabled={spinning || betNumber === null}
        className={`mt-6 px-6 py-2 font-bold rounded ${
          spinning
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600 text-black"
        }`}
      >
        Girar Roleta
      </button>

      {resultNumber !== null && won !== null && (
        <RouletteResultModal number={resultNumber} success={won} onClose={reset} />
      )}

      {history.length > 0 && (
        <RouletteBlockHistory history={history} onSelect={setSelectedBlock} />
      )}

      {selectedBlock && (
        <RouletteBlockDetailModal data={selectedBlock} onClose={() => setSelectedBlock(null)} />
      )}
    </div>
  );
}
