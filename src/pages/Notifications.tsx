import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Check, CheckCheck, Trash2, X } from 'lucide-react';
import Button from '../components/ui/Button';
import notificationStorage, { StoredNotification } from '../services/notificationStorage.service';
import firebaseService from '../services/firebase.service';
import { useAuth } from '../context/AdminAuthContext';
import useNotifications from '../hooks/useNotifications';

const Notifications: React.FC = () => {
  const { admin } = useAuth();
  const { requestPermission, permissionStatus } = useNotifications(!!admin);
  const [notifications, setNotifications] = useState<StoredNotification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Load notifications
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const allNotifications = notificationStorage.getAll();
    setNotifications(allNotifications);
  };

  const handleMarkAsRead = (id: string) => {
    notificationStorage.markAsRead(id);
    loadNotifications();
  };

  const handleMarkAllAsRead = () => {
    notificationStorage.markAllAsRead();
    loadNotifications();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      notificationStorage.delete(id);
      loadNotifications();
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all notifications? This cannot be undone.')) {
      notificationStorage.clearAll();
      loadNotifications();
    }
  };

  const handleEnableNotifications = async () => {
    await requestPermission();
  };

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(n => !n.read);

  const unreadCount = notifications.filter(n => !n.read).length;
  const isNotificationsEnabled = permissionStatus === 'granted';
  const isNotificationsBlocked = permissionStatus === 'denied';

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'new_order':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'order_status':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'table_update':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'system_alert':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
          <p className="text-gray-600">View and manage your notification history</p>
        </div>

        {/* Notification Status Card */}
        <div className={`mb-6 rounded-lg border-2 p-6 ${
          isNotificationsEnabled
            ? 'bg-green-50 border-green-200'
            : isNotificationsBlocked
            ? 'bg-red-50 border-red-200'
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-full ${
                isNotificationsEnabled
                  ? 'bg-green-100'
                  : isNotificationsBlocked
                  ? 'bg-red-100'
                  : 'bg-yellow-100'
              }`}>
                {isNotificationsEnabled ? (
                  <Bell className="h-6 w-6 text-green-600" />
                ) : (
                  <BellOff className="h-6 w-6 text-yellow-600" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {isNotificationsEnabled
                    ? 'Notifications Enabled'
                    : isNotificationsBlocked
                    ? 'Notifications Blocked'
                    : 'Notifications Disabled'}
                </h3>
                <p className="text-sm text-gray-600">
                  {isNotificationsEnabled
                    ? 'You will receive real-time notifications for new orders, status updates, and table changes.'
                    : isNotificationsBlocked
                    ? 'Notifications are blocked in your browser. Please enable them in browser settings to receive real-time updates.'
                    : 'Enable notifications to receive real-time updates for orders and table status.'}
                </p>
              </div>
            </div>
            {!isNotificationsEnabled && !isNotificationsBlocked && (
              <Button
                onClick={handleEnableNotifications}
                className="flex items-center space-x-2"
              >
                <Bell className="h-4 w-4" />
                <span>Enable Notifications</span>
              </Button>
            )}
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-6">
              <div>
                <p className="text-sm text-gray-600">Total Notifications</p>
                <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-indigo-600">{unreadCount}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="flex items-center space-x-1"
                >
                  <CheckCheck className="h-4 w-4" />
                  <span>Mark All Read</span>
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Clear All</span>
                </Button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </h3>
            <p className="text-gray-600">
              {filter === 'unread'
                ? 'All caught up! You have no unread notifications.'
                : 'When you receive notifications, they will appear here.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow-sm border-l-4 p-4 transition-all hover:shadow-md ${
                  !notification.read
                    ? 'border-indigo-500 bg-indigo-50/30'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded border ${getCategoryColor(notification.category)}`}>
                        {notification.category.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                      {!notification.read && (
                        <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-600 text-white rounded-full">
                          NEW
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-semibold text-gray-900 mb-1">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-gray-700">{notification.body}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
