import { useQuery } from '@tanstack/react-query';
import api from '@/app/lib/api';
import { Party, INITIAL_PARTIES_DATA } from '@/types/PartyData';

export function usePartiesData() {
  return useQuery({
    queryKey: ['parties'],
    queryFn: async () => {
      const response = await api.get<Party[]>('/office/parties');
      return response.data;
    },
    initialData: INITIAL_PARTIES_DATA,
    staleTime: 0,
    gcTime: 24 * 60 * 60 * 1000, // Keep cache for 1 day
    refetchOnWindowFocus: false,
    retry: 2,
  });
}