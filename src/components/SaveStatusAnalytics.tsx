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
  BarChart,
  RefreshCw,
  Activity,
  Target,
  Award,
  Calendar
} from 'lucide-react';

interface SaveStatusAnalyticsProps {
  isVisible: boolean;
  onClose: () => void;
  onShowHistory: () => void;
  onShowStatistics: () => void;
  onShowSettings: () => void;
  onShowDashboard: () => void;
  onShowOverview: () => void;
  onShowMonitor: () => void;
}

interface AnalyticsData {
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
  recentActivity: Array<{
    id: string;
    timestamp: Date;
    status: 'success' | 'error';
    message: string;
    duration?: number;
  }>;
  performanceMetrics: {
    bestSaveTime: number;
    worstSaveTime: number;
    averageSuccessRate: number;
    streakDays: number;
    totalDataSaved: number;
  };
}

const SaveStatusAnalytics: React.FC<SaveStatusAnalyticsProps> = ({ 
  isVisible, 
  onClose, 
  onShowHistory, 
  onShowStatistics, 
  onShowSettings,
  onShowDashboard,
  onShowOverview,
  onShowMonitor 
}) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
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
    currentStatus: 'idle',
    recentActivity: [],
    performanceMetrics: {
      bestSaveTime: 0,
      worstSaveTime: 0,
      averageSuccessRate: 0,
      streakDays: 0,
      totalDataSaved: 0
    }
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (isVisible) {
      calculateAnalyticsData();
      const interval = setInterval(calculateAnalyticsData, 10000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const calculateAnalyticsData = async () => {
    try {
      setIsRefreshing(true);
      
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

      // Get recent activity (last 10 items)
      const recentActivity = saveHistory
        .slice(0, 10)
        .map((item: any) => ({
          id: item.id,
          timestamp: new Date(item.timestamp),
          status: item.status,
          message: item.message,
          duration: item.duration
        }));

      // Calculate performance metrics
      const bestSaveTime = saveTimes.length > 0 ? Math.min(...saveTimes) : 0;
      const worstSaveTime = saveTimes.length > 0 ? Math.max(...saveTimes) : 0;
      const averageSuccessRate = totalSaves > 0 ? (successfulSaves / totalSaves) * 100 : 0;
      
      // Calculate streak days (consecutive days with saves)
      let streakDays = 0;
      const uniqueDays = Array.from(new Set(saveHistory.map((item: any) => 
        new Date(item.timestamp).toDateString()
      ))).sort().reverse() as string[];
      
      for (let i = 0; i < uniqueDays.length; i++) {
        const currentDay = new Date(uniqueDays[i]);
        const previousDay = new Date(currentDay.getTime() - 24 * 60 * 60 * 1000);
        const previousDayString = previousDay.toDateString();
        
        if (i === 0 || uniqueDays[i - 1] === previousDayString) {
          streakDays++;
        } else {
          break;
        }
      }

      // Estimate total data saved (rough calculation)
      const totalDataSaved = totalSaves * 1024; // Assume 1KB per save

      // Get sync status
      const { getSyncStatus } = await import('../utils/storage');
      const syncStatus = await getSyncStatus();

      setAnalyticsData({
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
        currentStatus: 'idle', // This would be passed from parent component
        recentActivity,
        performanceMetrics: {
          bestSaveTime,
          worstSaveTime,
          averageSuccessRate,
          streakDays,
          totalDataSaved
        }
      });
    } catch (error) {
      console.error('Error calculating analytics data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatDuration = (duration: number) => {
    if (duration < 1000) {
      return `${Math.round(duration)}ms`;
    }
    return `${(duration / 1000).toFixed(1)}s`;
  };

  const formatDataSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  // const getSuccessRate = () => {
  //   if (analyticsData.totalSaves === 0) return 0;
  //   return Math.round((analyticsData.successfulSaves / analyticsData.totalSaves) * 100);
  // };

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

  const getActivityIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
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
            className="relative bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-bold text-gray-800">Analityka zapisów</h2>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={calculateAnalyticsData}
                  disabled={isRefreshing}
                  className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>Odśwież</span>
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
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
                    {getStatusIcon(analyticsData.currentStatus)}
                    <h3 className="font-semibold text-gray-800">Status</h3>
                  </div>
                  <div className={`text-2xl font-bold ${getStatusColor(analyticsData.currentStatus)}`}>
                    {analyticsData.currentStatus === 'saving' ? 'Zapisywanie...' : 
                     analyticsData.currentStatus === 'saved' ? 'Zapisano' :
                     analyticsData.currentStatus === 'error' ? 'Błąd' : 'Gotowy'}
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
                    {analyticsData.isOnline ? (
                      <Wifi className="w-5 h-5 text-green-500" />
                    ) : (
                      <WifiOff className="w-5 h-5 text-red-500" />
                    )}
                    <h3 className="font-semibold text-gray-800">Połączenie</h3>
                  </div>
                  <div className={`text-2xl font-bold ${analyticsData.isOnline ? 'text-green-600' : 'text-red-600'}`}>
                    {analyticsData.isOnline ? 'Online' : 'Offline'}
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
                  <div className="text-2xl font-bold text-yellow-600">{analyticsData.pendingSync}</div>
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
                    {analyticsData.lastSaveTime 
                      ? formatLastSaveTime(analyticsData.lastSaveTime)
                      : 'Brak danych'
                    }
                  </div>
                </motion.div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Best Save Time */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-green-50 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-5 h-5 text-green-500" />
                    <h3 className="font-semibold text-green-800">Najlepszy czas</h3>
                  </div>
                  <div className="text-3xl font-bold text-green-600">
                    {formatDuration(analyticsData.performanceMetrics.bestSaveTime)}
                  </div>
                </motion.div>

                {/* Worst Save Time */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-red-50 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <h3 className="font-semibold text-red-800">Najgorszy czas</h3>
                  </div>
                  <div className="text-3xl font-bold text-red-600">
                    {formatDuration(analyticsData.performanceMetrics.worstSaveTime)}
                  </div>
                </motion.div>

                {/* Average Success Rate */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-blue-50 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold text-blue-800">Średni wskaźnik sukcesu</h3>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">
                    {Math.round(analyticsData.performanceMetrics.averageSuccessRate)}%
                  </div>
                </motion.div>

                {/* Streak Days */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-purple-50 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    <h3 className="font-semibold text-purple-800">Seria dni</h3>
                  </div>
                  <div className="text-3xl font-bold text-purple-600">
                    {analyticsData.performanceMetrics.streakDays}
                  </div>
                </motion.div>

                {/* Total Data Saved */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="bg-yellow-50 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Save className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-semibold text-yellow-800">Łączne dane</h3>
                  </div>
                  <div className="text-3xl font-bold text-yellow-600">
                    {formatDataSize(analyticsData.performanceMetrics.totalDataSaved)}
                  </div>
                </motion.div>

                {/* Average Save Time */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="bg-indigo-50 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-5 h-5 text-indigo-500" />
                    <h3 className="font-semibold text-indigo-800">Średni czas zapisu</h3>
                  </div>
                  <div className="text-3xl font-bold text-indigo-600">
                    {formatDuration(analyticsData.averageSaveTime)}
                  </div>
                </motion.div>
              </div>

              {/* Time-based Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Saves Today */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="bg-yellow-50 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-semibold text-yellow-800">Dzisiaj</h3>
                  </div>
                  <div className="text-3xl font-bold text-yellow-600">{analyticsData.savesToday}</div>
                </motion.div>

                {/* Saves This Week */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="bg-indigo-50 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-indigo-500" />
                    <h3 className="font-semibold text-indigo-800">Ten tydzień</h3>
                  </div>
                  <div className="text-3xl font-bold text-indigo-600">{analyticsData.savesThisWeek}</div>
                </motion.div>

                {/* Saves This Month */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 }}
                  className="bg-pink-50 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-pink-500" />
                    <h3 className="font-semibold text-pink-800">Ten miesiąc</h3>
                  </div>
                  <div className="text-3xl font-bold text-pink-600">{analyticsData.savesThisMonth}</div>
                </motion.div>
              </div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="bg-gray-50 rounded-lg p-4 mb-8"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Ostatnia aktywność</span>
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {analyticsData.recentActivity.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Brak aktywności</p>
                  ) : (
                    analyticsData.recentActivity.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.5 + index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border"
                      >
                        <div className="flex items-center space-x-3">
                          {getActivityIcon(activity.status)}
                          <div>
                            <p className="text-sm font-medium text-gray-800">{activity.message}</p>
                            <p className="text-xs text-gray-500">
                              {formatLastSaveTime(activity.timestamp)}
                            </p>
                          </div>
                        </div>
                        {activity.duration && (
                          <div className="text-xs text-gray-400">
                            {formatDuration(activity.duration)}
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 }}
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
                <button
                  onClick={onShowDashboard}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={onShowOverview}
                  className="flex items-center space-x-2 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Przegląd</span>
                </button>
                <button
                  onClick={onShowMonitor}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  <Activity className="w-4 h-4" />
                  <span>Monitor</span>
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

export default SaveStatusAnalytics;
