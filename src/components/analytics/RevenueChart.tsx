import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import Card, { CardHeader, CardBody } from '../ui/Card';
import { RevenueData } from '../../types';

interface RevenueChartProps {
  data: RevenueData[];
  loading?: boolean;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data, loading = false }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d');
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-xl font-bold text-gray-900">Revenue Overview</h3>
        </CardHeader>
        <CardBody>
          <div className="h-80 flex items-center justify-center">
            <p className="text-gray-500">Loading chart...</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-xl font-bold text-gray-900">Revenue Overview</h3>
        </CardHeader>
        <CardBody>
          <div className="h-80 flex items-center justify-center">
            <p className="text-gray-500">No revenue data available</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    ...item,
    date: formatDate(item.date),
  }));

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-bold text-gray-900">Revenue Overview</h3>
        <p className="text-sm text-gray-600 mt-1">Daily revenue and order count</p>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              yAxisId="left"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickFormatter={formatCurrency}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
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
                if (value === 'revenue') return 'Revenue';
                if (value === 'orders') return 'Orders';
                return value;
              }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ fill: '#6366f1', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="orders"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: '#10b981', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};

export default RevenueChart;
