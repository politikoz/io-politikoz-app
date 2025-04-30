import { useQuery } from '@tanstack/react-query';
import api from '@/app/lib/api';
import { TicketPolicyData, INITIAL_TICKET_POLICY } from '@/types/TicketPolicy';

export function useTicketPolicy() {
  return useQuery({
    queryKey: ['ticketPolicy'],
    queryFn: async () => {
      const response = await api.get<TicketPolicyData>('/api/v1/laundry/ticket-configuration');
      return response.data;
    },
    initialData: INITIAL_TICKET_POLICY,  // Use as initial data
    staleTime: 0,                        // Consider data immediately stale
    gcTime: 24 * 60 * 60 * 1000,        // Keep inactive data for 1 day
    refetchOnWindowFocus: false,         // Don't refetch on window focus
    retry: 2                             // Retry failed requests twice
  });
}