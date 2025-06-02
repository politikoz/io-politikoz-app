import { useQuery } from '@tanstack/react-query';
import api from '@/app/lib/api';
import { Politikoz } from '@/types/PolitikozData';
import { useEffect, useState } from 'react';

export function usePolitikozData() {
  const [stakeAddress, setStakeAddress] = useState<string | null>(null);
  
  useEffect(() => {
    setStakeAddress(localStorage.getItem('stakeAddress'));
  }, []);

  const query = useQuery({
    queryKey: ['politikoz', stakeAddress],
    queryFn: async () => {
      if (!stakeAddress) {
        return []; 
      }

      const response = await api.get<Politikoz[]>(`/api/v1/party/list-politikoz`, {
        params: { stakeAddress }
      });
      return response.data;
    },
    enabled: !!stakeAddress,
    staleTime: 0,
    refetchOnWindowFocus: true,
    retry: 2
  });

  if (!stakeAddress) {
    return {
      ...query,
      data: [],
      isLoading: false,
      isError: false,
      error: null
    };
  }

  return query;
}