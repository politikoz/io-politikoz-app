import { useQuery } from '@tanstack/react-query';
import api from '@/app/lib/api';
import { ExploreData, INITIAL_EXPLORE_DATA } from '@/types/ExploreData';

export function useExploreData() {
  return useQuery({
    queryKey: ['explore'],
    queryFn: async () => {
      const response = await api.get<ExploreData>('/proxy/explore');
      return response.data;
    },
    initialData: INITIAL_EXPLORE_DATA,// Show while loading
    staleTime: 0,                        // Always fetch fresh data first
    gcTime: 24 * 60 * 60 * 1000,        // Keep cache for 1 day
    refetchOnWindowFocus: false,         // Disable automatic refetch
    retry: 2,                            // Number of retry attempts    
  });
}