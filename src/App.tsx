import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AdminAuthProvider, useAuth } from './context/AdminAuthContext';
import { SocketProvider } from './context/SocketContext';
import { OrdersProvider, useOrders } from './context/OrdersContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './components/layout';
import { useNotifications } from './hooks/useNotifications';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Kitchen from './pages/Kitchen';
import Menu from './pages/Menu';
import Categories from './pages/Categories';
import AddOns from './pages/AddOns';
import Tables from './pages/Tables';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';

/**
 * AppContent component - handles Firebase notifications setup
 * This needs to be inside all providers to access context
 */
const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { fetchActiveOrders } = useOrders();

  // Setup Firebase Cloud Messaging notifications
  useNotifications(isAuthenticated, {
    onOrderCreated: async () => {
      console.log('📱 [FCM] New order notification - refreshing orders list');
      await fetchActiveOrders();
    },
    onOrderUpdate: async (orderId: string) => {
      console.log('📱 [FCM] Order update notification - refreshing orders list', orderId);
      await fetchActiveOrders();
    },
    onTableUpdate: async () => {
      console.log('📱 [FCM] Table update notification');
      // Tables will be refreshed automatically when viewing the tables page
    },
  });

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/kitchen" element={<Kitchen />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/addons" element={<AddOns />} />
        <Route path="/tables" element={<Tables />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Catch-all redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <SocketProvider>
          <OrdersProvider>
            {/* AppContent needs to be inside providers to access contexts */}
            <AppContent />

            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#333',
                  color: '#fff',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </OrdersProvider>
        </SocketProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
};

export default App;
