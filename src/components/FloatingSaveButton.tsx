import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

interface FloatingSaveButtonProps {
  onSave: () => void;
  status: 'idle' | 'saving' | 'saved' | 'error';
  className?: string;
}

const FloatingSaveButton: React.FC<FloatingSaveButtonProps> = ({ 
  onSave, 
  status, 
  className = '' 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getIcon = () => {
    switch (status) {
      case 'saving':
        return <Loader2 className="w-5 h-5 animate-spin" />;
      case 'saved':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Save className="w-5 h-5" />;
    }
  };

  const getBackgroundColor = () => {
    switch (status) {
      case 'saving':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'saved':
        return 'bg-green-500 hover:bg-green-600';
      case 'error':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-purple-500 hover:bg-purple-600';
    }
  };

  const getTooltipText = () => {
    switch (status) {
      case 'saving':
        return 'Zapisywanie...';
      case 'saved':
        return 'Zapisano!';
      case 'error':
        return 'Błąd zapisywania';
      default:
        return 'Zapisz stan';
    }
  };

  return (
    <div className={`fixed bottom-4 left-4 z-40 ${className}`}>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onSave}
        disabled={status === 'saving'}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`w-14 h-14 rounded-full shadow-lg text-white transition-all duration-200 flex items-center justify-center ${getBackgroundColor()} ${
          status === 'saving' ? 'cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        {getIcon()}
      </motion.button>
      
      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="absolute right-full top-1/2 transform -translate-y-1/2 mr-3 bg-gray-800 text-white text-sm px-2 py-1 rounded whitespace-nowrap"
          >
            {getTooltipText()}
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-800 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingSaveButton;
