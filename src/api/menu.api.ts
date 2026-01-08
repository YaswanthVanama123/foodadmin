import { apiClient } from './client';
import { MenuItem, MenuFilters, MenuItemFormData, ApiResponse } from '../types';

export const menuApi = {
  /**
   * Get all menu items with filters
   */
  getAll: async (filters?: MenuFilters): Promise<MenuItem[]> => {
    const response = await apiClient.get<ApiResponse<MenuItem[]>>('/menu', {
      params: filters,
    });
    return response.data.data;
  },

  /**
   * Get menu item by ID
   */
  getById: async (id: string): Promise<MenuItem> => {
    const response = await apiClient.get<ApiResponse<MenuItem>>(`/menu/${id}`);
    return response.data.data;
  },

  /**
   * Create new menu item
   */
  create: async (data: MenuItemFormData): Promise<MenuItem> => {
    const response = await apiClient.post<ApiResponse<MenuItem>>('/menu', data);
    return response.data.data;
  },

  /**
   * Update menu item
   */
  update: async (id: string, data: Partial<MenuItemFormData>): Promise<MenuItem> => {
    const response = await apiClient.put<ApiResponse<MenuItem>>(`/menu/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete menu item
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/menu/${id}`);
  },

  /**
   * Toggle menu item availability
   */
  toggleAvailability: async (id: string): Promise<MenuItem> => {
    const response = await apiClient.patch<ApiResponse<MenuItem>>(`/menu/${id}/toggle`);
    return response.data.data;
  },

  /**
   * Upload menu item image
   */
  uploadImage: async (id: string, formData: FormData): Promise<MenuItem> => {
    const response = await apiClient.post<ApiResponse<MenuItem>>(
      `/menu/${id}/image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  /**
   * Search menu items
   */
  search: async (query: string): Promise<MenuItem[]> => {
    const response = await apiClient.get<ApiResponse<MenuItem[]>>('/search/menu', {
      params: { query },
    });
    return response.data.data;
  },
};
