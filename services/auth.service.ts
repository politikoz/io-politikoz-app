import api from '@/app/lib/api';
import { WalletAuthSession, SignaturePayload, AuthResponse, AuthRequestBody, SignatureNested } from '@/types/auth';
import { DataSignature } from '@meshsdk/core';

export class AuthService {
    private static readonly SESSION_DURATION = 60 * 60 * 1000; // 1 hour
    private static readonly COOKIE_NAME = 'auth_session';

    static async authenticate(
        stakeAddress: string, 
        signData: (payload: string, address: string) => Promise<DataSignature>
    ): Promise<WalletAuthSession | null> {
        if (!stakeAddress) {
            return null;
        }

        try {
            const payload: SignaturePayload = {
                stakeAddress,
                timestamp: Date.now(),
                nonce: crypto.randomUUID()
            };

            const stringifiedPayload = JSON.stringify(payload, Object.keys(payload).sort());
            
            const signatureData = await Promise.resolve()
                .then(() => signData(stringifiedPayload, stakeAddress))
                .catch(() => null);

            if (!signatureData?.signature || !signatureData?.key) {
                return null;
            }

            const signature: SignatureNested = {
                signature: signatureData.signature,
                key: signatureData.key
            };

            const requestBody: AuthRequestBody = {
                payload,
                signature,
                expiresIn: this.SESSION_DURATION
            };

            const response = await Promise.resolve()
                .then(() => api.post<AuthResponse>('/api/v1/auth/wallet', requestBody))
                .catch(() => null);
                
            if (!response?.data?.token) {
                return null;
            }

            const session: WalletAuthSession = {
                jwt: response.data.token,
                stakeAddress,
                expiresAt: Date.now() + this.SESSION_DURATION
            };

            this.saveSession(session);
            return session;
        } catch {
            return null;
        }
    }

    static saveSession(session: WalletAuthSession): void {
        try {
            const value = encodeURIComponent(JSON.stringify(session));
            const expires = new Date(session.expiresAt).toUTCString();
            const cookieString = `${this.COOKIE_NAME}=${value}; expires=${expires}; path=/; SameSite=Strict`;
            document.cookie = cookieString;
        } catch {
            // Silent fail
        }
    }

    static getSession(): WalletAuthSession | null {
        try {
            const cookie = this.getCookie(this.COOKIE_NAME);
            if (!cookie) return null;

            const session = JSON.parse(decodeURIComponent(cookie)) as WalletAuthSession;
            
            if (this.isSessionExpired(session) || !this.isValidSession(session)) {
                this.clearSession();
                return null;
            }

            return session;
        } catch {
            this.clearSession();
            return null;
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