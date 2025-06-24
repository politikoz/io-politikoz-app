import { useCallback } from 'react';
import { useWalletContext } from '@/contexts/WalletContext';
import { AuthService } from '@/services/auth.service';

export function useAuth() {
    const { wallet, isConnected } = useWalletContext();

    const authenticate = useCallback(async () => {
        if (!isConnected || !wallet) {
            throw new Error('Wallet not connected');
        }

        try {
            const addresses = await wallet.getRewardAddresses();
            const stakeAddress = addresses[0];

            if (!stakeAddress) {
                throw new Error('No stake address available');
            }

            const result = await AuthService.authenticate(
                stakeAddress,
                async (payload: string, address: string) => {
                    return wallet.signData(payload, address);
                }
            );
            return result;
        } catch (error) {
            throw error;
        }
    }, [wallet, isConnected]);

    const getSession = useCallback(() => {
        return AuthService.getSession();
    }, []);

    const clearSession = useCallback(() => {
        AuthService.clearSession();
    }, []);

    return { 
        authenticate,
        getSession,
        clearSession,
        isAuthenticated: !!getSession()
    };
}