import { useState, useEffect, useRef, useCallback } from 'react';
import { PageHeader } from '../components/common';
import { StatsCard, OrdersGrid } from '../components/dashboard';
import PrintServiceBanner from '../components/PrintServiceBanner';
import { useOrders } from '../hooks/useOrders';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../context/AdminAuthContext';
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
import { printService } from '../services/printService';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { admin, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [initialOrders, setInitialOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Prevent duplicate API calls (React Strict Mode)
  const hasFetchedData = useRef(false);
  const isFetching = useRef(false);

  const { activeOrders, updateOrderStatus } = useOrders(initialOrders);

  // Fetch dashboard data function (reusable)
  const fetchDashboardData = useCallback(async (showLoading = true) => {
    // Prevent duplicate calls
    if (isFetching.current) return;

    try {
      isFetching.current = true;
      if (showLoading) {
        setLoading(true);
      }
      setError(null);

      console.log('📊 [Dashboard] Fetching dashboard data...');

      // OPTIMIZATION: Single API call for stats + active orders
      const { stats: statsData, activeOrders: ordersData } = await dashboardApi.getPageData();

      setStats(statsData);
      setInitialOrders(ordersData);

      console.log('✅ [Dashboard] Data fetched successfully');

      // Ensure socket is connected
      const restaurantId = localStorage.getItem('restaurantId');
      if (restaurantId && !socketService.isConnected()) {
        socketService.connect(restaurantId);
      }
    } catch (err) {
      console.error('❌ [Dashboard] Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      if (showLoading) {
        setLoading(false);
      }
      isFetching.current = false;
    }
  }, []);

  // Handle order notifications and refresh dashboard
  const handleOrderNotification = useCallback(() => {
    console.log('🔔 [Dashboard] Order notification received - refreshing dashboard...');
    fetchDashboardData(false);
  }, [fetchDashboardData]);

  // Handle new order creation with auto-print
  const handleOrderCreated = useCallback(async (order: Order) => {
    console.log('🆕 [Dashboard] New order created:', order.orderNumber);

    // Refresh dashboard data
    fetchDashboardData(false);

    // Auto-print if print service is connected
    try {
      const result = await printService.print(order);
      if (result.success) {
        console.log('✅ [Dashboard] Order printed automatically');
        toast.success(`Order #${order.orderNumber} printed!`, {
          icon: '🖨️',
          duration: 2000,
        });
      } else {
        console.log('⚠️ [Dashboard] Print failed:', result.error);
      }
    } catch (error) {
      console.log('⚠️ [Dashboard] Print service not available');
    }
  }, [fetchDashboardData]);

  // Setup Firebase notifications with dashboard refresh callbacks
  useNotifications(isAuthenticated, {
    onOrderCreated: handleOrderCreated,
    onOrderUpdate: handleOrderNotification,
  });

  // Fetch initial data on mount
  useEffect(() => {
    // Prevent duplicate calls
    if (hasFetchedData.current || isFetching.current) return;

    hasFetchedData.current = true;
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch data when tab becomes visible (Page Visibility API)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('👁️ [Dashboard] Tab became visible - refreshing data...');
        // Refetch data without showing loading spinner
        fetchDashboardData(false);
      } else {
        console.log('🙈 [Dashboard] Tab became hidden');
      }
    };

    // Add event listener
    document.addEventListener('visibilitychange', handleVisibilityChange);

    console.log('✅ [Dashboard] Visibility change listener added');

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      console.log('🗑️ [Dashboard] Visibility change listener removed');
    };
  }, [fetchDashboardData]); // Now depends on fetchDashboardData callback

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

      {/* Print Service Banner */}
      <PrintServiceBanner />

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Today's Orders"
            value={stats.todayOrders ?? 0}
            icon={ShoppingBag}
            color="#3b82f6"
          />
          <StatsCard
            title="Today's Revenue"
            value={formatCurrency(stats.todayRevenue ?? 0)}
            icon={DollarSign}
            color="#10b981"
          />
          <StatsCard
            title="Active Orders"
            value={stats.activeOrders ?? 0}
            icon={Package}
            color="#f59e0b"
          />
          <StatsCard
            title="Avg Prep Time"
            value={`${stats.averagePreparationTime ?? 0}m`}
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
