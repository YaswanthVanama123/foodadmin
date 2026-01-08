import { apiClient } from './client';
import { Order, OrderFilters, OrderStatus, PaginatedResponse, ApiResponse } from '../types';

export const ordersApi = {
  /**
   * Get all orders with filters and pagination
   */
  getAll: async (filters?: OrderFilters): Promise<PaginatedResponse<Order>> => {
    const response = await apiClient.get<PaginatedResponse<Order>>('/orders', {
      params: filters,
    });
    return response.data;
  },

  /**
   * Get active orders (not served or cancelled)
   */
  getActive: async (): Promise<Order[]> => {
    const response = await apiClient.get<ApiResponse<Order[]>>('/orders/active');
    return response.data.data;
  },

  /**
   * Get order by ID
   */
  getById: async (id: string): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data.data;
  },

  /**
   * Update order status
   */
  updateStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    const response = await apiClient.patch<ApiResponse<Order>>(
      `/orders/${id}/status`,
      { status }
    );
    return response.data.data;
  },

  /**
   * Cancel order
   */
  cancel: async (id: string): Promise<Order> => {
    const response = await apiClient.delete<ApiResponse<Order>>(`/orders/${id}`);
    return response.data.data;
  },

  /**
   * Get orders for a specific table
   */
  getByTable: async (tableId: string): Promise<Order[]> => {
    const response = await apiClient.get<ApiResponse<Order[]>>(`/orders/table/${tableId}`);
    return response.data.data;
  },

  /**
   * Add items to existing order
   */
  addItems: async (id: string, items: any[]): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>(
      `/orders/${id}/items`,
      { items }
    );
    return response.data.data;
  },

  /**
   * Update order notes
   */
  updateNotes: async (id: string, notes: string): Promise<Order> => {
    const response = await apiClient.patch<ApiResponse<Order>>(
      `/orders/${id}/notes`,
      { notes }
    );
    return response.data.data;
  },
};
