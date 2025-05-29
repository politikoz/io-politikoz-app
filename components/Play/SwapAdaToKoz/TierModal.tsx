import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Tier, ElectionInfo } from '@/types/tiers'
import { useTranslations } from 'next-intl'

interface TierModalProps {
  isOpen: boolean
  onClose: () => void
  currentTier: Tier
  allTiers: Tier[]
  electionInfo: ElectionInfo // Add this line
}

function calculateTicketProgress(tier: Tier): {
  soldTickets: number;
  percentageRemaining: number;
} {
  const kozPerTicket = tier.adaPerTicket / tier.adaPerKoz;
  const soldTickets = Math.floor((tier.kozSupply - tier.remainingKozSupply) / kozPerTicket);
  const percentageRemaining = (tier.remainingKozSupply / tier.kozSupply) * 100;

  return {
    soldTickets,
    percentageRemaining
  };
}

export default function TierModal({ isOpen, onClose, currentTier, allTiers, electionInfo }: TierModalProps) {
  const t = useTranslations("Swap.tiers");

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-300"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="bg-gray-900 px-4 pb-4 pt-5 sm:p-6">
                  <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-yellow-500 mb-2">
                    {t('modalTitle')}
                  </Dialog.Title>
                  <p className="text-sm text-gray-300 mb-6">
                    {t('modalDescription')}
                  </p>
                  <div className="space-y-4">
                    {allTiers.map((tier) => {
                      const { soldTickets, percentageRemaining } = calculateTicketProgress(tier);
                      
                      return (
                        <div 
                          key={tier.tierId}
                          className={`p-4 rounded-lg border ${
                            tier.tierId === currentTier.tierId 
                              ? 'border-yellow-500 bg-yellow-500/10' 
                              : 'border-gray-700'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <span className="text-sm font-medium text-white">
                                {t('tierNumber', { number: tier.tierId })}
                                {tier.tierId === currentTier.tierId && (
                                  <span className="ml-2 text-xs text-yellow-500">
                                    ({t('currentTierLabel')})
                                  </span>
                                )}
                              </span>
                              <div className="text-xs text-gray-400 mt-1">
                                {t('kozPrice', { price: tier.adaPerKoz.toFixed(4) })}
                              </div>
                            </div>
                            <span className={`text-sm ${tier.status === 'PENDING' ? 'text-yellow-500' : 'text-gray-500'}`}>
                              {t(`status.${tier.status}`)}
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <div className="text-gray-400">{t('projectedTickets')}</div>
                                <div className="text-white font-medium">
                                  {soldTickets}/{tier.ticketsPerTier}
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-400">{t('adaPerTicketLabel')}</div>
                                <div className="text-white font-medium">{tier.adaPerTicket} ADA</div>
                              </div>
                            </div>
                            
                            <div className="h-2 bg-gray-700 rounded overflow-hidden">
                              <div 
                                className="h-full transition-all duration-300"
                                style={{ 
                                  width: `${(soldTickets/tier.ticketsPerTier) * 100}%`,
                                  backgroundColor: '#22c55e' // Green color
                                }}
                              />
                            </div>

                            {/* Highlight the Frontman Boost Prize */}
                            <div className="mt-4 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                              <div className="flex justify-between items-center">
                                <span className="text-yellow-500 font-medium text-sm">
                                  {t('prizeLabel')}
                                </span>
                                <span className="text-yellow-400 font-bold">
                                  {tier.prizePerTier} ADA
                                </span>
                              </div>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-400">
                                {t('supply', { amount: tier.remainingKozSupply.toLocaleString() })}
                              </span>
                              <span className={tier.status === 'PENDING' ? 'text-yellow-500' : 'text-gray-500'}>
                                {t(`status.${tier.status}`)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}