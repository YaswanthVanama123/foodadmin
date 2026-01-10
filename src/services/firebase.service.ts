import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// VAPID key for web push
const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

class FirebaseService {
  private messaging: Messaging | null = null;
  private initialized: boolean = false;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize Firebase app and messaging
   */
  private initialize(): void {
    const isEnabled = import.meta.env.VITE_FIREBASE_ENABLED === 'true';

    console.log('\n🔥 Firebase Cloud Messaging Initialization (Admin App)...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (!isEnabled) {
      console.log('⚠️  Firebase is DISABLED via VITE_FIREBASE_ENABLED env variable');
      console.log('   Set VITE_FIREBASE_ENABLED=true in .env to enable push notifications');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      return;
    }

    try {
      // Check if all required config values are present
      const hasApiKey = firebaseConfig.apiKey && firebaseConfig.apiKey !== 'AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
      const hasProjectId = firebaseConfig.projectId && firebaseConfig.projectId !== 'your-project-id';
      const hasVapidKey = vapidKey && vapidKey !== 'BXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

      console.log('📋 Configuration Check:');
      console.log(`   API Key: ${hasApiKey ? '✓' : '✗'} ${hasApiKey ? firebaseConfig.apiKey.substring(0, 20) + '...' : 'Missing'}`);
      console.log(`   Project ID: ${hasProjectId ? '✓' : '✗'} ${firebaseConfig.projectId}`);
      console.log(`   Auth Domain: ${firebaseConfig.authDomain ? '✓' : '✗'} ${firebaseConfig.authDomain}`);
      console.log(`   Messaging Sender ID: ${firebaseConfig.messagingSenderId ? '✓' : '✗'} ${firebaseConfig.messagingSenderId}`);
      console.log(`   App ID: ${firebaseConfig.appId ? '✓' : '✗'} ${firebaseConfig.appId}`);
      console.log(`   VAPID Key: ${hasVapidKey ? '✓' : '✗'} ${hasVapidKey ? vapidKey.substring(0, 20) + '...' : 'Missing'}`);

      if (!hasApiKey || !hasProjectId || !hasVapidKey) {
        console.log('\n❌ Firebase configuration incomplete!');
        console.log('   Missing required fields. Please update .env with valid Firebase credentials.');
        console.log('   Required: VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_VAPID_KEY');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        return;
      }

      // Initialize Firebase App
      console.log('\n🔄 Initializing Firebase App...');
      const app = initializeApp(firebaseConfig);

      // Initialize Firebase Messaging
      this.messaging = getMessaging(app);
      this.initialized = true;

      console.log('✅ Firebase initialized successfully!');
      console.log('📱 Push notifications are ENABLED for Admin App');
      console.log('   - Request permission to receive notifications');
      console.log('   - Silent notifications: Background data updates');
      console.log('   - Active notifications: Visible alerts');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    } catch (error: any) {
      console.log('\n❌ Failed to initialize Firebase');
      console.log(`   Error: ${error.message}`);

      if (error.message.includes('API key')) {
        console.log('\n💡 API Key Issue:');
        console.log('   - Verify VITE_FIREBASE_API_KEY is correct');
        console.log('   - Get from Firebase Console > Project Settings > General');
      }

      if (error.message.includes('project')) {
        console.log('\n💡 Project ID Issue:');
        console.log('   - Verify VITE_FIREBASE_PROJECT_ID matches your Firebase project');
      }

      console.log('\n⚠️  Push notifications will NOT work until this is resolved.');
      console.log('   Check your .env file and restart the dev server.');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    }
  }

  /**
   * Check if Firebase is initialized and ready
   */
  public isReady(): boolean {
    return this.initialized && this.messaging !== null;
  }

  /**
   * Request notification permission from the user
   * Returns: 'granted', 'denied', or 'default'
   */
  public async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);
      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }

  /**
   * Get the current notification permission status
   */
  public getPermissionStatus(): NotificationPermission {
    if (!('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission;
  }

  /**
   * Get FCM registration token
   * This token is used to send push notifications to this device
   */
  public async getToken(): Promise<string | null> {
    if (!this.isReady() || !this.messaging) {
      console.warn('Firebase messaging not initialized');
      return null;
    }

    try {
      // Check if permission is granted
      const permission = await this.requestPermission();

      if (permission !== 'granted') {
        console.log('Notification permission not granted');
        return null;
      }

      // Register service worker first
      await this.registerServiceWorker();

      // Get FCM token
      const token = await getToken(this.messaging, {
        vapidKey,
      });

      if (token) {
        console.log('✅ FCM token obtained:', token.substring(0, 20) + '...');
        return token;
      } else {
        console.log('No registration token available.');
        return null;
      }
    } catch (error: any) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  /**
   * Register service worker for background notifications
   */
  private async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service workers are not supported');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js',
        { scope: '/' }
      );

      console.log('✅ Service worker registered:', registration.scope);
      return registration;
    } catch (error) {
      console.error('Service worker registration failed:', error);
      return null;
    }
  }

  /**
   * Listen for foreground messages (when app is open and visible)
   *
   * @param callback - Function to call when a message is received
   */
  public onForegroundMessage(
    callback: (payload: { type: string; data: Record<string, string> }) => void
  ): void {
    if (!this.isReady() || !this.messaging) {
      console.warn('Firebase messaging not initialized');
      return;
    }

    console.log('👂 [Firebase Service] Registering onMessage listener...');

    onMessage(this.messaging, (payload) => {
      console.log('🔔🔔🔔 ===== FOREGROUND MESSAGE RECEIVED (ADMIN) ===== 🔔🔔🔔');
      console.log('📦 Full payload:', JSON.stringify(payload, null, 2));
      console.log('📝 Notification field:', payload.notification);
      console.log('📝 Data field:', payload.data);
      console.log('📝 FCM Message ID:', payload.fcmMessageId);
      console.log('📝 From:', payload.from);

      const messageType = payload.data?.type || 'unknown';
      const messageData = payload.data || {};

      console.log('🔍 Parsed type:', messageType);
      console.log('🔍 Parsed data:', messageData);

      // Call the callback with parsed data
      callback({
        type: messageType,
        data: messageData as Record<string, string>,
      });

      console.log('✅ Callback executed');
    });

    console.log('✅ [Firebase Service] onMessage listener registered successfully');
  }

  /**
   * Delete FCM token (on logout)
   */
  public async deleteToken(): Promise<boolean> {
    if (!this.isReady() || !this.messaging) {
      return false;
    }

    try {
      // Import deleteToken function
      const { deleteToken } = await import('firebase/messaging');
      await deleteToken(this.messaging);
      console.log('✅ FCM token deleted');
      return true;
    } catch (error) {
      console.error('Error deleting FCM token:', error);
      return false;
    }
  }
}

// Export singleton instance
export default new FirebaseService();
