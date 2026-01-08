import { useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus } from '../types';
import socketService from '../services/socket';

export const useOrders = (initialOrders: Order[] = []) => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  useEffect(() => {
    // Listen for new orders
    const handleNewOrder = (order: Order) => {
      console.log('New order received:', order);
      setOrders((prevOrders) => [order, ...prevOrders]);
    };

    // Listen for order updates
    const handleOrderUpdate = (updatedOrder: Order) => {
      console.log('Order updated:', updatedOrder);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    };

    // Listen for order status changes
    const handleOrderStatusChange = (data: { orderId: string; status: OrderStatus; order?: Order }) => {
      console.log('Order status changed:', data);
      if (data.order) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === data.orderId ? data.order! : order
          )
        );
      } else {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === data.orderId ? { ...order, status: data.status } : order
          )
        );
      }
    };

    // Subscribe to socket events
    socketService.on('new-order', handleNewOrder);
    socketService.on('order-updated', handleOrderUpdate);
    socketService.on('order-status-changed', handleOrderStatusChange);

    // Cleanup
    return () => {
      socketService.off('new-order', handleNewOrder);
      socketService.off('order-updated', handleOrderUpdate);
      socketService.off('order-status-changed', handleOrderStatusChange);
    };
  }, []);

  const updateOrderStatus = useCallback((orderId: string, newStatus: OrderStatus) => {
    // Optimistically update UI
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );

    // Emit status change to server
    socketService.emit('update-order-status', { orderId, status: newStatus });
  }, []);

  const getActiveOrders = useCallback(() => {
    return orders.filter(
      (order) => order.status !== 'served' && order.status !== 'cancelled'
    );
  }, [orders]);

  const getOrdersByStatus = useCallback((status: OrderStatus) => {
    return orders.filter((order) => order.status === status);
  }, [orders]);

  return {
    orders,
    activeOrders: getActiveOrders(),
    updateOrderStatus,
    getOrdersByStatus,
  };
};
