import { DailyData, WeeklyData, Statistics } from '../types';

const STORAGE_PREFIX = 'daily_addicts_';
const DAILY_DATA_KEY = 'daily_data';
const WEEKLY_DATA_KEY = 'weekly_data';
const STATISTICS_KEY = 'statistics';

export const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getCurrentWeek = (): string => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  return startOfWeek.toISOString().split('T')[0];
};

export const saveDailyData = async (data: DailyData): Promise<void> => {
  try {
    const key = `${STORAGE_PREFIX}${DAILY_DATA_KEY}_${data.date}`;
    localStorage.setItem(key, JSON.stringify(data));
    
    // Also save to weekly data
    await updateWeeklyData(data);
  } catch (error) {
    console.error('Error saving daily data:', error);
    throw error;
  }
};

export const loadDailyData = async (date: string): Promise<DailyData | null> => {
  try {
    const key = `${STORAGE_PREFIX}${DAILY_DATA_KEY}_${date}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading daily data:', error);
    return null;
  }
};

export const updateWeeklyData = async (dailyData: DailyData): Promise<void> => {
  try {
    const weekStart = getCurrentWeek();
    const key = `${STORAGE_PREFIX}${WEEKLY_DATA_KEY}_${weekStart}`;
    
    let weeklyData: WeeklyData | null = null;
    const existingData = localStorage.getItem(key);
    
    if (existingData) {
      weeklyData = JSON.parse(existingData);
    } else {
      weeklyData = {
        weekStart,
        weekEnd: new Date(new Date(weekStart).getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dailyData: [],
        totalPoints: 0,
        ranking: ''
      };
    }
    
    // Update or add daily data
    if (weeklyData) {
      const existingDayIndex = weeklyData.dailyData.findIndex(d => d.date === dailyData.date);
      if (existingDayIndex >= 0) {
        weeklyData.dailyData[existingDayIndex] = dailyData;
      } else {
        weeklyData.dailyData.push(dailyData);
      }
      
      // Recalculate total points
      weeklyData.totalPoints = weeklyData.dailyData.reduce((sum, day) => sum + day.batsnackPoints, 0);
    }
    
    if (weeklyData) {
      localStorage.setItem(key, JSON.stringify(weeklyData));
    }
  } catch (error) {
    console.error('Error updating weekly data:', error);
  }
};

export const loadWeeklyData = async (weekStart: string): Promise<WeeklyData | null> => {
  try {
    const key = `${STORAGE_PREFIX}${WEEKLY_DATA_KEY}_${weekStart}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading weekly data:', error);
    return null;
  }
};

export const getAllDailyData = async (): Promise<DailyData[]> => {
  try {
    const allData: DailyData[] = [];
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith(`${STORAGE_PREFIX}${DAILY_DATA_KEY}_`)
    );
    
    for (const key of keys) {
      const data = localStorage.getItem(key);
      if (data) {
        allData.push(JSON.parse(data));
      }
    }
    
    return allData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } catch (error) {
    console.error('Error loading all daily data:', error);
    return [];
  }
};

export const calculateStatistics = async (): Promise<Statistics> => {
  try {
    const allData = await getAllDailyData();
    const now = new Date();
    const currentWeek = getCurrentWeek();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    
    // Daily stats (today)
    const today = getCurrentDate();
    const todayData = allData.find(d => d.date === today);
    const daily = {
      completedTasks: todayData ? todayData.tasks.filter(t => t.completed).length : 0,
      totalTasks: todayData ? todayData.tasks.length : 0,
      pointsEarned: todayData ? todayData.batsnackPoints : 0,
      pointsLost: 0 // TODO: Implement penalty system
    };
    
    // Weekly stats
    const weekData = allData.filter(d => d.date >= currentWeek);
    const weeklyPointsEarned = weekData.reduce((sum, day) => sum + Math.max(0, day.batsnackPoints), 0);
    const weeklyPointsLost = weekData.reduce((sum, day) => sum + Math.abs(Math.min(0, day.batsnackPoints)), 0);
    const weeklyNetPoints = weeklyPointsEarned - weeklyPointsLost;
    
    const getWeeklyRanking = (points: number): string => {
      if (points >= 50) return 'Master';
      if (points >= 35) return 'Expert';
      if (points >= 25) return 'Advanced';
      if (points >= 15) return 'Intermediate';
      return 'Beginner';
    };
    
    const weekly = {
      averageCompletion: weekData.length > 0 
        ? weekData.reduce((sum, day) => {
            const completed = day.tasks.filter(t => t.completed).length;
            const total = day.tasks.length;
            return sum + (total > 0 ? (completed / total) * 100 : 0);
          }, 0) / weekData.length
        : 0,
      totalPoints: weeklyNetPoints,
      ranking: getWeeklyRanking(weeklyNetPoints),
      pointsEarned: weeklyPointsEarned,
      pointsLost: weeklyPointsLost,
      netPoints: weeklyNetPoints
    };
    
    // Monthly stats
    const monthData = allData.filter(d => d.date >= currentMonth);
    const monthly = {
      totalDays: monthData.length,
      averagePoints: monthData.length > 0 
        ? monthData.reduce((sum, day) => sum + day.batsnackPoints, 0) / monthData.length
        : 0,
      bestWeek: 0 // TODO: Calculate best week
    };
    
    // Overall stats
    const overall = {
      totalPoints: allData.reduce((sum, day) => sum + day.batsnackPoints, 0),
      totalTasks: allData.reduce((sum, day) => sum + day.tasks.length, 0),
      completionRate: allData.length > 0 
        ? allData.reduce((sum, day) => {
            const completed = day.tasks.filter(t => t.completed).length;
            const total = day.tasks.length;
            return sum + (total > 0 ? (completed / total) * 100 : 0);
          }, 0) / allData.length
        : 0
    };
    
    return { daily, weekly, monthly, overall };
  } catch (error) {
    console.error('Error calculating statistics:', error);
    return {
      daily: { completedTasks: 0, totalTasks: 0, pointsEarned: 0, pointsLost: 0 },
      weekly: { averageCompletion: 0, totalPoints: 0, ranking: 'Beginner', pointsEarned: 0, pointsLost: 0, netPoints: 0 },
      monthly: { totalDays: 0, averagePoints: 0, bestWeek: 0 },
      overall: { totalPoints: 0, totalTasks: 0, completionRate: 0 }
    };
  }
};

export const exportWeeklyData = async (weekStart: string): Promise<string> => {
  try {
    const weeklyData = await loadWeeklyData(weekStart);
    if (!weeklyData) {
      throw new Error('No weekly data found');
    }
    
    const exportData = {
      ...weeklyData,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    
    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Error exporting weekly data:', error);
    throw error;
  }
};

export const sendEmailExport = async (weekStart: string, email: string): Promise<void> => {
  try {
    const exportData = await exportWeeklyData(weekStart);
    
    // Create mailto link with the data
    const subject = `Daily Addicts Weekly Export - ${weekStart}`;
    const body = `Weekly data export:\n\n${exportData}`;
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.open(mailtoLink);
  } catch (error) {
    console.error('Error sending email export:', error);
    throw error;
  }
};
