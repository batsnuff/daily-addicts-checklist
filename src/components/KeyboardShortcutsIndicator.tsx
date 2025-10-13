import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, HelpCircle } from 'lucide-react';

interface KeyboardShortcutsIndicatorProps {
  onShowHelp: () => void;
  className?: string;
}

const KeyboardShortcutsIndicator: React.FC<KeyboardShortcutsIndicatorProps> = ({ 
  onShowHelp, 
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [, setShowShortcuts] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Show indicator when Ctrl or Cmd is pressed
      if (event.ctrlKey || event.metaKey) {
        setIsVisible(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      // Hide indicator when Ctrl or Cmd is released
      if (!event.ctrlKey && !event.metaKey) {
        setIsVisible(false);
        setShowShortcuts(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const shortcuts = [
    { key: 'S', description: 'Zapisz stan' },
    { key: '1-7', description: 'Przełącz zakładki' },
    { key: '?', description: 'Pokaż pomoc' }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`fixed bottom-4 right-4 z-40 ${className}`}
        >
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg p-4 min-w-64">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Keyboard className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">Skróty klawiszowe</span>
              </div>
              <button
                onClick={onShowHelp}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-2">
              {shortcuts.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{shortcut.description}</span>
                  <kbd className="px-2 py-1 bg-gray-200 text-gray-700 rounded font-mono">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Naciśnij <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">?</kbd> aby zobaczyć wszystkie skróty
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default KeyboardShortcutsIndicator;
