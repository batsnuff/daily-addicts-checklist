import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';
import { Task } from '../types';

interface PassionsRoutinesProps {
  tasks: Task[];
  onToggleTask: (id: number) => void;
  onUpdateNote: (id: number, note: string) => void;
}

const PassionsRoutines: React.FC<PassionsRoutinesProps> = ({ tasks, onToggleTask, onUpdateNote }) => {

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

  if (tasks.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-6 shadow-lg">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
            <span className="text-2xl">🎨</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Passions Pills</h2>
            <p className="text-purple-100">Dzisiejsza aktywność kreatywna (19:30-22:00)</p>
          </div>
        </div>

        <div className="space-y-3">
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => !task.completed && onToggleTask(task.id)}
              className={`bg-white bg-opacity-10 rounded-lg p-4 border-2 transition-all duration-200 ${
                task.completed 
                  ? 'border-green-400 bg-green-500 bg-opacity-20' 
                  : 'border-white border-opacity-30 hover:border-opacity-50 cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="transition-colors duration-200 cursor-pointer"
                    onClick={(e) => {
                      if (task.completed) {
                        e.stopPropagation();
                        onToggleTask(task.id);
                      }
                    }}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-400" />
                    ) : (
                      <Circle className="w-6 h-6 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getPriorityIcon(task.priority)}</span>
                      <span className={`text-lg font-medium ${
                        task.completed ? 'line-through text-gray-300' : 'text-white'
                      }`}>
                        {task.text}
                      </span>
                    </div>
                    
                    {task.note && (
                      <div className="mt-2 p-2 bg-black bg-opacity-20 rounded text-sm text-gray-200">
                        <span className="font-medium">Notatka:</span> {task.note}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.priority === 'high' ? 'bg-red-500 text-white' :
                    task.priority === 'medium' ? 'bg-yellow-500 text-black' :
                    'bg-green-500 text-white'
                  }`}>
                    {task.priority === 'high' ? 'Wysoki' : 
                     task.priority === 'medium' ? 'Średni' : 'Niski'}
                  </span>
                </div>
              </div>
              
              {task.completed && (
                <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                  <textarea
                    value={task.note}
                    onChange={(e) => onUpdateNote(task.id, e.target.value)}
                    placeholder="Dodaj notatkę o ukończonej aktywności kreatywnej..."
                    className="w-full p-2 bg-black bg-opacity-20 border border-white border-opacity-30 rounded text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                    rows={2}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PassionsRoutines;
