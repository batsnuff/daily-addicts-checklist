import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface SaveIndicatorProps {
  status: 'idle' | 'saving' | 'saved' | 'error';
  className?: string;
}

const SaveIndicator: React.FC<SaveIndicatorProps> = ({ status, className = '' }) => {
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

  const getText = () => {
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

  const getColor = () => {
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

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`fixed top-4 right-4 z-40 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2 flex items-center space-x-2 ${className}`}
    >
      {getIcon()}
      <span className={`text-sm font-medium ${getColor()}`}>
        {getText()}
      </span>
    </motion.div>
  );
};

export default SaveIndicator;
