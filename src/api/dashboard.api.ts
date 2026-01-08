import { apiClient } from './client';
import { DashboardStats, Order, ApiResponse } from '../types';

export const dashboardApi = {
  /**
   * Get dashboard statistics
   */
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return response.data.data;
  },

  /**
   * Get active orders for dashboard
   */
  getActiveOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get<ApiResponse<Order[]>>('/dashboard/active-orders');
    return response.data.data;
  },
};
