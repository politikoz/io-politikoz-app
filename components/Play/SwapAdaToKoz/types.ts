export interface SwapHistory {
    adaSent: number;
    kozReceived: number;
    timestamp: string;
    txHash?: string;  // Added txHash property as optional
    status?: 'pending' | 'completed' | 'failed';  // Optional status field
  }
  
  export interface SwapProps {
    conversionRate: number;
    kozAvailable: number;
    adaReceiverAddress: string;
  }
