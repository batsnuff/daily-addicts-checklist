import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Edit3, Zap } from 'lucide-react';
import { Task } from '../types';

interface PassionsPillsProps {
  tasks: Task[];
  onToggleTask: (id: number) => void;
  onUpdateNote: (id: number, note: string) => void;
  onAddPoints: (points: number) => void;
}

const PassionsPills: React.FC<PassionsPillsProps> = ({ tasks, onToggleTask, onUpdateNote, onAddPoints }) => {
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());
  const [editingNote, setEditingNote] = useState<number | null>(null);
  const [tempNote, setTempNote] = useState('');

  const toggleExpanded = (taskId: number) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const startEditingNote = (taskId: number, currentNote: string) => {
    setEditingNote(taskId);
    setTempNote(currentNote);
  };

  const saveNote = (taskId: number) => {
    onUpdateNote(taskId, tempNote);
    setEditingNote(null);
    setTempNote('');
  };

  const cancelEditing = () => {
    setEditingNote(null);
    setTempNote('');
  };

  const handleTaskToggle = (taskId: number) => {
    onToggleTask(taskId);
    
    // Add points based on task type
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      // This is a completion, add points
      let points = 0;
      switch (task.text.toLowerCase()) {
        case 'kodowanie':
        case 'muzyka':
        case 'malarstwo/grafika':
        case 'pisanie':
        case 'studio/produkcja':
          points = 2; // Creative work unrelated to Miloverse
          break;
        default:
          points = 1; // Default bonus
          break;
      }
      onAddPoints(points);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'from-purple-500 to-purple-700 border-purple-400';
      case 'medium': return 'from-blue-500 to-blue-700 border-blue-400';
      case 'low': return 'from-green-500 to-green-700 border-green-400';
      default: return 'from-gray-500 to-gray-700 border-gray-400';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '💊';
      case 'medium': return '💉';
      case 'low': return '💊';
      default: return '⚪';
    }
  };

  const getTaskIcon = (taskText: string) => {
    const text = taskText.toLowerCase();
    if (text.includes('kodowanie')) return '💻';
    if (text.includes('muzyka')) return '🎵';
    if (text.includes('malarstwo') || text.includes('grafika')) return '🎨';
    if (text.includes('pisanie')) return '✍️';
    if (text.includes('studio') || text.includes('produkcja')) return '🎙️';
    return '💊';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card mb-6"
    >
      <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
        💊 PASSIONS PILLS 💊
      </h2>
      
      <div className="text-center mb-6">
        <div className="text-lg text-purple-400 mb-2">
          BLOKI KREATYWNE (19:30-22:00) • Harmonogram Tygodniowy
        </div>
        <div className="text-sm text-gray-400">
          💻 Kodowanie: 4.5h/tydzień • 🎵 Muzyka: 4h/tydzień • 🖼️ Grafika: 3h/tydzień
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => {
          const isExpanded = expandedTasks.has(task.id);
          const isEditing = editingNote === task.id;
          const hasNote = task.note.trim().length > 0;

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
                  onClick={() => handleTaskToggle(task.id)}
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
                    <span className={`text-white font-bold text-lg ${
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
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-1 mt-2"
                    >
                      <Zap size={16} className="text-yellow-400" />
                      <span className="text-sm text-yellow-400 font-bold">
                        +2BS🦇 za kreatywność!
                      </span>
                    </motion.div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEditingNote(task.id, task.note)}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                    title="Edytuj notatkę"
                  >
                    <Edit3 size={16} className="text-white" />
                  </button>
                  
                  <button
                    onClick={() => toggleExpanded(task.id)}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUp size={20} className="text-white" />
                    ) : (
                      <ChevronDown size={20} className="text-white" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-white border-opacity-20"
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <label className="block text-white font-bold">
                        Notatka (max 300 znaków):
                      </label>
                      <textarea
                        value={tempNote}
                        onChange={(e) => setTempNote(e.target.value)}
                        maxLength={300}
                        className="input-field w-full h-20 resize-none"
                        placeholder="Dodaj notatkę do tego zadania..."
                      />
                      <div className="text-sm text-gray-300">
                        {tempNote.length}/300 znaków
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveNote(task.id)}
                          className="btn-primary text-sm"
                        >
                          Zapisz
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="btn-secondary text-sm"
                        >
                          Anuluj
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-white">
                        <strong>Priorytet:</strong> {task.priority.toUpperCase()}
                      </div>
                      <div className="text-white">
                        <strong>Kategoria:</strong> {task.category}
                      </div>
                      <div className="text-purple-300">
                        <strong>Punkty za ukończenie:</strong> +2BS🦇
                      </div>
                      {hasNote && (
                        <div className="text-gray-200">
                          <strong>Notatka:</strong> {task.note}
                        </div>
                      )}
                      {!hasNote && (
                        <div className="text-gray-400 italic">
                          Brak notatki - kliknij ikonę edycji aby dodać
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <div className="text-sm text-gray-400">
          💊 Passions Pills - Twoje kreatywne uzależnienia • Każde ukończenie = +2BS🦇
        </div>
      </div>
    </motion.div>
  );
};

export default PassionsPills;
