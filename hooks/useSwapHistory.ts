import { useQuery } from '@tanstack/react-query';
import api from '@/app/lib/api';
import { SwapHistoryDTO } from '@/types/swap';
import { useEffect, useState } from 'react';

interface UseSwapHistoryProps {
    enabled?: boolean;
}

export function useSwapHistory({ enabled = false }: UseSwapHistoryProps = {}) {
    const [stakeAddress, setStakeAddress] = useState<string | null>(null);
    
      useEffect(() => {
        setStakeAddress(localStorage.getItem('stakeAddress'));
      }, []);

    return useQuery({
        queryKey: ['swapHistory', stakeAddress],
        queryFn: async () => {
            if (!stakeAddress) {
                throw new Error('No stake address available');
            }

            const response = await api.get<SwapHistoryDTO[]>('/api/v1/office/swap-history', {
                params: { stakeAddress }
            });

            if (!Array.isArray(response.data)) {              
                throw new Error('Invalid response format from server');
            }

            return response.data;
        },
        initialData: [],
        staleTime: 0,
        gcTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 2,
        enabled: enabled && !!stakeAddress // Only fetch when enabled is true and stakeAddress exists
    });
}