import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/app/lib/api';
import { CreatePartyRequest, PartyInfoDTO } from '@/types/CreatePartyData';
import { useAuth } from './useAuth';

// Custom error class for party creation errors
class PartyCreationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PartyCreationError';
  }
}

export function useCreateParty() {
  const queryClient = useQueryClient();
  const { getSession } = useAuth();

  return useMutation({
    mutationFn: async (request: CreatePartyRequest) => {
      const session = getSession();
      if (!session?.jwt) {
        throw new PartyCreationError('Authentication required');
      }

      try {
        const response = await api.post<PartyInfoDTO>('/api/v1/party/create', request);
        return response.data;
      } catch (error: any) {
        // Transform errors into our custom error type
        throw new PartyCreationError(
          error.response?.data?.message || 'Failed to create party'
        );
      }
    },
    onSuccess: () => {
      // Invalidate party info to force a refetch
      queryClient.invalidateQueries({ queryKey: ['partyInfo'] });
    }
  });
}