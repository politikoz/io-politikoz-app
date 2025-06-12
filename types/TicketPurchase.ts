export interface TicketPurchaseHistoryDTO {
  id: number;
  ticketQuantity: number;
  transactionHash: string;
  kozAmount: string;
  adaAmount: string;
  status: 'VALIDATING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
}

export interface TicketPurchase {
  id: number;
  stakeAddress: string;
  quantity: number;
  kozAmount: string;
  adaAmount: string;
  transactionHash: string;
  status: 'VALIDATING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketPurchaseDTO {
  stakeAddress: string;
  quantity: number;
  kozAmount: string;
  adaAmount: string;
  transactionHash: string;
}