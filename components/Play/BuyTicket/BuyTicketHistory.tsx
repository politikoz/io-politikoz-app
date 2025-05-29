import { useTranslations } from "next-intl";
import { BuyTicketHistory as HistoryType } from "./types";
import { formatDate } from "@/utils/date";

interface Props {
  history: HistoryType[];
  isLoading: boolean;
  onCancel: (txHash: string) => Promise<void>;
}

export default function BuyTicketHistory({ history, isLoading, onCancel }: Props) {
  const t = useTranslations("BuyTicket");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-500";
      case "completed":
        return "text-green-500";
      case "failed":
      case "cancelled":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="mt-6 animate-pulse">
        <h3 className="text-md font-bold text-yellow-300 mb-2">{t("historyTitle")}</h3>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800/50 p-4 rounded">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-md font-bold text-yellow-300 mb-2">{t("historyTitle")}</h3>
      
      {history.length > 0 ? (
        <div className="space-y-2">
          {history.map((entry) => (
            <div key={entry.id} className="bg-gray-800/50 p-4 rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">
                  {formatDate(entry.timestamp)}
                </span>
                <span className={`text-sm ${getStatusColor(entry.status)}`}>
                  {t(`status.${entry.status}`)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-white">
                    {t("ticketAmount", { amount: entry.ticketAmount })}
                  </span>
                  <span className="text-gray-400 text-sm ml-2">
                    ({entry.kozAmount} KOZ)
                  </span>
                </div>
                
                {entry.status === "pending" && (
                  <button
                    onClick={() => entry.txHash && onCancel(entry.txHash)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    {t("cancel")}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400 bg-gray-800/30 rounded">
          {t("noHistory")}
        </div>
      )}
    </div>
  );
}