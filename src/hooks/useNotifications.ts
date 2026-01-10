import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import firebaseService from '../services/firebase.service';
import { fcmTokenApi } from '../api';
import notificationStorage from '../services/notificationStorage.service';

// LocalStorage key for storing registered FCM token
const FCM_TOKEN_STORAGE_KEY = 'admin_fcm_token_registered';

interface NotificationCallbacks {
  onOrderUpdate?: (orderId: string) => void;
  onOrderCreated?: () => void;
  onTableUpdate?: () => void;
}

/**
 * Custom hook for handling Firebase Cloud Messaging notifications in Admin App
 * Supports both silent (data-only) and active (visible) notifications
 *
 * @param isAuthenticated - Whether admin is logged in
 * @param callbacks - Optional callbacks for different notification types
 */
export const useNotifications = (
  isAuthenticated: boolean,
  callbacks?: NotificationCallbacks
) => {
  const navigate = useNavigate();
  const tokenRegistered = useRef(false);
  const currentToken = useRef<string | null>(null);

  /**
   * Handle silent notifications - trigger API calls without showing notification
   */
  const handleSilentNotification = useCallback(
    async (data: Record<string, string>) => {
      console.log('📡 Silent notification received (Admin):', data);

      // Save to localStorage
      notificationStorage.save({
        type: 'silent',
        category: data.category || 'silent',
        title: data.title || 'Silent Notification',
        body: data.body || 'Background update',
        data,
      });

      const action = data.action;

      // ORDER UPDATES - Refresh order data
      if (action === 'refresh_order' && data.orderId) {
        console.log('🔄 Refreshing order:', data.orderId);
        if (callbacks?.onOrderUpdate) {
          callbacks.onOrderUpdate(data.orderId);
        }
      }

      // NEW ORDER - Refresh orders list
      if (action === 'refresh_orders') {
        console.log('🔄 Refreshing orders list');
        if (callbacks?.onOrderCreated) {
          callbacks.onOrderCreated();
        }
      }

      // TABLE UPDATES - Refresh table data
      if (action === 'refresh_tables') {
        console.log('🔄 Refreshing tables');
        if (callbacks?.onTableUpdate) {
          callbacks.onTableUpdate();
        }
      }
    },
    [callbacks]
  );

  /**
   * Handle active notifications - visible alerts to the admin
   */
  const handleActiveNotification = useCallback(
    (data: Record<string, string>) => {
      console.log('🔔 Active notification received (Admin):', data);

      const category = data.category;
      const clickAction = data.clickAction;

      // Get title and body from data (sent by backend)
      const title = data.title || 'New Notification';
      const body = data.body || 'You have a new update';

      // Save to localStorage
      notificationStorage.save({
        type: 'active',
        category: category || 'general',
        title,
        body,
        data,
      });

      console.log('📱 Showing toast notification:');
      console.log('   Title:', title);
      console.log('   Body:', body);

      // NEW ORDER NOTIFICATION
      if (category === 'new_order') {
        const orderId = data.orderId;
        const orderNumber = data.orderNumber;

        // Show toast notification with sound
        toast.success(body, {
          duration: 10000, // Show for 10 seconds for new orders
          icon: '🔔',
          onClick: () => {
            if (clickAction) {
              console.log('🔗 Navigating to:', clickAction);
              navigate(clickAction);
            }
          },
        } as any);

        // Trigger refresh
        if (callbacks?.onOrderCreated) {
          console.log('🔄 Triggering orders list refresh');
          callbacks.onOrderCreated();
        }

        // Play notification sound if available
        try {
          const audio = new Audio('/sounds/notification.mp3');
          audio.volume = 0.5;
          audio.play().catch((err) => {
            console.log('Could not play notification sound:', err);
          });
        } catch (err) {
          console.log('Audio not available');
        }
      }

      // ORDER STATUS UPDATE NOTIFICATION
      else if (category === 'order_status') {
        const orderId = data.orderId;
        const orderNumber = data.orderNumber;
        const status = data.status;

        toast.success(body, {
          duration: 5000,
          onClick: () => {
            if (clickAction) {
              console.log('🔗 Navigating to:', clickAction);
              navigate(clickAction);
            }
          },
        } as any);

        // Trigger refresh
        if (callbacks?.onOrderUpdate && orderId) {
          console.log('🔄 Triggering order refresh for:', orderId);
          callbacks.onOrderUpdate(orderId);
        }
      }

      // TABLE UPDATE NOTIFICATION
      else if (category === 'table_update') {
        toast.success(body, {
          duration: 5000,
          onClick: () => {
            if (clickAction) {
              console.log('🔗 Navigating to:', clickAction);
              navigate(clickAction);
            }
          },
        } as any);

        // Trigger refresh
        if (callbacks?.onTableUpdate) {
          console.log('🔄 Triggering table refresh');
          callbacks.onTableUpdate();
        }
      }

      // GENERIC NOTIFICATION
      else {
        toast.success(body, {
          duration: 5000,
          onClick: () => {
            if (clickAction) {
              console.log('🔗 Navigating to:', clickAction);
              navigate(clickAction);
            }
          },
        } as any);
      }
    },
    [navigate, callbacks]
  );

  /**
   * Register FCM token with backend
   * Only sends to backend if token is new or not yet registered in localStorage
   */
  const registerToken = useCallback(async () => {
    if (!isAuthenticated || !firebaseService.isReady()) {
      return;
    }

    try {
      console.log('🔑 Requesting FCM token from Firebase (Admin)...');

      // Get FCM token
      const token = await firebaseService.getToken();

      if (!token) {
        console.log('❌ No FCM token available');
        return;
      }

      console.log('🎫 FCM Token Generated (Admin):');
      console.log('   Full token:', token);
      console.log('   Token preview:', token.substring(0, 50) + '...');

      // Check if this token is already registered in localStorage
      const storedToken = localStorage.getItem(FCM_TOKEN_STORAGE_KEY);

      if (storedToken === token) {
        console.log('✅ Token already registered in localStorage - skipping backend call');
        currentToken.current = token;
        tokenRegistered.current = true;
        return;
      }

      // New token or not yet registered - send to backend
      console.log('📤 Registering new token with backend...');
      const response = await fcmTokenApi.register(token);
      console.log('   Backend response:', response);

      // Store token in localStorage after successful registration
      localStorage.setItem(FCM_TOKEN_STORAGE_KEY, token);

      currentToken.current = token;
      tokenRegistered.current = true;

      console.log('✅ FCM token registered with backend successfully (Admin)!');
      console.log('💾 Token saved to localStorage');
    } catch (error) {
      console.error('❌ Failed to register FCM token:', error);
    }
  }, [isAuthenticated]);

  /**
   * Remove FCM token from backend (on logout)
   */
  const unregisterToken = useCallback(async () => {
    if (!currentToken.current) {
      return;
    }

    try {
      const token = currentToken.current;

      // Send token to backend for removal
      await fcmTokenApi.remove(token);
      await firebaseService.deleteToken();

      // Remove from localStorage
      localStorage.removeItem(FCM_TOKEN_STORAGE_KEY);

      currentToken.current = null;
      tokenRegistered.current = false;

      console.log('✅ FCM token removed from backend (Admin)');
      console.log('🗑️ Token removed from localStorage');
    } catch (error) {
      console.error('Failed to remove FCM token:', error);
    }
  }, []);

  /**
   * Request notification permission
   */
  const requestPermission = useCallback(async () => {
    const permission = await firebaseService.requestPermission();

    if (permission === 'granted') {
      console.log('✅ Notification permission granted (Admin)');
      await registerToken();
    } else if (permission === 'denied') {
      console.log('❌ Notification permission denied');
      toast.error('Notifications are blocked. Enable them in browser settings for real-time updates.');
    }
  }, [registerToken]);

  /**
   * Check permission status
   */
  const checkPermission = useCallback(() => {
    return firebaseService.getPermissionStatus();
  }, []);

  /**
   * Setup foreground message listener
   */
  useEffect(() => {
    if (!firebaseService.isReady()) {
      console.log('⚠️  Firebase not ready, skipping message listener setup');
      return;
    }

    console.log('📡 Setting up foreground message listener (Admin)...');

    // Listen for foreground messages
    firebaseService.onForegroundMessage((payload) => {
      console.log('📩 Foreground message received (Admin)!');
      console.log('   Type:', payload.type);
      console.log('   Data:', payload.data);

      const { type, data } = payload;

      if (type === 'silent') {
        console.log('🔇 Handling silent notification...');
        handleSilentNotification(data);
      } else if (type === 'active') {
        console.log('🔔 Handling active notification...');
        handleActiveNotification(data);
      } else {
        console.log('❓ Unknown notification type:', type);
      }
    });

    console.log('✅ Foreground message listener setup complete (Admin)');
  }, [handleSilentNotification, handleActiveNotification]);

  /**
   * Setup service worker message listener for background notifications
   */
  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      console.log('⚠️  Service workers not supported');
      return;
    }

    console.log('📡 Setting up service worker message listener (Admin)...');

    const messageHandler = (event: MessageEvent) => {
      console.log('📬 Service worker message received (Admin):', event.data);

      if (event.data?.type === 'SILENT_NOTIFICATION') {
        console.log('🔇 Handling silent notification from service worker...');
        handleSilentNotification(event.data.data);
      } else if (event.data?.type === 'NAVIGATE') {
        console.log('🧭 Navigating to:', event.data.url);
        navigate(event.data.url);
      } else {
        console.log('❓ Unknown service worker message type:', event.data?.type);
      }
    };

    navigator.serviceWorker.addEventListener('message', messageHandler);

    console.log('✅ Service worker message listener setup complete (Admin)');

    return () => {
      navigator.serviceWorker.removeEventListener('message', messageHandler);
      console.log('🗑️ Service worker message listener removed');
    };
  }, [handleSilentNotification, navigate]);

  /**
   * Auto-register token when admin logs in
   */
  useEffect(() => {
    if (isAuthenticated && !tokenRegistered.current) {
      // Check if permission is already granted
      const permission = firebaseService.getPermissionStatus();

      if (permission === 'granted') {
        registerToken();
      } else if (permission === 'default') {
        // Auto-request permission for admins on login
        requestPermission();
      }
    } else if (!isAuthenticated && tokenRegistered.current) {
      // Unregister when admin logs out
      unregisterToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]); // Only depend on isAuthenticated, not the callback functions

  return {
    requestPermission,
    checkPermission,
    isReady: firebaseService.isReady(),
    permissionStatus: checkPermission(),
  };
};

export default useNotifications;
