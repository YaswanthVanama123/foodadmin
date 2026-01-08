import React from 'react';
import KitchenOrderCard from './KitchenOrderCard';
import { Order, OrderStatus } from '../../types';

interface KitchenColumnProps {
  title: string;
  status: OrderStatus;
  orders: Order[];
  icon: React.ReactNode;
  color: 'blue' | 'yellow' | 'green';
  onStatusChange: (orderId: string, newStatus: OrderStatus) => Promise<void>;
  onOrderClick?: (order: Order) => void;
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    header: 'bg-blue-100 text-blue-800',
    count: 'bg-blue-600 text-white',
  },
  yellow: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    header: 'bg-yellow-100 text-yellow-800',
    count: 'bg-yellow-600 text-white',
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    header: 'bg-green-100 text-green-800',
    count: 'bg-green-600 text-white',
  },
};

const KitchenColumn: React.FC<KitchenColumnProps> = ({
  title,
  status: _status,
  orders,
  icon,
  color,
  onStatusChange,
  onOrderClick,
}) => {
  const colors = colorClasses[color];

  return (
    <div className={`rounded-lg border-2 ${colors.border} ${colors.bg} overflow-hidden`}>
      {/* Header */}
      <div className={`px-4 py-3 ${colors.header} flex items-center justify-between`}>
        <div className="flex items-center space-x-2">
          {icon}
          <h3 className="font-bold text-lg">{title}</h3>
        </div>
        <span className={`${colors.count} text-sm font-bold px-2.5 py-1 rounded-full`}>
          {orders.length}
        </span>
      </div>

      {/* Orders */}
      <div className="p-4 space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto">
        {orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No orders in this status</p>
          </div>
        ) : (
          orders.map((order) => (
            <KitchenOrderCard
              key={order._id}
              order={order}
              onStatusChange={onStatusChange}
              onOrderClick={onOrderClick}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default KitchenColumn;
