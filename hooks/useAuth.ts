import { useCallback } from 'react';
import { useWalletContext } from '@/contexts/WalletContext';
import { AuthService } from '@/services/auth.service';

export function useAuth() {
    const { wallet, isConnected } = useWalletContext();

    const authenticate = useCallback(async () => {
        if (!isConnected || !wallet) {
            console.log('[useAuth] No wallet connected');
            throw new Error('Wallet not connected');
        }

        try {
            console.log('[useAuth] Getting reward addresses');
            const addresses = await wallet.getRewardAddresses();
            const stakeAddress = addresses[0];

            if (!stakeAddress) {
                console.log('[useAuth] No stake address found');
                throw new Error('No stake address available');
            }

            console.log('[useAuth] Starting authentication for address:', stakeAddress);
            const result = await AuthService.authenticate(
                stakeAddress,
                async (payload: string, address: string) => {
                    console.log('[useAuth] Requesting wallet signature');
                    return wallet.signData(payload, address);
                }
            );
            console.log('[useAuth] Authentication completed:', result);
            return result;
        } catch (error) {
            console.error('[useAuth] Authentication error:', error);
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