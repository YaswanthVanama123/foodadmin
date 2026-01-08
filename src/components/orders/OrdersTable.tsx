import React from 'react';
import { Order } from '../../types';
import DataTable, { Column } from '../common/DataTable';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils';
import { Eye } from 'lucide-react';

interface OrdersTableProps {
  orders: Order[];
  isLoading?: boolean;
  onOrderClick?: (order: Order) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  isLoading = false,
  onOrderClick,
}) => {
  const columns: Column<Order>[] = [
    {
      key: 'orderNumber',
      label: 'Order #',
      sortable: true,
      render: (order) => (
        <span className="font-semibold text-indigo-600">{order.orderNumber}</span>
      ),
    },
    {
      key: 'tableNumber',
      label: 'Table',
      sortable: true,
      render: (order) => (
        <span className="font-medium">Table {order.tableNumber}</span>
      ),
    },
    {
      key: 'items',
      label: 'Items',
      render: (order) => (
        <span className="text-gray-600">
          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
        </span>
      ),
    },
    {
      key: 'total',
      label: 'Total',
      sortable: true,
      render: (order) => (
        <span className="font-semibold">{formatCurrency(order.total)}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (order) => <StatusBadge status={order.status} />,
    },
    {
      key: 'createdAt',
      label: 'Order Time',
      sortable: true,
      render: (order) => (
        <span className="text-sm text-gray-600">{formatDate(order.createdAt)}</span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (order) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOrderClick?.(order);
          }}
          className="text-indigo-600 hover:text-indigo-800 transition-colors"
          title="View Details"
        >
          <Eye className="h-5 w-5" />
        </button>
      ),
    },
  ];

  return (
    <DataTable
      data={orders}
      columns={columns}
      isLoading={isLoading}
      emptyMessage="No orders found"
      onRowClick={onOrderClick}
    />
  );
};

export default OrdersTable;
