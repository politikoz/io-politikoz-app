import { useQuery } from '@tanstack/react-query';
import api from '@/app/lib/api';
import { RoleTotalsResponse } from '@/types/RoleTotalsData';

export function useRoleTotals() {
  return useQuery({
    queryKey: ['roleTotals'],
    queryFn: async () => {
      const response = await api.get<RoleTotalsResponse>('/api/v1/office/candidates/role-totals');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
    refetchOnWindowFocus: false
  });
}