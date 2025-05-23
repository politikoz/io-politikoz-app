import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

interface Props {
  kozAmount: number;
  setKozAmount: (amount: number) => void;
  max: number;
  min: number;
}

export default function SwapInput({ kozAmount, setKozAmount, max, min }: Props) {
  const t = useTranslations("Swap");
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    if (kozAmount > 0) {
      setInputValue(kozAmount.toString());
    } else {
      setInputValue("");
    }
  }, [kozAmount]);

  const handleInputChange = (value: string) => {
    const numValue = Number(value);
    if (isNaN(numValue)) return;
    setKozAmount(Math.min(numValue, max));
  };

  return (
    <div className="mt-4">
      <div className="relative">
        <input
          type="number"
          value={kozAmount || ""}
          onChange={(e) => handleInputChange(e.target.value)}
          min={min}
          max={max}
          placeholder={`Min ${min} KOZ`}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          KOZ
        </span>
      </div>
      {kozAmount > 0 && kozAmount < min && (
        <p className="mt-1 text-xs text-red-400">
          {t("errors.minimumKozRequired", { amount: min })}
        </p>
      )}
    </div>
  );
}
