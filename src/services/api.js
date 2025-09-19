import axios from 'axios';
import { supabase, SUPABASE_URL } from '@/integrations/supabase/client';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://api.kmrl-docs.com/api' 
    : 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kmrl_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('kmrl_token');
      localStorage.removeItem('kmrl_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints - These will be integrated with backend later
const apiEndpoints = {
  // Authentication
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),

// Documents via Supabase Edge Function
  getPendingDocuments: () => api.get('/functions/documents/pending'),
  uploadDocument: (formData) => api.post('/functions/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  approveDocument: (id, userIds) => api.post(`/functions/documents/${id}/approve`, { userIds }),
  getApprovedForUser: (userId) => api.get(`/functions/documents/approved/${userId}`),

  // Summaries
  getSummary: (id) => api.get(`/summaries/${id}`),
  translateSummary: (id, language) => api.post(`/summaries/${id}/translate`, { language }),

  // Users (Admin only)
  getUsers: () => api.get('/users'),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),

  // Alerts
  getAlerts: () => api.get('/alerts'),
  markAlertRead: (id) => api.post(`/alerts/${id}/read`),

  // Analytics (Admin only)
  getAnalytics: () => api.get('/analytics'),
};

export { apiEndpoints, api };

// Supabase Functions client for Edge Functions
const functionsApi = axios.create({
  baseURL: `${SUPABASE_URL}/functions/v1`,
  timeout: 20000,
});

functionsApi.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // Fallback for mock auth used by the app (local demo credentials)
    try {
      const mockUserRaw = localStorage.getItem('kmrl_user');
      if (mockUserRaw) {
        const mockUser = JSON.parse(mockUserRaw);
        config.headers = config.headers || {};
        // These headers are consumed by the Edge Function to simulate auth
        config.headers['x-mock-role'] = mockUser.role;
        config.headers['x-mock-user-id'] = mockUser.id ?? mockUser.user_id ?? 'mock-user';
      }
    } catch (_) {
      // ignore parsing errors
    }
  }
  return config;
});

export const documentsApi = {
  getPendingDocuments: () => functionsApi.get('/documents/pending'),
  uploadDocument: (formData) => functionsApi.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  approveDocument: (id, userIds) => functionsApi.post(`/documents/${id}/approve`, { userIds }),
  getApprovedForUser: (userId) => functionsApi.get(`/documents/approved/${userId}`),
};

export default { ...apiEndpoints, ...documentsApi };