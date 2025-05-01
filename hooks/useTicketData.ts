import { useQuery } from '@tanstack/react-query';
import api from '@/app/lib/api';
import { Ticket, INITIAL_TICKET_DATA } from '@/types/TicketData';
import { getDecryptedStakeAddress } from '@/utils/encryption';

export function useTicketData() {
  const mockStakeAddress = process.env.NEXT_PUBLIC_STAKE_ADDRESS_MOCK;
  const stakeAddress = mockStakeAddress || getDecryptedStakeAddress();

  return useQuery({
    queryKey: ['tickets', stakeAddress],
    queryFn: async () => {
      if (!stakeAddress) {
        throw new Error('No stake address found');
      }

      const response = await api.get<Ticket[]>(`/api/v1/office/tickets`, {
        params: { stakeAddress }
      });
      return response.data;
    },
    initialData: INITIAL_TICKET_DATA,
    staleTime: 0,
    refetchOnWindowFocus: true,
    retry: 2,
    enabled: !!stakeAddress, // Only run query if stakeAddress exists
  });
}