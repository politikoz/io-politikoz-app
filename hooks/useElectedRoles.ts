import { useQuery } from '@tanstack/react-query';
import api from '@/app/lib/api';
import { ElectedRoles } from '@/types/office';

export function useElectedRoles() {
  return useQuery<ElectedRoles>({
    queryKey: ['electedRoles'],
    queryFn: async () => {
      const response = await api.get<ElectedRoles>('/office/elected-roles');
      return response.data;
    },
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });
}