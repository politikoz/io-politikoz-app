import { useQuery } from '@tanstack/react-query';
import { ElectionGroup, UserCandidatesResponse } from '@/types/UserCandidatesData';
import api from '@/app/lib/api';
import { useEffect, useState } from 'react';

export function useUserCandidates() {
  const [stakeAddress, setStakeAddress] = useState<string | null>(null);
  
    useEffect(() => {
      setStakeAddress(localStorage.getItem('stakeAddress'));
    }, []);

  return useQuery({
    queryKey: ['userCandidates', stakeAddress],
    queryFn: async () => {
      if (!stakeAddress) {
        throw new Error('No stake address found');
      }
      
      const response = await api.get<ElectionGroup[]>(
        `/proxy/office/user-candidates?stakeAddress=${stakeAddress}`
      );
      
      // Wrap the response in the expected format
      return {
        data: response.data
      } as UserCandidatesResponse;
    },
    enabled: !!stakeAddress,
    staleTime: 0,
    gcTime: 60 * 2000,
    refetchOnWindowFocus: false,
    retry: 2
  });
}