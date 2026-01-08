import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Admin } from '../types';

interface AuthContextType {
  admin: Admin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (admin: Admin, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already logged in
    const storedAdmin = localStorage.getItem('admin');
    const storedToken = localStorage.getItem('token');

    if (storedAdmin && storedToken) {
      try {
        const parsedAdmin = JSON.parse(storedAdmin);
        setAdmin(parsedAdmin);
      } catch (error) {
        console.error('Failed to parse stored admin data:', error);
        localStorage.removeItem('admin');
        localStorage.removeItem('token');
      }
    }

    setIsLoading(false);
  }, []);

  const login = (adminData: Admin, token: string) => {
    setAdmin(adminData);
    localStorage.setItem('admin', JSON.stringify(adminData));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('admin');
    localStorage.removeItem('token');
  };

  const value: AuthContextType = {
    admin,
    isLoading,
    isAuthenticated: !!admin,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
