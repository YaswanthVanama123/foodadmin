/**
 * Notification Storage Service
 * Stores received notifications in localStorage for history display
 */

export interface StoredNotification {
  id: string;
  type: 'silent' | 'active';
  category: string;
  title: string;
  body: string;
  data: Record<string, string>;
  timestamp: number;
  read: boolean;
}

const STORAGE_KEY = 'admin_notifications_history';
const MAX_NOTIFICATIONS = 100; // Keep last 100 notifications

class NotificationStorageService {
  /**
   * Get all stored notifications
   */
  getAll(): StoredNotification[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      const notifications = JSON.parse(stored) as StoredNotification[];
      // Sort by timestamp descending (newest first)
      return notifications.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Error reading notifications from storage:', error);
      return [];
    }
  }

  /**
   * Save a new notification
   */
  save(notification: Omit<StoredNotification, 'id' | 'timestamp' | 'read'>): void {
    try {
      const notifications = this.getAll();

      const newNotification: StoredNotification = {
        ...notification,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        read: false,
      };

      // Add to beginning and limit to MAX_NOTIFICATIONS
      notifications.unshift(newNotification);
      const trimmed = notifications.slice(0, MAX_NOTIFICATIONS);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));

      console.log('📝 Notification saved to storage:', newNotification.id);
    } catch (error) {
      console.error('Error saving notification to storage:', error);
    }
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string): void {
    try {
      const notifications = this.getAll();
      const notification = notifications.find(n => n.id === notificationId);

      if (notification) {
        notification.read = true;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): void {
    try {
      const notifications = this.getAll();
      notifications.forEach(n => n.read = true);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }

  /**
   * Get unread count
   */
  getUnreadCount(): number {
    const notifications = this.getAll();
    return notifications.filter(n => !n.read).length;
  }

  /**
   * Clear all notifications
   */
  clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log('🗑️ All notifications cleared from storage');
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  }

  /**
   * Delete specific notification
   */
  delete(notificationId: string): void {
    try {
      const notifications = this.getAll();
      const filtered = notifications.filter(n => n.id !== notificationId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }
}

export const notificationStorage = new NotificationStorageService();
export default notificationStorage;
