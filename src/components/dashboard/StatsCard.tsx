import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatsCard = ({ title, value, icon: Icon, color, trend }: StatsCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>

          {trend && (
            <div className="mt-2 flex items-center">
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '+' : '-'}
                {Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-gray-500 ml-2">vs yesterday</span>
            </div>
          )}
        </div>

        <div
          className="flex items-center justify-center w-14 h-14 rounded-full"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon size={28} style={{ color }} />
        </div>
      </div>
    </div>
  );
};
