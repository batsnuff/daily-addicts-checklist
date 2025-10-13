import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, RefreshCw, Save, Clock, Wifi, WifiOff } from 'lucide-react';

interface SaveErrorHandlerProps {
  isVisible: boolean;
  error: string;
  onRetry: () => void;
  onExit: () => void;
  onDismiss: () => void;
  isOnline: boolean;
  lastAttempt?: Date;
}

const SaveErrorHandler: React.FC<SaveErrorHandlerProps> = ({
  isVisible,
  error,
  onRetry,
  onExit,
  onDismiss,
  isOnline,
  lastAttempt
}) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  const getErrorIcon = () => {
    if (!isOnline) return <WifiOff className="w-6 h-6 text-red-500" />;
    if (error.includes('timeout')) return <Clock className="w-6 h-6 text-orange-500" />;
    return <AlertTriangle className="w-6 h-6 text-red-500" />;
  };

  const getErrorTitle = () => {
    if (!isOnline) return 'Brak połączenia internetowego';
    if (error.includes('timeout')) return 'Przekroczono limit czasu';
    return 'Błąd zapisu danych';
  };

  const getErrorDescription = () => {
    if (!isOnline) return 'Sprawdź połączenie internetowe i spróbuj ponownie.';
    if (error.includes('timeout')) return 'Operacja trwała zbyt długo. Spróbuj ponownie.';
    return 'Wystąpił nieoczekiwany błąd podczas zapisywania danych.';
  };

  const getRetryButtonText = () => {
    if (!isOnline) return 'Sprawdź połączenie i spróbuj ponownie';
    return 'Spróbuj ponownie';
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
        >
          {/* Header */}
          <div className="bg-red-50 border-b border-red-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getErrorIcon()}
                <div>
                  <h3 className="text-lg font-semibold text-red-800">
                    {getErrorTitle()}
                  </h3>
                  <p className="text-sm text-red-600">
                    {getErrorDescription()}
                  </p>
                </div>
              </div>
              <button
                onClick={onDismiss}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Error Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Szczegóły błędu:</span>
              </div>
              <p className="text-sm text-gray-600 break-words">{error}</p>
            </div>

            {/* Connection Status */}
            <div className="flex items-center space-x-2 mb-4">
              {isOnline ? (
                <>
                  <Wifi className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">Połączenie internetowe aktywne</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600">Brak połączenia internetowego</span>
                </>
              )}
            </div>

            {/* Last Attempt */}
            {lastAttempt && (
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Ostatnia próba: {lastAttempt.toLocaleString('pl-PL')}
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col space-y-3">
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isRetrying ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                <span>{isRetrying ? 'Ponawianie...' : getRetryButtonText()}</span>
              </button>

              <button
                onClick={onExit}
                className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Wyjdź bez zapisywania</span>
              </button>

              <button
                onClick={onDismiss}
                className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Zamknij i spróbuj później</span>
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                <strong>Wskazówka:</strong> Jeśli problem się powtarza, sprawdź połączenie internetowe 
                lub spróbuj ponownie za kilka minut. Twoje dane są bezpiecznie przechowywane lokalnie.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SaveErrorHandler;
