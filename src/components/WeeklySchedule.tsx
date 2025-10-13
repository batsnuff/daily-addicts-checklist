import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Target, CheckCircle2 } from 'lucide-react';

interface WeeklyScheduleProps {
  schedule: Record<string, string>;
  onTaskComplete: (day: string, completed: boolean) => void;
}

const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({ schedule, onTaskComplete }) => {
  const [completedDays, setCompletedDays] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load completed days from localStorage
    const saved = localStorage.getItem('weekly_completed_days');
    if (saved) {
      setCompletedDays(new Set(JSON.parse(saved)));
    }
  }, []);

  const handleDayToggle = (day: string) => {
    const newCompleted = new Set(completedDays);
    if (newCompleted.has(day)) {
      newCompleted.delete(day);
    } else {
      newCompleted.add(day);
    }
    setCompletedDays(newCompleted);
    localStorage.setItem('weekly_completed_days', JSON.stringify(Array.from(newCompleted)));
    onTaskComplete(day, newCompleted.has(day));
  };


  const getDayName = (day: string) => {
    const names = {
      monday: 'Poniedziałek',
      tuesday: 'Wtorek',
      wednesday: 'Środa',
      thursday: 'Czwartek',
      friday: 'Piątek',
      saturday: 'Sobota',
      sunday: 'Niedziela'
    };
    return names[day as keyof typeof names] || day;
  };

  const getCurrentDay = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date().getDay()];
  };

  const isToday = (day: string) => {
    return day === getCurrentDay();
  };

  const completedCount = completedDays.size;
  const totalDays = Object.keys(schedule).length;
  const progressPercentage = (completedCount / totalDays) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card mb-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <Calendar className="text-blue-400" size={32} />
          HARMONOGRAM TYGODNIOWY
        </h2>
        <p className="text-lg text-blue-400 mb-2">
          Ustalony plan kreatywny na bieżący tydzień
        </p>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Postęp tygodniowy</span>
            <span className="text-sm text-blue-400 font-bold">
              {completedCount}/{totalDays} dni
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(schedule).map(([day, activity], index) => {
          const isCompleted = completedDays.has(day);
          const isCurrentDay = isToday(day);
          
          return (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                isCurrentDay 
                  ? 'border-blue-400 shadow-lg shadow-blue-400/50 bg-gradient-to-br from-blue-500/20 to-blue-700/20'
                  : 'border-white/20'
              } ${isCompleted ? 'opacity-60' : ''}`}
              onClick={() => handleDayToggle(day)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {isCompleted ? (
                    <CheckCircle2 className="text-green-400" size={20} />
                  ) : (
                    <Target className="text-gray-400" size={20} />
                  )}
                  <span className="font-bold text-white">
                    {getDayName(day)}
                  </span>
                </div>
                {isCurrentDay && (
                  <span className="text-xs text-blue-400 font-bold bg-blue-400/20 px-2 py-1 rounded">
                    DZISIAJ
                  </span>
                )}
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-white mb-2">
                  {activity}
                </div>
                <div className="flex items-center justify-center gap-1 text-sm text-gray-300">
                  <Clock size={14} />
                  <span>19:30-22:00</span>
                </div>
              </div>
              
              {isCompleted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-3 text-center"
                >
                  <div className="text-green-400 font-bold text-sm">
                    ✅ UKOŃCZONE
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-900/30 to-blue-900/30 rounded-lg border border-blue-500">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-300 mb-2">
            📊 PODSUMOWANIE TYGODNIA
          </div>
          <div className="text-sm text-blue-200">
            Ukończono {completedCount} z {totalDays} dni • {progressPercentage.toFixed(0)}% postępu
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeeklySchedule;
