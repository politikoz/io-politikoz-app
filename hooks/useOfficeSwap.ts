import { useState } from 'react';
import { CreateSwapDTO, SwapHistoryDTO } from '@/types/swap';
import api from '@/app/lib/api';

export function useOfficeSwap() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createSwap = async (data: CreateSwapDTO): Promise<SwapHistoryDTO | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.post<SwapHistoryDTO>('/office/swap', data);
            return response.data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to create swap';
            setError(message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        createSwap,
        isLoading,
        error
    };
}