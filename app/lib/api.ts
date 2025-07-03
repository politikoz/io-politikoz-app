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

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_VALIDATOR_API_URL, // Aponta para seu backend
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'X-Client-Version': process.env.NEXT_PUBLIC_VERSION || '1.0.0',
        'X-Request-Id': () => crypto.randomUUID()
    }
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Add security headers
        if (config.headers) {
            config.headers['X-Requested-With'] = 'XMLHttpRequest';
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