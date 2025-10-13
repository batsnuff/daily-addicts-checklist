import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const WeekdaysMadness: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isGlowing, setIsGlowing] = useState(false);
  const [isWorkDay, setIsWorkDay] = useState(false);

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

  // Work day detection
  useEffect(() => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    
    setIsWorkDay(dayOfWeek >= 1 && dayOfWeek <= 5); // Monday to Friday
  }, [currentTime]);

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

      {/* Digital Clock */}
      <div className="bg-gradient-to-r from-gray-900 to-black rounded-lg p-6 border-2 border-blue-400 shadow-lg">
        <div className="text-center">
          {/* Time Display */}
          <motion.div
            animate={{ 
              scale: isGlowing ? 1.05 : 1,
              textShadow: isGlowing 
                ? '0 0 20px #477129, 0 0 40px #477129' 
                : '0 0 5px #477129'
            }}
            className="text-6xl font-mono font-bold text-blue-400 mb-4"
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
                className="w-2 h-2 bg-blue-400 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="mt-4 flex justify-between items-center text-sm">
        <div className="text-gray-400">
          Chaos: <span className="text-green-400">Kontrolowany</span>
        </div>
        <div className="text-gray-400">
          Tryb: <span className="text-blue-400">Nadaktywny</span>
        </div>
      </div>

      {/* Work/Weekend Status in Calendar */}
      <div className="mt-6">
        {isWorkDay ? (
          <motion.div
            className="p-4 rounded-lg border-2 shadow-lg bg-gradient-to-r from-red-500 to-blue-900 border-blue-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Clock className="text-yellow-400" size={24} />
                <span className="text-yellow-400 font-bold text-xl">8:30-18:30</span>
              </div>
              
              <div className="text-lg font-bold text-white">
                offToWork
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="p-4 rounded-lg border-2 shadow-lg"
            style={{
              background: 'linear-gradient(to right, #3b82f680, #198541de)',
              borderColor: '#198541de'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
            
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ 
                  scale: 5.2,
                  filter: "brightness(1.7) drop-shadow(0 0 8pxrgb(255, 64, 0)) drop-shadow(0 0 16px rgb(255, 64, 0))",
                  transition: { duration: 0.43 }
                }}
                className=" text-green-200 font-bold text-xl mb-2 cursor-pointer transition-all hover:text-orange-400"
                style={{
                  textShadow: "0 0 10px rgba(255, 107, 0, 0)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textShadow = "0 0 20px #ff6b00, 0 0 30px #ff0000";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textShadow = "0 0 10px rgba(255, 107, 0, 0)";
                }}
              >
                🎉 WEEKEND! 🎉
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

    </motion.div>
  );
};

export default WeekdaysMadness;
