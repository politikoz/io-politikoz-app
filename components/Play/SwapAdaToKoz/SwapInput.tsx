import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

interface Props {
  kozAmount: number;
  setKozAmount: (value: number) => void;
  max: number;
}

export default function SwapInput({ kozAmount, setKozAmount, max }: Props) {
  const t = useTranslations("Swap");
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    if (kozAmount > 0) {
      setInputValue(kozAmount.toString());
    } else {
      setInputValue("");
    }
  }, [kozAmount]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setInputValue("");
      setKozAmount(0);
      return;
    }

    const number = Number(value);
    if (!isNaN(number) && number > 0 && number <= max) {
      setInputValue(value);
      setKozAmount(number);
    }
  };

  return (
    <div className="mb-4">
      <label className="text-sm font-bold text-yellow-300 mb-1 block">
        {t("amountLabel")}
      </label>
      <input
        type="number"
        inputMode="numeric"
        pattern="[0-9]*"
        value={inputValue}
        onChange={handleChange}
        className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded"
        min={1}
        max={max}
        step={1}
      />
    </div>
  );
}
