import { useTranslations } from "next-intl";

interface Props {
  ticketAmount: number;
  onBuy: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function BuyTicketSummary({ 
  ticketAmount, 
  onBuy,
  isLoading = false,
  disabled = false
}: Props) {
  const t = useTranslations("BuyTicket");

  return (
    <div className="mt-4">
      <button
        onClick={onBuy}
        disabled={disabled || isLoading}
        className={`w-full py-3 px-4 rounded-lg font-medium transition ${
          disabled || isLoading
            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
            : "bg-yellow-500 text-black hover:bg-yellow-400"
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full mr-2" />
            {t("processing")}
          </div>
        ) : (
          t("buyButton", { amount: ticketAmount })
        )}
      </button>
    </div>
  );
}