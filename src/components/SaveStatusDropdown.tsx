import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Save, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Wifi,
  WifiOff,
  Settings,
  History,
  BarChart,
  Monitor,
  TrendingUp,
  Activity
} from 'lucide-react';

interface SaveStatusDropdownProps {
  status: 'idle' | 'saving' | 'saved' | 'error';
  isOnline: boolean;
  pendingSync: number;
  lastSaveTime?: Date;
  onShowHistory: () => void;
  onShowStatistics: () => void;
  onShowSettings: () => void;
  onShowDashboard: () => void;
  onShowOverview: () => void;
  onShowMonitor: () => void;
  onShowAnalytics: () => void;
  onShowInsights: () => void;
}

const SaveStatusDropdown: React.FC<SaveStatusDropdownProps> = ({
  status,
  isOnline,
  pendingSync,
  lastSaveTime,
  onShowHistory,
  onShowStatistics,
  onShowSettings,
  onShowDashboard,
  onShowOverview,
  onShowMonitor,
  onShowAnalytics,
  onShowInsights
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'saving':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'saved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Save className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'saving':
        return 'Zapisywanie...';
      case 'saved':
        return 'Zapisano';
      case 'error':
        return 'Błąd zapisu';
      default:
        return 'Gotowy do zapisu';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'saving':
        return 'text-blue-600';
      case 'saved':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const menuItems = [
    {
      icon: History,
      label: 'Historia zapisów',
      onClick: onShowHistory,
      color: 'text-blue-600'
    },
    {
      icon: BarChart,
      label: 'Statystyki',
      onClick: onShowStatistics,
      color: 'text-green-600'
    },
    {
      icon: Settings,
      label: 'Ustawienia zapisu',
      onClick: onShowSettings,
      color: 'text-purple-600'
    },
    {
      icon: Monitor,
      label: 'Dashboard',
      onClick: onShowDashboard,
      color: 'text-yellow-600'
    },
    {
      icon: TrendingUp,
      label: 'Przegląd',
      onClick: onShowOverview,
      color: 'text-indigo-600'
    },
    {
      icon: Activity,
      label: 'Monitor',
      onClick: onShowMonitor,
      color: 'text-blue-600'
    },
    {
      icon: BarChart,
      label: 'Analytics',
      onClick: onShowAnalytics,
      color: 'text-emerald-600'
    },
    {
      icon: TrendingUp,
      label: 'Insights',
      onClick: onShowInsights,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
      >
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        
        {/* Connection Status */}
        <div className="flex items-center space-x-1">
          {isOnline ? (
            <Wifi className="w-3 h-3 text-green-500" />
          ) : (
            <WifiOff className="w-3 h-3 text-red-500" />
          )}
          {pendingSync > 0 && (
            <span className="text-xs bg-orange-100 text-orange-600 px-1 rounded">
              {pendingSync}
            </span>
          )}
        </div>
        
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                {getStatusIcon()}
                <div>
                  <p className="text-sm font-medium text-gray-900">Status zapisu</p>
                  <p className="text-xs text-gray-500">
                    {lastSaveTime ? `Ostatni zapis: ${lastSaveTime.toLocaleString('pl-PL')}` : 'Brak zapisów'}
                  </p>
                </div>
              </div>
            </div>

            {/* Connection Info */}
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {isOnline ? (
                    <Wifi className="w-4 h-4 text-green-500" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm text-gray-600">
                    {isOnline ? 'Połączenie aktywne' : 'Brak połączenia'}
                  </span>
                </div>
                {pendingSync > 0 && (
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
                    {pendingSync} oczekujących
                  </span>
                )}
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick();
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                >
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Kliknij poza menu, aby zamknąć
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SaveStatusDropdown;
