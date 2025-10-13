import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { getSyncStatus, forceSync } from '../utils/storage';

interface SyncStatusProps {
  className?: string;
}

const SyncStatus: React.FC<SyncStatusProps> = ({ className = '' }) => {
  const [syncStatus, setSyncStatus] = useState<{ isOnline: boolean; pendingSync: number }>({
    isOnline: navigator.onLine,
    pendingSync: 0
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    const updateSyncStatus = async () => {
      try {
        const status = await getSyncStatus();
        setSyncStatus(status);
      } catch (error) {
        console.error('Error getting sync status:', error);
      }
    };

    // Update status on mount
    updateSyncStatus();

    // Update status when online/offline status changes
    const handleOnline = () => updateSyncStatus();
    const handleOffline = () => updateSyncStatus();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Update status every 30 seconds
    const interval = setInterval(updateSyncStatus, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const handleForceSync = async () => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    try {
      await forceSync();
      setLastSync(new Date());
      // Update status after sync
      const status = await getSyncStatus();
      setSyncStatus(status);
    } catch (error) {
      console.error('Error during sync:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const getStatusIcon = () => {
    if (!syncStatus.isOnline) {
      return <WifiOff className="w-4 h-4 text-red-500" />;
    }
    
    if (syncStatus.pendingSync > 0) {
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
    
    return <Wifi className="w-4 h-4 text-green-500" />;
  };

  const getStatusText = () => {
    if (!syncStatus.isOnline) {
      return 'Offline';
    }
    
    if (syncStatus.pendingSync > 0) {
      return `${syncStatus.pendingSync} pending`;
    }
    
    return 'Synced';
  };

  const getStatusColor = () => {
    if (!syncStatus.isOnline) {
      return 'text-red-500';
    }
    
    if (syncStatus.pendingSync > 0) {
      return 'text-yellow-500';
    }
    
    return 'text-green-500';
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {getStatusIcon()}
      <span className={`text-sm font-medium ${getStatusColor()}`}>
        {getStatusText()}
      </span>
      
      {syncStatus.isOnline && syncStatus.pendingSync > 0 && (
        <button
          onClick={handleForceSync}
          disabled={isSyncing}
          className="flex items-center space-x-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
        </button>
      )}
      
      {lastSync && (
        <span className="text-xs text-gray-500">
          Last sync: {lastSync.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};

export default SyncStatus;
