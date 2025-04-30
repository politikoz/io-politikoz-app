import { TicketPolicyData, TicketRole } from '@/types/TicketPolicy';

export function calculateTickets(adaAmount: number, policyData: TicketPolicyData) {
  const tickets = policyData.ticketValues.map(({ role, value }) => ({
    role,
    quantity: Math.floor(adaAmount / value)
  }));

  const estimatedKozRewards = adaAmount * policyData.kozRewardRate;

  return {
    tickets,
    estimatedKozRewards
  };
}