/**
 * Print Service Client
 * Communicates with local or network print service from browser
 * Supports both desktops (localhost) and tablets (network IP)
 */

export interface PrintServiceStatus {
  connected: boolean;
  version?: string;
  url?: string;
}

export interface PrintSettings {
  restaurantName: string;
  printerInterface: string;
  autoPrint: boolean;
}

const PRINT_SERVICE_URL_KEY = 'printServiceUrl';
const DEFAULT_URL = 'http://localhost:9100';

class PrintServiceClient {
  private serviceUrl: string;
  private checkInterval: NodeJS.Timeout | null = null;
  private connected = false;
  private listeners: Array<(status: boolean) => void> = [];

  constructor() {
    // Load saved URL or use default (localhost for desktops)
    this.serviceUrl = this.getSavedUrl();
    this.startHealthCheck();
  }

  /**
   * Get saved print service URL from localStorage
   */
  private getSavedUrl(): string {
    return localStorage.getItem(PRINT_SERVICE_URL_KEY) || DEFAULT_URL;
  }

  /**
   * Set print service URL
   * @param url - Print service URL (e.g., "http://192.168.1.50:9100" for tablets)
   */
  setServiceUrl(url: string): void {
    this.serviceUrl = url;
    localStorage.setItem(PRINT_SERVICE_URL_KEY, url);
    console.log('📍 Print service URL updated:', url);

    // Reset connection and check new URL
    this.setConnected(false);
    this.isConnected();
  }

  /**
   * Get current service URL
   */
  getServiceUrl(): string {
    return this.serviceUrl;
  }

  /**
   * Check if print service is connected
   */
  async isConnected(): Promise<boolean> {
    try {
      const response = await fetch(`${this.serviceUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(2000), // 2 second timeout
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Print service connected:', data.version);
        this.setConnected(true);
        return true;
      }
    } catch (error) {
      // Service not running - this is normal if not installed
      this.setConnected(false);
    }

    return false;
  }

  /**
   * Print an order
   */
  async print(order: any): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('📄 Sending print request for order:', order.orderNumber);

      const response = await fetch(`${this.serviceUrl}/print`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Order printed successfully');
        return { success: true };
      } else {
        console.error('❌ Print failed:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      console.error('❌ Print service error:', error.message);
      return {
        success: false,
        error: error.message || 'Print service not available',
      };
    }
  }

  /**
   * Get print service settings
   */
  async getSettings(): Promise<PrintSettings | null> {
    try {
      const response = await fetch(`${this.serviceUrl}/settings`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Failed to get print settings:', error);
    }
    return null;
  }

  /**
   * Update print service settings
   */
  async updateSettings(settings: Partial<PrintSettings>): Promise<boolean> {
    try {
      const response = await fetch(`${this.serviceUrl}/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Failed to update print settings:', error);
      return false;
    }
  }

  /**
   * Send test print
   */
  async testPrint(): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await fetch(`${this.serviceUrl}/test-print`, {
        method: 'POST',
      });

      return await response.json();
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Print service not available',
      };
    }
  }

  /**
   * Get download URL for print service installer
   */
  getDownloadUrl(): string {
    // Detect platform
    const platform = window.navigator.platform.toLowerCase();

    if (platform.includes('win')) {
      return '/downloads/print-service-windows.exe';
    } else if (platform.includes('mac')) {
      return '/downloads/print-service-mac.dmg';
    } else {
      return '/downloads/print-service-linux.AppImage';
    }
  }

  /**
   * Subscribe to connection status changes
   */
  onConnectionChange(callback: (connected: boolean) => void): () => void {
    this.listeners.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Start periodic health check
   */
  private startHealthCheck(): void {
    // Check immediately
    this.isConnected();

    // Check every 30 seconds
    this.checkInterval = setInterval(() => {
      this.isConnected();
    }, 30000);
  }

  /**
   * Stop health check
   */
  stopHealthCheck(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Update connection status and notify listeners
   */
  private setConnected(status: boolean): void {
    if (this.connected !== status) {
      this.connected = status;
      this.listeners.forEach((callback) => callback(status));
    }
  }

  /**
   * Get current connection status
   */
  getConnectionStatus(): boolean {
    return this.connected;
  }
}

// Export singleton instance
export const printService = new PrintServiceClient();
