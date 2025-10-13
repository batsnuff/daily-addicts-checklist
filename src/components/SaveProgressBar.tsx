import React from 'react';
import { motion } from 'framer-motion';
import { Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface SaveProgressBarProps {
  isVisible: boolean;
  progress: number;
  status: 'idle' | 'saving' | 'saved' | 'error';
  message?: string;
  className?: string;
}

const SaveProgressBar: React.FC<SaveProgressBarProps> = ({
  isVisible,
  progress,
  status,
  message,
  className = ''
}) => {
  if (!isVisible) return null;

  const getIcon = () => {
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

  const getProgressColor = () => {
    switch (status) {
      case 'saving':
        return 'bg-blue-500';
      case 'saved':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
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

  const getTextColor = () => {
    switch (status) {
      case 'saving':
        return 'text-blue-700';
      case 'saved':
        return 'text-green-700';
      case 'error':
        return 'text-red-700';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-0 left-0 right-0 z-50 ${getBackgroundColor()} border-b ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className={`text-sm font-medium ${getTextColor()}`}>
                {message || 'Zapisywanie...'}
              </span>
              <span className={`text-xs ${getTextColor()}`}>
                {Math.round(progress)}%
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className={`h-full ${getProgressColor()} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SaveProgressBar;
