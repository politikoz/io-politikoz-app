import { useTranslations } from "next-intl";
import { useState, useCallback, useEffect } from "react";

interface Props {
  kozAmount: number;
  setKozAmount: (amount: number) => void;
  max: number;
  min: number;
  walletBalance?: number; // Novo: saldo da carteira
  conversionRate?: number; // Novo: taxa de conversão ADA para KOZ
}

export default function SwapInput({ kozAmount, setKozAmount, max, min, walletBalance = 0, conversionRate = 0 }: Props) {
  const t = useTranslations("Swap");
  const [inputValue, setInputValue] = useState<string>("");
  const [debouncedValue, setDebouncedValue] = useState<number>(0);

  // Calcular o valor máximo possível com base no saldo e taxa de conversão
  const calculateMaxPossible = useCallback(() => {
    if (!walletBalance || !conversionRate) return max;
    
    // Subtrair 2.5 ADA para taxas (2 retorno + 0.5 taxa)
    const availableForSwap = Math.max(0, walletBalance - 20);
    // Converter para KOZ e arredondar para baixo (sem decimais)
    const maxKozPossible = Math.floor(availableForSwap * conversionRate);
    // Retornar o menor entre o máximo possível e o máximo disponível
    return Math.min(maxKozPossible, max);
  }, [walletBalance, conversionRate, max]);

  // Handle input changes locally first
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
    if (numValue > max) {
      setInputValue(max.toString());
      setDebouncedValue(max);
      return;
    }
    
    setInputValue(value);
    setDebouncedValue(numValue);
  };

  // Handle MIN button click
  const handleMinClick = () => {
    setInputValue(min.toString());
    setDebouncedValue(min);
  };

  // Handle MAX button click
  const handleMaxClick = () => {
    const maxPossible = calculateMaxPossible();
    setInputValue(maxPossible.toString());
    setDebouncedValue(maxPossible);
  };

  // Update parent state after debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setKozAmount(debouncedValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [debouncedValue, setKozAmount]);

  return (
    <div className="mb-2">
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={`Min ${min} KOZ`}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
        />
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          KOZ
        </span>
      </div>
      
      {/* MIN/MAX buttons */}
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleMinClick}
          className="flex-1 py-1 px-2 text-xs text-white bg-gray-700 hover:bg-gray-600 rounded transition-colors"
        >
          MIN ({min})
        </button>
        <button
          onClick={handleMaxClick}
          className="flex-1 py-1 px-2 text-xs text-white bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          disabled={!walletBalance || walletBalance <= 2.5}
        >
          MAX ({calculateMaxPossible().toLocaleString()})
        </button>
      </div>
      
      <div className="h-4 mt-1">
        {kozAmount > 0 && kozAmount < min && (
          <p className="text-xs text-red-400">
            {t("errors.minimumKozRequired", { amount: min })}
          </p>
        )}
      </div>
    </div>
  );
}