import { Transaction } from "./incomeOutcomeMock";
import { useTranslations } from "next-intl";

interface ListProps {
  transactions: Transaction[];
}

export default function OutcomeList({ transactions }: ListProps) {
  const t = useTranslations("IncomeOutcome");

  return (
    <div className="flex-1 bg-gray-800 p-4">
      <h3 className="text-md font-bold text-red-400 mb-2">{t("outcomeTitle")}</h3>
      <div className="max-h-60 overflow-y-auto">
        {transactions.map((t, index) => (
          <div key={index} className="flex justify-between text-sm py-2 border-b border-gray-700 last:border-0">
            <span>{t.amount} {t.type}</span>
            <span className="text-xs text-gray-400">{t.source}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
