import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect automatically - let components handle auth errors
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  setAuthToken: (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  },

  // Auth endpoints
  auth: {
    login: async (credentials) => {
      const response = await api.post('/users/signin', credentials);
      return response.data;
    },
    register: async (userData) => {
      const response = await api.post('/users/register', userData);
      return response.data;
    },
  },

  // Customer endpoints
  customers: {
    register: async (customerData) => {
      const response = await api.post('/customers', customerData);
      return response.data;
    },
  },

  // Supplier endpoints
  suppliers: {
    register: async (supplierData) => {
      const response = await api.post('/suppliers', supplierData);
      return response.data;
    },
  },

  // Product endpoints
  products: {
    getAll: async () => {
      const response = await api.get('/products');
      return response.data;
    },
    getById: async (id) => {
      const response = await api.get(`/products/${id}`);
      return response.data;
    },
    create: async (productData) => {
      const response = await api.post('/products', productData);
      return response.data;
    },
    update: async (id, productData) => {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    },
    delete: async (id) => {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    },
    search: async (query) => {
      const response = await api.get(`/products/search?query=${query}`);
      return response.data;
    },
  },

  // Order endpoints
  orders: {
    create: async (orderData) => {
      const response = await api.post('/orders', orderData);
      return response.data;
    },
    createWithPayment: async (orderData) => {
      const response = await api.post('/orders/with-payment', orderData);
      return response.data;
    },
    getAll: async () => {
      const response = await api.get('/orders');
      return response.data;
    },
    getByCustomer: async (customerId) => {
      const response = await api.get(`/orders/customer/${customerId}`);
      return response.data;
    },
    confirm: async (orderId) => {
      const response = await api.put(`/orders/confirm/${orderId}`);
      return response.data;
    },
    cancel: async (orderId) => {
      const response = await api.put(`/orders/cancel/${orderId}`);
      return response.data;
    },
  },
};

export default apiService;