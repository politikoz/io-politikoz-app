'use client';

import { ReactNode, useEffect } from 'react';
import { MeshProvider } from "@meshsdk/react";
import { WalletContextProvider } from "@/contexts/WalletContext";
import { useWalletContext } from '@/contexts/WalletContext';

function WalletConnectionManager({ children }: { children: ReactNode }) {
    const { connect, isConnected } = useWalletContext();

    useEffect(() => {
        const connectStoredWallet = async () => {
            const walletName = localStorage.getItem("walletName");
            if (walletName && !isConnected) {
                await connect(walletName);
            }
        };

        connectStoredWallet();
    }, [connect, isConnected]);

    return <>{children}</>;
}

export function WalletProvider({ children }: { children: ReactNode }) {
    console.log('[WalletProvider] loaded');
    return (
        <MeshProvider>
            <WalletContextProvider>
                <WalletConnectionManager>
                    {children}
                </WalletConnectionManager>
            </WalletContextProvider>
        </MeshProvider>
    );
}