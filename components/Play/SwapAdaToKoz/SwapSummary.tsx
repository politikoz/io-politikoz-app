import { useTranslations } from "next-intl";

interface Props {
  kozAmount: number;
  adaAmount: number;
  maxKozAvailable: number;
  onSwap: () => void;
}

export default function SwapSummary({ kozAmount, adaAmount, maxKozAvailable, onSwap }: Props) {
  const t = useTranslations("Swap");

  const isDisabled = kozAmount <= 0 || kozAmount > maxKozAvailable;

  return (
    <>
      <p className="text-sm text-gray-300 mb-4">
        {t("costLabel")} <span className="text-white font-bold">{adaAmount} ADA</span>
      </p>
      <button
        onClick={onSwap}
        disabled={isDisabled}
        className={`w-full px-4 py-2 font-bold text-black bg-yellow-400 rounded shadow-md transition ${
          isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-yellow-500"
        }`}
      >
        {t("swapButton")}
      </button>
    </>
  );
}
