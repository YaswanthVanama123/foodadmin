import { useState, useEffect } from 'react';
import { Download, Printer, CheckCircle, AlertCircle, X, Settings, Wifi } from 'lucide-react';
import { printService } from '../services/printService';
import PrintServiceSettingsModal from './PrintServiceSettingsModal';

const PrintServiceBanner = () => {
  const [connected, setConnected] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [serviceUrl, setServiceUrl] = useState('');

  useEffect(() => {
    // Check connection status
    checkConnection();
    setServiceUrl(printService.getServiceUrl());

    // Subscribe to connection changes
    const unsubscribe = printService.onConnectionChange((status) => {
      setConnected(status);
      setChecking(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const checkConnection = async () => {
    setChecking(true);
    const status = await printService.isConnected();
    setConnected(status);
    setServiceUrl(printService.getServiceUrl());
    setChecking(false);
  };

  const handleDownload = () => {
    const downloadUrl = printService.getDownloadUrl();

    // Try to download, but show helpful message if file doesn't exist
    fetch(downloadUrl, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          window.open(downloadUrl, '_blank');
        } else {
          // Installer not available yet - show instructions
          alert(
            '📦 Installer files are being prepared!\n\n' +
            'For now, you can run Print Service manually:\n\n' +
            '1. Open terminal/command prompt\n' +
            '2. cd packages/print-service\n' +
            '3. npm install\n' +
            '4. npm start\n\n' +
            'Print Service will run on http://localhost:9100\n' +
            'Then refresh this page - it should detect automatically!'
          );
        }
      })
      .catch(() => {
        // Network error or file doesn't exist
        alert(
          '📦 Installer not available yet!\n\n' +
          'Run Print Service manually:\n' +
          'cd packages/print-service\n' +
          'npm install && npm start'
        );
      });
  };

  const handleDismiss = () => {
    setDismissed(true);
    // Save dismissed state to localStorage
    localStorage.setItem('printServiceBannerDismissed', 'true');
  };

  // Show connection status if connected
  if (connected) {
    const isLocalhost = serviceUrl.includes('localhost');

    return (
      <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-green-900">
                  Print Service Connected
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Wifi className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-700">
                    {isLocalhost ? 'Local (Same Computer)' : 'Network'}: {serviceUrl}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center space-x-2 px-3 py-1.5 bg-white hover:bg-gray-50 text-green-700 text-sm font-medium rounded-lg border border-green-300 transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        <PrintServiceSettingsModal
          isOpen={showSettings}
          onClose={() => {
            setShowSettings(false);
            checkConnection(); // Recheck after settings change
          }}
        />
      </div>
    );
  }

  // Don't show if dismissed or checking
  if (dismissed || checking) {
    return null;
  }

  // Check if previously dismissed
  if (localStorage.getItem('printServiceBannerDismissed') === 'true') {
    return null;
  }

  return (
    <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg shadow-sm">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex-shrink-0 mt-1">
              <Printer className="h-6 w-6 text-blue-600" />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-900 mb-1">
                Enable Automatic Order Printing
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                Install the Print Service to automatically print orders to your thermal/receipt
                printer. Works with desktops, laptops, and tablets!
              </p>

              <div className="flex items-center space-x-3 flex-wrap gap-2">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Installer
                </button>

                <button
                  onClick={() => setShowSettings(true)}
                  className="inline-flex items-center px-4 py-2 bg-white hover:bg-gray-50 text-blue-600 font-medium rounded-lg border border-blue-300 transition-colors"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </button>

                <button
                  onClick={checkConnection}
                  className="inline-flex items-center px-4 py-2 bg-white hover:bg-gray-50 text-blue-600 font-medium rounded-lg border border-blue-300 transition-colors"
                >
                  {checking ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      Checking...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      I've Set It Up
                    </>
                  )}
                </button>
              </div>

              <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
                <p className="text-xs font-semibold text-blue-900 mb-2">
                  📱 Using a Tablet (iPad/Android)?
                </p>
                <ul className="text-xs text-blue-700 space-y-1 ml-4 list-disc">
                  <li>Install Print Service on a separate computer/device</li>
                  <li>Click "Configure" above to enter the network IP address</li>
                  <li>Both devices must be on the same WiFi network</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="flex-shrink-0 ml-4 p-1 hover:bg-blue-100 rounded transition-colors"
            title="Dismiss"
          >
            <X className="h-5 w-5 text-blue-600" />
          </button>
        </div>
      </div>

      <PrintServiceSettingsModal
        isOpen={showSettings}
        onClose={() => {
          setShowSettings(false);
          checkConnection(); // Recheck after settings change
        }}
      />
    </div>
  );
};

export default PrintServiceBanner;
