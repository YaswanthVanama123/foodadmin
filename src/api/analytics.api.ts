import { apiClient } from './client';
import {
  RevenueData,
  PopularItem,
  PeakHour,
  CategoryPerformance,
  AnalyticsDateRange,
  ApiResponse,
} from '../types';

export interface AnalyticsPageData {
  revenue: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    ordersByStatus: any[];
    dailyRevenue: RevenueData[];
  };
  popularItems: PopularItem[];
  peakHours: PeakHour[];
  categoryPerformance: CategoryPerformance[];
}

export const analyticsApi = {
  /**
   * Get all analytics page data (combined endpoint) - OPTIMIZED
   */
  getPageData: async (dateRange: AnalyticsDateRange): Promise<AnalyticsPageData> => {
    const response = await apiClient.get<ApiResponse<AnalyticsPageData>>('/analytics/page-data', {
      params: dateRange,
    });
    return response.data.data;
  },

  /**
   * Get revenue analytics
   */
  getRevenue: async (dateRange: AnalyticsDateRange): Promise<RevenueData[]> => {
    const response = await apiClient.get<ApiResponse<RevenueData[]>>('/analytics/revenue', {
      params: dateRange,
    });
    return response.data.data;
  },

  /**
   * Get popular items
   */
  getPopularItems: async (dateRange: AnalyticsDateRange): Promise<PopularItem[]> => {
    const response = await apiClient.get<ApiResponse<PopularItem[]>>('/analytics/popular-items', {
      params: dateRange,
    });
    return response.data.data;
  },

  /**
   * Get peak hours
   */
  getPeakHours: async (dateRange: AnalyticsDateRange): Promise<PeakHour[]> => {
    const response = await apiClient.get<ApiResponse<PeakHour[]>>('/analytics/peak-hours', {
      params: dateRange,
    });
    return response.data.data;
  },

  /**
   * Get category performance
   */
  getCategoryPerformance: async (dateRange: AnalyticsDateRange): Promise<CategoryPerformance[]> => {
    const response = await apiClient.get<ApiResponse<CategoryPerformance[]>>(
      '/analytics/category-performance',
      {
        params: dateRange,
      }
    );
    return response.data.data;
  },

  /**
   * Get table performance metrics
   */
  getTablePerformance: async (dateRange: AnalyticsDateRange): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>('/analytics/table-performance', {
      params: dateRange,
    });
    return response.data.data;
  },

  /**
   * Get preparation time analytics
   */
  getPreparationTime: async (dateRange: AnalyticsDateRange): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>('/analytics/preparation-time', {
      params: dateRange,
    });
    return response.data.data;
  },

  /**
   * Get dashboard analytics (aggregated)
   */
  getDashboardAnalytics: async (): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>('/analytics/dashboard');
    return response.data.data;
  },
};
