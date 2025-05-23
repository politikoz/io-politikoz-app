import { useState } from 'react';
import { SwapStatus } from '@/types/swap';
import api from '@/app/lib/api';

export function useSwapStatus() {
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateStatus = async (id: number, status: SwapStatus): Promise<boolean> => {
        setIsUpdating(true);
        setError(null);

        try {
            await api.put(`/api/v1/office/swap/${id}/status`, { status });
            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update swap status';
            setError(message);
            console.error('Failed to update swap status:', err);
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