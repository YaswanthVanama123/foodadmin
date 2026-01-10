import apiClient from './client';
import { AddOn } from '../types';

export const addOnsApi = {
  getAll: async (): Promise<AddOn[]> => {
    const response = await apiClient.get('/addons');
    return response.data.data;
  },

  getById: async (id: string): Promise<AddOn> => {
    const response = await apiClient.get(`/addons/${id}`);
    return response.data.data;
  },

  create: async (data: Partial<AddOn>): Promise<AddOn> => {
    const response = await apiClient.post('/addons', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<AddOn>): Promise<AddOn> => {
    const response = await apiClient.put(`/addons/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/addons/${id}`);
  },

  toggleAvailability: async (id: string): Promise<AddOn> => {
    const response = await apiClient.patch(`/addons/${id}/toggle-availability`);
    return response.data.data;
  },
};
