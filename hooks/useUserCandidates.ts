import { useQuery } from '@tanstack/react-query';
import { ElectionGroup, UserCandidatesResponse } from '@/types/UserCandidatesData';
import api from '@/app/lib/api';

export function useUserCandidates() {
  const mockStakeAddress = process.env.NEXT_PUBLIC_STAKE_ADDRESS_MOCK;
  const stakeAddress = mockStakeAddress || localStorage.getItem('stakeAddress');

  return useQuery({
    queryKey: ['userCandidates', stakeAddress],
    queryFn: async () => {
      if (!stakeAddress) {
        throw new Error('No stake address found');
      }
      
      const response = await api.get<ElectionGroup[]>(
        `/api/v1/office/user-candidates?stakeAddress=${stakeAddress}`
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