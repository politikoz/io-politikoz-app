import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SWAP_API_URL || 'http://localhost:3001', // Corrigido para usar a variável correta
  timeout: 300000, // Aumentado para 5 minutos devido à natureza da operação
  headers: {
    'Content-Type': 'application/json',
  }
});

// Melhorar logs para desenvolvimento
if (process.env.NODE_ENV === 'development') {
  api.interceptors.request.use(request => {
    console.log('API Request:', {
      url: request.url,
      method: request.method,
      baseURL: request.baseURL,
      data: request.data,
      timestamp: new Date().toISOString()
    });
    return request;
  });

  api.interceptors.response.use(
    response => {
      console.log('API Response:', {
        status: response.status,
        data: response.data,
        url: response.config.url,
        timestamp: new Date().toISOString()
      });
      return response;
    },
    error => {
      console.error('API Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          method: error.config?.method
        },
        timestamp: new Date().toISOString()
      });
      return Promise.reject(error);
    }
  );
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error('Unauthorized');
          break;
        case 403:
          console.error('Forbidden');
          break;
        case 429:
          console.error('Too Many Requests');
          break;
        default:
          console.error('API Error:', error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

export default api;