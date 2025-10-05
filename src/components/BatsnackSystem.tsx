import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Plus, Minus } from 'lucide-react';

interface BatsnackSystemProps {
  points: number;
  onAddPoints: (points: number) => void;
}

const BatsnackSystem: React.FC<BatsnackSystemProps> = ({ points, onAddPoints }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showPositiveMenu, setShowPositiveMenu] = useState(false);
  const [showNegativeMenu, setShowNegativeMenu] = useState(false);

  const pointCategories = [
    { name: 'Nadprogramowy +1km', points: 1, icon: '🏃' },
    { name: 'Grafika/Muzyka (niezwiązane z Miloverse)', points: 2, icon: '🎨' },
    { name: 'Grafika/Muzyka (związane z Miloverse)', points: 3, icon: '🎵' },
    { name: 'Zainicjowanie nowego projektu', points: 4, icon: '🚀' },
    { name: 'Domknięcie/Upload projektu', points: 7, icon: '✅' }
  ];

  const penaltyCategories = [
    { name: 'Brak refleksji/mantry/aktywności/czytania', points: -1, icon: '❌' },
    { name: 'Brak Passions Pills', points: -2, icon: '💊' },
    { name: 'Prozaiczne (śniadanie, higiena, czytanie mało rozwojowe)', points: -0.5, icon: '😴' }
  ];

  const addPoints = (pointValue: number) => {
    onAddPoints(pointValue);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <Zap className="text-yellow-400" size={32} />
          BATS'NACK SYSTEM
        </h2>
        <div className="text-4xl font-bold text-cyan-400">
          {points}BS[🦇]
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowPositiveMenu(!showPositiveMenu)}
            className="w-full bg-gradient-to-r from-green-600 to-green-800 rounded-lg p-4 text-left hover:from-green-500 hover:to-green-700 transition-all mb-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">➕</span>
                <span className="text-white font-bold text-lg">Punkty Dodatnie</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-300 font-bold">Rozwiń</span>
                <motion.div
                  animate={{ rotate: showPositiveMenu ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Plus size={20} />
                </motion.div>
              </div>
            </div>
          </motion.button>

          <motion.div
            initial={false}
            animate={{ 
              height: showPositiveMenu ? 'auto' : 0,
              opacity: showPositiveMenu ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-2">
              {pointCategories.map((category, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addPoints(category.points)}
                  className="w-full bg-gradient-to-r from-green-700 to-green-900 rounded-lg p-3 text-left hover:from-green-600 hover:to-green-800 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{category.icon}</span>
                      <span className="text-white font-medium">{category.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-300 font-bold">+{category.points}</span>
                      <Plus size={16} />
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        <div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowNegativeMenu(!showNegativeMenu)}
            className="w-full bg-gradient-to-r from-red-600 to-red-800 rounded-lg p-4 text-left hover:from-red-500 hover:to-red-700 transition-all mb-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">➖</span>
                <span className="text-white font-bold text-lg">Punkty Ujemne</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-300 font-bold">Rozwiń</span>
                <motion.div
                  animate={{ rotate: showNegativeMenu ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Minus size={20} />
                </motion.div>
              </div>
            </div>
          </motion.button>

          <motion.div
            initial={false}
            animate={{ 
              height: showNegativeMenu ? 'auto' : 0,
              opacity: showNegativeMenu ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-2">
              {penaltyCategories.map((category, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addPoints(category.points)}
                  className="w-full bg-gradient-to-r from-red-700 to-red-900 rounded-lg p-3 text-left hover:from-red-600 hover:to-red-800 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{category.icon}</span>
                      <span className="text-white font-medium">{category.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-300 font-bold">{category.points}</span>
                      <Minus size={16} />
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="btn-secondary text-sm"
        >
          {showDetails ? 'Ukryj' : 'Pokaż'} szczegóły systemu punktowego
        </button>
        
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-4 bg-black bg-opacity-30 rounded-lg"
          >
            <p className="text-sm text-gray-300 mb-2">
              Punkty kumulują się przez cały tydzień. Możesz je wykorzystać do skipowania zadań z czystym sumieniem.
            </p>
            <p className="text-sm text-gray-300">
              System punktowy pozwala na elastyczność w realizacji celów, ale pamiętaj o konsekwencjach.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default BatsnackSystem;
