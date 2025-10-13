import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Trophy } from 'lucide-react';

const getCurrentDay = () => {
  const days = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
  return days[new Date().getDay()];
};

const getTodaySchedule = () => {
  const today = new Date().getDay();
  const schedules = {
    0: { day: 'Niedziela', distance: '21km', distanceValue: 21, type: 'Półmaraton', color: 'from-red-500 to-red-700' },
    1: { day: 'Poniedziałek', distance: '5km', distanceValue: 5, type: 'Standard', color: 'from-blue-400 to-purple-600' },
    2: { day: 'Wtorek', distance: '5km', distanceValue: 5, type: 'Standard', color: 'from-green-500 to-green-700' },
    3: { day: 'Środa', distance: '5km', distanceValue: 5, type: 'Standard', color: 'from-purple-500 to-purple-700' },
    4: { day: 'Czwartek', distance: '5km', distanceValue: 5, type: 'Standard', color: 'from-yellow-500 to-yellow-700' },
    5: { day: 'Piątek', distance: '5km', distanceValue: 5, type: 'Standard', color: 'from-pink-500 to-pink-700' },
    6: { day: 'Sobota', distance: '10km', distanceValue: 10, type: 'Weekend', color: 'from-orange-500 to-orange-700' }
  };
  return schedules[today as keyof typeof schedules];
};

interface RunningTrackerProps {
  onAddPoints: (points: number) => void;
}

