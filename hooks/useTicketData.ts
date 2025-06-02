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
        throw new Error('No stake address found');
      }

      const response = await api.get<Ticket[]>(`/api/v1/office/tickets`, {
        params: { stakeAddress }
      });
      return response.data;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
    retry: 2,
    enabled: !!stakeAddress,
  });
}