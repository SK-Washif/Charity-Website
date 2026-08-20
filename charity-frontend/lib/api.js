import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export const api = {
  get: async (url) => {
    const response = await apiClient.get(url);
    return response.data.data;
  },
  post: async (url, data) => {
    const response = await apiClient.post(url, data);
    return response.data.data;
  },
  put: async (url, data) => {
    const response = await apiClient.put(url, data);
    return response.data.data;
  },
  delete: async (url) => {
    const response = await apiClient.delete(url);
    return response.data.data;
  },
  
  // 📌 Banner APIs (Backend Ready)
  getBanners: async () => {
    return await api.get('/content/banners');
  },
  updateBanner: async (id, data) => {
    return await api.put(`/content/banners/${id}`, data);
  },
  createBanner: async (data) => {
    return await api.post('/content/banners', data);
  },
  deleteBanner: async (id) => {
    return await api.delete(`/content/banners/${id}`);
  },
  
  // 📌 Stats APIs (Backend Ready)
  getStats: async () => {
    return await api.get('/content/stats');
  },
  updateStats: async (data) => {
    return await api.put('/content/stats', data);
  },
};

export default apiClient;