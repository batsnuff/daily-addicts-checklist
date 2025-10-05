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
