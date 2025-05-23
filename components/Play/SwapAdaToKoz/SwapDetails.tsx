import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { TransactionStatusType } from '@/types/transaction';

const CARDANOSCAN_URL = 'https://cardanoscan.io/transaction/';

interface SwapDetailsProps {
    kozAmount: number;
    adaAmount: number;
    status?: TransactionStatusType;
    txHash?: string;
    isLoading?: boolean;
    error?: string;
    message?: string; // Add this line
}

export default function SwapDetails({ 
    kozAmount, 
    adaAmount, 
    status, 
    txHash,
    isLoading,
    error,
    message
}: SwapDetailsProps) {
    const serviceFee = 0.5;
    const networkFee = 0.18;
    const returnAmount = 2;
    const total = adaAmount + serviceFee + networkFee + returnAmount;

    const getStatusMessage = (status: string | undefined) => {
        switch (status) {
            case 'connecting':
                return 'Checking wallet connection...';
            case 'signing':
                return 'Waiting for signature...';
            case 'submitting':
                return 'Submitting transaction...';
            case 'processing':
                return 'Processing swap...';
            case 'accepting':
                return 'Accepting swap...';
            case 'cancelling':
                return 'Cancelling swap...';
            default:
                return 'Processing...';
        }
    };

    const getStatusIcon = (status: string | undefined) => {
        switch (status) {
            case 'connecting':
                 return (
                    <div className="animate-spin h-4 w-4 border-2 border-yellow-500 rounded-full border-t-transparent" />
                );
            case 'processing':
                 return (
                    <div className="animate-spin h-4 w-4 border-2 border-yellow-500 rounded-full border-t-transparent" />
                );      
            case 'accepting':
                return (
                    <div className="animate-spin h-4 w-4 border-2 border-yellow-500 rounded-full border-t-transparent" />
                );
            case 'cancelling':
                 return (
                    <div className="animate-spin h-4 w-4 border-2 border-yellow-500 rounded-full border-t-transparent" />
                );
            case 'signing':   
             return (
                    <div className="animate-spin h-4 w-4 border-2 border-yellow-500 rounded-full border-t-transparent" />
                );     // Added signing status
            case 'submitting':     // Added submitting status
                return (
                    <div className="animate-spin h-4 w-4 border-2 border-yellow-500 rounded-full border-t-transparent" />
                );
            case 'completed':
                return <span className="text-green-500">✓</span>;
            case 'failed':
                return <span className="text-red-500">✗</span>;
            default:
                return null;
        }
    };

    return (
        <div className="mt-4 space-y-4">
            {/* Status Title Card - Only show during active transactions */}
            {((isLoading && status === 'connecting') || error) && (
                <div className={`mt-4 bg-gray-900 rounded-lg p-3 border ${error ? 'border-red-500' : 'border-yellow-500'} shadow-lg`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-500" />
                            ) : error ? (
                                <div className="text-red-500">✗</div>
                            ) : null}
                            <p className={`text-sm ${error ? 'text-red-400' : 'text-white'}`}>
                                {error ? error : getStatusMessage(status)}
                            </p>
                        </div>
                        {txHash && (
                            <div className="text-xs text-gray-400">
                                TX: <a 
                                    href={`${CARDANOSCAN_URL}${txHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-mono text-yellow-500 hover:text-yellow-400 transition-colors inline-flex items-center gap-1"
                                >
                                    {txHash.slice(0, 8)}...{txHash.slice(-8)}
                                    <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Message Info Box - Updated with conditional styling */}
            {message && (
                <div className={`p-4 rounded-lg text-sm ${
                    status === 'cancelling'
                        ? 'bg-red-500/10 border border-red-500/30 text-red-300'
                        : 'bg-blue-500/10 border border-blue-500/30 text-blue-300'
                }`}>
                    {message}
                </div>
            )}

            {/* Main Transaction Details Card */}
            <div className="mt-4 bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-sm font-semibold text-yellow-400">Transaction Details</h4>
                            {status && (
                                <div className="flex items-center space-x-2">
                                    <div className="flex-shrink-0">
                                        {getStatusIcon(status)}
                                    </div>
                                    <span className={`text-sm capitalize ${
                                        status === 'cancelling' ? 'text-yellow-500' : ''
                                    }`}>
                                        {status}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">You will receive:</span>
                                <div className="text-right">
                                    <div className="text-white font-medium">{kozAmount} KOZ</div>
                                    <div className="text-green-400 text-sm">+ {returnAmount} ADA return</div>
                                </div>
                            </div>

                            <div className="h-px bg-gray-700"></div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">Swap Amount:</span>
                                    <span className="text-white">{adaAmount} ADA</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500">Required Return Amount:</span>
                                    <span className="text-green-400">{returnAmount} ADA *</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500">Service Fee:</span>
                                    <span className="text-yellow-400">{serviceFee} ADA</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500">Network Fee (est.):</span>
                                    <span className="text-yellow-400">~{networkFee} ADA</span>
                                </div>
                                <div className="h-px bg-gray-700 my-2"></div>
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <span className="text-gray-400">Total Required:</span>
                                    <div className="text-right">
                                        <div className="text-white">{total} ADA</div>
                                        <div className="text-xs text-green-400">({returnAmount} ADA will be returned)</div>
                                    </div>
                                </div>
                            </div>

                            {/* Transaction Hash */}
                            {txHash && (
                                <div className="mt-3">
                                    <div className="text-xs text-gray-400 mb-1">Transaction ID:</div>
                                    <a
                                        href={`${CARDANOSCAN_URL}${txHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs break-all bg-gray-700 p-2 rounded font-mono block hover:bg-gray-600 transition-colors text-yellow-500 hover:text-yellow-400 flex items-center justify-between"
                                    >
                                        <span>{txHash}</span>
                                        <ArrowTopRightOnSquareIcon className="h-4 w-4 flex-shrink-0 ml-2" />
                                    </a>
                                </div>
                            )}

                            <div className="text-xs text-gray-500 mt-2">
                                * {returnAmount} ADA will be returned to your wallet after the swap<br />
                                * Network fee is approximate and may vary slightly
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}