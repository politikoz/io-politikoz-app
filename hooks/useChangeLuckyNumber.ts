import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/app/lib/api';

interface ChangeLuckyNumberParams {
  ticketIds: number[];
  luckyNumber: string;
}

export function useChangeLuckyNumber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ticketIds, luckyNumber }: ChangeLuckyNumberParams) => {
      // Log detalhado para debug
      console.log('Making API call with:', {
        ticketIds,
        ticketCount: ticketIds.length,
        luckyNumber,
        url: '/api/v1/office/tickets/lucky-number'
      });

      const response = await api.put('/api/v1/office/tickets/lucky-number', {
        ticketIds,
        luckyNumber
      });

      console.log('API Response:', response.data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      console.log('Mutation successful for tickets:', variables.ticketIds);
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
    onError: (error, variables) => {
      console.error('Mutation error for tickets:', variables.ticketIds, error);
    }
  });
}