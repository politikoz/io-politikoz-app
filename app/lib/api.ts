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
    '/api/v1/auth/wallet'
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

// Development logging
if (process.env.NODE_ENV === 'development') {
    api.interceptors.request.use(function (config) {
        console.log('API Request:', {
            url: config.url,
            method: config.method,
            headers: config.headers,
            data: config.data,
            params: config.params
        });
        return config;
    });

    api.interceptors.response.use(function (response) {
        console.log('API Response:', {
            status: response.status,
            data: response.data
        });
        return response;
    }, function (error) {
        console.error('API Error:', {
            status: error?.response?.status,
            data: error?.response?.data,
            config: {
                url: error?.config?.url,
                method: error?.config?.method,
                headers: error?.config?.headers
            }
        });
        return Promise.reject(error);
    });
}

export default api;