import api from '@/app/lib/apiNode';

export class SwapService {
    static async acceptSwap(txHash: string, tier: number): Promise<{ success: boolean; error?: string; status?: string }> {
        try {
            const response = await api.post(`/swap/accept/${txHash}/${tier}`);

            if (response.status === 202) {
                return {
                    success: true,
                    status: 'processing',
                };
            }

            return {
                success: true,
                status: 'completed'
            };

        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to process swap',
                status: 'failed'
            };
        }
    }
}