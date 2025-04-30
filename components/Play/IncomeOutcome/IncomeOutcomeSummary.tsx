import { Transaction } from "./incomeOutcomeMock";
import { useTranslations } from "next-intl";

interface SummaryProps {
  transactions: Transaction[];
}

export default function IncomeOutcomeSummary({ transactions }: SummaryProps) {
  const t = useTranslations("IncomeOutcome");

  const totalIncome = transactions
    .filter((t) => t.category === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOutcome = transactions
    .filter((t) => t.category === "outcome")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="mb-4 p-4 bg-gray-800 text-white border-2 border-yellow-500 rounded">
      <h3 className="text-md font-bold text-yellow-300">{t("summaryTitle")}</h3>
      <div className="flex justify-between mt-2">
        <span className="text-green-400">{t("incomeSummary", { amount: totalIncome })}</span>
        <span className="text-red-400">{t("outcomeSummary", { amount: totalOutcome })}</span>
      </div>
    </div>
  );
}
