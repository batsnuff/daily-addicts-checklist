import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import { Calendar, TrendingUp, BarChart3, FileText, Download, RotateCcw, Database } from 'lucide-react';
import RunningTracker from './components/RunningTracker';
import MorningRoutines from './components/MorningRoutines';
import PassionsRoutines from './components/PassionsRoutines';
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
import DatabaseSettings from './components/DatabaseSettings';
import SyncStatus from './components/SyncStatus';
import SaveStatusPopup from './components/SaveStatusPopup';
import SaveIndicator from './components/SaveIndicator';
import Toast from './components/Toast';
import SaveProgress from './components/SaveProgress';
import FloatingSaveButton from './components/FloatingSaveButton';
import HelpModal from './components/HelpModal';
import KeyboardShortcutsIndicator from './components/KeyboardShortcutsIndicator';
import SaveStatusBadge from './components/SaveStatusBadge';
import SaveAnimation from './components/SaveAnimation';
import SaveConfirmationDialog from './components/SaveConfirmationDialog';
import SaveHistory from './components/SaveHistory';
import SaveStatistics from './components/SaveStatistics';
import SaveSettings from './components/SaveSettings';
import SaveNotification from './components/SaveNotification';
import SaveProgressBar from './components/SaveProgressBar';
import SaveStatusSummary from './components/SaveStatusSummary';
import SaveStatusDashboard from './components/SaveStatusDashboard';
import SaveStatusOverview from './components/SaveStatusOverview';
import SaveStatusMonitor from './components/SaveStatusMonitor';
import SaveStatusAnalytics from './components/SaveStatusAnalytics';
import SaveStatusInsights from './components/SaveStatusInsights';
import SaveErrorHandler from './components/SaveErrorHandler';
import SaveStatusDropdown from './components/SaveStatusDropdown';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { Task, DailyData } from './types';
import { saveDailyData, loadDailyData, getCurrentDate } from './utils/storage';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'today' | 'week' | 'notes' | 'statistics' | 'export' | 'calendar' | 'database'>('today');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [batsnackPoints, setBatsnackPoints] = useState<number>(0);
  const [dailyData, setDailyData] = useState<DailyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [weeklySchedule, setWeeklySchedule] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState<string>('');
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [toast, setToast] = useState<{ isVisible: boolean; type: 'success' | 'error' | 'info'; message: string }>({
    isVisible: false,
    type: 'info',
    message: ''
  });
  const [saveProgress, setSaveProgress] = useState<{ isVisible: boolean; progress: number; message: string }>({
    isVisible: false,
    progress: 0,
    message: ''
  });
  const [saveProgressBar, setSaveProgressBar] = useState<{ isVisible: boolean; progress: number; status: 'idle' | 'saving' | 'saved' | 'error'; message: string }>({
    isVisible: false,
    progress: 0,
    status: 'idle',
    message: ''
  });
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ isOnline: boolean; pendingSync: number }>({
    isOnline: navigator.onLine,
    pendingSync: 0
  });
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [showSaveAnimation, setShowSaveAnimation] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [showSaveHistory, setShowSaveHistory] = useState(false);
  const [showSaveStatistics, setShowSaveStatistics] = useState(false);
  const [showSaveSettings, setShowSaveSettings] = useState(false);
  const [showSaveStatusSummary, setShowSaveStatusSummary] = useState(false);
  const [showSaveStatusDashboard, setShowSaveStatusDashboard] = useState(false);
  const [showSaveStatusOverview, setShowSaveStatusOverview] = useState(false);
  const [showSaveStatusMonitor, setShowSaveStatusMonitor] = useState(false);
  const [showSaveStatusAnalytics, setShowSaveStatusAnalytics] = useState(false);
  const [showSaveStatusInsights, setShowSaveStatusInsights] = useState(false);
  const [saveError, setSaveError] = useState<{
    isVisible: boolean;
    error: string;
    lastAttempt?: Date;
  }>({
    isVisible: false,
    error: '',
    lastAttempt: undefined
  });
  const [saveNotification, setSaveNotification] = useState<{
    isVisible: boolean;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
  }>({
    isVisible: false,
    type: 'info',
    title: '',
    message: ''
  });

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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [autoSaveTimeout]);

  const saveCurrentState = async () => {
    // Show confirmation dialog first
    setShowSaveConfirmation(true);
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onSave: saveCurrentState,
    onToggleView: (view) => setCurrentView(view as any)
  });

  // Help modal keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '?' || (event.shiftKey && event.key === '/')) {
        event.preventDefault();
        setShowHelpModal(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update sync status
  useEffect(() => {
    const updateSyncStatus = async () => {
      try {
        const { getSyncStatus } = await import('./utils/storage');
        const status = await getSyncStatus();
        setSyncStatus(status);
      } catch (error) {
        console.error('Error getting sync status:', error);
      }
    };

    updateSyncStatus();
    const interval = setInterval(updateSyncStatus, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const initializeDefaultTasks = () => {
    const defaultTasks: Task[] = [
      // Morning routines (07:00-08:30)
      { id: 1, text: "Dopamine Booster 07:00-08:30 : I call it Mindfullness", category: "morning", priority: "low", completed: false, note: "" },
      { id: 2, text: "preWakeUp 06:45-07:05 : Napping + Stretching / Kostka Rubika", category: "morning", priority: "medium", completed: false, note: "" },
      { id: 3, text: "Selfcare 07:00-07:15 : Prysznic / Umyj zęby / Ogarnij fejs", category: "morning", priority: "high", completed: false, note: "" },
      { id: 4, text: "preWorkPreparation 07:15-08:15 : Zmiksuj sok / Przygotuj posiłek / Dopakuj resztę", category: "morning", priority: "high", completed: false, note: "" },
      { id: 5, text: "KickOff 08:15-08:30 : lettin' go", category: "morning", priority: "low", completed: false, note: "" },
      
      // Passions Pills (19:30-22:00) - Harmonogram tygodniowy
      { id: 6, text: "🧠 Rozwój mentalny i duchowy / Improwizacja", category: "passions", priority: "high", completed: false, note: "" },
      { id: 7, text: "🎓 Kursy / Szkolenia / Materiały edukacyjne", category: "passions", priority: "high", completed: false, note: "" },
      { id: 8, text: "💻 Kodowanie", category: "passions", priority: "high", completed: false, note: "" },
      { id: 9, text: "🎵 Muzyka - koncepcyjne segregowanie tekstów i idei / komponowanie / RemixLive", category: "passions", priority: "high", completed: false, note: "" },
      { id: 10, text: "🖼️ Grafika Cyfrowa", category: "passions", priority: "high", completed: false, note: "" },
      { id: 11, text: "✍️ Pisanie kreatywne", category: "passions", priority: "medium", completed: false, note: "" },
      { id: 12, text: "🎨 Malowanie / Kolorowanie", category: "passions", priority: "medium", completed: false, note: "" },
      { id: 13, text: "🎭 uYEAHbunaBanda i ich osobista marka", category: "passions", priority: "medium", completed: false, note: "" },
      
      // Evening routines (22:00-23:15)
      { id: 15, text: "21:30-22:30 - Czytanie WebToons / Serfowanie sieciowe (30 min)", category: "evening", priority: "medium", completed: false, note: "" },
      { id: 16, text: "22:30-23:00 - Rozciąganie / Prysznic", category: "evening", priority: "medium", completed: false, note: "" },
      { id: 17, text: "23:00-23:15 - Mantra + Refleksja / Podsumowanie użycia życia / Wymieszanie kostki", category: "evening", priority: "high", completed: false, note: "" },
    ];
    
    setTasks(defaultTasks);
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, completed: !task.completed }
        : task
    ));
    
    // Auto-save after task toggle
    autoSave();
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
    
    // Auto-save after points change
    autoSave();
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

  const handleSaveConfirm = async () => {
    setShowSaveConfirmation(false);
    setSaveStatus('saving');
    setSaveMessage('Zapisywanie danych...');
    setSaveProgressBar({
      isVisible: true,
      progress: 0,
      status: 'saving',
      message: 'Zapisywanie danych...'
    });
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setSaveProgressBar(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90)
        }));
      }, 200);
      
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
      
      clearInterval(progressInterval);
      setSaveProgressBar(prev => ({ ...prev, progress: 100, status: 'saved' }));
      
      setSaveStatus('success');
      setSaveMessage('Dane zostały pomyślnie zapisane!');
      setLastSaveTime(new Date());
      
      // Show popup and animation AFTER sync is complete
      setShowSavePopup(true);
      setShowSaveAnimation(true);
      
      showSaveNotification('success', 'Zapisano!', 'Dane zostały pomyślnie zapisane i zsynchronizowane z chmurą.');
      
      // Hide progress bar after success
      setTimeout(() => {
        setSaveProgressBar({ isVisible: false, progress: 0, status: 'idle', message: '' });
      }, 2000);
      
      // Auto-close popup after success
      setTimeout(() => {
        setShowSavePopup(false);
        setSaveStatus('idle');
        setSaveMessage('');
      }, 3000);
          } catch (error) {
            console.error('Error saving data:', error);
            setSaveStatus('error');
            setSaveMessage('Wystąpił błąd podczas zapisywania danych');
            setSaveProgressBar(prev => ({ ...prev, status: 'error' }));
            
            // Show popup and animation AFTER error
            setShowSavePopup(true);
            setShowSaveAnimation(true);
            
            // Show error handler
            setSaveError({
              isVisible: true,
              error: error instanceof Error ? error.message : 'Nieznany błąd',
              lastAttempt: new Date()
            });
            
            showSaveNotification('error', 'Błąd zapisu!', 'Wystąpił błąd podczas zapisywania danych. Sprawdź połączenie internetowe.');
            
            // Hide progress bar after error
            setTimeout(() => {
              setSaveProgressBar({ isVisible: false, progress: 0, status: 'idle', message: '' });
            }, 3000);
          }
  };

  const handleSaveCancel = () => {
    setShowSaveConfirmation(false);
  };

  const handleSaveErrorRetry = async () => {
    setSaveError(prev => ({ ...prev, isVisible: false }));
    await handleSaveConfirm();
  };

  const handleSaveErrorExit = () => {
    setSaveError(prev => ({ ...prev, isVisible: false }));
    setSaveStatus('idle');
    setSaveMessage('');
    setShowSavePopup(false);
  };

  const handleSaveErrorDismiss = () => {
    setSaveError(prev => ({ ...prev, isVisible: false }));
  };


  const showSaveNotification = (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => {
    setSaveNotification({
      isVisible: true,
      type,
      title,
      message
    });
  };

  const hideSaveNotification = () => {
    setSaveNotification(prev => ({ ...prev, isVisible: false }));
  };

  const handleCloseSavePopup = () => {
    setShowSavePopup(false);
    setSaveStatus('idle');
    setSaveMessage('');
  };

  const handleSaveAnimationComplete = () => {
    setShowSaveAnimation(false);
  };

  const autoSave = () => {
    // Clear existing timeout
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }
    
    // Set new timeout for debounced auto-save
    const timeout = setTimeout(async () => {
      setAutoSaveStatus('saving');
      setSaveProgress({
        isVisible: true,
        progress: 0,
        message: 'Zapisywanie danych...'
      });
      
      try {
        // Simulate progress
        const progressInterval = setInterval(() => {
          setSaveProgress(prev => ({
            ...prev,
            progress: Math.min(prev.progress + 20, 90)
          }));
        }, 200);
        
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
        
        clearInterval(progressInterval);
        setSaveProgress(prev => ({ ...prev, progress: 100 }));
        
        setAutoSaveStatus('saved');
        
        // Show success toast
        setToast({
          isVisible: true,
          type: 'success',
          message: 'autozapisane!'
        });
        
        // Hide progress after success
        setTimeout(() => {
          setSaveProgress({ isVisible: false, progress: 0, message: '' });
        }, 1000);
        
        // Reset status after 2 seconds
        setTimeout(() => {
          setAutoSaveStatus('idle');
        }, 2000);
      } catch (error) {
        console.error('Auto-save error:', error);
        setAutoSaveStatus('idle');
        setSaveProgress({ isVisible: false, progress: 0, message: '' });
        
        // Show error toast
        setToast({
          isVisible: true,
          type: 'error',
          message: 'Błąd automatycznego zapisywania!'
        });
      }
    }, 2000); // 2 second delay
    
    setAutoSaveTimeout(timeout);
  };

  // Filter tasks for today based on day of week
  const getTodayTasks = () => {
    const today = new Date().getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = dayNames[today];
    
    // Always show morning and evening tasks
    const alwaysShowCategories = ['morning', 'evening'];
    
    // Get today's creative activity from weekly schedule
    const todayCreativeActivity = weeklySchedule && weeklySchedule[currentDay] 
      ? weeklySchedule[currentDay] 
      : null;
    
    return tasks.filter(task => {
      // Always show morning, evening, and running tasks
      if (alwaysShowCategories.includes(task.category)) {
        return true;
      }
      
      // Show creative tasks only if they match today's schedule
      if (task.category === 'passions') {
        if (!todayCreativeActivity) return false;
        
        // Check if this task matches today's creative activity
        const taskName = task.text.split('(')[0].trim();
        return todayCreativeActivity.includes(taskName);
      }
      
      return false;
    });
  };

  const todayTasks = getTodayTasks();
  
  const stats = {
    total: todayTasks.length,
    completed: todayTasks.filter(t => t.completed).length,
    percentage: todayTasks.length ? Math.round((todayTasks.filter(t => t.completed).length / todayTasks.length) * 100) : 0
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 glow-text">⚙️</div>
          <div className="text-2xl text-green-400">SCHEDULE'S CREATION...</div>
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
            ⚙️ DAILY ADDICTIONS SUP. ⚙️
          </h1>
          <p className="text-pink-500 text-lg sm:text-xl mb-6 px-4">
            ŻYCIE BEZ DECYZYJNYCH PARALIŻY | w ciągach | ALGORYTMÓW BEZ CHAOSU
          </p>
          
          {/* Stats Bar */}
          <div className="responsive-grid max-w-3xl mx-auto mb-6 px-4">
            <div className="card relative group">
              <div className="text-3xl font-bold text-white">{stats.completed}/{stats.total}</div>
              <div className="text-sm text-green-100">checklist</div>
              
              {/* Tooltip Cloud with visual task indicators */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                <div className="relative px-4 py-3 bg-gradient-to-br from-green-600 to-emerald-600 text-white text-sm font-medium rounded-2xl shadow-2xl"
                     style={{
                       borderRadius: '55% 45% 58% 42% / 52% 48% 52% 48%',
                       filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))'
                     }}>
                  <div className="flex flex-wrap gap-1.5 justify-center max-w-[200px]">
                    {Array.from({ length: stats.total }, (_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full ${
                          i < stats.completed 
                            ? 'bg-white shadow-md' 
                            : 'bg-white bg-opacity-20 border border-white border-opacity-30'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                    <div className="w-3 h-3 bg-emerald-600 transform rotate-45"
                         style={{
                           borderRadius: '0 0 50% 0',
                           filter: 'drop-shadow(0 2px 2px rgba(0, 0, 0, 0.2))'
                         }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card relative group">
              <div className="text-3xl font-bold text-white">{stats.percentage}%</div>
              <div className="text-sm text-purple-100">BNS</div>
              
              {/* Tooltip Cloud */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                <div className="relative px-4 py-2 bg-gradient-to-br from-purple-600 to-pink-600 text-white text-sm font-medium rounded-2xl shadow-2xl"
                     style={{
                       borderRadius: '63% 37% 54% 46% / 55% 48% 52% 45%',
                       filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))'
                     }}>
                  Brain Nutrition Supplying 🧠 antywegetacja, zachowanie świadomości, skrupulatne 
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                    <div className="w-3 h-3 bg-pink-600 transform rotate-45"
                         style={{
                           borderRadius: '0 0 50% 0',
                           filter: 'drop-shadow(0 2px 2px rgba(0, 0, 0, 0.2))'
                         }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card relative group">
              <div className="text-3xl font-bold text-white">{batsnackPoints}BS🦇</div>
              
              {/* Tooltip Cloud */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                <div className="relative px-4 py-2 bg-gradient-to-br from-orange-600 to-red-600 text-white text-sm font-medium rounded-2xl shadow-2xl"
                     style={{
                       borderRadius: '58% 42% 61% 39% / 48% 55% 45% 52%',
                       filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))'
                     }}>
                  skrzynia Batsnack'ów
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                    <div className="w-3 h-3 bg-red-600 transform rotate-45"
                         style={{
                           borderRadius: '0 0 50% 0',
                           filter: 'drop-shadow(0 2px 2px rgba(0, 0, 0, 0.2))'
                         }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="mb-8 px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 justify-center">
            <button
              onClick={() => setCurrentView('today')}
              className={`px-2 sm:px-4 py-2 rounded-lg font-bold transition-all text-xs sm:text-sm ${
                currentView === 'today'
                  ? 'btn-primary'
                  : 'btn-secondary'
              }`}
            >
              <Calendar className="inline mr-1" size={14} />
              <span className="hidden sm:inline">Dailies</span>
              <span className="sm:hidden">Dailies</span>
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
              <span className="hidden sm:inline">Workdays Madness</span>
              <span className="sm:hidden">Workdays Madness</span>
            </button>
            <button
              onClick={() => setCurrentView('database')}
              className={`px-2 sm:px-4 py-2 rounded-lg font-bold transition-all text-xs sm:text-sm ${
                currentView === 'database'
                  ? 'btn-primary'
                  : 'btn-secondary'
              }`}
            >
              <Database className="inline mr-1" size={14} />
              <span className="hidden sm:inline">BAZA DANYCH</span>
              <span className="sm:hidden">BAZA DANYCH</span>
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
              <span className="sm:hidden">STATY</span>
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
              <span className="hidden sm:inline">EXPORT</span>
              <span className="sm:hidden">EXPORT</span>
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
              <span className="sm:hidden">KALENDARZ</span>
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
              <span className="sm:hidden">NOTATKI</span>
            </button>
          </div>
        </div>

        {/* Save Button and Sync Status */}
        <div className="text-center mb-6 space-y-4">
          <div className="flex items-center justify-center space-x-4">
          <button
            onClick={saveCurrentState}
            className="btn-primary"
          >
            💾 savepoint
          </button>
            
            {/* Auto-save indicator */}
            {autoSaveStatus === 'saving' && (
              <div className="flex items-center space-x-2 text-blue-500">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Autozapisywanie...</span>
              </div>
            )}
            
            {autoSaveStatus === 'saved' && (
              <div className="flex items-center space-x-2 text-green-500">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm">Autozapisane</span>
              </div>
            )}
          </div>
          
          <div className="flex justify-center">
            <FloatingSaveButton
              onSave={saveCurrentState}
              status={saveStatus === 'success' ? 'saved' : saveStatus}
            />
          </div>
          
          {/* Save Status Badge */}
          <div className="flex justify-center mt-2">
            <SaveStatusBadge
              status={autoSaveStatus}
              isOnline={syncStatus.isOnline}
              pendingSync={syncStatus.pendingSync}
            />
          </div>
          
          {/* Save Status Indicator */}
          <div className="flex justify-center mt-2">
            <SaveStatusDropdown
              status={autoSaveStatus}
              isOnline={syncStatus.isOnline}
              pendingSync={syncStatus.pendingSync}
              lastSaveTime={lastSaveTime || undefined}
              onShowHistory={() => setShowSaveHistory(true)}
              onShowStatistics={() => setShowSaveStatistics(true)}
              onShowSettings={() => setShowSaveSettings(true)}
              onShowDashboard={() => setShowSaveStatusDashboard(true)}
              onShowOverview={() => setShowSaveStatusOverview(true)}
              onShowMonitor={() => setShowSaveStatusMonitor(true)}
              onShowAnalytics={() => setShowSaveStatusAnalytics(true)}
              onShowInsights={() => setShowSaveStatusInsights(true)}
            />
          </div>
          
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
                tasks={todayTasks.filter(t => t.category === 'morning')} 
                onToggleTask={toggleTask}
                onUpdateNote={updateTaskNote}
              />
              <WeekdaysMadness />
              <PassionsRoutines 
                tasks={todayTasks.filter(t => t.category === 'passions')} 
                onToggleTask={toggleTask}
                onUpdateNote={updateTaskNote}
              />
              <EveningRoutines 
                tasks={todayTasks.filter(t => t.category === 'evening')} 
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
                      Losowanie dostępne tylko w niedziele
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

          {currentView === 'database' && (
            <motion.div
              key="database"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <DatabaseSettings />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-12 text-center text-green-400 italic">
          <p className="text-xl mb-2 glow-text">
            "Dyscyplina zaczyna się w miejscu gdzie kończy się przejmność"
          </p>
          <p className="text-lg text-blue-400">⚙️ Algorytmy | Ciągi | Perfekcjonizm ⚙️</p>
        </div>
      </div>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
      
      {/* Save Status Popup */}
      <SaveStatusPopup
        isVisible={showSavePopup}
        status={saveStatus}
        message={saveMessage}
        onClose={handleCloseSavePopup}
      />
      
      {/* Save Indicator */}
      <SaveIndicator status={autoSaveStatus} />
      
      {/* Toast Notification */}
      <Toast
        isVisible={toast.isVisible}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
      
      {/* Save Progress */}
      <SaveProgress
        isVisible={saveProgress.isVisible}
        progress={saveProgress.progress}
        message={saveProgress.message}
      />
      
      {/* Floating Sync Status */}
      <SyncStatus />
      
      {/* Help Modal */}
      <HelpModal
        isVisible={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
      
      {/* Keyboard Shortcuts Indicator */}
      <KeyboardShortcutsIndicator
        onShowHelp={() => setShowHelpModal(true)}
      />
      
      {/* Save Animation */}
      <SaveAnimation
        isVisible={showSaveAnimation}
        status={saveStatus === 'success' ? 'saved' : saveStatus}
        onComplete={handleSaveAnimationComplete}
      />
      
      {/* Save Confirmation Dialog */}
      <SaveConfirmationDialog
        isVisible={showSaveConfirmation}
        onConfirm={handleSaveConfirm}
        onCancel={handleSaveCancel}
        message="Czy na pewno chcesz zapisać aktualny stan? Wszystkie zmiany zostaną zsynchronizowane z chmurą."
        type="info"
      />
      
      {/* Save History */}
      <SaveHistory
        isVisible={showSaveHistory}
        onClose={() => setShowSaveHistory(false)}
      />
      
      {/* Save Statistics */}
      <SaveStatistics
        isVisible={showSaveStatistics}
        onClose={() => setShowSaveStatistics(false)}
      />
      
      {/* Save Settings */}
      <SaveSettings
        isVisible={showSaveSettings}
        onClose={() => setShowSaveSettings(false)}
      />
      
      {/* Save Notification */}
      <SaveNotification
        isVisible={saveNotification.isVisible}
        type={saveNotification.type}
        title={saveNotification.title}
        message={saveNotification.message}
        onClose={hideSaveNotification}
      />
      
      {/* Save Progress Bar */}
      <SaveProgressBar
        isVisible={saveProgressBar.isVisible}
        progress={saveProgressBar.progress}
        status={saveProgressBar.status}
        message={saveProgressBar.message}
      />
      
      {/* Save Status Summary */}
      <SaveStatusSummary
        isVisible={showSaveStatusSummary}
        onClose={() => setShowSaveStatusSummary(false)}
      />
      
      {/* Save Status Dashboard */}
      <SaveStatusDashboard
        isVisible={showSaveStatusDashboard}
        onClose={() => setShowSaveStatusDashboard(false)}
        onShowHistory={() => {
          setShowSaveStatusDashboard(false);
          setShowSaveHistory(true);
        }}
        onShowStatistics={() => {
          setShowSaveStatusDashboard(false);
          setShowSaveStatistics(true);
        }}
        onShowSettings={() => {
          setShowSaveStatusDashboard(false);
          setShowSaveSettings(true);
        }}
      />
      
      {/* Save Status Overview */}
      <SaveStatusOverview
        isVisible={showSaveStatusOverview}
        onClose={() => setShowSaveStatusOverview(false)}
        onShowHistory={() => {
          setShowSaveStatusOverview(false);
          setShowSaveHistory(true);
        }}
        onShowStatistics={() => {
          setShowSaveStatusOverview(false);
          setShowSaveStatistics(true);
        }}
        onShowSettings={() => {
          setShowSaveStatusOverview(false);
          setShowSaveSettings(true);
        }}
        onShowDashboard={() => {
          setShowSaveStatusOverview(false);
          setShowSaveStatusDashboard(true);
        }}
      />
      
      {/* Save Status Monitor */}
      <SaveStatusMonitor
        isVisible={showSaveStatusMonitor}
        onClose={() => setShowSaveStatusMonitor(false)}
        onShowHistory={() => {
          setShowSaveStatusMonitor(false);
          setShowSaveHistory(true);
        }}
        onShowStatistics={() => {
          setShowSaveStatusMonitor(false);
          setShowSaveStatistics(true);
        }}
        onShowSettings={() => {
          setShowSaveStatusMonitor(false);
          setShowSaveSettings(true);
        }}
        onShowDashboard={() => {
          setShowSaveStatusMonitor(false);
          setShowSaveStatusDashboard(true);
        }}
        onShowOverview={() => {
          setShowSaveStatusMonitor(false);
          setShowSaveStatusOverview(true);
        }}
      />
      
      {/* Save Status Analytics */}
        <SaveStatusAnalytics
          isVisible={showSaveStatusAnalytics}
          onClose={() => setShowSaveStatusAnalytics(false)}
          onShowHistory={() => {
            setShowSaveStatusAnalytics(false);
            setShowSaveHistory(true);
          }}
          onShowStatistics={() => {
            setShowSaveStatusAnalytics(false);
            setShowSaveStatistics(true);
          }}
          onShowSettings={() => {
            setShowSaveStatusAnalytics(false);
            setShowSaveSettings(true);
          }}
          onShowDashboard={() => {
            setShowSaveStatusAnalytics(false);
            setShowSaveStatusDashboard(true);
          }}
          onShowOverview={() => {
            setShowSaveStatusAnalytics(false);
            setShowSaveStatusOverview(true);
          }}
          onShowMonitor={() => {
            setShowSaveStatusAnalytics(false);
            setShowSaveStatusMonitor(true);
          }}
        />
        <SaveStatusInsights
          isVisible={showSaveStatusInsights}
          onClose={() => setShowSaveStatusInsights(false)}
          onShowHistory={() => {
            setShowSaveStatusInsights(false);
            setShowSaveHistory(true);
          }}
          onShowStatistics={() => {
            setShowSaveStatusInsights(false);
            setShowSaveStatistics(true);
          }}
          onShowSettings={() => {
            setShowSaveStatusInsights(false);
            setShowSaveSettings(true);
          }}
          onShowDashboard={() => {
            setShowSaveStatusInsights(false);
            setShowSaveStatusDashboard(true);
          }}
          onShowOverview={() => {
            setShowSaveStatusInsights(false);
            setShowSaveStatusOverview(true);
          }}
          onShowMonitor={() => {
            setShowSaveStatusInsights(false);
            setShowSaveStatusMonitor(true);
          }}
          onShowAnalytics={() => {
            setShowSaveStatusInsights(false);
            setShowSaveStatusAnalytics(true);
          }}
        />
        
        {/* Save Error Handler */}
        <SaveErrorHandler
          isVisible={saveError.isVisible}
          error={saveError.error}
          onRetry={handleSaveErrorRetry}
          onExit={handleSaveErrorExit}
          onDismiss={handleSaveErrorDismiss}
          isOnline={syncStatus.isOnline}
          lastAttempt={saveError.lastAttempt}
        />
    </div>
  );
};

export default App;
