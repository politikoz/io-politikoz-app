import { useTranslations } from "next-intl";
import { SwapHistory as History } from "./types";

interface Props {
  history: History[];
}

export default function SwapHistory({ history }: Props) {
  const t = useTranslations("Swap");

  if (!history.length) return null;

  return (
    <div className="mt-6">
      <h3 className="text-md font-bold text-yellow-300 mb-2">{t("historyTitle")}</h3>
      <div className="bg-gray-800 p-3 rounded border border-gray-600 max-h-60 overflow-y-auto">
        {history.map((entry, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row justify-between text-sm text-gray-300 py-1 border-b border-gray-700 last:border-0"
          >
            <span>{entry.adaSent} ADA</span>
            <span>{entry.kozReceived} KOZ</span>
            <span className="text-xs text-gray-400">{entry.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
