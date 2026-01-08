import { apiClient } from './client';
import { Admin, ApiResponse, LoginFormData } from '../types';

export const authApi = {
  /**
   * Admin login
   */
  login: async (credentials: LoginFormData): Promise<{ token: string; admin: Admin }> => {
    const response = await apiClient.post<ApiResponse<{ token: string; admin: Admin }>>(
      '/auth/login',
      credentials
    );
    return response.data.data;
  },

  /**
   * Get current authenticated admin
   */
  getCurrentAdmin: async (): Promise<Admin> => {
    const response = await apiClient.get<ApiResponse<Admin>>('/auth/me');
    return response.data.data;
  },

  /**
   * Logout admin
   */
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  /**
   * Refresh JWT token
   */
  refreshToken: async (): Promise<{ token: string }> => {
    const response = await apiClient.post<ApiResponse<{ token: string }>>('/auth/refresh');
    return response.data.data;
  },
};
