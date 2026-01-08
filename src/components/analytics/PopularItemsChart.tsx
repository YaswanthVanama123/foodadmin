import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card, { CardHeader, CardBody } from '../ui/Card';
import { PopularItem } from '../../types';

interface PopularItemsChartProps {
  data: PopularItem[];
  loading?: boolean;
}

const PopularItemsChart: React.FC<PopularItemsChartProps> = ({ data, loading = false }) => {
  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  // Take top 10 items for better visualization
  const chartData = data.slice(0, 10);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-xl font-bold text-gray-900">Popular Items</h3>
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
          <h3 className="text-xl font-bold text-gray-900">Popular Items</h3>
        </CardHeader>
        <CardBody>
          <div className="h-80 flex items-center justify-center">
            <p className="text-gray-500">No item data available for the selected period</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-bold text-gray-900">Popular Items</h3>
        <p className="text-sm text-gray-600 mt-1">Top selling menu items by order count and revenue</p>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              angle={-45}
              textAnchor="end"
              height={100}
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
                return [value, 'Order Count'];
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '10px' }}
              formatter={(value) => {
                if (value === 'orderCount') return 'Order Count';
                if (value === 'revenue') return 'Revenue';
                return value;
              }}
            />
            <Bar
              yAxisId="left"
              dataKey="orderCount"
              fill="#6366f1"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              yAxisId="right"
              dataKey="revenue"
              fill="#10b981"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};

export default PopularItemsChart;
