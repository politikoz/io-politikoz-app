"use client";

import { useState } from "react";
import { fullMockIncomeOutcome, Transaction } from "./incomeOutcomeMock";
import { useTranslations } from "next-intl";

export default function IncomeOutcome() {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const t = useTranslations("IncomeOutcome");

  const months = t.raw("months");

  const filteredTransactions: Transaction[] = fullMockIncomeOutcome.filter(
    (t: Transaction) => new Date(t.timestamp).getMonth() === selectedMonth
  );

  const last12MonthsTransactions: Transaction[] = fullMockIncomeOutcome.filter(
    (t: Transaction) => {
      const transactionDate = new Date(t.timestamp);
      const currentDate = new Date();
      return transactionDate >= new Date(currentDate.getFullYear(), currentDate.getMonth() - 11, 1);
    }
  );

  const incomeTransactions: Transaction[] = filteredTransactions.filter((t) => t.category === "income");
  const outcomeTransactions: Transaction[] = filteredTransactions.filter((t) => t.category === "outcome");

  const summary = (transactions: Transaction[], category: "income" | "outcome", type: "KOZ" | "ADA"): number =>
    transactions
      .filter((t) => t.category === category && t.type === type)
      .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="p-4 bg-gray-900 text-white border-4 border-yellow-500 shadow-lg max-w-5xl mx-auto">
      <h2 className="text-lg font-bold text-yellow-300 text-center mb-2">{t("title")}</h2>

      <div className="flex justify-center mb-4">
        <select
          className="p-2 bg-gray-800 border border-yellow-400 text-yellow-300 text-sm rounded"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
        >
          {months.map((month: string, index: number) => (
            <option key={index} value={index}>{month}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-between bg-gray-800 p-3 rounded border border-yellow-400 mb-4">
        <div className="text-center">
          <p className="text-yellow-300 font-bold">{t("monthIncomeTitle")}</p>
          <p className="text-sm">KOZ: <span className="font-bold">{summary(filteredTransactions, "income", "KOZ")}</span></p>
          <p className="text-sm">ADA: <span className="font-bold">{summary(filteredTransactions, "income", "ADA")}</span></p>
        </div>
        <div className="text-center">
          <p className="text-yellow-300 font-bold">{t("monthOutcomeTitle")}</p>
          <p className="text-sm">KOZ: <span className="font-bold">{summary(filteredTransactions, "outcome", "KOZ")}</span></p>
          <p className="text-sm">ADA: <span className="font-bold">{summary(filteredTransactions, "outcome", "ADA")}</span></p>
        </div>
      </div>

      <div className="flex justify-between bg-gray-800 p-3 rounded border border-yellow-400 mb-4">
        <div className="text-center">
          <p className="text-yellow-300 font-bold">{t("yearIncomeTitle")}</p>
          <p className="text-sm">KOZ: <span className="font-bold">{summary(last12MonthsTransactions, "income", "KOZ")}</span></p>
          <p className="text-sm">ADA: <span className="font-bold">{summary(last12MonthsTransactions, "income", "ADA")}</span></p>
        </div>
        <div className="text-center">
          <p className="text-yellow-300 font-bold">{t("yearOutcomeTitle")}</p>
          <p className="text-sm">KOZ: <span className="font-bold">{summary(last12MonthsTransactions, "outcome", "KOZ")}</span></p>
          <p className="text-sm">ADA: <span className="font-bold">{summary(last12MonthsTransactions, "outcome", "ADA")}</span></p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 p-3 border border-green-400 rounded">
          <h3 className="text-green-300 font-bold text-center">{t("incomeTitle")}</h3>
          {incomeTransactions.length > 0 ? (
            incomeTransactions.map((t: Transaction, index: number) => (
              <div key={index} className="flex justify-between text-sm text-gray-300 border-b border-gray-700 py-1 last:border-0">
                <span>{t.source}</span>
                <span className="font-bold text-green-400">+{t.amount} {t.type}</span>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">{t("noIncome")}</p>
          )}
        </div>

        <div className="bg-gray-800 p-3 border border-red-400 rounded">
          <h3 className="text-red-300 font-bold text-center">{t("outcomeTitle")}</h3>
          {outcomeTransactions.length > 0 ? (
            outcomeTransactions.map((t: Transaction, index: number) => (
              <div key={index} className="flex justify-between text-sm text-gray-300 border-b border-gray-700 py-1 last:border-0">
                <span>{t.source}</span>
                <span className="font-bold text-red-400">-{t.amount} {t.type}</span>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">{t("noOutcome")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
