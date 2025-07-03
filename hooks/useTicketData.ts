import { useQuery } from '@tanstack/react-query';
import api from '@/app/lib/api';
import { Ticket } from '@/types/TicketData';
import { useEffect, useState } from 'react';

export function useTicketData() {
  const [stakeAddress, setStakeAddress] = useState<string | null>(null);

  useEffect(() => {
    setStakeAddress(localStorage.getItem('stakeAddress'));
  }, []);

  return useQuery({
    queryKey: ['tickets', stakeAddress],
    queryFn: async () => {
      if (!stakeAddress) {
        // Retorna mock vazio se não conectado
        return [];
      }
      const response = await api.get<Ticket[]>(`/proxy/office/tickets`, {
        params: { stakeAddress }
      });
      return response.data;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
    retry: 2,
    enabled: true, // Sempre habilitado para garantir retorno do mock
  });
}