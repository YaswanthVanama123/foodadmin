import React, { useState, useEffect, useCallback, useRef } from 'react';
import PageHeader from '../components/common/PageHeader';
import { KitchenBoard } from '../components/kitchen';
import { OrderDetailsModal } from '../components/orders';
import { kitchenApi } from '../api';
import { Order, OrderStatus } from '../types';
import { toast } from 'react-hot-toast';
import { RefreshCw } from 'lucide-react';
import Button from '../components/ui/Button';

const Kitchen: React.FC = () => {
  const [receivedOrders, setReceivedOrders] = useState<Order[]>([]);
  const [preparingOrders, setPreparingOrders] = useState<Order[]>([]);
  const [readyOrders, setReadyOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Prevent duplicate API calls (React Strict Mode)
  const isFetching = useRef(false);

  const fetchKitchenOrders = useCallback(async () => {
    // Prevent concurrent requests
    if (isFetching.current) return;

    try {
      isFetching.current = true;
      const data = await kitchenApi.getOrders();
      setReceivedOrders(data.received);
      setPreparingOrders(data.preparing);
      setReadyOrders(data.ready);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to fetch kitchen orders:', error);
      toast.error('Failed to load kitchen orders');
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  }, []);

  useEffect(() => {
    fetchKitchenOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      if (newStatus === 'preparing') {
        await kitchenApi.startPreparing(orderId);
      } else if (newStatus === 'ready') {
        await kitchenApi.markReady(orderId);
      } else {
        // For other status changes, use the orders API
        const { ordersApi } = await import('../api');
        await ordersApi.updateStatus(orderId, newStatus);
      }

      toast.success('Order status updated successfully');
      await fetchKitchenOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status');
      throw error;
    }
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleManualRefresh = () => {
    setIsLoading(true);
    fetchKitchenOrders();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading kitchen display...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kitchen Display"
        subtitle={`Last updated: ${lastRefresh.toLocaleTimeString()}`}
      >
        <Button
          variant="outline"
          size="md"
          onClick={handleManualRefresh}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </PageHeader>

      <KitchenBoard
        receivedOrders={receivedOrders}
        preparingOrders={preparingOrders}
        readyOrders={readyOrders}
        onStatusChange={handleStatusChange}
        onOrderClick={handleOrderClick}
      />

      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        order={selectedOrder}
      />
    </div>
  );
};

export default Kitchen;
