import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { formatCurrency } from '../../utils/format';
import { ORDER_STATUS_CONFIG } from '../../utils/constants';

interface ActiveOrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export const ActiveOrderCard = ({ order, onUpdateStatus }: ActiveOrderCardProps) => {
  const [timeElapsed, setTimeElapsed] = useState<string>('');

  useEffect(() => {
    const updateTimeElapsed = () => {
      const now = new Date();
      const created = new Date(order.createdAt);
      const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / 60000);

      if (diffInMinutes < 1) {
        setTimeElapsed('Just now');
      } else if (diffInMinutes < 60) {
        setTimeElapsed(`${diffInMinutes}m ago`);
      } else {
        const hours = Math.floor(diffInMinutes / 60);
        const minutes = diffInMinutes % 60;
        setTimeElapsed(`${hours}h ${minutes}m ago`);
      }
    };

    updateTimeElapsed();
    const interval = setInterval(updateTimeElapsed, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [order.createdAt]);

  const statusConfig = ORDER_STATUS_CONFIG[order.status];

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
      case 'received':
        return 'preparing';
      case 'preparing':
        return 'ready';
      case 'ready':
        return 'served';
      default:
        return null;
    }
  };

  const nextStatus = getNextStatus(order.status);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border-l-4" style={{ borderLeftColor: statusConfig.color }}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{order.orderNumber}</h3>
          <p className="text-sm text-gray-600">Table {order.tableNumber}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.textColor}`}
        >
          {statusConfig.label}
        </span>
      </div>

      <div className="mb-3">
        <div className="text-sm text-gray-700 space-y-1">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>
                {item.quantity}x {item.name}
              </span>
              <span className="text-gray-600">{formatCurrency(item.subtotal)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold text-gray-700">Total:</span>
          <span className="text-lg font-bold text-gray-900">{formatCurrency(order.total)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Clock size={14} className="mr-1" />
            {timeElapsed}
          </div>

          {nextStatus && (
            <button
              onClick={() => onUpdateStatus(order._id, nextStatus)}
              className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors"
              style={{
                backgroundColor: ORDER_STATUS_CONFIG[nextStatus].color,
              }}
            >
              Mark as {ORDER_STATUS_CONFIG[nextStatus].label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
