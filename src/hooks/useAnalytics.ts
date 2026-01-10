import { useState, useEffect, useRef } from 'react';
import { analyticsApi } from '../api';
import {
  RevenueData,
  PopularItem,
  PeakHour,
  CategoryPerformance,
  AnalyticsDateRange,
} from '../types';
import toast from 'react-hot-toast';

interface AnalyticsData {
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

export const useAnalytics = (dateRange: AnalyticsDateRange) => {
  const [data, setData] = useState<AnalyticsData>({
    revenue: {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      ordersByStatus: [],
      dailyRevenue: [],
    },
    popularItems: [],
    peakHours: [],
    categoryPerformance: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Prevent duplicate API calls (React Strict Mode)
  const isFetching = useRef(false);

  const fetchAnalytics = async () => {
    // Prevent concurrent requests
    if (isFetching.current) return;

    try {
      isFetching.current = true;
      setLoading(true);
      setError(null);

      // Single API call for all analytics data
      const analyticsData = await analyticsApi.getPageData(dateRange);

      setData(analyticsData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch analytics data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange.startDate, dateRange.endDate]);

  return {
    data,
    loading,
    error,
    refetch: fetchAnalytics,
  };
};
