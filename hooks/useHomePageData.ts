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
    initialData: INITIAL_HOMEPAGE_DATA,
    staleTime: 0,
    gcTime: 24 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2
  });
}