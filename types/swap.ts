export enum SwapStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  FAILED = 'FAILED'
}

export interface SwapHistoryDTO {
    id: number;
    transactionHash: string;
    tier: string;
    ada: string;
    koz: string;
    status: SwapStatus;
    createdAt: string; // ISO date string from LocalDateTime
}

export interface CreateSwapDTO {
    stakeAddress: string;
    transactionHash: string;
    tier: string;
    ada: string;
    koz: string;
}

export interface UpdateSwapStatusDTO {
    status: SwapStatus;
}