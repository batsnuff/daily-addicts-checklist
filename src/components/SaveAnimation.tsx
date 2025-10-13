import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface SaveAnimationProps {
  isVisible: boolean;
  status: 'idle' | 'saving' | 'saved' | 'error';
  onComplete: () => void;
}

const SaveAnimation: React.FC<SaveAnimationProps> = ({ 
  isVisible, 
  status, 
  onComplete 
}) => {
  const getIcon = () => {
    switch (status) {
      case 'saving':
        return <Loader2 className="w-8 h-8 animate-spin text-blue-500" />;
      case 'saved':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-8 h-8 text-red-500" />;
      default:
        return <Save className="w-8 h-8 text-gray-400" />;
    }
  };

  const getText = () => {
    switch (status) {
      case 'saving':
        return 'Zapisywanie...';
      case 'saved':
        return 'Zapisano!';
      case 'error':
        return 'Błąd zapisywania';
      default:
        return 'Gotowy do zapisania';
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

  // Auto-complete after success
  React.useEffect(() => {
    if (status === 'saved') {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && status !== 'saving' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50"
          />
          
          {/* Animation Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`relative bg-white rounded-lg shadow-xl p-8 text-center ${getBackgroundColor()}`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-4"
            >
              {getIcon()}
            </motion.div>
            
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`text-xl font-semibold ${getColor()} mb-2`}
            >
              {getText()}
            </motion.h3>
            
            {status === 'saved' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="text-sm text-gray-600 mt-2"
              >
                Dane zostały pomyślnie zapisane!
              </motion.div>
            )}
            
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-red-600 mt-2"
              >
                Wystąpił błąd podczas zapisywania
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SaveAnimation;
