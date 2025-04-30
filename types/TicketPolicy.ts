export type TicketRole = 'CORRUPT' | 'LOBBYIST' | 'BRIBER' | 'LAUNDERER';

export interface TicketValue {
  role: TicketRole;
  value: number;
}

export interface TicketPolicyData {
  ticketValues: TicketValue[];
  kozRewardRate: number;
  nextRebalanceEpoch: number;
}

export const INITIAL_TICKET_POLICY: TicketPolicyData = {
  ticketValues: [
    { role: 'CORRUPT', value: 0 },
    { role: 'LOBBYIST', value: 0 },
    { role: 'BRIBER', value: 0 },
    { role: 'LAUNDERER', value: 0 }
  ],
  kozRewardRate: 0,
  nextRebalanceEpoch: 0
};