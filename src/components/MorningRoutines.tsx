import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';
import { Task } from '../types';

interface MorningRoutinesProps {
  tasks: Task[];
  onToggleTask: (id: number) => void;
  onUpdateNote: (id: number, note: string) => void;
}

const MorningRoutines: React.FC<MorningRoutinesProps> = ({ tasks, onToggleTask, onUpdateNote }) => {

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'from-red-500 to-red-700 border-red-400';
      case 'medium': return 'from-yellow-500 to-yellow-700 border-yellow-400';
      case 'low': return 'from-green-500 to-green-700 border-green-400';
      default: return 'from-gray-500 to-gray-700 border-gray-400';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card mb-6"
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
        🌅 EARLY VAMP (07:00-08:30)
      </h2>
      

      <div className="space-y-3">
        {tasks.map((task) => {
          const hasNote = task.note && task.note.trim() !== '';

          return (
            <motion.div
              key={task.id}
              whileHover={{ scale: 1.02 }}
              className={`bg-gradient-to-r ${getPriorityColor(task.priority)} rounded-lg p-4 border-2 shadow-lg transition-all ${
                task.completed ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onToggleTask(task.id)}
                  className="flex-shrink-0 hover:scale-110 transition-transform"
                >
                  {task.completed ? (
                    <CheckCircle2 className="text-white" size={28} />
                  ) : (
                    <Circle className="text-white" size={28} />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{getPriorityIcon(task.priority)}</span>
                    <span className={`text-white font-bold text-base sm:text-lg ${
                      task.completed ? 'line-through' : ''
                    }`}>
                      {task.text}
                    </span>
                  </div>
                  
                  {hasNote && (
                    <div className="text-sm text-gray-200 mt-1">
                      📝 {task.note.length > 50 ? `${task.note.substring(0, 50)}...` : task.note}
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

export default MorningRoutines;
