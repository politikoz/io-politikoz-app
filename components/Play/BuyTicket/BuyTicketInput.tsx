import { useTranslations } from "next-intl";
import { useState, useCallback, useEffect } from "react";

interface Props {
  ticketAmount: number;
  setTicketAmount: (amount: number) => void;
  maxTickets: number;
}

export default function BuyTicketInput({ ticketAmount, setTicketAmount, maxTickets }: Props) {
  const t = useTranslations("BuyTicket");
  const [inputValue, setInputValue] = useState<string>("");
  const [debouncedValue, setDebouncedValue] = useState<number>(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      return;
    }
    
    // Handle empty input
    if (value === "") {
      setInputValue("");
      setDebouncedValue(0);
      return;
    }

    const numValue = parseInt(value);
    
    // Handle max value
    if (numValue > maxTickets) {
      setInputValue(maxTickets.toString());
      setDebouncedValue(maxTickets);
      return;
    }
    
    setInputValue(value);
    setDebouncedValue(numValue);
  };

  // Update parent state after debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setTicketAmount(debouncedValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [debouncedValue, setTicketAmount]);

  return (
    <div className="mb-2">
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={t("enterTicketAmount")}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
        />
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {t("tickets")}
        </span>
      </div>
      <div className="h-4">
        {ticketAmount > maxTickets && (
          <p className="text-xs text-red-400">
            {t("errors.maxTicketsExceeded", { max: maxTickets })}
          </p>
        )}
      </div>
    </div>
  );
}