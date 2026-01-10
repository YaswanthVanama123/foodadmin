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
  const handleOrderCreated = useCallback((data: any) => {
    console.log('New order received:', data);

    // The socket event sends partial order data, fetch full order if needed
    // For now, add the order data to active orders
    setActiveOrders((prevOrders) => {
      // Create a basic Order object from the socket data
      const newOrder: Order = {
        _id: data.orderId,
        orderNumber: data.orderNumber,
        tableNumber: data.tableNumber,
        items: data.items,
        subtotal: data.subtotal || 0,
        tax: data.tax || 0,
        total: data.total,
        status: data.status,
        createdAt: data.createdAt,
        restaurantId: '',
        tableId: null,
        notes: '',
      } as Order;

      // Check if order already exists (prevent duplicates)
      const exists = prevOrders.some((o) => o._id === newOrder._id);
      if (exists) return prevOrders;

      // Add new order to the beginning of the list
      return [newOrder, ...prevOrders];
    });
  }, []);

  /**
   * Handle order status changed via socket
   */
  const handleOrderStatusChanged = useCallback((data: any) => {
    console.log('Order status changed:', data);
    setActiveOrders((prevOrders) => {
      const orderIndex = prevOrders.findIndex((o) => o._id === data.orderId);

      // If order not found, ignore
      if (orderIndex === -1) return prevOrders;

      // Remove order if it's served or cancelled
      if (data.status === 'served' || data.status === 'cancelled') {
        return prevOrders.filter((o) => o._id !== data.orderId);
      }

      // Update order status in place
      const newOrders = [...prevOrders];
      newOrders[orderIndex] = {
        ...newOrders[orderIndex],
        status: data.status,
      };
      return newOrders;
    });
  }, []);

  /**
   * Setup socket event listeners
   */
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Subscribe to order events (matching backend event names)
    socket.on('new-order', handleOrderCreated);
    socket.on('order-status-changed', handleOrderStatusChanged);

    console.log('Subscribed to order events');

    // Cleanup listeners on unmount
    return () => {
      socket.off('new-order', handleOrderCreated);
      socket.off('order-status-changed', handleOrderStatusChanged);
      console.log('Unsubscribed from order events');
    };
  }, [socket, isConnected, handleOrderCreated, handleOrderStatusChanged]);

  /**
   * Fetch active orders on mount - REMOVED
   *
   * This was causing duplicate API calls since Dashboard now uses
   * the optimized page-data endpoint that includes active orders.
   *
   * Pages that need OrdersContext can call fetchActiveOrders() manually
   * or use their own data fetching logic.
   */
  // useEffect(() => {
  //   fetchActiveOrders();
  // }, [fetchActiveOrders]);

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
