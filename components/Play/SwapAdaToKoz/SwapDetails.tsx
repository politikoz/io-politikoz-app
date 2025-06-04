import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { TransactionStatusType } from '@/types/transaction';
import { useTranslations } from 'next-intl';
import { useValidateReferralCode } from '@/hooks/useValidateReferralCode';
import { useState } from 'react';

const CARDANOSCAN_URL = 'https://cardanoscan.io/transaction/';

interface SwapDetailsProps {
    kozAmount: number;
    adaAmount: number;
    status?: TransactionStatusType;
    txHash?: string;
    isLoading?: boolean;
    error?: string;
    message?: string; // Add this line
    min?: number;
    referralCode?: string;
    onReferralCodeChange: (code: string) => void;
}

export default function SwapDetails({ 
    kozAmount, 
    adaAmount, 
    status, 
    txHash,
    isLoading,
    error,
    message,
    min = 200,
    referralCode,
    onReferralCodeChange
}: SwapDetailsProps) {
    const t = useTranslations("Swap");
    const validateReferralMutation = useValidateReferralCode();
    const [referralError, setReferralError] = useState<string | null>(null);
    const [validReferral, setValidReferral] = useState(false);
    const serviceFee = 0.5;
    const networkFee = 0.18;
    const returnAmount = 2;
    const roundedAdaAmount = Math.ceil(adaAmount * 100) / 100;
    const total = Math.ceil((roundedAdaAmount + serviceFee + networkFee + returnAmount) * 100) / 100;
    const isValidAmount = kozAmount >= min;

    const getStatusMessage = (status: string | undefined) => {
        if (!status) return t("status.default");
        return t(`status.${status}`);
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
                return (<span className="text-green-500">✓</span>);
            case 'failed':
                return <span className="text-red-500">✗</span>;
            default:
                return null;
        }
    };

    const handleValidateReferral = async () => {
        if (!referralCode) return;
        
        try {
            setReferralError(null);
            const { valid } = await validateReferralMutation.mutateAsync(referralCode);
            
            if (valid) {
                setValidReferral(true);
                onReferralCodeChange(referralCode);
            } else {
                setReferralError(t("transactionDetails.invalidReferralCode"));
                setValidReferral(false);
            }
        } catch (error) {
            setReferralError(t("transactionDetails.referralValidationError"));
            setValidReferral(false);
        }
    };

    return (
        <div className="mt-2">
            {/* Status and Message - Only render div if there's content */}
            {((isLoading && status === 'connecting') || error || message) && (
                <div className="mb-3">
                    {/* Status card */}
                    {((isLoading && status === 'connecting') || error) && (
                        <div className={`bg-gray-900 rounded-lg p-3 border ${error ? 'border-red-500' : 'border-yellow-500'} shadow-lg mb-2`}>
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
                    )}

                    {/* Message box */}
                    {message && (
                        <div className={`p-4 rounded-lg text-sm ${
                            status === 'cancelling'
                                ? 'bg-red-500/10 border border-red-500/30 text-red-300'
                                : 'bg-blue-500/10 border border-blue-500/30 text-blue-300'
                        }`}>
                            {message}
                        </div>
                    )}
                </div>
            )}

            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="space-y-4">
                    {/* Referral Code Input with Bonus Info */}
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="referralCode" className="text-sm text-gray-400">
                            {t("transactionDetails.referralCode")} ({t("transactionDetails.optional")})
                        </label>
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <input
                                    id="referralCode"
                                    type="text"
                                    value={referralCode}
                                    onChange={(e) => {
                                        setValidReferral(false);
                                        setReferralError(null);
                                        onReferralCodeChange(e.target.value);
                                    }}
                                    placeholder={t("transactionDetails.enterReferralCode")}
                                    className={`w-full bg-gray-700 border ${
                                        referralError ? 'border-red-500' : 
                                        validReferral ? 'border-green-500' : 
                                        'border-gray-600'
                                    } rounded px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500`}
                                    maxLength={20}
                                />
                                <button
                                    onClick={handleValidateReferral}
                                    disabled={!referralCode || validateReferralMutation.isPending}
                                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                                        !referralCode || validateReferralMutation.isPending
                                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                            : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                                    }`}
                                >
                                    {validateReferralMutation.isPending ? (
                                        <div className="animate-spin h-5 w-5 border-2 border-black rounded-full border-t-transparent" />
                                    ) : t("transactionDetails.validate")}
                                </button>
                            </div>
                            
                            {referralError && (
                                <div className="text-xs text-red-400 flex items-center gap-1 pl-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    {referralError}
                                </div>
                            )}

                            {validReferral && (
                                <div className="text-xs text-green-400 flex items-center gap-1 pl-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    {t("transactionDetails.validReferralCode")}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-sm font-semibold text-yellow-400">
                                {t("transactionDetails.title")}
                            </h4>
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
                                <span className="text-gray-400">{t("transactionDetails.willReceive")}</span>
                                <div className="text-right">
                                    <div className="text-white font-medium">
                                        {isValidAmount ? `${kozAmount} KOZ` : '-'}
                                    </div>
                                    <div className="text-green-400 text-sm">
                                        {isValidAmount ? t("transactionDetails.returnAmount", { amount: returnAmount }) : '-'}
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-gray-700"></div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">{t("transactionDetails.swapAmount")}</span>
                                    <span className="text-white">
                                        {isValidAmount ? `${roundedAdaAmount.toFixed(2)} ADA` : '-'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500">{t("transactionDetails.requiredReturn")}</span>
                                    <span className="text-green-400">{returnAmount} ADA *</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500">{t("transactionDetails.serviceFee")}</span>
                                    <span className="text-yellow-400">{serviceFee} ADA</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500">{t("transactionDetails.networkFee")}</span>
                                    <span className="text-yellow-400">~{networkFee} ADA</span>
                                </div>

                                <div className="h-px bg-gray-700 my-2"></div>

                                <div className="flex justify-between items-center text-sm font-medium">
                                    <span className="text-gray-400">{t("transactionDetails.totalRequired")}</span>
                                    <div className="text-right">
                                        <div className="text-white">
                                            {isValidAmount ? `${total.toFixed(2)} ADA` : '-'}
                                        </div>
                                        <div className="text-xs text-green-400">
                                            {t("transactionDetails.returnMessage", { amount: returnAmount })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Transaction Hash */}
                            {txHash && (
                                <div className="mt-3">
                                    <div className="text-xs text-gray-400 mb-1">{t("transactionDetails.transactionId")}:</div>
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
                                * {t("notes.returnNote", { amount: returnAmount })}<br />
                                * {t("notes.networkNote")}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}