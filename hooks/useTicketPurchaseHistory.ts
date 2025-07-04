import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/app/lib/api';
import { TicketPurchaseHistoryDTO } from '@/types/TicketPurchase';
import { useEffect } from 'react';

export function useTicketPurchaseHistory(stakeAddress: string | null) {
  const queryClient = useQueryClient();
  
  // Definir a chave do query para poder referenciá-la em outros lugares
  const queryKey = ['ticketPurchaseHistory', stakeAddress];
  
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      if (!stakeAddress) return [];
      
      try {
        const response = await api.get<TicketPurchaseHistoryDTO[]>(
          `/office/ticket-purchases?stakeAddress=${stakeAddress}`
        );
        return response.data;
      } catch (error: any) {
        // Retornar array vazio em caso de erro
        return [];
      }
    },
    enabled: !!stakeAddress,
    staleTime: 0, // Alterado de 60 * 1000 para 0 - sempre considerar os dados obsoletos
    refetchOnWindowFocus: true, // Recarregar quando a janela ganhar foco
  });

  // Função para forçar a recarga dos dados
  const forceRefresh = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  // Adicionar a função de forceRefresh ao objeto retornado
  return {
    ...query,
    forceRefresh
  };
}