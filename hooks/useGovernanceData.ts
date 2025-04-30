import { useQuery } from '@tanstack/react-query';
import api from '@/app/lib/api';
import { GovernanceData, INITIAL_GOVERNANCE_DATA } from '@/types/GovernanceData';

export function useGovernanceData() {
  return useQuery({
    queryKey: ['governance'],
    queryFn: async () => {
      const response = await api.get<GovernanceData>('/api/v1/governance');
      return response.data;
    },
    initialData: INITIAL_GOVERNANCE_DATA, // Use initial data while loading
    staleTime: 0,                        // Consider data immediately stale
    gcTime: 24 * 60 * 60 * 1000,        // Keep inactive data for 1 day
    refetchOnWindowFocus: false,         // Don't refetch on window focus
    retry: 2,                             // Retry failed requests twice
  });
}