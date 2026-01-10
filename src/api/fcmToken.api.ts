import apiClient from './client';

/**
 * Admin FCM Token API
 * Handles registration and removal of Firebase Cloud Messaging tokens for admins
 */
export const fcmTokenApi = {
  /**
   * Register FCM token for admin user
   */
  register: async (token: string) => {
    const response = await apiClient.post('/admin/fcm-token', { token });
    return response.data;
  },

  /**
   * Remove FCM token for admin user
   */
  remove: async (token: string) => {
    const response = await apiClient.delete('/admin/fcm-token', { data: { token } });
    return response.data;
  },
};
