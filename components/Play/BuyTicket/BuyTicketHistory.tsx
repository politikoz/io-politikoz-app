import { useTranslations } from "next-intl";
import { formatDate } from "@/utils/date";
import { formatTxHash } from "@/utils/formatters";
import { memo, useEffect, useRef } from "react";
import { useTicketPurchaseHistory } from "@/hooks/useTicketPurchaseHistory";

interface Props {
  stakeAddress: string | null;
  isLoading?: boolean;
  queryRef?: React.MutableRefObject<any>;
}

const BuyTicketHistory = memo(function BuyTicketHistory({ 
  stakeAddress, 
  isLoading: externalLoading = false,
  queryRef
}: Props) {
  const t = useTranslations("BuyTicket");
  
  // O hook é chamado diretamente no componente (nível superior)
  const historyQuery = useTicketPurchaseHistory(stakeAddress);
  const { 
    data: history = [], 
    isLoading: isLoadingHistory,
    error,
    refetch
  } = historyQuery;

  // Armazenar a referência ao query para que o componente pai possa acessar
  useEffect(() => {
    if (queryRef) {
      queryRef.current = historyQuery;
    }
  }, [queryRef, historyQuery]);

  // Combinando os estados de loading
  const isLoading = externalLoading || isLoadingHistory;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VALIDATING":
        return "bg-yellow-500/10 border-yellow-500/50";
      case "COMPLETED":
        return "bg-blue-500/10 border-blue-500/50";
      case "FAILED":
        return "bg-red-500/10 border-red-500/50";
      default:
        return "bg-gray-500/10 border-gray-500/50";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "VALIDATING":
        return "text-yellow-500";
      case "COMPLETED":
        return "text-blue-500";
      case "FAILED":
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
          {[1, 2, 3].map((i) => (
            <div key={i} className="grid grid-cols-4 gap-4 px-4 py-3 bg-gray-800/20 rounded">
              <div className="h-4 bg-gray-700/30 rounded w-20"></div>
              <div className="h-4 bg-gray-700/30 rounded w-16"></div>
              <div className="h-4 bg-gray-700/30 rounded w-24"></div>
              <div className="h-4 bg-gray-700/30 rounded w-16"></div>
            </div>
          ))}
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
      <div className="grid grid-cols-4 gap-4 px-4 py-2 bg-gray-800/50 rounded-t border-b border-gray-700 text-sm font-medium text-gray-400">
        <div>{t("date")}</div>
        <div>{t("history.amount")}</div>
        <div>{t("history.transaction")}</div>
        <div className="text-center">{t("history.status")}</div>
      </div>

      {/* Content */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {history.length > 0 ? (
          history.map((entry) => (
            <div
              key={entry.id}
              className={`grid grid-cols-4 gap-4 px-4 py-3 rounded border ${getStatusColor(
                entry.status
              )}`}
            >
              <div className="text-sm text-gray-300">
                {formatDate(entry.createdAt)}
              </div>
              <div className="flex flex-col text-sm">
                <span className="text-gray-300">
                  {t("history.ticketAmount", { amount: entry.ticketQuantity })}
                </span>
                <span className="text-gray-500">
                  {t("history.kozAmount", { amount: entry.kozAmount })}
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

export default BuyTicketHistory;