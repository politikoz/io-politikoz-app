import { useQuery } from '@tanstack/react-query';
import { UserGridViewResponse } from '@/types/UserGridViewData';
import api from '@/app/lib/api';
import { useEffect, useState } from 'react';

export function useUserGridView() {
  const [stakeAddress, setStakeAddress] = useState<string | null>(null);
  
    useEffect(() => {
      setStakeAddress(localStorage.getItem('stakeAddress'));
    }, []);

  return useQuery({
    queryKey: ['userGridView', stakeAddress],
    queryFn: async () => {
      if (!stakeAddress) {
        throw new Error('No stake address found');
      }
      
      const response = await api.get<UserGridViewResponse>(
        `/office/user-grid-view?stakeAddress=${stakeAddress}`
      );
      
      return response.data;
    },
    enabled: !!stakeAddress,
    staleTime: 0,
    gcTime: 60 * 2000,
    refetchOnWindowFocus: false,
    retry: 2
  });
}