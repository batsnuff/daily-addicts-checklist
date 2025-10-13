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
              onClick={() => !task.completed && onToggleTask(task.id)}
              className={`bg-gradient-to-r ${getPriorityColor(task.priority)} rounded-lg p-4 border-2 shadow-lg transition-all ${
                task.completed ? 'opacity-60' : 'cursor-pointer'
              }`}
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
                  
                  {task.completed && (
                    <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                      <textarea
                        value={task.note}
                        onChange={(e) => onUpdateNote(task.id, e.target.value)}
                        placeholder="Dodaj notatkę o ukończonym zadaniu..."
                        className="w-full p-2 bg-black bg-opacity-20 border border-white border-opacity-30 rounded text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 text-sm"
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

export default MorningRoutines;
