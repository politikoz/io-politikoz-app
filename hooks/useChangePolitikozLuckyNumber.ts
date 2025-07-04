import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/app/lib/api';
import { useAuth } from './useAuth';

interface ChangePolitikozLuckyNumberParams {
  assetNames: string[];
  luckyNumber: string;
}

export function useChangePolitikozLuckyNumber() {
  const queryClient = useQueryClient();
  const { getSession } = useAuth();

  return useMutation({
    mutationFn: async ({ assetNames, luckyNumber }: ChangePolitikozLuckyNumberParams) => {
      const session = getSession();
      if (!session?.jwt) {
        throw new Error('Authentication required');
      }

      // Remove '#' from asset names
      const cleanedAssetNames = assetNames.map(name => name.replace('#', ''));

      // Let the api utility handle the authorization headers
      const response = await api.put('/party/politikoz-lucky-number', {
        assetNames: cleanedAssetNames,
        luckyNumber
      });

      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['politikoz'] });
    },
    onError: (error, variables) => {
      throw new Error(`[useChangePolitikozLuckyNumber] Mutation error for politikoz: ${variables.assetNames}, ${error}`);
    }
  });
}