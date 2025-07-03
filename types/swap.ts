export enum SwapStatus {
  PENDING = 'PENDING',
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  FAILED = 'FAILED'
}

export interface SwapHistoryDTO {
    id: number;
    transactionHash: string;
    tierId: number;
    ada: string;
    koz: string;
    status: SwapStatus;
    createdAt: string; // ISO date string from LocalDateTime
}

export interface CreateSwapDTO {
    stakeAddress: string;
    transactionHash: string;
    tierId: number;
    ada: string;
    koz: string;
    referralCode?: string; // Add optional referral code
}

export interface UpdateSwapStatusDTO {
    id: number;
    status: SwapStatus;
}