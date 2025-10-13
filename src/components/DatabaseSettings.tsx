import React, { useState, useEffect } from 'react';
import { Database, Cloud, HardDrive, Settings, RefreshCw, Trash2, Download } from 'lucide-react';
import { getSyncStatus, forceSync, getAllDailyData, exportWeeklyData } from '../utils/storage';

const DatabaseSettings: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<{ isOnline: boolean; pendingSync: number }>({
    isOnline: navigator.onLine,
    pendingSync: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [dataStats, setDataStats] = useState({
    totalDays: 0,
    totalPoints: 0,
    lastActivity: null as Date | null
  });

  useEffect(() => {
    const updateStatus = async () => {
      try {
        const status = await getSyncStatus();
        setSyncStatus(status);
        
        // Get data statistics
        const allData = await getAllDailyData();
        const totalPoints = allData.reduce((sum, day) => sum + day.batsnackPoints, 0);
        const lastActivity = allData.length > 0 
          ? new Date(Math.max(...allData.map(d => new Date(d.date).getTime())))
          : null;
        
        setDataStats({
          totalDays: allData.length,
          totalPoints,
          lastActivity
        });
      } catch (error) {
        console.error('Error updating status:', error);
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handleForceSync = async () => {
    setIsLoading(true);
    try {
      await forceSync();
      const status = await getSyncStatus();
      setSyncStatus(status);
    } catch (error) {
      console.error('Error during sync:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const currentWeek = new Date();
      currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay());
      const weekStart = currentWeek.toISOString().split('T')[0];
      
      const exportData = await exportWeeklyData(weekStart);
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `daily-addicts-export-${weekStart}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handleClearLocalData = () => {
    if (window.confirm('Are you sure you want to clear all local data? This action cannot be undone.')) {
      // Clear IndexedDB
      const deleteReq = indexedDB.deleteDatabase('DailyAddictsDB');
      deleteReq.onsuccess = () => {
        window.location.reload();
      };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Database className="w-5 h-5 text-blue-500" />
        <h2 className="text-xl font-semibold">Database Settings</h2>
      </div>

      {/* Sync Status */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium flex items-center space-x-2">
            <Cloud className="w-4 h-4" />
            <span>Synchronization Status</span>
          </h3>
          <button
            onClick={handleForceSync}
            disabled={isLoading || !syncStatus.isOnline}
            className="flex items-center space-x-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Syncing...' : 'Force Sync'}</span>
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Status:</span>
            <span className={`ml-2 font-medium ${
              syncStatus.isOnline ? 'text-green-600' : 'text-red-600'
            }`}>
              {syncStatus.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Pending Sync:</span>
            <span className="ml-2 font-medium">
              {syncStatus.pendingSync} items
            </span>
          </div>
        </div>
      </div>

      {/* Data Statistics */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-medium flex items-center space-x-2 mb-4">
          <HardDrive className="w-4 h-4" />
          <span>Data Statistics</span>
        </h3>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total Days:</span>
            <span className="ml-2 font-medium">{dataStats.totalDays}</span>
          </div>
          <div>
            <span className="text-gray-600">Total Points:</span>
            <span className="ml-2 font-medium">{dataStats.totalPoints}</span>
          </div>
          <div className="col-span-2">
            <span className="text-gray-600">Last Activity:</span>
            <span className="ml-2 font-medium">
              {dataStats.lastActivity 
                ? dataStats.lastActivity.toLocaleDateString()
                : 'No data'
              }
            </span>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-medium flex items-center space-x-2 mb-4">
          <Settings className="w-4 h-4" />
          <span>Data Management</span>
        </h3>
        
        <div className="space-y-3">
          <button
            onClick={handleExportData}
            className="flex items-center space-x-2 w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
          
          <button
            onClick={handleClearLocalData}
            className="flex items-center space-x-2 w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Local Data</span>
          </button>
        </div>
      </div>

      {/* Information */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="text-lg font-medium text-blue-800 mb-2">How it works</h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p>• <strong>Offline First:</strong> All data is stored locally using IndexedDB for fast access</p>
          <p>• <strong>Auto Sync:</strong> Changes are automatically synchronized when online</p>
          <p>• <strong>Multi-Device:</strong> Data syncs across all your devices when connected</p>
          <p>• <strong>Conflict Resolution:</strong> Latest changes take precedence in case of conflicts</p>
        </div>
      </div>
    </div>
  );
};

export default DatabaseSettings;
