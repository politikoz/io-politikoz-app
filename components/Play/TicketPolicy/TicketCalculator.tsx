"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { TicketPolicyData } from "@/types/TicketPolicy";
import { calculateTickets } from "@/utils/ticketCalculations";

interface Props {
  policyData: TicketPolicyData;
}

export default function TicketCalculator({ policyData }: Props) {
  const t = useTranslations("TicketPolicy");
  const [stakeAmount, setStakeAmount] = useState<string>("");
  const [calculation, setCalculation] = useState<ReturnType<typeof calculateTickets> | null>(null);

  const handleCalculate = () => {
    const amount = parseFloat(stakeAmount || "0");
    if (amount > 0) {
      const result = calculateTickets(amount, policyData);
      setCalculation(result);
    }
  };

  return (
    <div className="bg-gray-900 border-4 border-yellow-500 p-6 rounded-lg shadow-lg text-white space-y-4">
      <h4 className="text-lg font-bold text-yellow-300 mb-1">{t("calculatorTitle")}</h4>
      <p className="text-sm text-gray-300 mb-4">{t("calculatorDescription")}</p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <label htmlFor="stakeInput" className="text-sm">
          {t("adaAmount")}
        </label>
        <input
          id="stakeInput"
          type="number"
          value={stakeAmount}
          onChange={(e) => setStakeAmount(e.target.value)}
          className="bg-gray-800 border-2 border-white rounded px-3 py-1 w-full sm:w-[200px]"
          min="0"
        />
        <button
          onClick={handleCalculate}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded border-2 border-white"
        >
          {t("calculate")}
        </button>
      </div>

      {calculation && (
        <div className="text-sm mt-4">
          <h5 className="font-bold text-yellow-200 mb-2">{t("resultsTitle")}</h5>
          <ul className="list-disc pl-6 space-y-1">
            {calculation.tickets.map(({ role, quantity }) => (
              <li key={role}>
                {role}: <span className="text-green-300 font-bold">{quantity}</span> {t("tickets")}
              </li>
            ))}
          </ul>
          {calculation.estimatedKozRewards > 0 && (
            <div className="mt-4 p-4 bg-green-900 border-2 border-green-500 rounded shadow-md">
              <h5 className="text-md font-bold text-green-300 mb-1">💰 {t("bonusTitle")}</h5>
              <p className="text-sm">
                {t("bonusMessage", {
                  amount: calculation.estimatedKozRewards,
                })}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
