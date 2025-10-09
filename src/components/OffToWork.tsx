import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const OffToWork: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isWorkTime, setIsWorkTime] = useState(false);
  const [isWorkDay, setIsWorkDay] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTimeInMinutes = hours * 60 + minutes;
    
    // Work time: Monday to Friday, 8:30-18:30
    const workStart = 8 * 60 + 30; // 8:30 in minutes
    const workEnd = 18 * 60 + 30; // 18:30 in minutes
    
    setIsWorkDay(dayOfWeek >= 1 && dayOfWeek <= 5); // Monday to Friday
    setIsWorkTime(isWorkDay && currentTimeInMinutes >= workStart && currentTimeInMinutes <= workEnd);
  }, [currentTime, isWorkDay]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pl-PL', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getDayName = () => {
    const days = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
    return days[new Date().getDay()];
  };

  const getStatusMessage = () => {
    if (!isWorkDay) {
      return "Weekend - Wolne!";
    }
    if (isWorkTime) {
      return "Czas pracy - OFF TO WORK!";
    }
    return "Poza godzinami pracy";
  };

  const getStatusColor = () => {
    if (!isWorkDay) {
      return "from-green-500 to-green-700 border-green-400";
    }
    if (isWorkTime) {
      return "from-red-500 to-red-700 border-red-400";
    }
    return "from-gray-500 to-gray-700 border-gray-400";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card mb-6"
    >
      <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
        🏢 OFF TO WORK
      </h2>
      
      <div className="text-center mb-6">
        <div className="text-lg text-cyan-400 mb-2">
          {getDayName()} • {formatTime(currentTime)}
        </div>
        <div className="text-sm text-gray-400">
          Pon-Pt: 8:30-18:30 | Weekendy: Wolne
        </div>
      </div>

      <motion.div
        className={`p-6 rounded-lg border-2 shadow-lg bg-gradient-to-r ${getStatusColor()} ${
          isWorkTime ? 'animate-pulse' : ''
        }`}
        animate={{ 
          scale: isWorkTime ? [1, 1.02, 1] : 1,
        }}
        transition={{ 
          duration: 2, 
          repeat: isWorkTime ? Infinity : 0 
        }}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">
            {isWorkTime ? (
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                🏢
              </motion.div>
            ) : (
              <X className="mx-auto text-white" size={64} />
            )}
          </div>
          
          <div className="text-2xl font-bold text-white mb-2">
            {getStatusMessage()}
          </div>
          
          {isWorkTime && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg text-red-200"
            >
              🔥 CZAS PRACY! 🔥
            </motion.div>
          )}
          
          {!isWorkDay && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg text-green-200"
            >
              🎉 WEEKEND! 🎉
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Progress bar for work day */}
      {isWorkDay && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Postęp dnia roboczego</span>
            <span className="text-sm text-cyan-400 font-bold">
              {isWorkTime ? 'W TRAKCIE' : 'POZA GODZINAMI'}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <motion.div
              className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: isWorkTime ? '100%' : '0%' 
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default OffToWork;
