import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Zap, 
  Wifi, 
  WifiOff, 
  Save,
  Settings,
  History,
  BarChart
} from 'lucide-react';

interface SaveStatusDashboardProps {
  isVisible: boolean;
  onClose: () => void;
  onShowHistory: () => void;
  onShowStatistics: () => void;
  onShowSettings: () => void;
}

interface DashboardData {
  totalSaves: number;
  successfulSaves: number;
  failedSaves: number;
  averageSaveTime: number;
  lastSaveTime: Date | null;
  savesToday: number;
  savesThisWeek: number;
  savesThisMonth: number;
  isOnline: boolean;
  pendingSync: number;
  currentStatus: 'idle' | 'saving' | 'saved' | 'error';
}

const SaveStatusDashboard: React.FC<SaveStatusDashboardProps> = ({ 
  isVisible, 
  onClose, 
  onShowHistory, 
  onShowStatistics, 
  onShowSettings 
}) => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalSaves: 0,
    successfulSaves: 0,
    failedSaves: 0,
    averageSaveTime: 0,
    lastSaveTime: null,
    savesToday: 0,
    savesThisWeek: 0,
    savesThisMonth: 0,
    isOnline: navigator.onLine,
    pendingSync: 0,
    currentStatus: 'idle'
  });

  useEffect(() => {
    if (isVisible) {
      calculateDashboardData();
      const interval = setInterval(calculateDashboardData, 5000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const calculateDashboardData = async () => {
    try {
      // Load save history
      const history = localStorage.getItem('saveHistory');
      if (!history) return;

      const saveHistory = JSON.parse(history);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      const totalSaves = saveHistory.length;
      const successfulSaves = saveHistory.filter((item: any) => item.status === 'success').length;
      const failedSaves = saveHistory.filter((item: any) => item.status === 'error').length;
      
      const saveTimes = saveHistory
        .filter((item: any) => item.duration)
        .map((item: any) => item.duration);
      const averageSaveTime = saveTimes.length > 0 
        ? saveTimes.reduce((sum: number, time: number) => sum + time, 0) / saveTimes.length 
        : 0;

      const lastSaveTime = saveHistory.length > 0 
        ? new Date(saveHistory[0].timestamp) 
        : null;

      const savesToday = saveHistory.filter((item: any) => 
        new Date(item.timestamp) >= today
      ).length;

      const savesThisWeek = saveHistory.filter((item: any) => 
        new Date(item.timestamp) >= weekAgo
      ).length;

      const savesThisMonth = saveHistory.filter((item: any) => 
        new Date(item.timestamp) >= monthAgo
      ).length;

      // Get sync status
      const { getSyncStatus } = await import('../utils/storage');
      const syncStatus = await getSyncStatus();

      setDashboardData({
        totalSaves,
        successfulSaves,
        failedSaves,
        averageSaveTime,
        lastSaveTime,
        savesToday,
        savesThisWeek,
        savesThisMonth,
        isOnline: syncStatus.isOnline,
        pendingSync: syncStatus.pendingSync,
        currentStatus: 'idle' // This would be passed from parent component
      });
    } catch (error) {
      console.error('Error calculating dashboard data:', error);
    }
  };

  const formatDuration = (duration: number) => {
    if (duration < 1000) {
      return `${Math.round(duration)}ms`;
    }
    return `${(duration / 1000).toFixed(1)}s`;
  };

  const getSuccessRate = () => {
    if (dashboardData.totalSaves === 0) return 0;
    return Math.round((dashboardData.successfulSaves / dashboardData.totalSaves) * 100);
  };

  const formatLastSaveTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Przed chwilą';
    if (minutes < 60) return `${minutes} min temu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} godz. temu`;
    const days = Math.floor(hours / 24);
    return `${days} dni temu`;
  };

  const getStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'saving':
        return <Zap className="w-4 h-4 animate-pulse text-blue-500" />;
      case 'saved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Save className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
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
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="relative bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-bold text-gray-800">Dashboard zapisów</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Status Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Current Status */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gray-50 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(dashboardData.currentStatus)}
                    <h3 className="font-semibold text-gray-800">Status</h3>
                  </div>
                  <div className={`text-2xl font-bold ${getStatusColor(dashboardData.currentStatus)}`}>
                    {dashboardData.currentStatus === 'saving' ? 'Zapisywanie...' : 
                     dashboardData.currentStatus === 'saved' ? 'Zapisano' :
                     dashboardData.currentStatus === 'error' ? 'Błąd' : 'Gotowy'}
                  </div>
                </motion.div>

                {/* Connection Status */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gray-50 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {dashboardData.isOnline ? (
                      <Wifi className="w-5 h-5 text-green-500" />
                    ) : (
                      <WifiOff className="w-5 h-5 text-red-500" />
                    )}
                    <h3 className="font-semibold text-gray-800">Połączenie</h3>
                  </div>
                  <div className={`text-2xl font-bold ${dashboardData.isOnline ? 'text-green-600' : 'text-red-600'}`}>
                    {dashboardData.isOnline ? 'Online' : 'Offline'}
                  </div>
                </motion.div>

                {/* Pending Sync */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gray-50 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-semibold text-gray-800">Oczekujące</h3>
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">{dashboardData.pendingSync}</div>
                </motion.div>

                {/* Last Save */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gray-50 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Save className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold text-gray-800">Ostatni zapis</h3>
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    {dashboardData.lastSaveTime 
                      ? formatLastSaveTime(dashboardData.lastSaveTime)
                      : 'Brak danych'
                    }
                  </div>
                </motion.div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Total Saves */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-blue-50 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold text-blue-800">Łączne zapisy</h3>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">{dashboardData.totalSaves}</div>
                </motion.div>

                {/* Success Rate */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-green-50 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <h3 className="font-semibold text-green-800">Wskaźnik sukcesu</h3>
                  </div>
                  <div className="text-3xl font-bold text-green-600">{getSuccessRate()}%</div>
                </motion.div>

                {/* Average Save Time */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-purple-50 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-5 h-5 text-purple-500" />
                    <h3 className="font-semibold text-purple-800">Średni czas zapisu</h3>
                  </div>
                  <div className="text-3xl font-bold text-purple-600">
                    {formatDuration(dashboardData.averageSaveTime)}
                  </div>
                </motion.div>
              </div>

              {/* Time-based Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Saves Today */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-yellow-50 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-semibold text-yellow-800">Dzisiaj</h3>
                  </div>
                  <div className="text-3xl font-bold text-yellow-600">{dashboardData.savesToday}</div>
                </motion.div>

                {/* Saves This Week */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="bg-indigo-50 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-indigo-500" />
                    <h3 className="font-semibold text-indigo-800">Ten tydzień</h3>
                  </div>
                  <div className="text-3xl font-bold text-indigo-600">{dashboardData.savesThisWeek}</div>
                </motion.div>

                {/* Saves This Month */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="bg-pink-50 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-pink-500" />
                    <h3 className="font-semibold text-pink-800">Ten miesiąc</h3>
                  </div>
                  <div className="text-3xl font-bold text-pink-600">{dashboardData.savesThisMonth}</div>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="flex flex-wrap justify-center space-x-4"
              >
                <button
                  onClick={onShowHistory}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  <History className="w-4 h-4" />
                  <span>Historia zapisów</span>
                </button>
                <button
                  onClick={onShowStatistics}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  <BarChart className="w-4 h-4" />
                  <span>Szczegółowe statystyki</span>
                </button>
                <button
                  onClick={onShowSettings}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Ustawienia</span>
                </button>
              </motion.div>
            </div>

            {/* Footer */}
            <div className="flex justify-end p-6 border-t">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Zamknij
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SaveStatusDashboard;
