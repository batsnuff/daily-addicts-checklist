import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar } from 'lucide-react';

const WeekdaysMadness: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isGlowing, setIsGlowing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Glow effect every 2 seconds
    const glowTimer = setInterval(() => {
      setIsGlowing(true);
      setTimeout(() => setIsGlowing(false), 500);
    }, 2000);

    return () => {
      clearInterval(timer);
      clearInterval(glowTimer);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pl-PL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDayType = () => {
    const day = currentTime.getDay();
    if (day >= 1 && day <= 5) {
      return 'WEEKDAY';
    } else if (day === 6) {
      return 'SATURDAY';
    } else {
      return 'SUNDAY';
    }
  };

  const getDayColor = () => {
    const day = currentTime.getDay();
    if (day >= 1 && day <= 5) {
      return 'from-red-500 to-red-700';
    } else if (day === 6) {
      return 'from-orange-500 to-orange-700';
    } else {
      return 'from-purple-500 to-purple-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card mb-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <Calendar className="text-cyan-400" size={32} />
          WEEKDAYS MADNESS
        </h2>
      </div>

      {/* Digital Clock */}
      <div className="bg-gradient-to-r from-gray-900 to-black rounded-lg p-6 border-2 border-cyan-400 shadow-lg">
        <div className="text-center">
          {/* Time Display */}
          <motion.div
            animate={{ 
              scale: isGlowing ? 1.05 : 1,
              textShadow: isGlowing 
                ? '0 0 20px #00ff88, 0 0 40px #00ff88' 
                : '0 0 5px #00ff88'
            }}
            className="text-6xl font-mono font-bold text-cyan-400 mb-4"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            {formatTime(currentTime)}
          </motion.div>

          {/* Date Display */}
          <div className="text-xl text-gray-300 mb-4 font-mono">
            {formatDate(currentTime)}
          </div>

          {/* Day Type Indicator */}
          <motion.div
            animate={{ 
              scale: isGlowing ? 1.02 : 1,
              opacity: isGlowing ? 0.8 : 1
            }}
            className={`inline-block px-4 py-2 rounded-lg bg-gradient-to-r ${getDayColor()} text-white font-bold text-lg mb-4`}
          >
            {getDayType()}
          </motion.div>

          {/* Work Schedule */}
          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg border border-yellow-500">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Clock className="text-yellow-400" size={24} />
              <span className="text-yellow-400 font-bold text-xl">8:20-18:30</span>
            </div>
            <div className="text-yellow-200 text-lg font-semibold">
              OFF TO WORK
            </div>
          </div>

          {/* Animated Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-2 h-2 bg-cyan-400 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="mt-4 flex justify-between items-center text-sm">
        <div className="text-gray-400">
          Status: <span className="text-green-400">ACTIVE</span>
        </div>
        <div className="text-gray-400">
          Mode: <span className="text-cyan-400">PRODUCTIVE</span>
        </div>
      </div>

    </motion.div>
  );
};

export default WeekdaysMadness;
