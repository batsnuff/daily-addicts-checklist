import React from 'react';
import { motion } from 'framer-motion';
import { Save, CheckCircle, AlertCircle, Loader2, Wifi, WifiOff } from 'lucide-react';

interface SaveStatusBadgeProps {
  status: 'idle' | 'saving' | 'saved' | 'error';
  isOnline: boolean;
  pendingSync: number;
  className?: string;
}

const SaveStatusBadge: React.FC<SaveStatusBadgeProps> = ({ 
  status, 
  isOnline, 
  pendingSync, 
  className = '' 
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'saving':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'saved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Save className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'saving':
        return 'Zapisywanie...';
      case 'saved':
        return 'Zapisano';
      case 'error':
        return 'Błąd';
      default:
        return 'Gotowy';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'saving':
        return 'text-blue-500';
      case 'saved':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  const getBackgroundColor = () => {
    switch (status) {
      case 'saving':
        return 'bg-blue-50 border-blue-200';
      case 'saved':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-medium ${getBackgroundColor()} ${className}`}
    >
      {getStatusIcon()}
      <span className={getStatusColor()}>{getStatusText()}</span>
      
      {/* Online/Offline indicator */}
      <div className="flex items-center space-x-1">
        {isOnline ? (
          <Wifi className="w-3 h-3 text-green-500" />
        ) : (
          <WifiOff className="w-3 h-3 text-red-500" />
        )}
        <span className="text-xs text-gray-500">
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>
      
      {/* Pending sync indicator */}
      {pendingSync > 0 && (
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-yellow-600">
            {pendingSync} oczekujących
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default SaveStatusBadge;
