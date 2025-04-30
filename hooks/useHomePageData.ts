import { useQuery } from '@tanstack/react-query';
import api from '@/app/lib/api';
import { HomePageData, INITIAL_HOMEPAGE_DATA } from '@/types/HomePageData';

export function useHomePageData() {
  return useQuery<HomePageData>({
    queryKey: ['homePage'],
    queryFn: async () => {
      const response = await api.get<HomePageData>('/api/v1/statistics/election');
      return response.data;
    },
    initialData: INITIAL_HOMEPAGE_DATA,  // Use as initial data
    staleTime: 0,                        // Consider data immediately stale
    gcTime: 24 * 60 * 60 * 1000,        // Keep inactive data for 1 day
    refetchOnWindowFocus: false,         // Don't refetch on window focus
    retry: 2                             // Retry failed requests twice
  });
}