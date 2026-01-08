import React, { createContext, useContext, useEffect, useState } from 'react';
import { Admin, LoginFormData } from '../types';
import { authApi } from '../api';
import { STORAGE_KEYS } from '../utils/constants';

interface AdminAuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAdmin: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Login admin
   */
  const login = async (username: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);

      // Preserve the restaurant ID that was set during login page initialization
      const existingRestaurantId = localStorage.getItem(STORAGE_KEYS.RESTAURANT_ID);
      console.log('[Auth Context] Existing restaurant ID before login:', existingRestaurantId);

      const credentials: LoginFormData = { username, password };
      const { token, admin: adminData } = await authApi.login(credentials);

      console.log('[Auth Context] Login response - admin data:', adminData);
      console.log('[Auth Context] Admin restaurantId from response:', adminData.restaurantId);

      // Store token and admin data
      localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.ADMIN_DATA, JSON.stringify(adminData));

      // Use existing restaurant ID if admin data doesn't have it
      const restaurantIdToStore = adminData.restaurantId || existingRestaurantId;
      console.log('[Auth Context] Storing restaurant ID:', restaurantIdToStore);

      if (restaurantIdToStore) {
        localStorage.setItem(STORAGE_KEYS.RESTAURANT_ID, restaurantIdToStore);
      } else {
        console.error('[Auth Context] No restaurant ID available!');
      }

      // Update state
      setAdmin(adminData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout admin
   */
  const logout = async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.ADMIN_DATA);
      localStorage.removeItem(STORAGE_KEYS.RESTAURANT_ID);

      // Update state
      setAdmin(null);
      setIsAuthenticated(false);
    }
  };

  /**
   * Refresh admin data from server
   */
  const refreshAdmin = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const adminData = await authApi.getCurrentAdmin();

      // Update stored admin data
      localStorage.setItem(STORAGE_KEYS.ADMIN_DATA, JSON.stringify(adminData));
      localStorage.setItem(STORAGE_KEYS.RESTAURANT_ID, adminData.restaurantId);

      // Update state
      setAdmin(adminData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to refresh admin data:', error);

      // Clear authentication on failure
      localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.ADMIN_DATA);
      localStorage.removeItem(STORAGE_KEYS.RESTAURANT_ID);

      setAdmin(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Check authentication status on mount
   * Optimistic check - just verify token and cached data exist
   * If token is invalid, API interceptor will handle 401/403 and redirect to login
   */
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
      const cachedAdmin = localStorage.getItem(STORAGE_KEYS.ADMIN_DATA);
      const restaurantId = localStorage.getItem(STORAGE_KEYS.RESTAURANT_ID);

      console.log('[Auth Context] Initial auth check:', { hasToken: !!token, hasAdmin: !!cachedAdmin, restaurantId });

      if (token && cachedAdmin && restaurantId) {
        try {
          // Use cached admin data to avoid unnecessary API call on every page load
          const adminData = JSON.parse(cachedAdmin);
          setAdmin(adminData);
          setIsAuthenticated(true);
          console.log('[Auth Context] Restored session from localStorage');
        } catch (error) {
          console.error('Failed to parse cached admin data:', error);
          // Clear invalid cache
          localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.ADMIN_DATA);
          localStorage.removeItem(STORAGE_KEYS.RESTAURANT_ID);
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const value: AdminAuthContextType = {
    admin,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshAdmin,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AdminAuthProvider');
  }
  return context;
};
