import api from '@/app/lib/api';
import { WalletAuthSession, SignaturePayload, AuthResponse, AuthRequestBody, SignatureNested } from '@/types/auth';
import { DataSignature } from '@meshsdk/core';

export class AuthService {
    private static readonly SESSION_DURATION = 60 * 60 * 1000; // 1 hour
    private static readonly COOKIE_NAME = 'auth_session';

    // Remove wallet parameter and use provided addresses
    static async authenticate(
        stakeAddress: string, 
        signData: (payload: string, address: string) => Promise<DataSignature>
    ): Promise<WalletAuthSession> {
        try {
            if (!stakeAddress) {
                throw new Error('No stake address available');
            }

            const payload: SignaturePayload = {
                stakeAddress,
                timestamp: Date.now(),
                nonce: crypto.randomUUID()
            };

            const stringifiedPayload = JSON.stringify(payload, Object.keys(payload).sort());
            
            try {
                const signatureData = await signData(stringifiedPayload, stakeAddress);
                
                if (!signatureData.signature || !signatureData.key) {
                    throw new Error('Invalid signature data received from wallet');
                }

                // Create signature object first
                const signature: SignatureNested = {
                    signature: signatureData.signature,
                    key: signatureData.key
                };

                // Then create the complete request body
                const requestBody: AuthRequestBody = {
                    payload,
                    signature,
                    expiresIn: this.SESSION_DURATION
                };

                console.info('[AuthService] Request details:', {
                    endpoint: '/api/v1/auth/wallet',
                    signatureData,
                    requestBody
                });

                const response = await api.post<AuthResponse>('/api/v1/auth/wallet', requestBody);
                
                const session: WalletAuthSession = {
                    jwt: response.data.token,
                    stakeAddress,
                    expiresAt: Date.now() + this.SESSION_DURATION
                };

                this.saveSession(session);
                return session;
            } catch (signError) {
                console.error('[AuthService] Signature generation failed:', {
                    message: signError instanceof Error ? signError.message : String(signError),
                    stakeAddress
                });
                throw signError;
            }
        } catch (error) {
            console.error('[AuthService] Authentication failed:', error);
            throw error;
        }
    }

    static getSession(): WalletAuthSession | null {
        try {
            console.log('[AuthService] Getting session from cookie');
            const cookie = this.getCookie(this.COOKIE_NAME);
            console.log('[AuthService] Cookie found:', !!cookie);
            
            if (!cookie) return null;

            const session = JSON.parse(decodeURIComponent(cookie)) as WalletAuthSession;
            console.log('[AuthService] Session parsed:', {
                hasJwt: !!session?.jwt,
                hasStakeAddress: !!session?.stakeAddress,
                expiresAt: session?.expiresAt
            });
            
            if (this.isSessionExpired(session)) {
                console.log('[AuthService] Session expired');
                this.clearSession();
                return null;
            }

            if (!this.isValidSession(session)) {
                console.log('[AuthService] Invalid session');
                this.clearSession();
                return null;
            }

            console.log('[AuthService] Valid session found');
            return session;
        } catch (error) {
            console.error('[AuthService] Error getting session:', error);
            this.clearSession();
            return null;
        }
    }

    static saveSession(session: WalletAuthSession): void {
        try {
            const value = encodeURIComponent(JSON.stringify(session));
            const expires = new Date(session.expiresAt).toUTCString();
            const cookieString = `${this.COOKIE_NAME}=${value}; expires=${expires}; path=/; SameSite=Strict`;
            
            console.log('[AuthService] Saving session cookie:', {
                hasJwt: !!session.jwt,
                expiresAt: session.expiresAt,
                cookieLength: cookieString.length
            });
            
            document.cookie = cookieString;
        } catch (error) {
            console.error('[AuthService] Error saving session:', error);
        }
    }

    static clearSession(): void {
        document.cookie = `${this.COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }

    private static getCookie(name: string): string | null {
        const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
        return match ? match[2] : null;
    }

    private static isValidSession(session: WalletAuthSession): boolean {
        return (
            !!session.jwt && 
            session.jwt.split('.').length === 3 &&
            !!session.stakeAddress?.startsWith('stake_')
        );
    }

    private static isSessionExpired(session: WalletAuthSession): boolean {
        return session.expiresAt < Date.now();
    }
}