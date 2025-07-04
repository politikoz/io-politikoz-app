import axios from 'axios';
import { AuthService } from '@/services/auth.service';

type AuthEventHandler = () => Promise<void>;
let authEventHandler: AuthEventHandler | null = null;

export const setAuthEventHandler = (handler: AuthEventHandler) => {
    authEventHandler = handler;
};

// Critical endpoints that require authentication
const SECURE_ENDPOINTS = [
    '/office/tickets/config',
    '/office/tickets/lucky-number',
    '/party/politikoz/lucky-number',
    "/party/create",
    '/auth/wallet'
];


// Função para gerar UUID seguro em qualquer ambiente
function generateRequestId() {
    // Browser moderno
    if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
        return window.crypto.randomUUID();
    }
    // Node.js 19+ ou ambientes que expõem globalThis.crypto
    if (typeof globalThis !== 'undefined' && globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
        return globalThis.crypto.randomUUID();
    }
    // Fallback universal (Math.random, não criptográfico, mas suficiente para request id)
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c: string) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_VALIDATOR_API_URL, // Aponta para seu backend
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'X-Client-Version': process.env.NEXT_PUBLIC_VERSION || '1.0.0',
        // O X-Request-Id será adicionado dinamicamente no interceptor
    }
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Add security headers
        if (config.headers) {
            config.headers['X-Requested-With'] = 'XMLHttpRequest';
            // Gera um novo X-Request-Id para cada request
            config.headers['X-Request-Id'] = generateRequestId();
        }

        // Add JWT for secure endpoints
        const isSecureEndpoint = SECURE_ENDPOINTS.some(
            endpoint => config.url?.includes(endpoint)
        );

        if (isSecureEndpoint) {
            const session = AuthService.getSession();
            if (session?.jwt && config.headers) {
                config.headers.Authorization = `Bearer ${session.jwt}`;
            } else {
                throw new Error('Authentication required');
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // Handle unauthorized
                    if (authEventHandler) {
                        await authEventHandler();
                    }
                    break;
                    
                case 403:
                    // Handle forbidden
                    break;
                    
                case 429:
                    // Handle rate limiting
                    const retryAfter = error.response.headers['retry-after'];
                    if (retryAfter) {
                        // Implement retry logic if needed
                    }
                    break;
                    
                case 500:
                    // Handle server errors
                    break;
            }
        }
        
        // Network errors
        if (error.code === 'ECONNABORTED') {
            // Handle timeout
        }

        return Promise.reject(error);
    }
);

export default api;