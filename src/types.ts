export interface Task {
  id: number;
  text: string;
  category: 'morning' | 'passions' | 'evening';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  note: string;
}


export interface DailyData {
  date: string;
  tasks: Task[];
  batsnackPoints: number;
  notes: string;
  generalNote: string;
}

export interface WeeklyData {
  weekStart: string;
  weekEnd: string;
  dailyData: DailyData[];
  totalPoints: number;
  ranking: string;
}

export interface Statistics {
  daily: {
    completedTasks: number;
    totalTasks: number;
    pointsEarned: number;
    pointsLost: number;
  };
  weekly: {
    averageCompletion: number;
    totalPoints: number;
    ranking: string;
    pointsEarned: number;
    pointsLost: number;
    netPoints: number;
  };
  monthly: {
    totalDays: number;
    averagePoints: number;
    bestWeek: number;
  };
  overall: {
    totalPoints: number;
    totalTasks: number;
    completionRate: number;
  };
}

