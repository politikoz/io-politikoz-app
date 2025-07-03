import { useState } from 'react';
import { SwapStatus, UpdateSwapStatusDTO } from '@/types/swap';
import api from '@/app/lib/api';

export function useSwapStatus() {
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateStatus = async (payload: UpdateSwapStatusDTO): Promise<boolean> => {
        setIsUpdating(true);
        setError(null);

        try {
            await api.put('/proxy/office/swap-status', payload);
            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update swap status';
            setError(message);          
            return false;
        } finally {
            setIsUpdating(false);
        }
    };

    return {
        updateStatus,
        isUpdating,
        error
    };
}