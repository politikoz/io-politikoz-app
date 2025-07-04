import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/app/lib/api';
import { useAuth } from './useAuth';

interface ChangeLuckyNumberParams {
  ticketIds: number[];
  luckyNumber: string;
}

export function useChangeLuckyNumber() {
  const queryClient = useQueryClient();
  const { getSession } = useAuth();

  return useMutation({
    mutationFn: async ({ ticketIds, luckyNumber }: ChangeLuckyNumberParams) => {
      // Check session from cookie
      const session = getSession();
      if (!session?.jwt) {
        throw new Error('Authentication required');
      }

      const response = await api.put('/office/tickets-lucky-number', {
        ticketIds,
        luckyNumber
      });

      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
    onError: (error, variables) => {
      throw new Error(`[useChangeLuckyNumber] Mutation error for tickets: ${variables.ticketIds}, ${error}`);
    }
  });
}