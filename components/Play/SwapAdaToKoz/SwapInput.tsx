import { useTranslations } from "next-intl";
import { useState, useCallback, useEffect } from "react";

interface Props {
  kozAmount: number;
  setKozAmount: (amount: number) => void;
  max: number;
  min: number;
}

export default function SwapInput({ kozAmount, setKozAmount, max, min }: Props) {
  const t = useTranslations("Swap");
  const [inputValue, setInputValue] = useState<string>("");
  const [debouncedValue, setDebouncedValue] = useState<number>(0);

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
      <div className="h-4">
        {kozAmount > 0 && kozAmount < min && (
          <p className="text-xs text-red-400">
            {t("errors.minimumKozRequired", { amount: min })}
          </p>
        )}
      </div>
    </div>
  );
}