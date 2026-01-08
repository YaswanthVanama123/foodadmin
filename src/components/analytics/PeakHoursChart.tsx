import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card, { CardHeader, CardBody } from '../ui/Card';
import { PeakHour } from '../../types';

interface PeakHoursChartProps {
  data: PeakHour[];
  loading?: boolean;
}

const PeakHoursChart: React.FC<PeakHoursChartProps> = ({ data, loading = false }) => {
  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  const chartData = data.map((item) => ({
    ...item,
    hourLabel: formatHour(item.hour),
  }));

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-xl font-bold text-gray-900">Peak Hours</h3>
        </CardHeader>
        <CardBody>
          <div className="h-80 flex items-center justify-center">
            <p className="text-gray-500">Loading chart...</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-xl font-bold text-gray-900">Peak Hours</h3>
        </CardHeader>
        <CardBody>
          <div className="h-80 flex items-center justify-center">
            <p className="text-gray-500">No peak hours data available for the selected period</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-bold text-gray-900">Peak Hours</h3>
        <p className="text-sm text-gray-600 mt-1">Order count and revenue by hour of day</p>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="hourLabel"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              yAxisId="left"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickFormatter={formatCurrency}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: number, name: string) => {
                if (name === 'revenue') {
                  return [formatCurrency(value), 'Revenue'];
                }
                return [value, 'Orders'];
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => {
                if (value === 'orderCount') return 'Orders';
                if (value === 'revenue') return 'Revenue';
                return value;
              }}
            />
            <Bar
              yAxisId="left"
              dataKey="orderCount"
              fill="#8b5cf6"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              yAxisId="right"
              dataKey="revenue"
              fill="#f59e0b"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};

export default PeakHoursChart;
