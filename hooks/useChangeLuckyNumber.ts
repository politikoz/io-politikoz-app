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
        console.error('[useChangeLuckyNumber] No valid session found in cookie');
        throw new Error('Authentication required');
      }

      // Log detalhado para debug
      console.log('[useChangeLuckyNumber] Making API call with:', {
        ticketIds,
        ticketCount: ticketIds.length,
        luckyNumber,
        url: '/api/v1/office/tickets/lucky-number',
        hasSession: !!session
      });

      const response = await api.put('/api/v1/office/tickets/lucky-number', {
        ticketIds,
        luckyNumber
      });

      console.log('[useChangeLuckyNumber] API Response:', response.data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      console.log('[useChangeLuckyNumber] Mutation successful for tickets:', variables.ticketIds);
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
    onError: (error, variables) => {
      console.error('[useChangeLuckyNumber] Mutation error for tickets:', variables.ticketIds, error);
    }
  });
}