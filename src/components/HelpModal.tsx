import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard, Save, MousePointer, Zap } from 'lucide-react';

interface HelpModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isVisible, onClose }) => {
  const shortcuts = [
    { key: 'Ctrl+S / Cmd+S', description: 'Zapisz stan', icon: <Save className="w-4 h-4" /> },
    { key: '1', description: 'Przełącz na DZISIAJ', icon: <MousePointer className="w-4 h-4" /> },
    { key: '2', description: 'Przełącz na TYDZIEŃ', icon: <MousePointer className="w-4 h-4" /> },
    { key: '3', description: 'Przełącz na NOTATKI', icon: <MousePointer className="w-4 h-4" /> },
    { key: '4', description: 'Przełącz na STATYSTYKI', icon: <MousePointer className="w-4 h-4" /> },
    { key: '5', description: 'Przełącz na EKSPORT', icon: <MousePointer className="w-4 h-4" /> },
    { key: '6', description: 'Przełącz na KALENDARZ', icon: <MousePointer className="w-4 h-4" /> },
    { key: '7', description: 'Przełącz na BAZA', icon: <MousePointer className="w-4 h-4" /> },
  ];

  const features = [
    {
      title: 'Automatyczne zapisywanie',
      description: 'Dane są automatycznie zapisywane po każdej zmianie',
      icon: <Zap className="w-5 h-5 text-yellow-500" />
    },
    {
      title: 'Synchronizacja między urządzeniami',
      description: 'Twoje dane są synchronizowane z chmurą',
      icon: <Save className="w-5 h-5 text-blue-500" />
    },
    {
      title: 'Offline support',
      description: 'Aplikacja działa bez internetu',
      icon: <MousePointer className="w-5 h-5 text-green-500" />
    }
  ];

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
            className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-2">
                <Keyboard className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-bold text-gray-800">Pomoc i skróty</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Keyboard Shortcuts */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <Keyboard className="w-5 h-5" />
                  <span>Skróty klawiszowe</span>
                </h3>
                <div className="grid gap-3">
                  {shortcuts.map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {shortcut.icon}
                        <span className="font-medium text-gray-700">{shortcut.description}</span>
                      </div>
                      <kbd className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm font-mono">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Funkcje aplikacji</span>
                </h3>
                <div className="grid gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                      {feature.icon}
                      <div>
                        <h4 className="font-medium text-gray-800">{feature.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">💡 Wskazówki</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Użyj Ctrl+S aby szybko zapisać stan</li>
                  <li>• Dane są automatycznie synchronizowane między urządzeniami</li>
                  <li>• Aplikacja działa offline - dane są zapisywane lokalnie</li>
                  <li>• Użyj numerów 1-7 aby szybko przełączać między zakładkami</li>
                </ul>
              </div>
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

export default HelpModal;
