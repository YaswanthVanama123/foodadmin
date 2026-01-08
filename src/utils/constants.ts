import { OrderStatus } from '../types';

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Order Status Configuration
export const ORDER_STATUS_CONFIG: Record<OrderStatus, {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
}> = {
  received: {
    label: 'Received',
    color: '#3b82f6',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
  },
  preparing: {
    label: 'Preparing',
    color: '#f59e0b',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
  },
  ready: {
    label: 'Ready',
    color: '#10b981',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
  },
  served: {
    label: 'Served',
    color: '#6b7280',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
  },
  cancelled: {
    label: 'Cancelled',
    color: '#ef4444',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
  },
};

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Date Presets for Analytics
export const DATE_RANGE_PRESETS = {
  today: { label: 'Today', days: 0 },
  yesterday: { label: 'Yesterday', days: 1 },
  last7Days: { label: 'Last 7 Days', days: 7 },
  last30Days: { label: 'Last 30 Days', days: 30 },
  thisMonth: { label: 'This Month', days: 30 },
  lastMonth: { label: 'Last Month', days: 60 },
};

// Local Storage Keys
export const STORAGE_KEYS = {
  ADMIN_TOKEN: 'adminToken',
  RESTAURANT_ID: 'restaurantId',
  ADMIN_DATA: 'adminData',
};

// Toast Configuration
export const TOAST_CONFIG = {
  duration: 3000,
  position: 'top-right' as const,
};
