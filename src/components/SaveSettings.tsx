import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Save, Clock, Zap, Shield, Cloud } from 'lucide-react';

interface SaveSettingsProps {
  isVisible: boolean;
  onClose: () => void;
}

interface SaveSettingsData {
  autoSave: boolean;
  autoSaveDelay: number;
  confirmBeforeSave: boolean;
  showSaveAnimations: boolean;
  saveToCloud: boolean;
  backupFrequency: number;
  maxHistoryItems: number;
}

const SaveSettings: React.FC<SaveSettingsProps> = ({ isVisible, onClose }) => {
  const [settings, setSettings] = useState<SaveSettingsData>({
    autoSave: true,
    autoSaveDelay: 2000,
    confirmBeforeSave: true,
    showSaveAnimations: true,
    saveToCloud: true,
    backupFrequency: 24,
    maxHistoryItems: 50
  });

  useEffect(() => {
    if (isVisible) {
      loadSettings();
    }
  }, [isVisible]);

  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem('saveSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading save settings:', error);
    }
  };

  const saveSettings = () => {
    try {
      localStorage.setItem('saveSettings', JSON.stringify(settings));
      onClose();
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleSettingChange = (key: keyof SaveSettingsData, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetToDefaults = () => {
    setSettings({
      autoSave: true,
      autoSaveDelay: 2000,
      confirmBeforeSave: true,
      showSaveAnimations: true,
      saveToCloud: true,
      backupFrequency: 24,
      maxHistoryItems: 50
    });
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
            className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-2">
                <Settings className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-bold text-gray-800">Ustawienia zapisywania</h2>
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
            <div className="p-6 space-y-6">
              {/* Auto Save Settings */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Automatyczne zapisywanie</span>
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Włącz automatyczne zapisywanie</label>
                      <p className="text-xs text-gray-500">Dane są automatycznie zapisywane po zmianach</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoSave}
                        onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Opóźnienie automatycznego zapisu</label>
                      <p className="text-xs text-gray-500">Czas oczekiwania przed automatycznym zapisem (ms)</p>
                    </div>
                    <input
                      type="number"
                      value={settings.autoSaveDelay}
                      onChange={(e) => handleSettingChange('autoSaveDelay', parseInt(e.target.value))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      min="500"
                      max="10000"
                      step="500"
                    />
                  </div>
                </div>
              </div>

              {/* Save Behavior */}
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center space-x-2">
                  <Save className="w-5 h-5" />
                  <span>Zachowanie zapisywania</span>
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Potwierdź przed zapisem</label>
                      <p className="text-xs text-gray-500">Pokaż dialog potwierdzenia przed zapisem</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.confirmBeforeSave}
                        onChange={(e) => handleSettingChange('confirmBeforeSave', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Pokaż animacje zapisu</label>
                      <p className="text-xs text-gray-500">Wyświetl animacje podczas zapisywania</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.showSaveAnimations}
                        onChange={(e) => handleSettingChange('showSaveAnimations', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Cloud Sync */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center space-x-2">
                  <Cloud className="w-5 h-5" />
                  <span>Synchronizacja z chmurą</span>
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Zapisz do chmury</label>
                      <p className="text-xs text-gray-500">Synchronizuj dane z chmurą</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.saveToCloud}
                        onChange={(e) => handleSettingChange('saveToCloud', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Częstotliwość kopii zapasowych</label>
                      <p className="text-xs text-gray-500">Jak często tworzyć kopie zapasowe (godziny)</p>
                    </div>
                    <input
                      type="number"
                      value={settings.backupFrequency}
                      onChange={(e) => handleSettingChange('backupFrequency', parseInt(e.target.value))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      min="1"
                      max="168"
                      step="1"
                    />
                  </div>
                </div>
              </div>

              {/* History Settings */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Historia zapisów</span>
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Maksymalna liczba elementów historii</label>
                      <p className="text-xs text-gray-500">Ile elementów historii zachować</p>
                    </div>
                    <input
                      type="number"
                      value={settings.maxHistoryItems}
                      onChange={(e) => handleSettingChange('maxHistoryItems', parseInt(e.target.value))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      min="10"
                      max="1000"
                      step="10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between p-6 border-t">
              <button
                onClick={resetToDefaults}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Resetuj do domyślnych
              </button>
              <div className="space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                >
                  Anuluj
                </button>
                <button
                  onClick={saveSettings}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Zapisz ustawienia
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SaveSettings;
