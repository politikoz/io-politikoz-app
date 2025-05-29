export interface BuyTicketHistory {
  id: number;
  ticketAmount: number;
  kozAmount: number;
  timestamp: string;
  txHash?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
}

export interface BuyTicketProps {
  kozBalance: number;  // This will be replaced with real balance later
}

export interface TransactionDetails {
  ticketAmount: number;
  actualTicketAmount: number; // Novo campo para total com ticket grátis
  kozAmount: number;
  serviceFee: number;
  networkFee: number;
  total: number;
}