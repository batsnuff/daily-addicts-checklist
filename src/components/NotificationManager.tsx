import React, { useState, useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { Bell, Clock, Calendar, Settings } from 'lucide-react';

interface NotificationSettings {
  morningReminder: boolean;
  eveningReminder: boolean;
  taskReminders: boolean;
  weeklyScheduleReminder: boolean;
  morningTime: string;
  eveningTime: string;
}

const NotificationManager: React.FC = () => {
  const [permissions, setPermissions] = useState<{ display: string }>({ display: 'denied' });
  const [settings, setSettings] = useState<NotificationSettings>({
    morningReminder: true,
    eveningReminder: true,
    taskReminders: true,
    weeklyScheduleReminder: true,
    morningTime: '07:00',
    eveningTime: '22:00'
  });

  useEffect(() => {
    checkPermissions();
    loadSettings();
  }, []);

  const checkPermissions = async () => {
    if (Capacitor.isNativePlatform()) {
      const permStatus = await LocalNotifications.checkPermissions();
      setPermissions(permStatus);
    }
  };

  const requestPermissions = async () => {
    if (Capacitor.isNativePlatform()) {
      const permStatus = await LocalNotifications.requestPermissions();
      setPermissions(permStatus);
    }
  };

  const loadSettings = () => {
    const saved = localStorage.getItem('notification_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  };

  const saveSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings);
    localStorage.setItem('notification_settings', JSON.stringify(newSettings));
    scheduleNotifications(newSettings);
  };

  const scheduleNotifications = async (notificationSettings: NotificationSettings) => {
    if (!Capacitor.isNativePlatform() || permissions.display !== 'granted') {
      return;
    }

    try {
      // Clear existing notifications
      await LocalNotifications.cancel({ notifications: [] });

      const notifications = [];

      // Morning reminder
      if (notificationSettings.morningReminder) {
        const [hours, minutes] = notificationSettings.morningTime.split(':').map(Number);
        const morningTime = new Date();
        morningTime.setHours(hours, minutes, 0, 0);
        
        if (morningTime <= new Date()) {
          morningTime.setDate(morningTime.getDate() + 1);
        }

        notifications.push({
          title: '🌅 Czas na poranne rutyny!',
          body: 'Dopamine Booster i poranne przygotowania czekają!',
          id: 1,
          schedule: { at: morningTime },
          extra: { type: 'morning' }
        });
      }

      // Evening reminder
      if (notificationSettings.eveningReminder) {
        const [hours, minutes] = notificationSettings.eveningTime.split(':').map(Number);
        const eveningTime = new Date();
        eveningTime.setHours(hours, minutes, 0, 0);
        
        if (eveningTime <= new Date()) {
          eveningTime.setDate(eveningTime.getDate() + 1);
        }

        notifications.push({
          title: '🌙 Czas na wieczorne rutyny!',
          body: 'Czytanie, rozciąganie i refleksja czekają!',
          id: 2,
          schedule: { at: eveningTime },
          extra: { type: 'evening' }
        });
      }

      // Weekly schedule reminder (Sundays at 20:00)
      if (notificationSettings.weeklyScheduleReminder) {
        const sundayTime = new Date();
        sundayTime.setHours(20, 0, 0, 0);
        
        // Find next Sunday
        const daysUntilSunday = (7 - sundayTime.getDay()) % 7;
        if (daysUntilSunday === 0 && sundayTime <= new Date()) {
          sundayTime.setDate(sundayTime.getDate() + 7);
        } else {
          sundayTime.setDate(sundayTime.getDate() + daysUntilSunday);
        }

        notifications.push({
          title: '📅 Czas na nowy harmonogram!',
          body: 'Wylosuj nowy tygodniowy plan kreatywnych aktywności',
          id: 3,
          schedule: { at: sundayTime },
          extra: { type: 'weekly' }
        });
      }

      if (notifications.length > 0) {
        await LocalNotifications.schedule({ notifications });
        console.log('Notifications scheduled successfully');
      }
    } catch (error) {
      console.error('Error scheduling notifications:', error);
    }
  };

  const scheduleTaskReminder = async (taskName: string, reminderTime: Date) => {
    if (!Capacitor.isNativePlatform() || permissions.display !== 'granted') {
      return;
    }

    try {
      await LocalNotifications.schedule({
        notifications: [{
          title: '⚙️ Przypomnienie o zadaniu',
          body: `Czas na: ${taskName}`,
          id: Date.now(),
          schedule: { at: reminderTime },
          extra: { type: 'task', taskName }
        }]
      });
    } catch (error) {
      console.error('Error scheduling task reminder:', error);
    }
  };

  const testNotification = async () => {
    if (!Capacitor.isNativePlatform() || permissions.display !== 'granted') {
      return;
    }

    try {
      await LocalNotifications.schedule({
        notifications: [{
          title: '🧪 Test powiadomienia',
          body: 'Jeśli widzisz to powiadomienie, wszystko działa!',
          id: 999,
          schedule: { at: new Date(Date.now() + 2000) },
          extra: { type: 'test' }
        }]
      });
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center mb-4">
        <Bell className="mr-2 text-blue-400" size={20} />
        <h3 className="text-xl font-bold text-white">Zarządzanie Powiadomieniami</h3>
      </div>

      {permissions.display !== 'granted' && (
        <div className="mb-4 p-4 bg-yellow-900 bg-opacity-50 rounded-lg border border-yellow-500">
          <p className="text-yellow-200 mb-2">
            Aby otrzymywać powiadomienia, musisz udzielić uprawnień.
          </p>
          <button
            onClick={requestPermissions}
            className="btn-primary"
          >
            Udziel uprawnień
          </button>
        </div>
      )}

      {permissions.display === 'granted' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.morningReminder}
                  onChange={(e) => saveSettings({ ...settings, morningReminder: e.target.checked })}
                  className="rounded"
                />
                <span className="text-white">Poranne przypomnienia</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.eveningReminder}
                  onChange={(e) => saveSettings({ ...settings, eveningReminder: e.target.checked })}
                  className="rounded"
                />
                <span className="text-white">Wieczorne przypomnienia</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.weeklyScheduleReminder}
                  onChange={(e) => saveSettings({ ...settings, weeklyScheduleReminder: e.target.checked })}
                  className="rounded"
                />
                <span className="text-white">Przypomnienia o harmonogramie</span>
              </label>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-white mb-1">Czas porannego przypomnienia:</label>
                <input
                  type="time"
                  value={settings.morningTime}
                  onChange={(e) => saveSettings({ ...settings, morningTime: e.target.value })}
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-white mb-1">Czas wieczornego przypomnienia:</label>
                <input
                  type="time"
                  value={settings.eveningTime}
                  onChange={(e) => saveSettings({ ...settings, eveningTime: e.target.value })}
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={testNotification}
              className="btn-secondary flex items-center"
            >
              <Bell className="mr-1" size={16} />
              Test powiadomienia
            </button>
            
            <button
              onClick={() => scheduleNotifications(settings)}
              className="btn-primary flex items-center"
            >
              <Clock className="mr-1" size={16} />
              Zaplanuj powiadomienia
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationManager;
