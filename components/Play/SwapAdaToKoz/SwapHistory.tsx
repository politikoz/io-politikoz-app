import { useTranslations } from "next-intl";
import { SwapHistoryDTO } from "@/types/swap";
import { formatDate } from "@/utils/date";
import { memo } from "react";
import { formatTxHash, isPendingExpired } from "@/utils/formatters";

interface Props {
  history: SwapHistoryDTO[];
  isLoading: boolean;
  onCancelSwap: (txHash: string, swapId: number) => Promise<void>;
}

const SwapHistory = memo(function SwapHistory({ history, isLoading, onCancelSwap }: Props) {
  const t = useTranslations("Swap");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/10 border-yellow-500/50";
      case "COMPLETED":
        return "bg-blue-500/10 border-blue-500/50";
      case "FAILED":
      case "CANCELLED":
        return "bg-red-500/10 border-red-500/50";
      default:
        return "bg-gray-500/10 border-gray-500/50";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "text-yellow-500";
      case "COMPLETED":
        return "text-blue-500";
      case "FAILED":
      case "CANCELLED":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="mt-6">
        <h3 className="text-md font-bold text-yellow-300 mb-2">
          {t("historyTitle")}
        </h3>
        <div className="animate-pulse space-y-4">
          <div className="flex flex-col gap-1 py-2 border-b border-gray-700 last:border-0">
            <div className="flex flex-row justify-between text-sm items-center">
              <div className="flex flex-col">
                <span className="h-4 bg-gray-700 rounded w-3/4"></span>
                <span className="h-4 bg-gray-700 rounded w-1/2"></span>
              </div>
              <span className="h-4 bg-gray-700 rounded w-1/4"></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-md font-bold text-yellow-300 mb-2">
        {t("historyTitle")}
      </h3>

      {/* Header */}
      <div className="grid grid-cols-5 gap-4 px-4 py-2 bg-gray-800/50 rounded-t border-b border-gray-700 text-sm font-medium text-gray-400">
        <div>{t("date")}</div>
        <div>{t("history.amount")}</div>
        <div>{t("history.transaction")}</div>
        <div className="text-center">{t("history.status")}</div>
        <div className="text-center">{t("history.action")}</div>
      </div>

      {/* Content */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {history.length > 0 ? (
          history.map((entry) => (
            <div
              key={entry.id}
              className={`grid grid-cols-5 gap-4 px-4 py-3 rounded border ${getStatusColor(
                entry.status
              )}`}
            >
              <div className="text-sm text-gray-300">
                {formatDate(entry.createdAt)}
              </div>
              <div className="flex flex-col text-sm">
                <span className="text-gray-300">
                  {t("history.adaAmount", { amount: entry.ada })}
                </span>
                <span className="text-gray-500">
                  {t("history.kozAmount", { amount: entry.koz })}
                </span>
              </div>
              <div className="truncate">
                <a
                  href={`https://preprod.cardanoscan.io/transaction/${entry.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  {formatTxHash(entry.transactionHash)}
                </a>
              </div>
              <div className="text-center">
                <span className={`text-sm ${getStatusTextColor(entry.status)}`}>
                  {t(`history.${entry.status.toLowerCase()}`)}
                </span>
              </div>
              <div className="text-center">
                {entry.status === "FAILED" && onCancelSwap && (
                  <button
                    onClick={() => onCancelSwap(entry.transactionHash, entry.id)}
                    className="px-4 py-1.5 text-sm font-medium
                      text-red-400 hover:text-red-300 
                      bg-red-500/5 hover:bg-red-500/10
                      border border-red-500/30 hover:border-red-400 
                      rounded-full transition-all duration-200
                      flex items-center justify-center mx-auto
                      gap-1.5 min-w-[90px]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                    {t("history.cancel")}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400 bg-gray-800/30 rounded">
            {t("noHistory")}
          </div>
        )}
      </div>
    </div>
  );
});

export default SwapHistory;
