import { memo } from 'react';
import { useTranslations } from 'next-intl';

interface Props {
  onShowHistory: () => Promise<void>;
}

const BuyTicketHistoryPlaceholder = memo(function BuyTicketHistoryPlaceholder({ onShowHistory }: Props) {
  const t = useTranslations('BuyTicket');

  const handleClick = async () => {
    try {
      await onShowHistory();
    } catch (error) {
      
    }
  };

  return (
    <div className="mt-6">
      {/* Header */}
      <h3 className="text-md font-bold text-yellow-300 mb-2">
        {t('historyTitle')}
      </h3>

      {/* Grid header */}
      <div className="grid grid-cols-4 gap-4 px-4 py-2 bg-gray-800/50 rounded-t border-b border-gray-700 text-sm font-medium text-gray-400">
        <div>{t('date')}</div>
        <div>{t('history.amount')}</div>
        <div>{t('history.transaction')}</div>
        <div className="text-center">{t('history.status')}</div>
      </div>

      {/* Placeholder content with centered button */}
      <div className="relative">
        {/* Centered button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={handleClick}
            className="px-4 py-1.5 text-xs text-gray-400 hover:text-yellow-400 
                     bg-gray-800/80 hover:bg-gray-800 rounded-full transition-all duration-200
                     border border-gray-700/50 hover:border-yellow-500/30 shadow-lg
                     backdrop-blur-sm z-10"
          >
            {t('viewHistory')}
          </button>
        </div>

        {/* Blurred rows */}
        <div className="space-y-2 opacity-50 blur-[1px]">
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="grid grid-cols-4 gap-4 px-4 py-3 bg-gray-800/20 rounded">
                <div className="h-4 bg-gray-700/30 rounded w-20"></div>
                <div className="h-4 bg-gray-700/30 rounded w-16"></div>
                <div className="h-4 bg-gray-700/30 rounded w-24"></div>
                <div className="h-4 bg-gray-700/30 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default BuyTicketHistoryPlaceholder;