import { useState, useEffect } from 'react';
import { Settings, Wifi, Check, X, Loader2, Monitor, Tablet } from 'lucide-react';
import { printService } from '../services/printService';
import toast from 'react-hot-toast';

interface PrintServiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrintServiceSettingsModal = ({ isOpen, onClose }: PrintServiceSettingsModalProps) => {
  const [serviceUrl, setServiceUrl] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    if (isOpen) {
      setServiceUrl(printService.getServiceUrl());
      setTestResult(null);
    }
  }, [isOpen]);

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      // Temporarily set URL to test it
      const originalUrl = printService.getServiceUrl();
      printService.setServiceUrl(serviceUrl);

      const connected = await printService.isConnected();

      if (connected) {
        setTestResult('success');
        toast.success('Connection successful!');
      } else {
        setTestResult('error');
        printService.setServiceUrl(originalUrl); // Revert on failure
        toast.error('Could not connect to print service');
      }
    } catch (error) {
      setTestResult('error');
      toast.error('Connection failed');
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    printService.setServiceUrl(serviceUrl);
    toast.success('Print service URL saved!');
    onClose();
  };

  const usePreset = (url: string) => {
    setServiceUrl(url);
    setTestResult(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Print Service Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Device Type Presets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Your Setup:
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Desktop/Laptop Option */}
              <button
                onClick={() => usePreset('http://localhost:9100')}
                className={`p-4 border-2 rounded-lg text-left transition-all hover:border-blue-400 ${
                  serviceUrl === 'http://localhost:9100'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Monitor className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Desktop/Laptop</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Print service on same computer
                    </p>
                    <code className="text-xs text-blue-600 mt-2 block">
                      localhost:9100
                    </code>
                  </div>
                </div>
              </button>

              {/* Tablet Option */}
              <button
                onClick={() => setServiceUrl('http://192.168.1.')}
                className={`p-4 border-2 rounded-lg text-left transition-all hover:border-green-400 ${
                  serviceUrl !== 'http://localhost:9100' && serviceUrl !== ''
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Tablet className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Tablet/iPad</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Print service on separate device
                    </p>
                    <code className="text-xs text-green-600 mt-2 block">
                      Network IP:9100
                    </code>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Print Service URL:
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={serviceUrl}
                onChange={(e) => {
                  setServiceUrl(e.target.value);
                  setTestResult(null);
                }}
                placeholder="http://192.168.1.100:9100"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleTest}
                disabled={testing || !serviceUrl}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {testing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <Wifi className="h-4 w-4" />
                    <span>Test</span>
                  </>
                )}
              </button>
            </div>

            {/* Test Result */}
            {testResult === 'success' && (
              <div className="mt-2 flex items-center space-x-2 text-green-600 text-sm">
                <Check className="h-4 w-4" />
                <span>Connection successful!</span>
              </div>
            )}
            {testResult === 'error' && (
              <div className="mt-2 flex items-center space-x-2 text-red-600 text-sm">
                <X className="h-4 w-4" />
                <span>Connection failed. Check the URL and try again.</span>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">How to find the IP address:</h4>
            <div className="space-y-2 text-sm text-blue-800">
              <p><strong>1. On the Print Service computer:</strong></p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Right-click the Print Service tray icon</li>
                <li>Look for "Network: http://192.168.x.x:9100"</li>
                <li>Copy that IP address</li>
              </ul>
              <p className="mt-3"><strong>2. On this tablet:</strong></p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Enter the IP address above (e.g., http://192.168.1.50:9100)</li>
                <li>Click "Test" to verify connection</li>
                <li>Click "Save" when successful</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!serviceUrl || testResult !== 'success'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintServiceSettingsModal;
