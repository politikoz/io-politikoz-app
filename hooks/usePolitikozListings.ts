import { useQuery } from '@tanstack/react-query';
import api from '@/app/lib/api';
import { PolitikozListing, cargoMapping } from '@/types/PolitikozListing';

export function usePolitikozListings(tabName: string, quantity: number = 4) {
  const cargo = cargoMapping[tabName];

  return useQuery({
    queryKey: ['politikozListings', cargo, quantity],
    queryFn: async () => {
      if (!cargo) return [];

      try {
        const response = await api.get<PolitikozListing[]>(
          `/api/v1/party/listings?cargo=${cargo}&quantity=${quantity}`
        );
        return response.data;
      } catch (error) {
        // Silently handle any API errors by returning empty array
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    enabled: !!cargo,
    // Return empty array as fallback
    initialData: []
  });
}