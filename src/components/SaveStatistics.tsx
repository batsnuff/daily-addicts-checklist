import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, TrendingUp, Clock, CheckCircle, AlertCircle, Zap } from 'lucide-react';

interface SaveStatisticsProps {
  isVisible: boolean;
  onClose: () => void;
}

interface SaveStats {
  totalSaves: number;
  successfulSaves: number;
  failedSaves: number;
  averageSaveTime: number;
  lastSaveTime: Date | null;
  savesToday: number;
  savesThisWeek: number;
  savesThisMonth: number;
}

const SaveStatistics: React.FC<SaveStatisticsProps> = ({ isVisible, onClose }) => {
  const [stats, setStats] = useState<SaveStats>({
    totalSaves: 0,
    successfulSaves: 0,
    failedSaves: 0,
    averageSaveTime: 0,
    lastSaveTime: null,
    savesToday: 0,
    savesThisWeek: 0,
    savesThisMonth: 0
  });

  useEffect(() => {
    if (isVisible) {
      calculateStats();
    }
  }, [isVisible]);

  const calculateStats = () => {
    try {
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

      setStats({
        totalSaves,
        successfulSaves,
        failedSaves,
        averageSaveTime,
        lastSaveTime,
        savesToday,
        savesThisWeek,
        savesThisMonth
      });
    } catch (error) {
      console.error('Error calculating save statistics:', error);
    }
  };

  const formatDuration = (duration: number) => {
    if (duration < 1000) {
      return `${Math.round(duration)}ms`;
    }
    return `${(duration / 1000).toFixed(1)}s`;
  };

  const getSuccessRate = () => {
    if (stats.totalSaves === 0) return 0;
    return Math.round((stats.successfulSaves / stats.totalSaves) * 100);
  };

  const getStatusColor = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 60) return 'text-yellow-500';
    return 'text-red-500';
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
            className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-bold text-gray-800">Statystyki zapisów</h2>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Saves */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-blue-50 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold text-blue-800">Łączne zapisy</h3>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">{stats.totalSaves}</div>
                </motion.div>

                {/* Success Rate */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
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
                  transition={{ delay: 0.3 }}
                  className="bg-purple-50 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-5 h-5 text-purple-500" />
                    <h3 className="font-semibold text-purple-800">Średni czas zapisu</h3>
                  </div>
                  <div className="text-3xl font-bold text-purple-600">
                    {formatDuration(stats.averageSaveTime)}
                  </div>
                </motion.div>

                {/* Saves Today */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-yellow-50 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-semibold text-yellow-800">Dzisiaj</h3>
                  </div>
                  <div className="text-3xl font-bold text-yellow-600">{stats.savesToday}</div>
                </motion.div>

                {/* Saves This Week */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-indigo-50 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-indigo-500" />
                    <h3 className="font-semibold text-indigo-800">Ten tydzień</h3>
                  </div>
                  <div className="text-3xl font-bold text-indigo-600">{stats.savesThisWeek}</div>
                </motion.div>

                {/* Saves This Month */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-pink-50 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-pink-500" />
                    <h3 className="font-semibold text-pink-800">Ten miesiąc</h3>
                  </div>
                  <div className="text-3xl font-bold text-pink-600">{stats.savesThisMonth}</div>
                </motion.div>
              </div>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-6 bg-gray-50 rounded-lg p-4"
              >
                <h3 className="font-semibold text-gray-800 mb-3">Dodatkowe informacje</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Ostatni zapis:</span>
                    <span className="ml-2 font-medium">
                      {stats.lastSaveTime 
                        ? stats.lastSaveTime.toLocaleString() 
                        : 'Brak danych'
                      }
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Udane zapisy:</span>
                    <span className="ml-2 font-medium text-green-600">{stats.successfulSaves}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Nieudane zapisy:</span>
                    <span className="ml-2 font-medium text-red-600">{stats.failedSaves}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Średni czas zapisu:</span>
                    <span className="ml-2 font-medium">{formatDuration(stats.averageSaveTime)}</span>
                  </div>
                </div>
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

export default SaveStatistics;
