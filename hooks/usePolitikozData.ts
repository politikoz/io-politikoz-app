import { useQuery } from '@tanstack/react-query';
import api from '@/app/lib/api';
import { Politikoz } from '@/types/PolitikozData';

export function usePolitikozData() {
  const stakeAddress = localStorage.getItem('stakeAddress');

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
    staleTime: 0,
    refetchOnWindowFocus: true,
    retry: 2,
    enabled: !!stakeAddress,
  });
}