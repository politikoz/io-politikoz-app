import { useQuery } from '@tanstack/react-query';
import api from '@/app/lib/api';
import { ElectionMerkleDTO } from '@/types/ElectionMerkleData';

export function useElectionMerkle() {
  const { 
    data, 
    isLoading, 
    isError, 
    error
  } = useQuery<ElectionMerkleDTO[]>({
    queryKey: ['electionMerkle'],
    queryFn: async () => {
      const response = await api.get<ElectionMerkleDTO[]>(
        '/proxy/audit/merkle'
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });

  return {
    elections: data || null,
    isLoading,
    isError,
    error
  };
}