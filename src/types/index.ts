// Admin Types
export interface Admin {
  _id: string;
  restaurantId: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Restaurant Types
export interface Restaurant {
  _id: string;
  subdomain: string;
  name: string;
  slug: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  branding: {
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    fontFamily?: string;
    theme?: 'light' | 'dark';
    customCSS?: string;
  };
  settings: {
    currency: string;
    taxRate: number;
    serviceChargeRate: number;
    timezone: string;
    locale: string;
    orderNumberPrefix: string;
  };
  subscription: {
    plan: 'trial' | 'basic' | 'pro' | 'enterprise';
    status: 'active' | 'suspended' | 'cancelled' | 'expired';
    startDate: string;
    endDate: string;
    billingCycle: 'monthly' | 'yearly';
    maxTables: number;
    maxMenuItems: number;
    maxAdmins: number;
  };
  isActive: boolean;
  isOnboarded: boolean;
  onboardingStep: number;
  createdAt: string;
  updatedAt: string;
}

// Order Types
export type OrderStatus = 'received' | 'preparing' | 'ready' | 'served' | 'cancelled';

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  customizations?: Array<{
    name: string;
    options: string[];
  }>;
  subtotal: number;
  specialInstructions?: string;
}

export interface StatusHistory {
  status: OrderStatus;
  timestamp: string;
  updatedBy?: string;
}

export interface Order {
  _id: string;
  restaurantId: string;
  orderNumber: string;
  tableId: string;
  tableNumber: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  statusHistory: StatusHistory[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  servedAt?: string;
}

// Menu Types
export interface CustomizationOption {
  label: string;
  priceModifier: number;
}

export interface Customization {
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  options: CustomizationOption[];
}

export interface MenuItem {
  _id: string;
  restaurantId: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  image?: string;
  isAvailable: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  customizationOptions: Customization[];
  preparationTime: number;
  createdAt: string;
  updatedAt: string;
}

// Category Types
export interface Category {
  _id: string;
  restaurantId: string;
  name: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Table Types
export interface Table {
  _id: string;
  restaurantId: string;
  tableNumber: string;
  capacity: number;
  isActive: boolean;
  isOccupied: boolean;
  currentOrderId?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard Types
export interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  activeOrders: number;
  averagePreparationTime: number;
  ordersByStatus: {
    received: number;
    preparing: number;
    ready: number;
    served: number;
  };
}

// Analytics Types
export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

export interface PopularItem {
  itemId: string;
  name: string;
  category: string;
  orderCount: number;
  revenue: number;
}

export interface PeakHour {
  hour: number;
  orderCount: number;
  revenue: number;
}

export interface CategoryPerformance {
  categoryId: string;
  categoryName: string;
  itemCount: number;
  orderCount: number;
  revenue: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form Types
export interface LoginFormData {
  username: string;
  password: string;
}

export interface MenuItemFormData {
  name: string;
  description: string;
  categoryId: string;
  price: number;
  isAvailable: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  customizationOptions: Customization[];
  preparationTime: number;
}

export interface CategoryFormData {
  name: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
}

export interface TableFormData {
  tableNumber: string;
  capacity: number;
  location?: string;
  isActive: boolean;
}

// Filter Types
export interface OrderFilters {
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface MenuFilters {
  categoryId?: string;
  search?: string;
  isAvailable?: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
}

export interface AnalyticsDateRange {
  startDate: string;
  endDate: string;
}
