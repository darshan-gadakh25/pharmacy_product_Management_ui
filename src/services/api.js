import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  // Auth endpoints
  auth: {
    login: async (credentials) => {
      const response = await api.post('/users/signin', credentials);
      return response.data;
    },
  },
};

// Direct login function for convenience
export const login = async (credentials) => {
  return await apiService.auth.login(credentials);
};

export default apiService;