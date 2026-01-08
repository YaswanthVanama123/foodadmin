import { apiClient } from './client';
import { Table, TableFormData, ApiResponse } from '../types';

export const tablesApi = {
  /**
   * Get all tables
   */
  getAll: async (): Promise<Table[]> => {
    const response = await apiClient.get<ApiResponse<Table[]>>('/tables');
    return response.data.data;
  },

  /**
   * Get table by ID
   */
  getById: async (id: string): Promise<Table> => {
    const response = await apiClient.get<ApiResponse<Table>>(`/tables/${id}`);
    return response.data.data;
  },

  /**
   * Create new table
   */
  create: async (data: TableFormData): Promise<Table> => {
    const response = await apiClient.post<ApiResponse<Table>>('/tables', data);
    return response.data.data;
  },

  /**
   * Update table
   */
  update: async (id: string, data: Partial<TableFormData>): Promise<Table> => {
    const response = await apiClient.put<ApiResponse<Table>>(`/tables/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete table
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/tables/${id}`);
  },

  /**
   * Get table status
   */
  getStatus: async (id: string): Promise<{ isOccupied: boolean; currentOrderId?: string }> => {
    const response = await apiClient.get<ApiResponse<any>>(`/tables/${id}/status`);
    return response.data.data;
  },
};
