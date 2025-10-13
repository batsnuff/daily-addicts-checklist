import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Clock, Mail, AlertCircle, CheckCircle, Calendar } from 'lucide-react';
import { exportWeeklyData, sendEmailExport, getCurrentWeek } from '../utils/storage';
import CasinoAnimation from './CasinoAnimation';

const WeeklyExport: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [timeToReminder, setTimeToReminder] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [showCasino, setShowCasino] = useState(false);
  const [selectedPills, setSelectedPills] = useState<string[]>([]);

  useEffect(() => {
    // Check if it's time for weekly export reminder (23:00 Amsterdam time)
    const checkReminderTime = () => {
      const now = new Date();
      const amsterdamTime = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Amsterdam"}));
      
      // Check if it's 23:00 Amsterdam time
      if (amsterdamTime.getHours() === 23 && amsterdamTime.getMinutes() === 0) {
        setShowReminder(true);
      }
      
      // Calculate time until next 23:00 Amsterdam
      const nextReminder = new Date(amsterdamTime);
      nextReminder.setHours(23, 0, 0, 0);
      if (nextReminder <= amsterdamTime) {
        nextReminder.setDate(nextReminder.getDate() + 1);
      }
      
      const timeDiff = nextReminder.getTime() - amsterdamTime.getTime();
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeToReminder(`${hours}h ${minutes}m`);
      setCurrentTime(amsterdamTime);
    };

    checkReminderTime();
    const interval = setInterval(checkReminderTime, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const weekStart = getCurrentWeek();
      const exportData = await exportWeeklyData(weekStart);
      
      // Create and download file
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `daily-addicts-week-${weekStart}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
      
      // Show casino animation after successful export
      setTimeout(() => {
        setShowCasino(true);
      }, 2000);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleEmailExport = async () => {
    setIsExporting(true);
    try {
      const weekStart = getCurrentWeek();
      await sendEmailExport(weekStart, 'miloszszczepaniak@gmail.com');
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error('Email export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const dismissReminder = () => {
    setShowReminder(false);
  };

  const handleCasinoComplete = (pills: string[]) => {
    setSelectedPills(pills);
    setShowCasino(false);
    // Save selected pills to localStorage or send to backend
    localStorage.setItem('selectedPassionsPills', JSON.stringify(pills));
  };

  return (
    <div className="space-y-6">
      {/* Weekly Export Reminder */}
      <AnimatePresence>
        {showReminder && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-4 right-4 z-50 max-w-md"
          >
            <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl p-6 border-4 border-red-400 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="text-yellow-400" size={32} />
                <h3 className="text-xl font-bold text-white">PRZYPOMNIENIE EKSPORTU</h3>
              </div>
              <p className="text-red-100 mb-4">
                🕚 23:00 Amsterdam - Czas na eksport tygodniowy!
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleExport}
                  className="btn-primary text-sm flex-1"
                >
                  <Download size={16} className="inline mr-1" />
                  Eksportuj
                </button>
                <button
                  onClick={dismissReminder}
                  className="btn-secondary text-sm"
                >
                  Później
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
          <Calendar className="text-blue-400" size={32} />
          EKSPORT TYGODNIOWY
        </h2>

        {/* Time Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-black bg-opacity-30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="text-blue-400" size={20} />
              <span className="text-white font-bold">Czas Amsterdam</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {currentTime.toLocaleTimeString('pl-PL', { 
                timeZone: 'Europe/Amsterdam',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            <div className="text-sm text-gray-300">
              {currentTime.toLocaleDateString('pl-PL', { 
                timeZone: 'Europe/Amsterdam',
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          <div className="bg-black bg-opacity-30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="text-yellow-400" size={20} />
              <span className="text-white font-bold">Następne przypomnienie</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">
              {timeToReminder}
            </div>
            <div className="text-sm text-gray-300">
              do 23:00 Amsterdam
            </div>
          </div>
        </div>

        {/* Export Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExport}
            disabled={isExporting}
            className={`btn-primary text-lg p-4 ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Download size={24} className="inline mr-2" />
            {isExporting ? 'Eksportowanie...' : 'Pobierz JSON'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleEmailExport}
            disabled={isExporting}
            className={`btn-secondary text-lg p-4 ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Mail size={24} className="inline mr-2" />
            {isExporting ? 'Wysyłanie...' : 'Wyślij na Email'}
          </motion.button>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {exportSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 bg-green-600 bg-opacity-20 border border-green-400 rounded-lg p-4 text-center"
            >
              <CheckCircle className="inline text-green-400 mr-2" size={20} />
              <span className="text-green-400 font-bold">
                Eksport zakończony pomyślnie!
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Export Info */}
        <div className="mt-6 bg-black bg-opacity-30 rounded-lg p-4">
          <h3 className="text-lg font-bold text-white mb-2">Informacje o eksporcie:</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Dane eksportowane w formacie JSON</li>
            <li>• Zawiera wszystkie zadania i punkty z tygodnia</li>
            <li>• Automatyczne przypomnienie o 23:00 Amsterdam</li>
            <li>• Możliwość wysłania na email: miloszszczepaniak@gmail.com</li>
          </ul>
        </div>
      </motion.div>

      {/* Casino Animation */}
      <CasinoAnimation
        isOpen={showCasino}
        onClose={() => setShowCasino(false)}
        onComplete={handleCasinoComplete}
      />

      {/* Selected Pills Display */}
      {selectedPills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h3 className="text-2xl font-bold text-white mb-4 text-center">
            🎰 WYLOSOWANE PASSIONS PILLS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedPills.map((pill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 text-center border-2 border-purple-400"
              >
                <div className="text-3xl mb-2">💊</div>
                <div className="text-white font-bold">{pill}</div>
                <div className="text-sm text-purple-200">Na nadchodzący tydzień</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default WeeklyExport;
