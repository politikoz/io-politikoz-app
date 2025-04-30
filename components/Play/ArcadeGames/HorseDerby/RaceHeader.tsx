"use client";

import { useEffect, useState } from "react";

export default function RaceHeader() {
  const [cost, setCost] = useState<number | null>(null);
  const [prize, setPrize] = useState<number | null>(null);

  // Simula chamada à API
  useEffect(() => {
    // Mock: esses valores viriam da API
    setTimeout(() => {
      setCost(3); // ADA por corrida
      setPrize(15); // prêmio em ADA para o vencedor
    }, 300);
  }, []);

  return (
    <div className="flex justify-between w-full max-w-[1000px] mx-auto text-sm md:text-base px-4 py-2 bg-gray-800 text-white border-b-2 border-yellow-500">
      <div>
        💰 <strong>Custo:</strong>{" "}
        {cost !== null ? `${cost} ADA` : "Carregando..."}
      </div>
      <div>
        🏆 <strong>Prêmio 1º lugar:</strong>{" "}
        {prize !== null ? `${prize} ADA` : "Carregando..."}
      </div>
    </div>
  );
}
