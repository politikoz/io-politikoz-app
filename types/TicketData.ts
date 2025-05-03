export interface Ticket {
  id: number;
  type: string;
  name: string;
  luckyNumber: string;
  inElection: boolean;
  nextElection: boolean;
  politikozLinked?: string;
  estimatedEarnings: number;
  singleUse: boolean;
}

export const INITIAL_TICKET_DATA: Ticket[] = [];