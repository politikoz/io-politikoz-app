import { memo } from 'react';
import { useTranslations } from 'next-intl';

interface Props {
  onShowHistory: () => void;
}

const BuyTicketHistoryPlaceholder = memo(function BuyTicketHistoryPlaceholder({ onShowHistory }: Props) {
  const t = useTranslations('BuyTicket');

  return (
    <div className="mt-6">
      <h3 className="text-md font-bold text-yellow-300 mb-2">
        {t('historyTitle')}
      </h3>

      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={onShowHistory}
            className="px-4 py-1.5 text-xs text-gray-400 hover:text-yellow-400 
                     bg-gray-800/80 hover:bg-gray-800 rounded-full transition-all duration-200
                     border border-gray-700/50 hover:border-yellow-500/30 shadow-lg
                     backdrop-blur-sm z-10"
          >
            {t('viewHistory')}
          </button>
        </div>

        <div className="space-y-2 opacity-50 blur-[1px]">
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-800/50 p-4 rounded">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default BuyTicketHistoryPlaceholder;