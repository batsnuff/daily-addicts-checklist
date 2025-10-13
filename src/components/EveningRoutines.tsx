import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';
import { Task } from '../types';

interface EveningRoutinesProps {
  tasks: Task[];
  onToggleTask: (id: number) => void;
  onUpdateNote: (id: number, note: string) => void;
}

const EveningRoutines: React.FC<EveningRoutinesProps> = ({ tasks, onToggleTask, onUpdateNote }) => {

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'from-blue-500 to-blue-700 border-blue-400';
      case 'medium': return 'from-indigo-500 to-indigo-700 border-indigo-400';
      case 'low': return 'from-purple-500 to-purple-700 border-purple-400';
      default: return 'from-gray-500 to-gray-700 border-gray-400';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🌙';
      case 'medium': return '🌃';
      case 'low': return '🌌';
      default: return '⚪';
    }
  };

  const getTaskIcon = (taskText: string) => {
    const text = taskText.toLowerCase();
    if (text.includes('czytanie') || text.includes('komiksy')) return '📚';
    if (text.includes('gaming') || text.includes('rozciąganie')) return '🎮';
    if (text.includes('kąpiel')) return '🛁';
    if (text.includes('mantra') || text.includes('refleksja')) return '🕉️';
    return '🌙';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card mb-6"
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
        🌙 LateNightBats (22:00-23:15)
      </h2>
      

      <div className="space-y-3">
        {tasks.map((task) => {
          const hasNote = task.note && task.note.trim() !== '';
          const isComicReading = task.text.includes('22:00-22:30 - Czytanie komiksów');
          const isStretching = task.text.includes('22:30-23:00 - Rozciąganie');
          const isMantra = task.text.includes('23:00-23:15 - Mantra');
          const isWebToonsReading = task.text.includes('21:30-22:30 - Czytanie WebToons');
          const useCustomGradient = isComicReading || isStretching || isMantra || isWebToonsReading;

          return (
            <motion.div
              key={task.id}
              whileHover={{ scale: 1.02, filter: 'brightness(1.2)' }}
              onClick={() => !task.completed && onToggleTask(task.id)}
              className={`rounded-lg p-4 border-2 shadow-lg transition-all ${
                task.completed ? 'opacity-60' : 'cursor-pointer'
              } ${useCustomGradient ? '' : `bg-gradient-to-r ${getPriorityColor(task.priority)}`}`}
              style={useCustomGradient ? {
                background: 'linear-gradient(to right, #142a846e, #41243c)',
                borderColor: '#41243c'
              } : undefined}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="flex-shrink-0 cursor-pointer"
                  onClick={(e) => {
                    if (task.completed) {
                      e.stopPropagation();
                      onToggleTask(task.id);
                    }
                  }}
                >
                  {task.completed ? (
                    <CheckCircle2 className="text-white" size={28} />
                  ) : (
                    <Circle className="text-white" size={28} />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{getTaskIcon(task.text)}</span>
                    <span className={`text-white font-bold text-base sm:text-lg ${
                      task.completed ? 'line-through' : ''
                    }`}>
                      {task.text}
                    </span>
                    <span className="text-xl">{getPriorityIcon(task.priority)}</span>
                  </div>
                  
                  {hasNote && (
                    <div className="text-sm text-gray-200 mt-1">
                      📝 {task.note.length > 50 ? `${task.note.substring(0, 50)}...` : task.note}
                    </div>
                  )}
                  
                  {task.completed && (
                    <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                      <textarea
                        value={task.note}
                        onChange={(e) => onUpdateNote(task.id, e.target.value)}
                        placeholder="Dodaj notatkę o ukończonym zadaniu..."
                        className="w-full p-2 bg-black bg-opacity-20 border border-white border-opacity-30 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-sm"
                        rows={2}
                      />
                    </div>
                  )}
                </div>

              </div>

            </motion.div>
          );
        })}
      </div>

    </motion.div>
  );
};

export default EveningRoutines;
