import { useQuery } from '@tanstack/react-query';
import api from '@/app/lib/api';
import { TreasuryData, INITIAL_TREASURY_DATA } from '@/types/TreasuryData';

export function useTreasuryData() {
  return useQuery<TreasuryData>({
    queryKey: ['treasury'],
    queryFn: async () => {
      const response = await api.get<TreasuryData>('/api/v1/treasury');
      return response.data;
    },
    initialData: INITIAL_TREASURY_DATA,  // Use as initial data
    staleTime: 0,                        // Consider data immediately stale
    gcTime: 24 * 60 * 60 * 1000,        // Keep inactive data for 1 day
    refetchOnWindowFocus: false,         // Don't refetch on window focus
    retry: 2                             // Retry failed requests twice
  });
}