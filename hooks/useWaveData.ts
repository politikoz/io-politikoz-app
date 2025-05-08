import { useQuery } from '@tanstack/react-query';
import api from '@/app/lib/api';
import { Wave, INITIAL_WAVE_DATA } from '@/types/WaveData';

export function useWaveData() {
  return useQuery({
    queryKey: ['waves'],
    queryFn: async () => {
      const response = await api.get<Wave[]>('/api/v1/office/waves');
      return response.data;
    },
    initialData: INITIAL_WAVE_DATA,
    staleTime: 0,
    gcTime: 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 2,
  });
}