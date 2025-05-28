import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { useTranslations } from "next-intl";

export default function AllTiersCompleted() {
  const t = useTranslations("Swap.tiers");

  return (
    <div className="mt-4 p-6 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
      <div className="flex justify-center mb-3">
        <CheckCircleIcon className="w-12 h-12 text-green-500" />
      </div>
      <h3 className="text-lg font-bold text-green-400 mb-2">
        {t('allTiersCompleted')}
      </h3>
      <p className="text-gray-300">
        {t('waitForNextWave')}
      </p>
    </div>
  );
}