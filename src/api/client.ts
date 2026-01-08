import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

// Create axios instance
export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - Add auth token and restaurant ID
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token
    const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add restaurant ID header for multi-tenant isolation
    const restaurantId = localStorage.getItem(STORAGE_KEYS.RESTAURANT_ID);
    if (restaurantId) {
      config.headers['x-restaurant-id'] = restaurantId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized and 403 Forbidden
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('[API Client] Auth error detected, clearing session and redirecting to login');

      // Clear auth data
      localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.ADMIN_DATA);
      localStorage.removeItem(STORAGE_KEYS.RESTAURANT_ID);

      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Log error for debugging
    console.error('API Error:', error.response?.data || error.message);

    return Promise.reject(error);
  }
);

export default apiClient;
