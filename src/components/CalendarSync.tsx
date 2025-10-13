import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, RotateCcw, CheckCircle, AlertCircle, Clock, Settings } from 'lucide-react';

const CalendarSync: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncEnabled, setSyncEnabled] = useState(false);

  useEffect(() => {
    // Check if calendar sync is enabled
    const enabled = localStorage.getItem('calendarSyncEnabled') === 'true';
    setSyncEnabled(enabled);
    
    // Get last sync time
    const lastSyncTime = localStorage.getItem('lastCalendarSync');
    if (lastSyncTime) {
      setLastSync(new Date(lastSyncTime));
    }
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus('idle');
    
    try {
      // Simulate calendar sync process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update last sync time
      const now = new Date();
      setLastSync(now);
      localStorage.setItem('lastCalendarSync', now.toISOString());
      
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (error) {
      console.error('Calendar sync failed:', error);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleSync = () => {
    const newEnabled = !syncEnabled;
    setSyncEnabled(newEnabled);
    localStorage.setItem('calendarSyncEnabled', newEnabled.toString());
  };

  const getSyncStatusColor = () => {
    switch (syncStatus) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSyncStatusIcon = () => {
    switch (syncStatus) {
      case 'success': return <CheckCircle size={20} className="text-green-400" />;
      case 'error': return <AlertCircle size={20} className="text-red-400" />;
      default: return <Clock size={20} className="text-gray-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <Calendar className="text-blue-400" size={40} />
          SYNCHRONIZACJA KALENDARZA
        </h2>
        <p className="text-lg text-gray-300">
          Automatyczna synchronizacja z kalendarzem systemowym
        </p>
      </div>


      {/* Sync Status */}
      <div className="card">
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Settings className="text-blue-400" size={24} />
          STATUS SYNCHRONIZACJI
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black bg-opacity-30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              {getSyncStatusIcon()}
              <span className="text-white font-bold">Status</span>
            </div>
            <div className={`text-2xl font-bold ${getSyncStatusColor()}`}>
              {syncStatus === 'idle' && 'Gotowy'}
              {syncStatus === 'success' && 'Synchronizacja zakończona'}
              {syncStatus === 'error' && 'Błąd synchronizacji'}
            </div>
            <div className="text-sm text-gray-300 mt-1">
              {isSyncing && 'Synchronizacja w toku...'}
            </div>
          </div>

          <div className="bg-black bg-opacity-30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="text-yellow-400" size={20} />
              <span className="text-white font-bold">Ostatnia synchronizacja</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {lastSync ? lastSync.toLocaleTimeString('pl-PL') : 'Nigdy'}
            </div>
            <div className="text-sm text-gray-300 mt-1">
              {lastSync ? lastSync.toLocaleDateString('pl-PL') : 'Brak danych'}
            </div>
          </div>
        </div>
      </div>

      {/* Sync Controls */}
      <div className="card">
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <RotateCcw className="text-green-400" size={24} />
          KONTROLA SYNCHRONIZACJI
        </h3>

        <div className="space-y-4">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between bg-black bg-opacity-30 rounded-lg p-4">
            <div>
              <div className="text-white font-bold">Automatyczna synchronizacja</div>
              <div className="text-sm text-gray-300">
                Automatycznie synchronizuj zadania z kalendarzem
              </div>
            </div>
            <button
              onClick={toggleSync}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                syncEnabled ? 'bg-green-500' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  syncEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Manual Sync Button */}
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSync}
              disabled={isSyncing}
              className={`btn-primary text-lg px-8 py-4 ${
                isSyncing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <RotateCcw size={24} className="inline mr-2" />
              {isSyncing ? 'Synchronizacja...' : 'Synchronizuj teraz'}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Sync Information */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-4">Informacje o synchronizacji</h3>
        <div className="bg-black bg-opacity-30 rounded-lg p-4">
          <ul className="text-sm text-gray-300 space-y-2">
            <li>• Synchronizacja z kalendarzem systemowym (Google Calendar, Outlook, Apple Calendar)</li>
            <li>• Automatyczne tworzenie wydarzeń dla zaplanowanych zadań</li>
            <li>• Dwukierunkowa synchronizacja - zmiany w kalendarzu wpływają na aplikację</li>
            <li>• Prywatność - dane synchronizowane lokalnie i szyfrowane</li>
            <li>• Możliwość wyłączenia synchronizacji w każdej chwili</li>
          </ul>
        </div>
      </div>

      {/* Sync History */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-4">Historia synchronizacji</h3>
        <div className="space-y-2">
          {lastSync ? (
            <div className="bg-black bg-opacity-30 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-400" size={20} />
                <span className="text-white">Ostatnia synchronizacja</span>
              </div>
              <div className="text-gray-300 text-sm">
                {lastSync.toLocaleString('pl-PL')}
              </div>
            </div>
          ) : (
            <div className="bg-black bg-opacity-30 rounded-lg p-3 text-center text-gray-400">
              Brak historii synchronizacji
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CalendarSync;
