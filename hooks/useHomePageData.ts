import { useQuery } from '@tanstack/react-query';
import api from '@/app/lib/api';
import { HomePageData, INITIAL_HOMEPAGE_DATA } from '@/types/HomePageData';

export function useHomePageData() {
  return useQuery<HomePageData>({
    queryKey: ['homePage'],
    queryFn: async () => {
      const response = await api.get<HomePageData>('/proxy/statistics/election');
      return response.data;
    },
    initialData: INITIAL_HOMEPAGE_DATA,
    staleTime: 0,
    gcTime: 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2
  });
}