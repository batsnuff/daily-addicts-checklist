import React from 'react';
import { motion } from 'framer-motion';

interface SaveProgressProps {
  isVisible: boolean;
  progress: number;
  message: string;
}

const SaveProgress: React.FC<SaveProgressProps> = ({ isVisible, progress, message }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed bottom-4 left-4 z-50 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg p-4 min-w-64"
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800">{message}</p>
          <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-blue-500 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-1">{Math.round(progress)}%</p>
        </div>
      </div>
    </motion.div>
  );
};

export default SaveProgress;
