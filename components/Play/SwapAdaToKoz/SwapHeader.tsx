import Image from "next/image";
import { useTranslations } from "next-intl";

interface Props {
  conversionRate: number;
  kozAvailable: number;
}

export default function SwapHeader({ conversionRate, kozAvailable }: Props) {
  const t = useTranslations("Swap");

  return (
    <div className="mb-4 flex flex-col sm:flex-row items-center gap-4">
      <Image src="/images/KOZ.png" alt="KOZ Token" width={80} height={80} className="rounded border-2 border-yellow-400" />
      <div>
        <h3 className="text-lg font-bold text-yellow-300">{t("title")}</h3>
        <p className="text-sm text-gray-300">
          {t("rate")} <span className="text-yellow-400 font-bold">1 ADA = {conversionRate} KOZ</span>
        </p>
        <p className="text-sm text-gray-300">
          {t("available")} <span className="text-white font-bold">{kozAvailable}</span>
        </p>
      </div>
    </div>
  );
}
