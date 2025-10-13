import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SaveStatusInsightsProps {
  isVisible: boolean;
  onClose: () => void;
  onShowHistory: () => void;
  onShowStatistics: () => void;
  onShowSettings: () => void;
  onShowDashboard: () => void;
  onShowOverview: () => void;
  onShowMonitor: () => void;
  onShowAnalytics: () => void;
}

const SaveStatusInsights: React.FC<SaveStatusInsightsProps> = ({
  isVisible,
  onClose,
  onShowHistory,
  onShowStatistics,
  onShowSettings,
  onShowDashboard,
  onShowOverview,
  onShowMonitor,
  onShowAnalytics
}) => {
  const [insights, setInsights] = useState({
    saveFrequency: 0,
    averageSaveTime: 0,
    successRate: 0,
    errorRate: 0,
    peakSaveHours: [] as string[],
    recommendations: [] as string[],
    patterns: [] as string[],
    trends: [] as string[]
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isVisible) {
      loadInsights();
    }
  }, [isVisible]);

  const loadInsights = async () => {
    setIsLoading(true);
    
    try {
      // Simulate loading insights data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock insights data
      setInsights({
        saveFrequency: 12,
        averageSaveTime: 1.2,
        successRate: 98.5,
        errorRate: 1.5,
        peakSaveHours: ['09:00', '13:00', '17:00'],
        recommendations: [
          'Rozważ włączenie automatycznego zapisywania',
          'Zapisz dane przed zamknięciem aplikacji',
          'Sprawdź połączenie internetowe przed zapisem'
        ],
        patterns: [
          'Najczęściej zapisujesz w godzinach porannych',
          'Większość zapisów odbywa się automatycznie',
          'Rzadko występują błędy zapisu'
        ],
        trends: [
          'Zwiększona częstotliwość zapisów w ostatnim tygodniu',
          'Stabilna wydajność systemu zapisywania',
          'Dobra synchronizacja z chmurą'
        ]
      });
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    if (recommendation.includes('automatycznego')) return 'text-blue-600';
    if (recommendation.includes('połączenie')) return 'text-red-600';
    return 'text-green-600';
  };

  const getPatternColor = (pattern: string) => {
    if (pattern.includes('porannych')) return 'text-yellow-600';
    if (pattern.includes('automatycznie')) return 'text-green-600';
    return 'text-blue-600';
  };

  const getTrendColor = (trend: string) => {
    if (trend.includes('Zwiększona')) return 'text-green-600';
    if (trend.includes('Stabilna')) return 'text-blue-600';
    return 'text-purple-600';
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Insights & Analytics</h2>
                  <p className="text-purple-100">Analiza wzorców zapisywania i rekomendacje</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-purple-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Częstotliwość zapisów</p>
                        <p className="text-2xl font-bold text-blue-600">{insights.saveFrequency}/dzień</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Średni czas zapisu</p>
                        <p className="text-2xl font-bold text-green-600">{insights.averageSaveTime}s</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Wskaźnik sukcesu</p>
                        <p className="text-2xl font-bold text-purple-600">{insights.successRate}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Wskaźnik błędów</p>
                        <p className="text-2xl font-bold text-red-600">{insights.errorRate}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Peak Save Hours */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Godziny szczytu zapisów</h3>
                  <div className="flex flex-wrap gap-2">
                    {insights.peakSaveHours.map((hour, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {hour}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-yellow-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Rekomendacje</h3>
                  <div className="space-y-3">
                    {insights.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <p className={`text-sm ${getRecommendationColor(recommendation)}`}>
                          {recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Patterns */}
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Wzorce</h3>
                  <div className="space-y-3">
                    {insights.patterns.map((pattern, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <p className={`text-sm ${getPatternColor(pattern)}`}>
                          {pattern}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trends */}
                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Trendy</h3>
                  <div className="space-y-3">
                    {insights.trends.map((trend, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </div>
                        <p className={`text-sm ${getTrendColor(trend)}`}>
                          {trend}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={onShowHistory}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
              >
                Historia
              </button>
              <button
                onClick={onShowStatistics}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
              >
                Statystyki
              </button>
              <button
                onClick={onShowSettings}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
              >
                Ustawienia
              </button>
              <button
                onClick={onShowDashboard}
                className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium"
              >
                Dashboard
              </button>
              <button
                onClick={onShowOverview}
                className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
              >
                Przegląd
              </button>
              <button
                onClick={onShowMonitor}
                className="px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors text-sm font-medium"
              >
                Monitor
              </button>
              <button
                onClick={onShowAnalytics}
                className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors text-sm font-medium"
              >
                Analytics
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SaveStatusInsights;