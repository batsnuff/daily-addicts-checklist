import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, CheckCircle, AlertCircle, Clock, Trash2 } from 'lucide-react';

interface SaveHistoryItem {
  id: string;
  timestamp: Date;
  status: 'success' | 'error';
  message: string;
  duration?: number;
}

interface SaveHistoryProps {
  isVisible: boolean;
  onClose: () => void;
}

const SaveHistory: React.FC<SaveHistoryProps> = ({ isVisible, onClose }) => {
  const [history, setHistory] = useState<SaveHistoryItem[]>([]);

  useEffect(() => {
    // Load save history from localStorage
    const savedHistory = localStorage.getItem('saveHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        setHistory(parsedHistory);
      } catch (error) {
        console.error('Error loading save history:', error);
      }
    }
  }, []);

  // const addToHistory = (item: Omit<SaveHistoryItem, 'id'>) => {
  //   const newItem: SaveHistoryItem = {
  //     ...item,
  //     id: Date.now().toString()
  //   };
    
  //   const updatedHistory = [newItem, ...history].slice(0, 50); // Keep only last 50 items
  //   setHistory(updatedHistory);
    
  //   // Save to localStorage
  //   localStorage.setItem('saveHistory', JSON.stringify(updatedHistory));
  // };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('saveHistory');
  };

  const formatDuration = (duration: number) => {
    if (duration < 1000) {
      return `${duration}ms`;
    }
    return `${(duration / 1000).toFixed(1)}s`;
  };

  const getStatusIcon = (status: 'success' | 'error') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: 'success' | 'error') => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
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
            className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-2">
                <History className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-bold text-gray-800">Historia zapisów</h2>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={clearHistory}
                  className="flex items-center space-x-1 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Wyczyść</span>
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
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {history.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Brak historii zapisów</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(item.status)}
                        <div>
                          <p className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                            {item.message}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {item.duration && (
                        <div className="text-xs text-gray-400">
                          {formatDuration(item.duration)}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
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

export default SaveHistory;
