import { useQuery } from '@tanstack/react-query';
import { CandidatesTableResponse, CandidatesTableFilters } from '@/types/CandidatesTableData';
import api from '@/app/lib/api';

export function useCandidatesTable(filters: CandidatesTableFilters) {
  const mockStakeAddress = process.env.NEXT_PUBLIC_STAKE_ADDRESS_MOCK;
  const stakeAddress = mockStakeAddress || localStorage.getItem('stakeAddress');

  return useQuery({
    queryKey: ['candidatesTable', filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: filters.page.toString(),
        pageSize: filters.pageSize.toString(),
        role: filters.role,
        winning: filters.winning.toString(),
        outOfStamina: filters.outOfStamina.toString(),
        ...(filters.stakeAddress && { stakeAddress: filters.stakeAddress })
      });

      const response = await api.get<CandidatesTableResponse>(
        `/api/v1/office/candidates-table?${params.toString()}`
      );

      // If stakeAddress exists, mark candidates as user's
      if (stakeAddress) {
        response.data.data = response.data.data.map(candidate => ({
          ...candidate,
          isUser: candidate.stakeAddress === stakeAddress
        }));
      }

      return response.data;
    },
    staleTime: 0,
    gcTime: 60 * 2000,
    refetchOnWindowFocus: false,
    retry: 2
  });
}