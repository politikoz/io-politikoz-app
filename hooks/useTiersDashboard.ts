import { useQuery } from '@tanstack/react-query';
import api from '@/app/lib/api';
import { TiersDashboard } from '@/types/tiers';

export function useTiersDashboard() {
    return useQuery<TiersDashboard>({
        queryKey: ['tiersDashboard'],
        queryFn: async () => {
            const response = await api.get<TiersDashboard>('/api/v1/office/tiers-dashboard');
            return response.data;
        },
        staleTime: 60 * 1000, // Cache for 1 minute
        refetchOnWindowFocus: true,
        retry: 2
    });
}