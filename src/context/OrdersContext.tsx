import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Order, OrderStatus } from '../types';
import { ordersApi } from '../api';
import { useSocket } from './SocketContext';

interface OrdersContextType {
  activeOrders: Order[];
  loading: boolean;
  error: string | null;
  fetchActiveOrders: () => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { socket, isConnected } = useSocket();

  /**
   * Fetch active orders from API
   */
  const fetchActiveOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const orders = await ordersApi.getActive();
      setActiveOrders(orders);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch active orders';
      console.error('Failed to fetch active orders:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update order status
   */
  const updateOrderStatus = useCallback(async (id: string, status: OrderStatus) => {
    try {
      setError(null);
      const updatedOrder = await ordersApi.updateStatus(id, status);

      // Update local state
      setActiveOrders((prevOrders) => {
        const orderIndex = prevOrders.findIndex((order) => order._id === id);
        if (orderIndex === -1) return prevOrders;

        // Remove order from active orders if it's served or cancelled
        if (status === 'served' || status === 'cancelled') {
          return prevOrders.filter((order) => order._id !== id);
        }

        // Update order in place
        const newOrders = [...prevOrders];
        newOrders[orderIndex] = updatedOrder;
        return newOrders;
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update order status';
      console.error('Failed to update order status:', err);
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Handle new order created via socket
   */
  const handleOrderCreated = useCallback((order: Order) => {
    console.log('New order created:', order);
    setActiveOrders((prevOrders) => {
      // Check if order already exists (prevent duplicates)
      const exists = prevOrders.some((o) => o._id === order._id);
      if (exists) return prevOrders;

      // Add new order to the beginning of the list
      return [order, ...prevOrders];
    });
  }, []);

  /**
   * Handle order updated via socket
   */
  const handleOrderUpdated = useCallback((order: Order) => {
    console.log('Order updated:', order);
    setActiveOrders((prevOrders) => {
      const orderIndex = prevOrders.findIndex((o) => o._id === order._id);

      // If order is not in active orders and is still active, add it
      if (orderIndex === -1) {
        if (order.status !== 'served' && order.status !== 'cancelled') {
          return [order, ...prevOrders];
        }
        return prevOrders;
      }

      // Remove order if it's served or cancelled
      if (order.status === 'served' || order.status === 'cancelled') {
        return prevOrders.filter((o) => o._id !== order._id);
      }

      // Update order in place
      const newOrders = [...prevOrders];
      newOrders[orderIndex] = order;
      return newOrders;
    });
  }, []);

  /**
   * Handle order cancelled via socket
   */
  const handleOrderCancelled = useCallback((data: { orderId: string }) => {
    console.log('Order cancelled:', data.orderId);
    setActiveOrders((prevOrders) => prevOrders.filter((o) => o._id !== data.orderId));
  }, []);

  /**
   * Setup socket event listeners
   */
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Subscribe to order events
    socket.on('order:created', handleOrderCreated);
    socket.on('order:updated', handleOrderUpdated);
    socket.on('order:cancelled', handleOrderCancelled);

    console.log('Subscribed to order events');

    // Cleanup listeners on unmount
    return () => {
      socket.off('order:created', handleOrderCreated);
      socket.off('order:updated', handleOrderUpdated);
      socket.off('order:cancelled', handleOrderCancelled);
      console.log('Unsubscribed from order events');
    };
  }, [socket, isConnected, handleOrderCreated, handleOrderUpdated, handleOrderCancelled]);

  /**
   * Fetch active orders on mount
   */
  useEffect(() => {
    fetchActiveOrders();
  }, [fetchActiveOrders]);

  const value: OrdersContextType = {
    activeOrders,
    loading,
    error,
    fetchActiveOrders,
    updateOrderStatus,
  };

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within OrdersProvider');
  }
  return context;
};
