import { useState, useEffect } from 'react';
import { PageHeader } from '../components/common';
import { StatsCard, OrdersGrid } from '../components/dashboard';
import { useOrders } from '../hooks/useOrders';
import { dashboardApi } from '../api/dashboard.api';
import { ordersApi } from '../api/orders.api';
import { DashboardStats, Order, OrderStatus } from '../types';
import { formatCurrency } from '../utils/format';
import {
  ShoppingBag,
  DollarSign,
  Clock,
  Package
} from 'lucide-react';
import socketService from '../services/socket';

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [initialOrders, setInitialOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { activeOrders, updateOrderStatus } = useOrders(initialOrders);

  // Fetch initial data on mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch stats and active orders in parallel
        const [statsData, ordersData] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getActiveOrders(),
        ]);

        setStats(statsData);
        setInitialOrders(ordersData);

        // Ensure socket is connected
        const restaurantId = localStorage.getItem('restaurantId');
        if (restaurantId && !socketService.isConnected()) {
          socketService.connect(restaurantId);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Update stats when orders change
  useEffect(() => {
    if (!stats) return;

    // Recalculate active orders count
    const activeCount = activeOrders.length;

    // Only update if the count actually changed
    if (stats.activeOrders !== activeCount) {
      setStats((prevStats) =>
        prevStats ? { ...prevStats, activeOrders: activeCount } : null
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeOrders.length]); // Only depend on the length, not the entire array

  // Handle order status update
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      // Update via hook (optimistic update + socket emission)
      updateOrderStatus(orderId, newStatus);

      // Also call API to ensure server is updated
      await ordersApi.updateStatus(orderId, newStatus);
    } catch (err) {
      console.error('Error updating order status:', err);
      // The socket will handle syncing if there's an error
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Dashboard"
        subtitle="Real-time overview of your restaurant operations"
      />

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Today's Orders"
            value={stats.todayOrders}
            icon={ShoppingBag}
            color="#3b82f6"
          />
          <StatsCard
            title="Today's Revenue"
            value={formatCurrency(stats.todayRevenue)}
            icon={DollarSign}
            color="#10b981"
          />
          <StatsCard
            title="Active Orders"
            value={stats.activeOrders}
            icon={Package}
            color="#f59e0b"
          />
          <StatsCard
            title="Avg Prep Time"
            value={`${stats.averagePreparationTime}m`}
            icon={Clock}
            color="#8b5cf6"
          />
        </div>
      )}

      {/* Active Orders Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Orders</h2>
        <OrdersGrid
          orders={activeOrders}
          loading={false}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>
    </div>
  );
};

export default Dashboard;
