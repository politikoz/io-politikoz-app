export interface SwapHistory {
    adaSent: number;
    kozReceived: number;
    timestamp: string;
  }
  
  export interface SwapProps {
    conversionRate: number;
    kozAvailable: number;
    adaReceiverAddress: string;
  }
  