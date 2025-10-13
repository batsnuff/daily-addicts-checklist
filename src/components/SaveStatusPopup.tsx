import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2, Save, Wifi, WifiOff } from 'lucide-react';
import { getSyncStatus } from '../utils/storage';

interface SaveStatusPopupProps {
  isVisible: boolean;
  status: 'idle' | 'saving' | 'success' | 'error';
  message?: string;
  onClose: () => void;
}

const SaveStatusPopup: React.FC<SaveStatusPopupProps> = ({
  isVisible,
  status,
  message,
  onClose
}) => {
  const [syncStatus, setSyncStatus] = useState<{ isOnline: boolean; pendingSync: number }>({
    isOnline: navigator.onLine,
    pendingSync: 0
  });

  useEffect(() => {
    const updateSyncStatus = async () => {
      try {
        const status = await getSyncStatus();
        setSyncStatus(status);
      } catch (error) {
        console.error('Error getting sync status:', error);
      }
    };

    if (isVisible) {
      updateSyncStatus();
    }
  }, [isVisible]);

  const getStatusIcon = () => {
    switch (status) {
      case 'saving':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Save className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'saving':
        return 'Zapisywanie...';
      case 'success':
        return 'Zapisano pomyślnie!';
      case 'error':
        return 'Błąd zapisywania';
      default:
        return 'Gotowy do zapisania';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'saving':
        return 'text-blue-500';
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getBackgroundColor = () => {
    switch (status) {
      case 'saving':
        return 'bg-blue-50 border-blue-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  // Auto-close after success
  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status, onClose]);

  return (
    <AnimatePresence>
      {isVisible && status !== 'saving' && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          
          {/* Popup Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 ${getBackgroundColor()}`}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Status Icon and Text */}
            <div className="text-center mb-4">
              <div className="flex justify-center mb-3">
                {getStatusIcon()}
              </div>
              <h3 className={`text-lg font-semibold ${getStatusColor()}`}>
                {getStatusText()}
              </h3>
              {message && (
                <p className="text-sm text-gray-600 mt-2">
                  {message}
                </p>
              )}
            </div>

            {/* Sync Status */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  {syncStatus.isOnline ? (
                    <Wifi className="w-4 h-4 text-green-500" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-500" />
                  )}
                  <span className={syncStatus.isOnline ? 'text-green-600' : 'text-red-600'}>
                    {syncStatus.isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
                <div className="text-gray-600">
                  {syncStatus.pendingSync > 0 && (
                    <span className="text-yellow-600">
                      {syncStatus.pendingSync} oczekujących
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Info */}
            {status === 'success' && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  {syncStatus.isOnline 
                    ? 'Dane zostały zsynchronizowane z chmurą' 
                    : 'Dane zapisane lokalnie, synchronizacja po połączeniu'
                  }
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="mt-4 text-center">
                <p className="text-sm text-red-600">
                  Sprawdź połączenie internetowe i spróbuj ponownie
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex justify-center space-x-3">
              {status === 'error' && (
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Spróbuj ponownie
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                {status === 'success' ? 'Zamknij' : 'Anuluj'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SaveStatusPopup;
