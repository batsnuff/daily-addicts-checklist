import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, TrendingUp, Calendar, Award, Trophy, DollarSign } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Statistics } from '../types';
import { calculateStatistics } from '../utils/storage';

const StatisticsTab: React.FC = () => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly' | 'overall' | 'points'>('daily');
  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const stats = await calculateStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankingColor = (ranking: string) => {
    switch (ranking.toLowerCase()) {
      case 'beginner': return 'from-gray-500 to-gray-700';
      case 'intermediate': return 'from-blue-500 to-blue-700';
      case 'advanced': return 'from-purple-500 to-purple-700';
      case 'expert': return 'from-yellow-500 to-yellow-700';
      case 'master': return 'from-red-500 to-red-700';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  const getRankingIcon = (ranking: string) => {
    switch (ranking.toLowerCase()) {
      case 'beginner': return '🌱';
      case 'intermediate': return '📈';
      case 'advanced': return '🚀';
      case 'expert': return '💎';
      case 'master': return '👑';
      default: return '⭐';
    }
  };

  const getWeeklyRanking = (totalPoints: number): string => {
    if (totalPoints >= 50) return 'Master';
    if (totalPoints >= 35) return 'Expert';
    if (totalPoints >= 25) return 'Advanced';
    if (totalPoints >= 15) return 'Intermediate';
    return 'Beginner';
  };

  // Mock data for point statistics - in real app this would come from storage
  const pointStatistics = {
    earned: [
      { source: 'Running +1km', points: 3, color: '#477129' },
      { source: 'Creative Work', points: 8, color: '#1565c0a3' },
      { source: 'Miloverse Art', points: 6, color: '#0099ff' },
      { source: 'New Projects', points: 4, color: '#ff6b00' },
      { source: 'Completed Projects', points: 7, color: '#ff00ff' }
    ],
    lost: [
      { source: 'Missing Reflection', points: -2, color: '#ff4444' },
      { source: 'Missing Passions Pills', points: -4, color: '#ff6666' },
      { source: 'Mundane Tasks', points: -1.5, color: '#ff8888' }
    ],
    weekly: [
      { day: 'Mon', earned: 5, lost: -1, net: 4 },
      { day: 'Tue', earned: 8, lost: -2, net: 6 },
      { day: 'Wed', earned: 6, lost: -0.5, net: 5.5 },
      { day: 'Thu', earned: 10, lost: -1, net: 9 },
      { day: 'Fri', earned: 7, lost: -2, net: 5 },
      { day: 'Sat', earned: 12, lost: -0.5, net: 11.5 },
      { day: 'Sun', earned: 9, lost: -1, net: 8 }
    ]
  };

  const totalEarned = pointStatistics.earned.reduce((sum, item) => sum + item.points, 0);
  const totalLost = Math.abs(pointStatistics.lost.reduce((sum, item) => sum + item.points, 0));
  const netPoints = totalEarned + pointStatistics.lost.reduce((sum, item) => sum + item.points, 0);
  const weeklyRanking = getWeeklyRanking(netPoints);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="text-6xl mb-4 glow-text">📊</div>
        <div className="text-2xl text-green-400">Ładowanie statystyk...</div>
      </motion.div>
    );
  }

  if (!statistics) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="text-6xl mb-4">❌</div>
        <div className="text-2xl text-red-400">Błąd ładowania statystyk</div>
      </motion.div>
    );
  }

  const dailyData = [
    { name: 'Ukończone', value: statistics.daily.completedTasks, color: '#477129' },
    { name: 'Pozostałe', value: statistics.daily.totalTasks - statistics.daily.completedTasks, color: '#666666' }
  ];

  const weeklyData = [
    { name: 'Pon', value: 85 },
    { name: 'Wt', value: 92 },
    { name: 'Śr', value: 78 },
    { name: 'Czw', value: 95 },
    { name: 'Pt', value: 88 },
    { name: 'Sob', value: 100 },
    { name: 'Nd', value: 90 }
  ];

  const pointsData = [
    { name: 'Zarobione', value: statistics.daily.pointsEarned, color: '#477129' },
    { name: 'Stracone', value: statistics.daily.pointsLost, color: '#ff4444' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <BarChart3 className="text-blue-400" size={40} />
          STATYSTYKI
        </h2>
        <p className="text-lg text-gray-300">
          Analiza postępów i osiągnięć
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 justify-center flex-wrap">
        {[
          { key: 'daily', label: 'Dzienne', icon: Calendar },
          { key: 'weekly', label: 'Tygodniowe', icon: TrendingUp },
          { key: 'monthly', label: 'Miesięczne', icon: BarChart3 },
          { key: 'points', label: 'Punkty', icon: DollarSign },
          { key: 'overall', label: 'Ogólne', icon: Award }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === key
                ? 'btn-primary'
                : 'btn-secondary'
            }`}
          >
            <Icon size={16} className="inline mr-1" />
            {label}
          </button>
        ))}
      </div>

      {/* Daily Statistics */}
      <AnimatePresence mode="wait">
        {activeTab === 'daily' && (
          <motion.div
            key="daily"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Daily Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">
                  {statistics.daily.completedTasks}/{statistics.daily.totalTasks}
                </div>
                <div className="text-gray-300">Ukończone zadania</div>
              </div>
              <div className="card text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">
                  {statistics.daily.pointsEarned}
                </div>
                <div className="text-gray-300">Punkty zarobione</div>
              </div>
              <div className="card text-center">
                <div className="text-4xl font-bold text-red-400 mb-2">
                  {statistics.daily.pointsLost}
                </div>
                <div className="text-gray-300">Punkty stracone</div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-xl font-bold text-white mb-4">Postęp dzienny</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dailyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {dailyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="card">
                <h3 className="text-xl font-bold text-white mb-4">Punkty dzienne</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={pointsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#477129" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {/* Weekly Statistics */}
        {activeTab === 'weekly' && (
          <motion.div
            key="weekly"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">
                  {statistics.weekly.averageCompletion.toFixed(1)}%
                </div>
                <div className="text-gray-300">Średnie ukończenie</div>
              </div>
              <div className="card text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">
                  {statistics.weekly.totalPoints}
                </div>
                <div className="text-gray-300">Punkty tygodniowe</div>
              </div>
              <div className="card text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">
                  {getRankingIcon(weeklyRanking)}
                </div>
                <div className="text-gray-300">Ranga tygodniowa</div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold text-white mb-4">Postęp tygodniowy</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#477129" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Monthly Statistics */}
        {activeTab === 'monthly' && (
          <motion.div
            key="monthly"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card text-center">
                <div className="text-4xl font-bold text-indigo-400 mb-2">
                  {statistics.monthly.totalDays}
                </div>
                <div className="text-gray-300">Dni aktywności</div>
              </div>
              <div className="card text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">
                  {statistics.monthly.averagePoints.toFixed(1)}
                </div>
                <div className="text-gray-300">Średnie punkty/dzień</div>
              </div>
              <div className="card text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">
                  {statistics.monthly.bestWeek}
                </div>
                <div className="text-gray-300">Najlepszy tydzień</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Points Statistics */}
        {activeTab === 'points' && (
          <motion.div
            key="points"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Points Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="card text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">
                  +{totalEarned}
                </div>
                <div className="text-gray-300">Punkty zarobione</div>
              </div>
              <div className="card text-center">
                <div className="text-4xl font-bold text-red-400 mb-2">
                  -{totalLost}
                </div>
                <div className="text-gray-300">Punkty stracone</div>
              </div>
              <div className="card text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">
                  {netPoints}
                </div>
                <div className="text-gray-300">Punkty netto</div>
              </div>
              <div className="card text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">
                  {getRankingIcon(weeklyRanking)}
                </div>
                <div className="text-gray-300">Ranga tygodniowa</div>
              </div>
            </div>

            {/* Weekly Ranking Display */}
            <div className="card">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Trophy className="text-yellow-400" size={24} />
                RANGA TYGODNIOWA
              </h3>
              <div className={`bg-gradient-to-r ${getRankingColor(weeklyRanking)} rounded-lg p-6 text-center`}>
                <div className="text-6xl mb-4">{getRankingIcon(weeklyRanking)}</div>
                <div className="text-3xl font-bold text-white mb-2">{weeklyRanking}</div>
                <div className="text-lg text-gray-200">
                  {netPoints} punktów netto w tym tygodniu
                </div>
                <div className="text-sm text-gray-300 mt-2">
                  {weeklyRanking === 'Master' && '🏆 Mistrz Dyscypliny - Niezrównana konsekwencja!'}
                  {weeklyRanking === 'Expert' && '💎 Ekspert - Doskonała kontrola nad rutyną!'}
                  {weeklyRanking === 'Advanced' && '🚀 Zaawansowany - Silna dyscyplina!'}
                  {weeklyRanking === 'Intermediate' && '📈 Średniozaawansowany - Dobry postęp!'}
                  {weeklyRanking === 'Beginner' && '🌱 Początkujący - Czas na rozwój!'}
                </div>
              </div>
            </div>

            {/* Points Breakdown Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-xl font-bold text-white mb-4">Punkty zarobione</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pointStatistics.earned}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="points"
                    >
                      {pointStatistics.earned.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`+${value} BS`, name]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="card">
                <h3 className="text-xl font-bold text-white mb-4">Punkty stracone</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={pointStatistics.lost}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="source" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} BS`, 'Stracone']} />
                    <Bar dataKey="points" fill="#ff4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Weekly Points Trend */}
            <div className="card">
              <h3 className="text-xl font-bold text-white mb-4">Trend punktów tygodniowych</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={pointStatistics.weekly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="earned" stackId="1" stroke="#477129" fill="#477129" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="lost" stackId="1" stroke="#ff4444" fill="#ff4444" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="net" stackId="2" stroke="#00ccff" fill="#00ccff" fillOpacity={0.8} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Points Sources Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-xl font-bold text-white mb-4">Źródła punktów dodatnich</h3>
                <div className="space-y-3">
                  {pointStatistics.earned.map((source, index) => (
                    <div key={index} className="flex items-center justify-between bg-black bg-opacity-30 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: source.color }}></div>
                        <span className="text-white">{source.source}</span>
                      </div>
                      <span className="text-green-400 font-bold">+{source.points} BS</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 className="text-xl font-bold text-white mb-4">Źródła punktów ujemnych</h3>
                <div className="space-y-3">
                  {pointStatistics.lost.map((source, index) => (
                    <div key={index} className="flex items-center justify-between bg-black bg-opacity-30 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: source.color }}></div>
                        <span className="text-white">{source.source}</span>
                      </div>
                      <span className="text-red-400 font-bold">{source.points} BS</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Overall Statistics */}
        {activeTab === 'overall' && (
          <motion.div
            key="overall"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card text-center">
                <div className="text-4xl font-bold text-gold-400 mb-2">
                  {statistics.overall.totalPoints}
                </div>
                <div className="text-gray-300">Łączne punkty</div>
              </div>
              <div className="card text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">
                  {statistics.overall.totalTasks}
                </div>
                <div className="text-gray-300">Łączne zadania</div>
              </div>
              <div className="card text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">
                  {statistics.overall.completionRate.toFixed(1)}%
                </div>
                <div className="text-gray-300">Wskaźnik ukończenia</div>
              </div>
            </div>

            <div className="card text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Osiągnięcia</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black bg-opacity-30 rounded-lg p-4">
                  <div className="text-3xl mb-2">🏆</div>
                  <div className="text-sm text-gray-300">Mistrz Dyscypliny</div>
                </div>
                <div className="bg-black bg-opacity-30 rounded-lg p-4">
                  <div className="text-3xl mb-2">⚡</div>
                  <div className="text-sm text-gray-300">Kreatywny Geniusz</div>
                </div>
                <div className="bg-black bg-opacity-30 rounded-lg p-4">
                  <div className="text-3xl mb-2">🎯</div>
                  <div className="text-sm text-gray-300">Celny Strzelec</div>
                </div>
                <div className="bg-black bg-opacity-30 rounded-lg p-4">
                  <div className="text-3xl mb-2">🔥</div>
                  <div className="text-sm text-gray-300">Płomień Pasji</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StatisticsTab;
