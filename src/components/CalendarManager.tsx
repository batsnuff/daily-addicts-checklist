import React, { useState, useEffect } from 'react';
import { CapacitorCalendar } from '@ebarooni/capacitor-calendar';
import { Capacitor } from '@capacitor/core';
import { Calendar, Plus, RefreshCw, Settings, Clock } from 'lucide-react';

interface CalendarEvent {
  id?: string;
  title: string;
  startDate: number;
  endDate: number;
  location?: string;
  notes?: string;
}

interface CalendarSettings {
  autoSync: boolean;
  syncInterval: number; // minutes
  defaultEventDuration: number; // minutes
}

const CalendarManager: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [settings, setSettings] = useState<CalendarSettings>({
    autoSync: true,
    syncInterval: 30,
    defaultEventDuration: 60
  });
  const [isLoading, setIsLoading] = useState(false);
  const [permissions, setPermissions] = useState<{ calendar: string }>({ calendar: 'denied' });

  useEffect(() => {
    checkPermissions();
    loadSettings();
    if (Capacitor.isNativePlatform()) {
      loadCalendarEvents();
    }
  }, []);

  const checkPermissions = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        // For now, assume permissions are granted if plugin is available
        setPermissions({ calendar: 'granted' });
      } catch (error) {
        console.error('Error checking permissions:', error);
        setPermissions({ calendar: 'denied' });
      }
    }
  };

  const requestPermissions = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        // For now, assume permissions are granted
        setPermissions({ calendar: 'granted' });
        loadCalendarEvents();
      } catch (error) {
        console.error('Error requesting permissions:', error);
        setPermissions({ calendar: 'denied' });
      }
    }
  };

  const loadSettings = () => {
    const saved = localStorage.getItem('calendar_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  };

  const saveSettings = (newSettings: CalendarSettings) => {
    setSettings(newSettings);
    localStorage.setItem('calendar_settings', JSON.stringify(newSettings));
  };

  const loadCalendarEvents = async () => {
    if (!Capacitor.isNativePlatform() || permissions.calendar !== 'granted') {
      return;
    }

    setIsLoading(true);
    try {
      // For now, just set empty events until we fix the plugin
      setEvents([]);
      console.log('Calendar events loading - plugin integration in progress');
    } catch (error) {
      console.error('Error loading calendar events:', error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createEvent = async (event: CalendarEvent) => {
    if (!Capacitor.isNativePlatform() || permissions.calendar !== 'granted') {
      return;
    }

    try {
      await CapacitorCalendar.createEvent(event);
      console.log('Event created:', event.title);
      loadCalendarEvents(); // Reload events
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const createDailyRoutineEvent = async (type: 'morning' | 'evening' | 'passions') => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    let event: CalendarEvent;

    switch (type) {
      case 'morning':
        event = {
          title: '🌅 Poranne Rutyny - Daily Addicts',
          startDate: today.getTime() + 7 * 60 * 60 * 1000, // 7:00
          endDate: today.getTime() + 8.5 * 60 * 60 * 1000, // 8:30
          notes: 'Dopamine Booster, Selfcare, preWorkPreparation, KickOff'
        };
        break;
      case 'evening':
        event = {
          title: '🌙 Wieczorne Rutyny - Daily Addicts',
          startDate: today.getTime() + 22 * 60 * 60 * 1000, // 22:00
          endDate: today.getTime() + 23.25 * 60 * 60 * 1000, // 23:15
          notes: 'Czytanie WebToons, Rozciąganie, Mantra + Refleksja'
        };
        break;
      case 'passions':
        event = {
          title: '🎨 Passions Pills - Daily Addicts',
          startDate: today.getTime() + 19.5 * 60 * 60 * 1000, // 19:30
          endDate: today.getTime() + 22 * 60 * 60 * 1000, // 22:00
          notes: 'Kreatywne aktywności według harmonogramu tygodniowego'
        };
        break;
    }

    await createEvent(event);
  };

  const syncWithTasks = async () => {
    if (!Capacitor.isNativePlatform() || permissions.calendar !== 'granted') {
      return;
    }

    setIsLoading(true);
    try {
      // Create events for today's routines
      await createDailyRoutineEvent('morning');
      await createDailyRoutineEvent('evening');
      await createDailyRoutineEvent('passions');
      
      // Load updated events
      await loadCalendarEvents();
    } catch (error) {
      console.error('Error syncing with tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createCustomEvent = async () => {
    const title = prompt('Nazwa wydarzenia:');
    if (!title) return;

    const startTime = prompt('Czas rozpoczęcia (HH:MM):');
    if (!startTime) return;

    const duration = prompt('Czas trwania (minuty):', settings.defaultEventDuration.toString());
    if (!duration) return;

    const [hours, minutes] = startTime.split(':').map(Number);
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
    const endDate = new Date(startDate.getTime() + parseInt(duration) * 60 * 1000);

    await createEvent({
      title,
      startDate: startDate.getTime(),
      endDate: endDate.getTime(),
      notes: 'Utworzone przez Daily Addicts Checklist'
    });
  };

  return (
    <div className="card">
      <div className="flex items-center mb-4">
        <Calendar className="mr-2 text-green-400" size={20} />
        <h3 className="text-xl font-bold text-white">Synchronizacja z Kalendarzem</h3>
      </div>

      {permissions.calendar !== 'granted' && (
        <div className="mb-4 p-4 bg-yellow-900 bg-opacity-50 rounded-lg border border-yellow-500">
          <p className="text-yellow-200 mb-2">
            Aby synchronizować z kalendarzem, musisz udzielić uprawnień.
          </p>
          <button
            onClick={requestPermissions}
            className="btn-primary"
          >
            Udziel uprawnień do kalendarza
          </button>
        </div>
      )}

      {permissions.calendar === 'granted' && (
        <div className="space-y-4">
          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={settings.autoSync}
                  onChange={(e) => saveSettings({ ...settings, autoSync: e.target.checked })}
                  className="rounded"
                />
                <span className="text-white">Automatyczna synchronizacja</span>
              </label>
            </div>
            
            <div>
              <label className="block text-white mb-1">Domyślny czas trwania (min):</label>
              <input
                type="number"
                value={settings.defaultEventDuration}
                onChange={(e) => saveSettings({ ...settings, defaultEventDuration: parseInt(e.target.value) })}
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
                min="15"
                max="480"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={syncWithTasks}
              disabled={isLoading}
              className="btn-primary flex items-center"
            >
              <RefreshCw className="mr-1" size={16} />
              {isLoading ? 'Synchronizacja...' : 'Synchronizuj z zadaniami'}
            </button>

            <button
              onClick={createCustomEvent}
              className="btn-secondary flex items-center"
            >
              <Plus className="mr-1" size={16} />
              Dodaj wydarzenie
            </button>

            <button
              onClick={loadCalendarEvents}
              className="btn-secondary flex items-center"
            >
              <Calendar className="mr-1" size={16} />
              Odśwież kalendarz
            </button>
          </div>

          {/* Today's Events */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">Dzisiejsze wydarzenia:</h4>
            {isLoading ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-400"></div>
                <p className="text-gray-400 mt-2">Ładowanie...</p>
              </div>
            ) : events.length > 0 ? (
              <div className="space-y-2">
                {events.map((event, index) => (
                  <div key={index} className="p-3 bg-gray-800 rounded-lg border border-gray-600">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-white font-medium">{event.title}</h5>
                        <p className="text-gray-400 text-sm">
                          {new Date(event.startDate).toLocaleTimeString('pl-PL', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })} - {new Date(event.endDate).toLocaleTimeString('pl-PL', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                        {event.notes && (
                          <p className="text-gray-500 text-xs mt-1">{event.notes}</p>
                        )}
                      </div>
                      <Clock className="text-gray-400" size={16} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4">Brak wydarzeń na dziś</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarManager;
