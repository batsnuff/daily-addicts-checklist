import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import { Calendar, TrendingUp, BarChart3, FileText, Download, RotateCcw } from 'lucide-react';
import RunningTracker from './components/RunningTracker';
import MorningRoutines from './components/MorningRoutines';
import OffToWork from './components/OffToWork';
import WeekdaysMadness from './components/WeekdaysMadness';
import EveningRoutines from './components/EveningRoutines';
import BatsnackSystem from './components/BatsnackSystem';
import AutomaticPenalties from './components/AutomaticPenalties';
import WeeklySchedule from './components/WeeklySchedule';
import WeeklyRandomizer from './components/WeeklyRandomizer';
import NotesTab from './components/NotesTab';
import StatisticsTab from './components/StatisticsTab';
import WeeklyExport from './components/WeeklyExport';
import CalendarSync from './components/CalendarSync';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { Task, DailyData } from './types';
import { saveDailyData, loadDailyData, getCurrentDate } from './utils/storage';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'today' | 'week' | 'notes' | 'statistics' | 'export' | 'calendar'>('today');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [batsnackPoints, setBatsnackPoints] = useState<number>(0);
  const [dailyData, setDailyData] = useState<DailyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [weeklySchedule, setWeeklySchedule] = useState<any>(null);

  const loadWeeklySchedule = () => {
    const saved = localStorage.getItem('weekly_schedule');
    if (saved) {
      setWeeklySchedule(JSON.parse(saved));
    }
  };

  const loadInitialData = useCallback(async () => {
    try {
      const today = getCurrentDate();
      const savedData = await loadDailyData(today);
      
      if (savedData) {
        setDailyData(savedData);
        setTasks(savedData.tasks);
        setBatsnackPoints(savedData.batsnackPoints);
      } else {
        initializeDefaultTasks();
      }
    } catch (error) {
      console.error('Error loading data:', error);
      initializeDefaultTasks();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
    loadWeeklySchedule();
  }, [loadInitialData]);

  const initializeDefaultTasks = () => {
    const defaultTasks: Task[] = [
      // Morning routines (07:00-08:30)
      { id: 1, text: "preWakeUp 06:45-07:05 : Napping + Stretching / Kostka Rubika", category: "morning", priority: "high", completed: false, note: "" },
      { id: 2, text: "Selfcare 07:00-07:15 : Prysznic / Umyj zęby / Ogarnij fejs", category: "morning", priority: "high", completed: false, note: "" },
      { id: 5, text: "preWorkPreparation 07:15-08:15 : Zmiksuj sok / Przygotuj posiłek / Dopakuj resztę", category: "morning", priority: "high", completed: false, note: "" },
      { id: 3, text: "Dopamine Booster 07:00-08:30 : I call it Mindfullness", category: "morning", priority: "medium", completed: false, note: "" },
      { id: 4, text: "KickOff 08:15-08:30 : letting go", category: "morning", priority: "medium", completed: false, note: "" },
      
      
      // Passions Pills (19:30-22:00) - Harmonogram tygodniowy
      { id: 8, text: "💻 Kodowanie", category: "passions", priority: "high", completed: false, note: "" },
      { id: 9, text: "🎵 Muzyka", category: "passions", priority: "high", completed: false, note: "" },
      { id: 10, text: "🖼️ Grafika Cyfrowa", category: "passions", priority: "high", completed: false, note: "" },
      { id: 11, text: "✍️ Pisanie kreatywne", category: "passions", priority: "medium", completed: false, note: "" },
      { id: 12, text: "🎨 Malarstwo/Kolorowanie", category: "passions", priority: "medium", completed: false, note: "" },
      { id: 13, text: "🎭 Wytwórnia/Persony", category: "passions", priority: "medium", completed: false, note: "" },
      
      // Evening routines (22:00-23:15)
      { id: 14, text: "22:00-22:30 - Czytanie komiksów / Serfowanie w sieci (30 min)", category: "evening", priority: "medium", completed: false, note: "" },
      { id: 15, text: "22:30-23:00 - Rozciąganie / Prysznic", category: "evening", priority: "medium", completed: false, note: "" },
      { id: 16, text: "23:00-23:15 - Mantra + Refleksja / Podsumowanie zażycia życia / Wymieszanie kostki", category: "evening", priority: "high", completed: false, note: "" },
    ];
    
    setTasks(defaultTasks);
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const updateTaskNote = (id: number, note: string) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, note }
        : task
    ));
  };

  const addBatsnackPoints = (points: number) => {
    setBatsnackPoints(prev => prev + points);
  };

  const handleScheduleGenerated = (schedule: any) => {
    setWeeklySchedule(schedule);
    localStorage.setItem('weekly_schedule', JSON.stringify(schedule));
    
    // Update Passions Pills tasks based on the new schedule
    updatePassionsPillsTasks(schedule);
  };

  const updatePassionsPillsTasks = (schedule: any) => {
    const dayNames = {
      monday: 'Pon',
      tuesday: 'Wt', 
      wednesday: 'Śr',
      thursday: 'Czw',
      friday: 'Pt',
      saturday: 'Sob',
      sunday: 'Nd'
    };

    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.category === 'passions') {
          // Find the day this task should be active based on the schedule
          const dayKey = Object.keys(schedule).find(day => 
            schedule[day].includes(task.text.split('(')[0].trim())
          );
          
          if (dayKey) {
            const dayName = dayNames[dayKey as keyof typeof dayNames];
            return {
              ...task,
              text: task.text.replace(/\([^)]*\)/, `(${dayName}: 19:30-22:00)`)
            };
          }
        }
        return task;
      })
    );
  };

  const handleWeeklyTaskComplete = (day: string, completed: boolean) => {
    if (completed) {
      addBatsnackPoints(2); // +2BS for completing weekly creative task
    }
  };

  const isSunday = () => {
    return new Date().getDay() === 0; // 0 = Sunday
  };

  const saveCurrentState = async () => {
    const today = getCurrentDate();
    const dataToSave: DailyData = {
      date: today,
      tasks,
      batsnackPoints,
      notes: dailyData?.notes || "",
      generalNote: dailyData?.generalNote || ""
    };
    
    await saveDailyData(dataToSave);
    setDailyData(dataToSave);
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    percentage: tasks.length ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 glow-text">⚙️</div>
          <div className="text-2xl text-green-400">Ładowanie systemu...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-green-400">
      <div className="max-w-7xl mx-auto p-2 sm:p-4 lg:p-6">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 glow-text">
            ⚙️ DAILY ADDICTS' CHECKLIST ⚙️
          </h1>
          <p className="text-pink-500 text-lg sm:text-xl mb-6 px-4">
            ŻYCIE BEZ PARALIŻÓW | w ciągu | ALGORYTMU BEZ CHAOSU
          </p>
          
          {/* Stats Bar */}
          <div className="responsive-grid max-w-3xl mx-auto mb-6 px-4">
            <div className="card">
              <div className="text-3xl font-bold text-white">{stats.completed}/{stats.total}</div>
              <div className="text-sm text-green-100">Ukończone dzisiaj</div>
            </div>
            <div className="card">
              <div className="text-3xl font-bold text-white">{stats.percentage}%</div>
              <div className="text-sm text-purple-100">Postęp</div>
            </div>
            <div className="card">
              <div className="text-3xl font-bold text-white">{batsnackPoints}</div>
              <div className="text-sm text-cyan-100">BS🦇</div>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="mb-8 px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 justify-center">
            <button
              onClick={() => setCurrentView('today')}
              className={`px-2 sm:px-4 py-2 rounded-lg font-bold transition-all text-xs sm:text-sm ${
                currentView === 'today'
                  ? 'btn-primary'
                  : 'btn-secondary'
              }`}
            >
              <Calendar className="inline mr-1" size={14} />
              <span className="hidden sm:inline">DZISIAJ</span>
              <span className="sm:hidden">DZIS</span>
            </button>
            <button
              onClick={() => setCurrentView('week')}
              className={`px-2 sm:px-4 py-2 rounded-lg font-bold transition-all text-xs sm:text-sm ${
                currentView === 'week'
                  ? 'btn-primary'
                  : 'btn-secondary'
              }`}
            >
              <TrendingUp className="inline mr-1" size={14} />
              <span className="hidden sm:inline">TYDZIEŃ</span>
              <span className="sm:hidden">TYDZ</span>
            </button>
            <button
              onClick={() => setCurrentView('notes')}
              className={`px-2 sm:px-4 py-2 rounded-lg font-bold transition-all text-xs sm:text-sm ${
                currentView === 'notes'
                  ? 'btn-primary'
                  : 'btn-secondary'
              }`}
            >
              <FileText className="inline mr-1" size={14} />
              <span className="hidden sm:inline">NOTATKI</span>
              <span className="sm:hidden">NOT</span>
            </button>
            <button
              onClick={() => setCurrentView('statistics')}
              className={`px-2 sm:px-4 py-2 rounded-lg font-bold transition-all text-xs sm:text-sm ${
                currentView === 'statistics'
                  ? 'btn-primary'
                  : 'btn-secondary'
              }`}
            >
              <BarChart3 className="inline mr-1" size={14} />
              <span className="hidden sm:inline">STATYSTYKI</span>
              <span className="sm:hidden">STAT</span>
            </button>
            <button
              onClick={() => setCurrentView('export')}
              className={`px-2 sm:px-4 py-2 rounded-lg font-bold transition-all text-xs sm:text-sm ${
                currentView === 'export'
                  ? 'btn-primary'
                  : 'btn-secondary'
              }`}
            >
              <Download className="inline mr-1" size={14} />
              <span className="hidden sm:inline">EKSPORT</span>
              <span className="sm:hidden">EXP</span>
            </button>
            <button
              onClick={() => setCurrentView('calendar')}
              className={`px-2 sm:px-4 py-2 rounded-lg font-bold transition-all text-xs sm:text-sm ${
                currentView === 'calendar'
                  ? 'btn-primary'
                  : 'btn-secondary'
              }`}
            >
              <RotateCcw className="inline mr-1" size={14} />
              <span className="hidden sm:inline">KALENDARZ</span>
              <span className="sm:hidden">KAL</span>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="text-center mb-6">
          <button
            onClick={saveCurrentState}
            className="btn-primary"
          >
            💾 Zapisz Stan
          </button>
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {currentView === 'today' && (
            <motion.div
              key="today"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <BatsnackSystem points={batsnackPoints} onAddPoints={addBatsnackPoints} />
              <AutomaticPenalties 
                tasks={tasks} 
                onAddPoints={addBatsnackPoints}
              />
              <RunningTracker onAddPoints={addBatsnackPoints} />
              <MorningRoutines 
                tasks={tasks.filter(t => t.category === 'morning')} 
                onToggleTask={toggleTask}
                onUpdateNote={updateTaskNote}
              />
              <OffToWork />
              <WeekdaysMadness />
              <EveningRoutines 
                tasks={tasks.filter(t => t.category === 'evening')} 
                onToggleTask={toggleTask}
                onUpdateNote={updateTaskNote}
              />
            </motion.div>
          )}

          {currentView === 'week' && (
            <motion.div
              key="week"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {isSunday() ? (
                <WeeklyRandomizer onScheduleGenerated={handleScheduleGenerated} />
              ) : (
                weeklySchedule ? (
                  <WeeklySchedule 
                    schedule={weeklySchedule} 
                    onTaskComplete={handleWeeklyTaskComplete}
                  />
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card text-center"
                  >
                    <div className="text-6xl mb-4">📅</div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Brak harmonogramu tygodniowego
                    </h3>
                    <p className="text-gray-300 mb-4">
                      Wróć w niedzielę aby wylosować nowy harmonogram kreatywny
                    </p>
                    <div className="text-sm text-gray-400">
                      Maszyna losująca dostępna tylko w niedziele
                    </div>
                  </motion.div>
                )
              )}
            </motion.div>
          )}

          {currentView === 'notes' && (
            <motion.div
              key="notes"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <NotesTab 
                tasks={tasks}
                dailyData={dailyData}
                onUpdateNote={updateTaskNote}
              />
            </motion.div>
          )}

          {currentView === 'statistics' && (
            <motion.div
              key="statistics"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <StatisticsTab />
            </motion.div>
          )}

          {currentView === 'export' && (
            <motion.div
              key="export"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <WeeklyExport />
            </motion.div>
          )}

          {currentView === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <CalendarSync />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-12 text-center text-green-400 italic">
          <p className="text-xl mb-2 glow-text">
            "Dyscyplina zaczyna się tam gdzie kończy się przyjemność wyhamowująca motywacje"
          </p>
          <p className="text-lg text-cyan-400">⚙️ Algorytm | Ciąg | Pewność ⚙️</p>
        </div>
      </div>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
};

export default App;
