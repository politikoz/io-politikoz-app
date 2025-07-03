import { useQuery } from '@tanstack/react-query';
import api from '@/app/lib/api';
import { TierRankingDTO } from '@/types/PartyRankingData';

/**
 * Hook para buscar os rankings de partidos por temporada
 * @returns {Object} Dados dos rankings, estado de carregamento e funções de controle
 */
export function usePartyRankings() {
  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery<TierRankingDTO[]>({
    queryKey: ['partyRankings'],
    queryFn: async () => {
      const response = await api.get<TierRankingDTO[]>('/proxy/party/rankings-season');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000,   // 10 minutos
    refetchOnWindowFocus: false,
    retry: 2
  });

  const refetchRankings = async () => {
    await refetch();
  };

  return {
    rankings: data || [],
    isLoading,
    isError,
    error,
    refetch: refetchRankings
  };
}