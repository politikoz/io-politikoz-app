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
        console.error('[useChangePolitikozLuckyNumber] No valid session found in cookie');
        throw new Error('Authentication required');
      }

      // Remove '#' from asset names
      const cleanedAssetNames = assetNames.map(name => name.replace('#', ''));

      console.log('[useChangePolitikozLuckyNumber] Making API call with:', {
        assetNames: cleanedAssetNames,
        politikozCount: cleanedAssetNames.length,
        luckyNumber,
        url: '/api/v1/party/politikoz/lucky-number',
        hasSession: !!session
      });

      // Let the api utility handle the authorization headers
      const response = await api.put('/api/v1/party/politikoz/lucky-number', {
        assetNames: cleanedAssetNames,
        luckyNumber
      });

      console.log('[useChangePolitikozLuckyNumber] API Response:', response.data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      console.log('[useChangePolitikozLuckyNumber] Mutation successful for politikoz:', variables.assetNames);
      queryClient.invalidateQueries({ queryKey: ['politikoz'] });
    },
    onError: (error, variables) => {
      console.error('[useChangePolitikozLuckyNumber] Mutation error for politikoz:', variables.assetNames, error);
    }
  });
}