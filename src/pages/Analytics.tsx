import React, { useState } from 'react';
import { format, subDays } from 'date-fns';
import PageHeader from '../components/PageHeader';
import {
  DateRangePicker,
  RevenueChart,
  PopularItemsChart,
  PeakHoursChart,
} from '../components/analytics';
import Spinner from '../components/ui/Spinner';
import { useAnalytics } from '../hooks/useAnalytics';
import { AnalyticsDateRange } from '../types';

const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState<AnalyticsDateRange>({
    startDate: format(subDays(new Date(), 29), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });

  const { data, loading, error } = useAnalytics(dateRange);

  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    setDateRange({
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
    });
  };

  if (error && !loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Analytics"
          subtitle="Insights and performance metrics for your restaurant"
        />
        <div className="text-center py-12">
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        subtitle="Insights and performance metrics for your restaurant"
      />

      <DateRangePicker
        startDate={new Date(dateRange.startDate)}
        endDate={new Date(dateRange.endDate)}
        onChange={handleDateRangeChange}
      />

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="space-y-6">
          <RevenueChart data={data.revenue} loading={loading} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PopularItemsChart data={data.popularItems} loading={loading} />
            <PeakHoursChart data={data.peakHours} loading={loading} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
