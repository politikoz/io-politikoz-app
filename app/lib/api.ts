import axios from 'axios';
import { AuthService } from '@/services/auth.service';

type AuthEventHandler = () => Promise<void>;
let authEventHandler: AuthEventHandler | null = null;

export const setAuthEventHandler = (handler: AuthEventHandler) => {
    authEventHandler = handler;
};

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Critical endpoints that require authentication (including secure GET operations)
const SECURE_ENDPOINTS = [
    '/office/tickets/config',
    '/office/tickets/lucky-number',
    '/party/politikoz/lucky-number',
    "/party/create",
    '/auth/wallet'
];

// Request interceptor for adding JWT
api.interceptors.request.use(function (config) {
    const isSecureEndpoint = SECURE_ENDPOINTS.some(
        endpoint => config.url?.includes(endpoint)
    );

    if (isSecureEndpoint) {
        const session = AuthService.getSession();
        if (session?.jwt) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${session.jwt}`;
        }
    }
    
    return config;
}, function (error) {
    return Promise.reject(error);
});

// Response interceptor for handling 401s and refreshing JWT
api.interceptors.response.use(
    response => response,
    error => {
        return Promise.reject(error);
    }
);

export default api;