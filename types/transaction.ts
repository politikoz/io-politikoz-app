export interface TransactionDetails {
    adaAmount: number;
    kozAmount: number;
    returnAmount: number;
    serviceFee: number;
    networkFee: number;
    bribeFee?: number;
    total: number;
}

export type TransactionStatusType = 
    | 'connecting'    
    | 'signing'
    | 'submitting'
    | 'processing'
    | 'queued'
    | 'accepting'
    | 'completed'
    | 'failed'
    | 'cancelling'
    | 'cancelled';

export interface TransactionStatus {
    status: TransactionStatusType;
    txHash?: string;
    details?: TransactionDetails;
    error?: string;
    message?: string; // Add this line
}