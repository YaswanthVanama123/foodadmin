import { Order, OrderStatus } from '../../types';
import { ActiveOrderCard } from './ActiveOrderCard';
import { Package } from 'lucide-react';

interface OrdersGridProps {
  orders: Order[];
  loading: boolean;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export const OrdersGrid = ({ orders, loading, onUpdateStatus }: OrdersGridProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <Package size={48} className="text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Active Orders</h3>
        <p className="text-gray-500 text-center max-w-md">
          There are no active orders at the moment. New orders will appear here in real-time.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {orders.map((order) => (
        <ActiveOrderCard
          key={order._id}
          order={order}
          onUpdateStatus={onUpdateStatus}
        />
      ))}
    </div>
  );
};
