import { useTranslations } from "next-intl";
import Timer from "@/utils/Timer";

interface NextTierCountdownProps {
  targetDate: string;
  tierId: number;
}

export default function NextTierCountdown({ targetDate, tierId }: NextTierCountdownProps) {
  const t = useTranslations("Swap");

  return (
    <div className="mt-4 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
      <p className="text-center text-yellow-400 font-medium mb-3">
        {t("tierWillBeAvailable", { tier: tierId })}
      </p>
      <div className="flex justify-center gap-4">
        {["days", "hours", "minutes", "seconds"].map((unit) => (
          <div key={unit} className="flex flex-col items-center">
            <div className="bg-gray-800/50 px-4 py-3 rounded border border-yellow-500/20">
              <Timer 
                unit={unit as "days" | "hours" | "minutes" | "seconds"} 
                targetDate={targetDate}
              />
            </div>
            <span className="text-xs text-gray-500 mt-2">
              {t(`timer.${unit}`)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}