import { useQuery } from '@tanstack/react-query';
import api from '@/app/lib/api';
import { Politikoz, INITIAL_POLITIKOZ_DATA } from '@/types/PolitikozData';

export function usePolitikozData() {
  const mockStakeAddress = process.env.NEXT_PUBLIC_STAKE_ADDRESS_MOCK;
  const stakeAddress = mockStakeAddress || localStorage.getItem('stakeAddress');

  return useQuery({
    queryKey: ['politikoz', stakeAddress],
    queryFn: async () => {
      if (!stakeAddress) {
        throw new Error('No stake address found');
      }

      const response = await api.get<Politikoz[]>(`/api/v1/party/list-politikoz`, {
        params: { stakeAddress }
      });
      return response.data;
    },
    initialData: INITIAL_POLITIKOZ_DATA,
    staleTime: 0,
    refetchOnWindowFocus: true,
    retry: 2,
    enabled: !!stakeAddress,
  });
}