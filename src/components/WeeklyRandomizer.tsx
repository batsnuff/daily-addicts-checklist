import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle } from 'lucide-react';

interface WeeklyRandomizerProps {
  onScheduleGenerated: (schedule: WeeklySchedule) => void;
}

interface WeeklySchedule {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

const WeeklyRandomizer: React.FC<WeeklyRandomizerProps> = ({ onScheduleGenerated }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<WeeklySchedule | null>(null);
  const [showResult, setShowResult] = useState(false);

  const creativeActivities = [
    { name: '💻 Kodowanie', duration: '1.5h', points: 3 },
    { name: '🎵 Muzyka', duration: '1h', points: 2 },
    { name: '🖼️ Grafika Cyfrowa', duration: '1.5h', points: 3 },
    { name: '✍️ Pisanie', duration: '1h', points: 2 },
    { name: '🎨 Malarstwo', duration: '1h', points: 2 },
    { name: '🎭 Wytwórnia/Persony', duration: '1.5h', points: 3 },
    { name: '🎙️ Studio/Produkcja', duration: '1h', points: 2 },
    { name: '📚 Czytanie rozwojowe', duration: '1h', points: 1 },
    { name: '🧘 Medytacja kreatywna', duration: '30min', points: 1 }
  ];

  const generateRandomSchedule = (): WeeklySchedule => {
    const shuffled = [...creativeActivities].sort(() => Math.random() - 0.5);
    
    return {
      monday: shuffled[0]?.name || '💻 Kodowanie',
      tuesday: shuffled[1]?.name || '🎵 Muzyka',
      wednesday: shuffled[2]?.name || '🖼️ Grafika Cyfrowa',
      thursday: shuffled[3]?.name || '✍️ Pisanie',
      friday: shuffled[4]?.name || '🎨 Malarstwo',
      saturday: shuffled[5]?.name || '🎭 Wytwórnia/Persony',
      sunday: shuffled[6]?.name || '🎙️ Studio/Produkcja'
    };
  };

  const handleSpin = () => {
    setIsSpinning(true);
    setShowResult(false);
    
    // Symulacja losowania
    setTimeout(() => {
      const newSchedule = generateRandomSchedule();
      setCurrentSchedule(newSchedule);
      setIsSpinning(false);
      setShowResult(true);
      onScheduleGenerated(newSchedule);
    }, 3000);
  };

  const getDayColor = (day: string) => {
    const colors = {
      monday: 'from-blue-500 to-blue-700',
      tuesday: 'from-green-500 to-green-700',
      wednesday: 'from-purple-500 to-purple-700',
      thursday: 'from-yellow-500 to-yellow-700',
      friday: 'from-pink-500 to-pink-700',
      saturday: 'from-orange-500 to-orange-700',
      sunday: 'from-red-500 to-red-700'
    };
    return colors[day as keyof typeof colors] || 'from-gray-500 to-gray-700';
  };

  const getDayName = (day: string) => {
    const names = {
      monday: 'Poniedziałek',
      tuesday: 'Wtorek',
      wednesday: 'Środa',
      thursday: 'Czwartek',
      friday: 'Piątek',
      saturday: 'Sobota',
      sunday: 'Niedziela'
    };
    return names[day as keyof typeof names] || day;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card mb-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <Shuffle className="text-purple-400" size={32} />
          MASZYNA LOSUJĄCA
        </h2>
        <p className="text-lg text-purple-400 mb-2">
          Wygeneruj harmonogram kreatywny na następny tydzień
        </p>
        <p className="text-sm text-gray-400">
          Każda niedziela = nowy losowy harmonogram Passions Pills
        </p>
      </div>

      {/* Spin Button */}
      <div className="text-center mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSpin}
          disabled={isSpinning}
          className={`btn-primary text-xl px-8 py-4 ${
            isSpinning ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSpinning ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="flex items-center gap-3"
            >
              <Shuffle size={24} />
              LOSUJĘ...
            </motion.div>
          ) : (
            <div className="flex items-center gap-3">
              <Shuffle size={24} />
              LOSUJ HARMONOGRAM
            </div>
          )}
        </motion.button>
      </div>

      {/* Result */}
      <AnimatePresence>
        {showResult && currentSchedule && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="space-y-4"
          >
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-blue-400 mb-2">
                🎲 NOWY HARMONOGRAM TYGODNIOWY
              </h3>
              <p className="text-gray-300">
                Twój losowy plan kreatywny na następny tydzień
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(currentSchedule).map(([day, activity], index) => (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg bg-gradient-to-r ${getDayColor(day)} border-2 border-white/20`}
                >
                  <div className="text-center">
                    <div className="text-sm font-bold text-white mb-1">
                      {getDayName(day)}
                    </div>
                    <div className="text-lg font-bold text-white">
                      {activity}
                    </div>
                    <div className="text-xs text-white/80 mt-1">
                      19:30-22:00
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg border border-purple-500">
              <div className="text-center">
                <div className="text-lg font-bold text-purple-300 mb-2">
                  🎯 HARMONOGRAM ZAPISANY
                </div>
                <div className="text-sm text-purple-200">
                  Nowy plan będzie aktywny od poniedziałku
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info */}
      <div className="mt-6 text-center">
        <div className="text-sm text-gray-400">
          🎲 Maszyna losuje 7 różnych aktywności kreatywnych na każdy dzień tygodnia
        </div>
      </div>
    </motion.div>
  );
};

export default WeeklyRandomizer;
