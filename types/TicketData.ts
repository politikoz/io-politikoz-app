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

export const INITIAL_TICKET_DATA: Ticket[] = [
  {
    id: 0,
    type: 'Launderer',
    name: '01235',
    luckyNumber: '00',
    inElection: false,
    nextElection: false,
    estimatedEarnings: 0,
    singleUse: false
  }
];