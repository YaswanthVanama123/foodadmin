import { useState, useEffect } from 'react';
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
  revenue: RevenueData[];
  popularItems: PopularItem[];
  peakHours: PeakHour[];
  categoryPerformance: CategoryPerformance[];
}

export const useAnalytics = (dateRange: AnalyticsDateRange) => {
  const [data, setData] = useState<AnalyticsData>({
    revenue: [],
    popularItems: [],
    peakHours: [],
    categoryPerformance: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const [revenueData, popularItemsData, peakHoursData, categoryPerformanceData] =
        await Promise.all([
          analyticsApi.getRevenue(dateRange),
          analyticsApi.getPopularItems(dateRange),
          analyticsApi.getPeakHours(dateRange),
          analyticsApi.getCategoryPerformance(dateRange),
        ]);

      setData({
        revenue: revenueData,
        popularItems: popularItemsData,
        peakHours: peakHoursData,
        categoryPerformance: categoryPerformanceData,
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch analytics data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange.startDate, dateRange.endDate]);

  return {
    data,
    loading,
    error,
    refetch: fetchAnalytics,
  };
};
