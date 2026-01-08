import React, { useState } from 'react';
import Button from '../ui/Button';
import { Order, OrderStatus } from '../../types';
import { formatCurrency, getRelativeTime } from '../../utils';
import { MapPin, Clock, ArrowRight, Eye } from 'lucide-react';

interface KitchenOrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => Promise<void>;
  onOrderClick?: (order: Order) => void;
}

const KitchenOrderCard: React.FC<KitchenOrderCardProps> = ({
  order,
  onStatusChange,
  onOrderClick,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

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

  const getNextStatusLabel = (currentStatus: OrderStatus): string => {
    switch (currentStatus) {
      case 'received':
        return 'Start Preparing';
      case 'preparing':
        return 'Mark Ready';
      case 'ready':
        return 'Mark Served';
      default:
        return '';
    }
  };

  const handleStatusChange = async () => {
    const nextStatus = getNextStatus(order.status);
    if (!nextStatus) return;

    setIsUpdating(true);
    try {
      await onStatusChange(order._id, nextStatus);
    } catch (error) {
      console.error('Failed to update order status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const nextStatus = getNextStatus(order.status);

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h4 className="font-bold text-lg text-indigo-600">
            {order.orderNumber}
          </h4>
          <div className="flex items-center space-x-1 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">Table {order.tableNumber}</span>
          </div>
        </div>
        {onOrderClick && (
          <button
            onClick={() => onOrderClick(order)}
            className="text-gray-400 hover:text-indigo-600 transition-colors"
            title="View Details"
          >
            <Eye className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Items */}
      <div className="px-4 py-3 space-y-2">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between items-start">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                <span className="text-indigo-600 font-bold">{item.quantity}x</span>{' '}
                {item.name}
              </p>
              {item.customizations && item.customizations.length > 0 && (
                <div className="mt-0.5 space-y-0.5">
                  {item.customizations.map((customization, idx) => (
                    <p key={idx} className="text-xs text-gray-500">
                      {customization.name}: {customization.options.join(', ')}
                    </p>
                  ))}
                </div>
              )}
              {item.specialInstructions && (
                <p className="text-xs text-orange-600 font-medium mt-1 bg-orange-50 px-2 py-1 rounded">
                  Note: {item.specialInstructions}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1 text-gray-600">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-medium">{getRelativeTime(order.createdAt)}</span>
          </div>
          <span className="text-sm font-bold text-gray-900">
            {formatCurrency(order.total)}
          </span>
        </div>
        {nextStatus && (
          <Button
            fullWidth
            size="sm"
            onClick={handleStatusChange}
            isLoading={isUpdating}
            disabled={isUpdating}
          >
            {getNextStatusLabel(order.status)}
            {!isUpdating && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        )}
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="px-4 py-2 bg-yellow-50 border-t border-yellow-200">
          <p className="text-xs text-yellow-800">
            <span className="font-semibold">Note:</span> {order.notes}
          </p>
        </div>
      )}
    </div>
  );
};

export default KitchenOrderCard;
