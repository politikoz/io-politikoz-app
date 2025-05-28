import { useState } from 'react';
import { Tier, ElectionInfo } from '@/types/tiers';
import { useTranslations } from 'next-intl';
import { ChevronRightIcon, CalendarIcon, TrophyIcon } from '@heroicons/react/24/outline';
import TierModal from './TierModal';

interface TierInfoProps {
  currentTier: Tier;
  allTiers: Tier[];
  electionInfo: ElectionInfo;
}

export default function TierInfo({ currentTier, allTiers, electionInfo }: TierInfoProps) {
  const t = useTranslations("Swap.tiers");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Loading state placeholder
  if (!currentTier || !electionInfo) {
    return (
      <div className="relative animate-pulse">
        <div className="w-full p-3 rounded border border-yellow-500/20 bg-gray-900">
          {/* Prize Information Box Skeleton */}
          <div className="mb-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center">
                <div className="h-5 w-24 bg-gray-700 rounded"></div>
                <div className="h-7 w-20 bg-gray-700 rounded mt-1"></div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="h-5 w-24 bg-gray-700 rounded"></div>
                <div className="h-5 w-28 bg-gray-700 rounded mt-1"></div>
              </div>
            </div>
          </div>

          {/* Progress Section Skeleton */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 bg-gray-700 rounded"></div>
              <div className="h-4 w-32 bg-gray-700 rounded"></div>
            </div>
            <div className="h-2 w-full bg-gray-700 rounded"></div>
          </div>

          {/* Note Skeleton */}
          <div className="mt-2">
            <div className="h-3 w-full bg-gray-700 rounded"></div>
            <div className="h-3 w-3/4 bg-gray-700 rounded mt-1"></div>
          </div>

          {/* Button Skeleton */}
          <div className="w-full h-9 mt-4 rounded bg-yellow-500/10 border border-yellow-500/20"></div>
        </div>
      </div>
    );
  }

  // Calculate days difference between current and potential election dates
  const currentElectionDate = new Date(electionInfo.electionStartDate);
  const potentialElectionDate = new Date(electionInfo.nextPotentialElectionStartDate);
  const daysDifference = Math.ceil((currentElectionDate.getTime() - potentialElectionDate.getTime()) / (1000 * 3600 * 24));

  const remainingPercentage = (currentTier.remainingKozSupply / currentTier.kozSupply) * 100;
  const kozPerTicket = currentTier.adaPerTicket / currentTier.adaPerKoz;
  const soldTickets = Math.floor((currentTier.kozSupply - currentTier.remainingKozSupply) / kozPerTicket);
  
  const getUrgencyColor = () => {
    if (remainingPercentage <= 25) return 'text-red-500 bg-red-500';
    if (remainingPercentage <= 50) return 'text-yellow-500 bg-yellow-500';
    return 'text-green-500 bg-green-500';
  };

  const [baseColor, bgColor] = getUrgencyColor().split(' ');

  return (
    <div className="relative">
      <div className="w-full p-3 rounded border border-yellow-500/20 bg-gray-900">
        {/* Tier Number Display */}
        <div className="absolute top-2 left-3 mb-8">
          <span className="text-yellow-400 font-bold">
            {t('tierNumber', { number: currentTier.tierId })}
          </span>
        </div>

        {/* Prize Information Box */}
        <div className="mt-8 mb-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
          {currentTier.status === 'PENDING' ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center">
                <span className="text-yellow-500 text-sm font-medium flex items-center gap-1">
                  <TrophyIcon className="w-4 h-4" />
                  {t('prizeLabel')}
                </span>
                <div className="text-xl font-bold text-yellow-400 mt-1">
                  {currentTier.prizePerTier} ADA
                </div>           
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-yellow-500 text-sm font-medium flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4" />
                  {t('nextElectionLabel')}
                </span>
                <div className="text-sm font-medium text-gray-300 mt-1">
                  {new Date(electionInfo.electionStartDate).toLocaleDateString()}
                </div>
                {daysDifference > 0 && (
                  <div className="text-xs text-green-400">
                    {t('earlierByDays', { days: daysDifference })}*
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <span className="text-yellow-500 text-sm font-medium flex items-center gap-1">
                <TrophyIcon className="w-4 h-4" />
                {t('prizeLabel')}
              </span>
              <div className="text-xl font-bold text-yellow-400 mt-1">
                {currentTier.prizePerTier} ADA
              </div>           
            </div>
          )}
        </div>

        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={`text-sm font-bold ${baseColor}`}>
              {remainingPercentage.toFixed(1)}% {t('remaining')}
            </span>
            <div className="text-sm text-gray-400">
              {t('projectedTickets')}: {soldTickets}/{currentTier.ticketsPerTier}
            </div>
          </div>
          <div className="h-2 bg-gray-700 rounded overflow-hidden">
            <div 
              className={`h-full ${bgColor}/50 transition-all`}
              style={{ width: `${remainingPercentage}%` }}
            />
          </div>
        </div>

        {/* Early Completion Note */}
        <div className="mt-2 text-xs text-gray-400">
          * {t('earlyCompletionNote')}
        </div>

        {/* View All Tiers Button */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full mt-4 py-2 px-4 rounded bg-yellow-500/10 hover:bg-yellow-500/20 
                     border border-yellow-500/20 hover:border-yellow-500/40 
                     text-yellow-500 text-sm font-medium
                     transition-all duration-200 flex items-center justify-center gap-2"
        >
          {t('viewAllTiers')}
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>

      <TierModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentTier={currentTier}
        allTiers={allTiers}
        electionInfo={electionInfo}
      />
    </div>
  );
}