'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { setAuthEventHandler } from '@/app/lib/api';
import { useWalletContext } from '@/contexts/WalletContext';
import { WalletProvider } from './WalletProvider';

interface AuthProviderProps {
    children: ReactNode;
    onAuthError?: () => void;
}

function AuthContent({ children, onAuthError }: AuthProviderProps) {
    const { wallet, isConnected } = useWalletContext();
    const { authenticate } = useAuth();

    useEffect(() => {
        if (isConnected && wallet) {
            // Usar uma flag para evitar múltiplas chamadas
            let isAuthenticating = false;
            
            setAuthEventHandler(async () => {
                if (isAuthenticating) return;
                try {
                    isAuthenticating = true;
                    await authenticate();
                } finally {
                    isAuthenticating = false;
                }
            });
        }

        return () => {
            setAuthEventHandler(() => Promise.resolve());
        };
    }, [isConnected, wallet, authenticate]);

    return <>{children}</>;
}

export function AuthProvider({ children, onAuthError }: AuthProviderProps) {
    return (
        <WalletProvider>
            <AuthContent onAuthError={onAuthError}>{children}</AuthContent>
        </WalletProvider>
    );
}