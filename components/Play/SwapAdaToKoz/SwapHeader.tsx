import Image from "next/image";
import { useTranslations } from "next-intl";
import TierInfo from "./TierInfo";
import { ElectionInfo, Tier } from "@/types/tiers";

interface Props {
  conversionRate: number;
  kozAvailable: number;
  currentTier: Tier;
  allTiers: Tier[];
  electionInfo: ElectionInfo;
}

export default function SwapHeader({ 
  conversionRate, 
  kozAvailable, 
  currentTier, 
  allTiers,
  electionInfo 
}: Props) {
  const t = useTranslations("Swap");
  const adaPerKoz = 1 / conversionRate;

  return (
    <div className="mb-4 space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Image
          src="/images/KOZ.png"
          alt="KOZ Token"
          width={80}
          height={80}
          className="rounded border-2 border-yellow-400"
        />
        <div className="flex-1">
          <h3 className="text-lg font-bold text-yellow-300">{t("title")}</h3>
          <p className="text-sm text-gray-300">
            {t("rate")}{" "}
            <span className="text-yellow-400 font-bold">1 KOZ = {adaPerKoz.toFixed(4)} ADA</span>
          </p>
          <p className="text-sm text-gray-300">
            {t("available")}{" "}
            <span className="text-white font-bold">{kozAvailable.toLocaleString()}</span>
          </p>
        </div>
      </div>

      <TierInfo 
        currentTier={currentTier} 
        allTiers={allTiers} 
        electionInfo={electionInfo}
      />
    </div>
  );
}
