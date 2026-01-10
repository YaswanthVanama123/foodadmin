import React, { useState, useEffect, useRef } from 'react';
import PageHeader from '../components/common/PageHeader';
import Pagination from '../components/common/Pagination';
import {
  OrdersTable,
  OrderDetailsModal,
  OrderFilters,
} from '../components/orders';
import { ordersApi } from '../api';
import { Order, OrderFilters as OrderFiltersType } from '../types';
import { toast } from 'react-hot-toast';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<OrderFiltersType>({
    page: 1,
    limit: 20,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });

  // Prevent duplicate API calls (React Strict Mode)
  const isFetching = useRef(false);

  const fetchOrders = async () => {
    // Prevent concurrent requests
    if (isFetching.current) return;

    try {
      isFetching.current = true;
      setIsLoading(true);
      const response = await ordersApi.getAll(filters);
      setOrders(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.page, filters.limit, filters.status, filters.tableId]);

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleFiltersChange = (newFilters: OrderFiltersType) => {
    setFilters({
      ...newFilters,
      page: 1,
      limit: filters.limit,
    });
  };

  const handlePageChange = (page: number) => {
    setFilters({
      ...filters,
      page,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        subtitle="Manage and track all customer orders"
      />

      <OrderFilters
        onFiltersChange={handleFiltersChange}
        initialFilters={filters}
      />

      <OrdersTable
        orders={orders}
        isLoading={isLoading}
        onOrderClick={handleOrderClick}
      />

      {!isLoading && orders.length > 0 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={handlePageChange}
        />
      )}

      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        order={selectedOrder}
      />
    </div>
  );
};

export default Orders;
