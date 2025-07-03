import { useQuery } from '@tanstack/react-query';
import api from '@/app/lib/api';
import { VerificationResponseDTO } from '@/types/VerificationData';

/**
 * Hook para verificar números de entrada
 * @param entryNumber Número de entrada para verificação
 * @returns {Object} Dados da verificação, estado de carregamento e funções de controle
 */
export function useVerification(entryNumber?: string, electionId?: number) {
  const { 
    data, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery<VerificationResponseDTO>({
    queryKey: ['verification', entryNumber, electionId],
    queryFn: async () => {
      const response = await api.get<VerificationResponseDTO>(
        `/proxy/audit/verify?entryNumber=${entryNumber}&electionId=${electionId}`
      );
      return response.data;
    },
    enabled: !!entryNumber && !!electionId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000,   // 10 minutos
    refetchOnWindowFocus: false,
    retry: 2
  });

  const verifyNumber = async () => {
    await refetch();
  };

  return {
    verification: data || null,
    isLoading,
    isError,
    error,
    verify: verifyNumber
  };
}