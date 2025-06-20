import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, CalendarIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

interface CurrentSeasonPromoProps {
  tierProgress: {
    percentageCompleted: number;
    prizePerTier: number;
    status: 'COMPLETED' | 'IN_PROGRESS';
    estimatedExecutionDate: string;
    tierId: number;
  } | null;
  isLoading?: boolean;
  nextElectionDate?: string;
}

export default function CurrentSeasonPromo({ 
  tierProgress, 
  isLoading = false,
  nextElectionDate 
}: CurrentSeasonPromoProps) {
  const t = useTranslations("CurrentSeasonPromo");
  const router = useRouter();

  if (isLoading) {
    return <SeasonPlaceholder />;
  }

  if (!tierProgress || !nextElectionDate) return null;

  const formattedProgress = tierProgress.percentageCompleted;
  const isCompleted = tierProgress.status === 'COMPLETED';

  const handleSwapClick = () => {
    router.push("/office?section=buy-koz");
  };

  return (
    <div className="relative bg-gradient-to-br from-[#2A2118] to-[#3F332C] rounded-xl border-2 border-[#4B3F36] 
                    shadow-lg w-full sm:w-[440px] h-[280px] p-6 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-500/5 rounded-full translate-y-12 -translate-x-12" />

      <div className="relative h-full flex flex-col">
        {!isCompleted && (
          <span className="font-pixel text-sm text-yellow-400 mb-4">
            {t("season")} {String(tierProgress.tierId).padStart(2, '0')}
          </span>
        )}

        {!isCompleted && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-sm">{t("seasonProgress")}</span>
              <span className="text-green-400 font-bold">{formattedProgress}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${formattedProgress}%` }}
              />
            </div>
          </div>
        )}

        {isCompleted ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h3 className="text-green-400 font-pixel text-xl mb-2">
              {t("seasonCompletedTitle", { season: String(tierProgress.tierId).padStart(2, '0') })}
            </h3>
            <div className="animate-bounce mb-6">
              <CheckCircleIcon className="w-12 h-12 text-green-400" />
            </div>
            <div className="space-y-2">
              <p className="text-yellow-400 text-lg font-bold">
                {t("nextElectionAnnouncement", { prize: tierProgress.prizePerTier.toLocaleString() })}
              </p>
              <p className="text-gray-300 text-sm">
                {t("prepareMessage")}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Prize and Next Election Info */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-black/20 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">
                  {isCompleted ? t("boostedPrize") : t("prizePool")}
                </p>
                <p className="text-white font-bold text-sm">
                  {tierProgress.prizePerTier.toLocaleString()} 
                  <span className="text-blue-400 ml-1">ADA</span>
                </p>
              </div>
              <div className="bg-black/20 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">
                  {isCompleted ? t("nextElection") : t("earlyElection")}
                </p>
                <div className="flex items-center gap-1">
                  <CalendarIcon className={`w-4 h-4 ${isCompleted ? 'text-blue-400' : 'text-green-400'}`} />
                  <p className={`text-sm font-medium ${isCompleted ? 'text-blue-400' : 'text-green-400'}`}>
                    {new Intl.DateTimeFormat('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }).format(new Date(isCompleted ? nextElectionDate : tierProgress.estimatedExecutionDate))}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-auto">
              {!isCompleted && (
                <button
                  onClick={handleSwapClick}
                  className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400
                           text-white px-6 py-2.5 rounded-lg font-pixel text-sm uppercase
                           transform transition-all duration-200 shadow-lg
                           flex items-center justify-center gap-2 group mb-2"
                >
                  <span>{t("swapNow")}</span>
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}

              <p className="text-center text-xs text-gray-400">
                {isCompleted ? t("seasonCompletedMessage") : t("completeSeasonMessage")}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SeasonPlaceholder() {
  return (
    <div className="relative bg-gradient-to-br from-[#2A2118] to-[#3F332C] rounded-xl border-2 border-[#4B3F36] 
                    shadow-lg w-full sm:w-[440px] h-[280px] p-6 overflow-hidden animate-pulse">
      {/* Background decoration placeholders */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-500/5 rounded-full translate-y-12 -translate-x-12" />

      {/* Content placeholders */}
      <div className="relative h-full flex flex-col">
        {/* Season Badge placeholder */}
        <div className="inline-block bg-gray-700/50 rounded-full w-24 h-6 mb-4" />

        {/* Progress Section placeholder */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <div className="bg-gray-700/50 w-24 h-4 rounded" />
            <div className="bg-gray-700/50 w-12 h-4 rounded" />
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2" />
        </div>

        {/* Stats Grid placeholder */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-black/20 rounded-lg p-3">
            <div className="bg-gray-700/50 w-20 h-3 mb-2 rounded" />
            <div className="bg-gray-700/50 w-28 h-5 rounded" />
          </div>
          <div className="bg-black/20 rounded-lg p-3">
            <div className="bg-gray-700/50 w-20 h-3 mb-2 rounded" />
            <div className="bg-gray-700/50 w-28 h-5 rounded" />
          </div>
        </div>

        {/* Button placeholder */}
        <div className="w-full bg-gray-700/50 h-12 rounded-lg" />

        {/* Message placeholder */}
        <div className="bg-gray-700/50 w-48 h-3 mx-auto mt-4 rounded" />
      </div>
    </div>
  );
}