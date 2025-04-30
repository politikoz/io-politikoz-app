import { useQuery } from '@tanstack/react-query';
import api from '@/app/lib/api';
import { Ticket } from '@/types/TicketData';
import { getDecryptedStakeAddress } from '@/utils/encryption';

export function useTicketData() {
  //const stakeAddress = getDecryptedStakeAddress();

  const stakeAddress = 'stake1uypjm3lj957g5npktl7ljqx23lpena7jy8307zg3w95l9ncs759j7'; // Replace with the actual stake address or use a function to retrieve it

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
    staleTime: 0,
    refetchOnWindowFocus: true,
    retry: 2,
    enabled: !!stakeAddress, // Only run query if stakeAddress exists
  });
}