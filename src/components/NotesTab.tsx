import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Edit3, Save, X, Calendar, Clock } from 'lucide-react';
import { Task, DailyData } from '../types';

interface NotesTabProps {
  tasks: Task[];
  dailyData: DailyData | null;
  onUpdateNote: (id: number, note: string) => void;
}

const NotesTab: React.FC<NotesTabProps> = ({ tasks, dailyData, onUpdateNote }) => {
  const [generalNote, setGeneralNote] = useState(dailyData?.generalNote || '');
  const [isEditingGeneral, setIsEditingGeneral] = useState(false);
  const [tempGeneralNote, setTempGeneralNote] = useState('');

  useEffect(() => {
    if (dailyData?.generalNote) {
      setGeneralNote(dailyData.generalNote);
    }
  }, [dailyData]);

  const startEditingGeneral = () => {
    setIsEditingGeneral(true);
    setTempGeneralNote(generalNote);
  };

  const saveGeneralNote = () => {
    setGeneralNote(tempGeneralNote);
    setIsEditingGeneral(false);
    // TODO: Save to daily data
  };

  const cancelEditingGeneral = () => {
    setIsEditingGeneral(false);
    setTempGeneralNote('');
  };

  const tasksWithNotes = tasks.filter(task => task.note.trim().length > 0);
  const eveningReflection = tasks.find(task => task.text.toLowerCase().includes('refleksja'));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <FileText className="text-blue-400" size={40} />
          ZAKŁADKA NOTATEK
        </h2>
        <p className="text-lg text-gray-300">
          Automatyczne notatki z checklisty + dzienna notatka generalna
        </p>
      </div>

      {/* General Daily Note */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="text-yellow-400" size={24} />
            NOTATKA GENERALNA
          </h3>
          {!isEditingGeneral && (
            <button
              onClick={startEditingGeneral}
              className="btn-secondary text-sm"
            >
              <Edit3 size={16} className="inline mr-1" />
              Edytuj
            </button>
          )}
        </div>

        {isEditingGeneral ? (
          <div className="space-y-4">
            <div>
              <label className="block text-white font-bold mb-2">
                Dzienna notatka generalna (max 1410 znaków):
              </label>
              <textarea
                value={tempGeneralNote}
                onChange={(e) => setTempGeneralNote(e.target.value)}
                maxLength={1410}
                className="input-field w-full h-32 resize-none"
                placeholder="Dodaj swoją dzienną notatkę generalną..."
              />
              <div className="text-sm text-gray-300 mt-1">
                {tempGeneralNote.length}/1410 znaków
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={saveGeneralNote}
                className="btn-primary"
              >
                <Save size={16} className="inline mr-1" />
                Zapisz
              </button>
              <button
                onClick={cancelEditingGeneral}
                className="btn-secondary"
              >
                <X size={16} className="inline mr-1" />
                Anuluj
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-black bg-opacity-30 rounded-lg p-4">
            {generalNote ? (
              <div className="text-gray-200 whitespace-pre-wrap">
                {generalNote}
              </div>
            ) : (
              <div className="text-gray-400 italic">
                Brak notatki generalnej - kliknij "Edytuj" aby dodać
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Evening Reflection (666 characters) */}
      {eveningReflection && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="text-purple-400" size={24} />
            WIECZORNA REFLEKSJA
          </h3>
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-lg p-4 border border-purple-500">
            <div className="text-sm text-purple-300 mb-2">
              Specjalna notatka (max 666 znaków):
            </div>
            <textarea
              value={eveningReflection.note}
              onChange={(e) => onUpdateNote(eveningReflection.id, e.target.value)}
              placeholder="Dodaj notatkę do wieczornej refleksji..."
              className="w-full p-3 bg-black bg-opacity-20 border border-purple-400 rounded text-white placeholder-gray-400 focus:outline-none focus:border-purple-300 focus:ring-1 focus:ring-purple-300 resize-none"
              rows={4}
              maxLength={666}
            />
            <div className="text-xs text-purple-300 mt-1 text-right">
              {eveningReflection.note.length}/666 znaków
            </div>
          </div>
        </motion.div>
      )}

      {/* Task Notes */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="card"
      >
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <FileText className="text-green-400" size={24} />
          NOTATKI Z ZADAŃ
        </h3>
        
        {tasksWithNotes.length > 0 ? (
          <div className="space-y-4">
            {tasksWithNotes.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black bg-opacity-30 rounded-lg p-4 border-l-4 border-green-400"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-400 font-bold">
                    {task.completed ? '✅' : '⭕'}
                  </span>
                  <span className="text-white font-bold">
                    {task.text}
                  </span>
                  <span className="text-sm text-gray-400">
                    ({task.category})
                  </span>
                </div>
                <div className="text-gray-200 whitespace-pre-wrap">
                  {task.note}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  {task.note.length}/300 znaków
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📝</div>
            <div className="text-gray-400 text-lg">
              Brak notatek z zadań
            </div>
            <div className="text-gray-500 text-sm mt-2">
              Dodaj notatki do zadań w głównej zakładce
            </div>
          </div>
        )}
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card text-center"
      >
        <h3 className="text-xl font-bold text-white mb-4">
          PODSUMOWANIE NOTATEK
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-black bg-opacity-30 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-400">
              {tasksWithNotes.length}
            </div>
            <div className="text-gray-300">Zadania z notatkami</div>
          </div>
          <div className="bg-black bg-opacity-30 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-400">
              {generalNote ? '1' : '0'}
            </div>
            <div className="text-gray-300">Notatka generalna</div>
          </div>
          <div className="bg-black bg-opacity-30 rounded-lg p-3">
            <div className="text-2xl font-bold text-purple-400">
              {eveningReflection?.note ? '1' : '0'}
            </div>
            <div className="text-gray-300">Wieczorna refleksja</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NotesTab;
