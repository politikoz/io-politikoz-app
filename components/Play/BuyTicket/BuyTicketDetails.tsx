import { ArrowTopRightOnSquareIcon, CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { TransactionDetails } from './types';
import { useTranslations } from 'next-intl';

const getStatusIcon = (status?: string) => {
  switch (status) {
    case 'success':
      return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
    case 'error':
      return <XCircleIcon className="h-5 w-5 text-red-400" />;
    case 'loading':
      return <ArrowPathIcon className="h-5 w-5 text-white animate-spin" />;
    default:
      return null;
  }
};

const getStatusMessage = (status?: string) => {
  switch (status) {
    case 'success':
      return 'Transaction completed successfully';
    case 'error':
      return 'Transaction failed';
    case 'loading':
      return 'Processing transaction...';
    default:
      return '';
  }
};

interface TotalDetails {
  kozAmount: number;
  adaAmount: number;
}

interface Props {
  details: TransactionDetails;
  status?: string;
  txHash?: string;
  isLoading?: boolean;
  error?: string;
}

export default function BuyTicketDetails({ details, ...props }: Props) {
  const t = useTranslations("BuyTicket");
  const showSplitFees = details.serviceFee > 2.5;

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="space-y-4">
        {/* Status message if exists */}
        {(props.isLoading || props.error || props.status) && (
          <div className={`p-3 rounded-lg ${props.error ? 'bg-red-500/10 border-red-500/30' : 'bg-gray-700/50'}`}>
            <div className="flex items-center gap-2">
              {getStatusIcon(props.status)}
              <span className={props.error ? 'text-red-400' : 'text-white'}>
                {props.error || getStatusMessage(props.status)}
              </span>
            </div>
          </div>
        )}

        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-semibold text-yellow-400">
              {t("transactionDetails.title")}
            </h4>
            {props.status && (
              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0">
                  {getStatusIcon(props.status)}
                </div>
                <span className="text-sm capitalize">{props.status}</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {/* You Will Receive Section */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">{t("transactionDetails.willReceive")}</span>
              <div className="text-right">
                <div className="text-white font-medium">
                  {details.ticketAmount} {t("transactionDetails.tickets")}
                </div>
                <div className="text-green-400 text-xs">
                  +3 {t("transactionDetails.freeTicketShort")}
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-700"></div>

            {/* Costs Breakdown Section */}
            <div className="space-y-2">
              {/* KOZ Amount */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">{t("transactionDetails.kozAmount")}</span>
                <span className="text-white">{details.kozAmount.toLocaleString()} KOZ</span>
              </div>

              {/* ADA Fees */}
              {showSplitFees ? (
                <>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">{t("transactionDetails.minimumFee")}</span>
                    <span className="text-yellow-400">2.5 ADA</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">{t("transactionDetails.additionalFee")}</span>
                    <span className="text-yellow-400">{(details.serviceFee - 1.2).toFixed(2)} ADA</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">{t("transactionDetails.minimumFee")}</span>
                  <span className="text-yellow-400">2.5 ADA</span>
                </div>
              )}
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">{t("transactionDetails.networkFee")}</span>
                <span className="text-yellow-400">~{details.networkFee} ADA</span>
              </div>
            </div>

            {/* Totals Section */}
            <div className="h-px bg-gray-700 my-2"></div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-gray-400">{t("transactionDetails.totalKoz")}</span>
                <span className="text-white">{details.kozAmount.toLocaleString()} KOZ</span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-gray-400">{t("transactionDetails.totalAda")}</span>
                <div className="text-right">
                  <div className="text-white">
                    {(details.serviceFee + details.networkFee).toFixed(2)} ADA
                  </div>          
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Hash */}
          {props.txHash && (
            <div className="mt-3">
              <div className="text-xs text-gray-400 mb-1">{t("transactionDetails.transactionId")}:</div>
              <a
                href={`https://cardanoscan.io/transaction/${props.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs break-all bg-gray-700 p-2 rounded font-mono block hover:bg-gray-600 transition-colors text-yellow-500 hover:text-yellow-400 flex items-center justify-between"
              >
                <span>{props.txHash}</span>
                <ArrowTopRightOnSquareIcon className="h-4 w-4 flex-shrink-0 ml-2" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}