const RunningTracker: React.FC<RunningTrackerProps> = ({ onAddPoints }) => {
  const [targetDistance, setTargetDistance] = useState(getTodaySchedule().distanceValue);
  const [currentDistance, setCurrentDistance] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionTime, setCompletionTime] = useState<string | null>(null);

  const remainingDistance = Math.max(0, targetDistance - currentDistance);
  const progress = (currentDistance / targetDistance) * 100;

  // Update target distance when day changes
  useEffect(() => {
    setTargetDistance(getTodaySchedule().distanceValue);
  }, []);

  // Load saved running state
  useEffect(() => {
    const savedState = localStorage.getItem('running_state');
    if (savedState) {
      const { currentDistance, isCompleted, targetDistance: savedTarget, completionTime } = JSON.parse(savedState);
      setCurrentDistance(currentDistance || 0);
      setIsCompleted(isCompleted || false);
      setCompletionTime(completionTime || null);
      if (savedTarget && savedTarget === getTodaySchedule().distanceValue) {
        setTargetDistance(savedTarget);
      }
    }
  }, []);

  // Save running state
  useEffect(() => {
    const runningState = {
      currentDistance,
      isCompleted,
      targetDistance,
      completionTime,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('running_state', JSON.stringify(runningState));
  }, [currentDistance, isCompleted, targetDistance, completionTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && currentDistance < targetDistance) {
      interval = setInterval(() => {
        setCurrentDistance(prev => {
          const newDistance = prev + 0.1;
          if (newDistance >= targetDistance) {
            setIsRunning(false);
            setIsCompleted(true);
            // Save completion time
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            setCompletionTime(`${hours}:${minutes}`);
            onAddPoints(1); // +1BS for completing the run
            return targetDistance;
          }
          return newDistance;
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, currentDistance, targetDistance, onAddPoints]);

  const startRun = () => {
    setIsRunning(true);
    setIsCompleted(false);
  };

  const pauseRun = () => {
    setIsRunning(false);
  };

  const resetRun = () => {
    setCurrentDistance(0);
    setIsRunning(false);
    setIsCompleted(false);
    setCompletionTime(null);
    setTargetDistance(getTodaySchedule().distanceValue);
    localStorage.removeItem('running_state');
  };

  const addBonusKm = () => {
    setCurrentDistance(prev => prev + 1);
    onAddPoints(1); // +1BS for adding bonus km
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card mb-6"
    >
      <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
        🦇 BATS'RUN INFO 🦇
      </h2>
      
      <div className="text-center mb-6">
        <div className="text-lg text-blue-400 mb-2">
          18:30 POWRÓT → 19:15 BIEG (45 min = 5km)
        </div>
        <div className="text-sm text-gray-400">
          Sobota: 10km • Niedziela: Półmaraton (21km) • ~47km/tydzień
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {[
            { day: 'Pon', distance: '5km', color: 'from-blue-400 to-purple-600' },
            { day: 'Wt', distance: '5km', color: 'from-green-500 to-green-700' },
            { day: 'Śr', distance: '5km', color: 'from-purple-500 to-purple-700' },
            { day: 'Czw', distance: '5km', color: 'from-yellow-500 to-yellow-700' },
            { day: 'Pt', distance: '5km', color: 'from-pink-500 to-pink-700' },
            { day: 'Sob', distance: '10km', color: 'from-orange-500 to-orange-700' },
            { day: 'Nd', distance: '21km', color: 'from-red-500 to-red-700' }
          ].map((schedule, index) => {
            const today = new Date().getDay();
            const isToday = (index + 1) % 7 === today;
            
            return (
              <motion.div
                key={schedule.day}
                whileHover={{ scale: 1.05 }}
                className={`p-3 rounded-lg text-center border-2 ${
                  isToday 
                    ? 'border-blue-400 shadow-lg shadow-blue-400/50 bg-gradient-to-br from-blue-500/20 to-blue-700/20' 
                    : 'border-gray-600'
                }`}
              >
                <div className={`text-sm font-bold ${isToday ? 'text-blue-300' : 'text-gray-300'}`}>
                  {schedule.day}
                </div>
                <div className={`text-xs ${isToday ? 'text-blue-200' : 'text-gray-400'}`}>
                  {schedule.distance}
                </div>
                {isToday && (
                  <div className="text-xs text-blue-400 font-bold mt-1">
                    DZISIAJ
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
        
        {/* Today's Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-lg bg-gradient-to-r ${getTodaySchedule().color} border-2 border-blue-400 shadow-lg`}
        >
          <div className="text-center">
            <div className="text-blue-200">
              Cel: {getTodaySchedule().distance}
              {completionTime && (
                <span className="ml-2">• Ukończono: {completionTime}</span>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Distance Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-green-400 font-bold mb-2">
              Cel dystansu (km):
            </label>
            <input
              type="number"
              value={targetDistance}
              onChange={(e) => setTargetDistance(Math.max(1, parseFloat(e.target.value) || 1))}
              className="input-field w-full"
              min="1"
              step="0.1"
              disabled={isRunning}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={isRunning ? pauseRun : startRun}
              disabled={isCompleted}
              className={`btn-primary flex-1 ${isCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isRunning ? <Pause size={20} /> : <Play size={20} />}
              {isRunning ? 'Pauza' : 'Start'}
            </button>
            <button
              onClick={resetRun}
              className="btn-secondary"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        {/* Progress Display */}
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2">
              {currentDistance.toFixed(1)} / {targetDistance} km
            </div>
            <div className="text-lg text-gray-300">
              Pozostało: {remainingDistance.toFixed(1)} km
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <motion.div
              className="h-full"
              style={{ backgroundColor: '#2864c652' }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Animation for remaining distance */}
          {isRunning && remainingDistance > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="text-2xl font-bold text-yellow-400 animate-pulse">
                {remainingDistance.toFixed(1)} km do celu!
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Completion Animation */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="text-center mt-6"
          >
            <div className="text-6xl mb-4">🎉</div>
            <div className="text-4xl font-bold text-green-400 mb-4 glow-text">
              DID IT!
            </div>
            <div className="text-xl text-blue-400 mb-4">
              +1BS🦇 za przekroczenie celu!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bonus Km Button - Visible after completion */}
      {isCompleted && (
        <div className="text-center mt-6">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addBonusKm}
            className="btn-primary text-lg"
          >
            <Trophy className="inline mr-2" size={24} />
            +1BS nieoczekiwany nadKilometer
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default RunningTracker;
