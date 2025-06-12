import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SWAP_API_URL || 'http://localhost:3001', // Corrigido para usar a variável correta
  timeout: 300000, // Aumentado para 5 minutos devido à natureza da operação
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor de resposta global (mantido)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Interceptor de erro sem logs de console
    if (error.response) {
      // Status code handling sem console.error
      switch (error.response.status) {
        case 401:
          // Unauthorized - tratamento silencioso
          break;
        case 403:
          // Forbidden - tratamento silencioso
          break;
        case 429:
          // Too Many Requests - tratamento silencioso
          break;
        default:
          // Outros erros - tratamento silencioso
      }
    }
    return Promise.reject(error);
  }
);

export default api;