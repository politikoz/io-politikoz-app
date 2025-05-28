import { useQuery } from '@tanstack/react-query';
import api from '@/app/lib/api';
import { PolitikozListing } from '@/types/PolitikozListing';

export function usePolitikozListings(tabName: string, quantity: number = 4) {
  // Remove cargoMapping dependency and use the tabName directly
  return useQuery({
    queryKey: ['politikozListings', tabName, quantity],
    queryFn: async () => {
      try {
        console.log('[usePolitikozListings] Fetching with params:', { 
          cargo: tabName, 
          quantity,
          url: `/api/v1/party/listings?cargo=${tabName}&quantity=${quantity}`
        });

        const response = await api.get<PolitikozListing[]>(
          `/api/v1/party/listings?cargo=${tabName}&quantity=${quantity}`
        );

        console.log('[usePolitikozListings] API Response:', {
          status: response.status,
          data: response.data,
          hasData: !!response.data?.length
        });

        return response.data;
      } catch (error) {
        console.error('[usePolitikozListings] API Error:', error);
        throw error; // Let the error propagate instead of returning empty array
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2
  });
}