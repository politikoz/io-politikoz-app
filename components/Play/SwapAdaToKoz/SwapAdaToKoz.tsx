"use client";

import { useState, useEffect } from "react";
import { SwapHistory as History } from "./types";
import SwapHeader from "./SwapHeader";
import SwapInput from "./SwapInput";
import SwapSummary from "./SwapSummary";
import SwapHistory from "./SwapHistory";

export default function SwapAdaToKoz() {
  const [conversionRate, setConversionRate] = useState<number>(0); // KOZ por 1 ADA
  const [kozAvailable, setKozAvailable] = useState<number>(0);
  const [adaReceiverAddress, setAdaReceiverAddress] = useState<string>("");

  const [kozAmount, setKozAmount] = useState(0);
  const [adaAmount, setAdaAmount] = useState(0);
  const [history, setHistory] = useState<History[]>([]);

  useEffect(() => {
    const fetchMockData = async () => {
      await new Promise((res) => setTimeout(res, 300));

      setConversionRate(25); // 1 ADA = 25 KOZ
      setKozAvailable(50000);
      setAdaReceiverAddress("addr1q9examplefakeaddresskoz8765");

      setHistory([
        { adaSent: 1, kozReceived: 25, timestamp: "2024-03-25 13:42" },
        { adaSent: 2, kozReceived: 50, timestamp: "2024-03-18 09:11" },
      ]);
    };

    fetchMockData();
  }, []);

  useEffect(() => {
    const cost = kozAmount > 0 ? kozAmount / conversionRate : 0;
    setAdaAmount(parseFloat(cost.toFixed(6))); // evita decimais infinitos
  }, [kozAmount, conversionRate]);

  const handleSwap = () => {
    if (kozAmount <= 0 || kozAmount > kozAvailable) return;

    const newEntry: History = {
      adaSent: adaAmount,
      kozReceived: kozAmount,
      timestamp: new Date().toLocaleString(),
    };

    setHistory([newEntry, ...history]);
    setKozAmount(0);

    alert(`Send ${adaAmount} ADA to ${adaReceiverAddress} to receive ${kozAmount} KOZ.`);
  };

  return (
    <div className="p-4 sm:p-6 w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto bg-gray-900 text-white border-2 border-yellow-500 rounded-lg shadow-lg">
      <SwapHeader conversionRate={conversionRate} kozAvailable={kozAvailable} />
      <SwapInput kozAmount={kozAmount} setKozAmount={setKozAmount} max={kozAvailable} />
      <SwapSummary
        kozAmount={kozAmount}
        adaAmount={adaAmount}
        onSwap={handleSwap}
        maxKozAvailable={kozAvailable}
      />
      <SwapHistory history={history} />
    </div>
  );
}
