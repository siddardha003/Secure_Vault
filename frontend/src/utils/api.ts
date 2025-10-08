import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: async (email: string, password: string) => {
    const response = await api.post('/auth/register', { email, password });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  verify: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
};

// Vault API calls
export const vaultAPI = {
  getItems: async (search?: string) => {
    const params = search ? { search } : {};
    const response = await api.get('/vault', { params });
    return response.data;
  },

  getItem: async (id: string) => {
    const response = await api.get(`/vault/${id}`);
    return response.data;
  },

  createItem: async (item: {
    title: string;
    username: string;
    encryptedPassword: string;
    url?: string;
    notes?: string;
  }) => {
    const response = await api.post('/vault', item);
    return response.data;
  },

  updateItem: async (id: string, item: {
    title: string;
    username: string;
    encryptedPassword: string;
    url?: string;
    notes?: string;
  }) => {
    const response = await api.put(`/vault/${id}`, item);
    return response.data;
  },

  deleteItem: async (id: string) => {
    const response = await api.delete(`/vault/${id}`);
    return response.data;
  },
};

export default api;