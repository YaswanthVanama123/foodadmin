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
      const credentials: LoginFormData = { username, password };
      const { token, admin: adminData } = await authApi.login(credentials);

      // Store token and admin data
      localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.ADMIN_DATA, JSON.stringify(adminData));
      localStorage.setItem(STORAGE_KEYS.RESTAURANT_ID, adminData.restaurantId);

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
   */
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Verify token is still valid by fetching current admin
        await refreshAdmin();
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsLoading(false);
      }
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
