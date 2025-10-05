import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Sparkles } from 'lucide-react';

interface CasinoAnimationProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (selectedPills: string[]) => void;
}

const passionsPills = [
  { id: 1, name: 'Kodowanie', icon: '💻', color: '#00ff88' },
  { id: 2, name: 'Muzyka', icon: '🎵', color: '#ff6b00' },
  { id: 3, name: 'Malarstwo', icon: '🎨', color: '#ff00ff' },
  { id: 4, name: 'Pisanie', icon: '✍️', color: '#00ccff' },
  { id: 5, name: 'Studio', icon: '🎙️', color: '#ffcc00' },
  { id: 6, name: 'Grafika', icon: '🖼️', color: '#ff3366' },
  { id: 7, name: 'Fotografia', icon: '📸', color: '#33ff66' },
  { id: 8, name: 'Design', icon: '🎭', color: '#6633ff' }
];

const CasinoAnimation: React.FC<CasinoAnimationProps> = ({ isOpen, onClose, onComplete }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedPills, setSelectedPills] = useState<string[]>([]);
  const [currentPills, setCurrentPills] = useState<string[]>([]);
  const [spinCount, setSpinCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setSelectedPills([]);
      setCurrentPills([]);
      setSpinCount(0);
    }
  }, [isOpen]);

  const startSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setSpinCount(prev => prev + 1);
    
    // Generate random pills for the spin
    const shuffled = [...passionsPills].sort(() => Math.random() - 0.5);
    const randomPills = shuffled.slice(0, 3).map(pill => pill.name);
    setCurrentPills(randomPills);
    
    // Stop spinning after animation
    setTimeout(() => {
      setIsSpinning(false);
      if (spinCount >= 2) {
        // Final selection after 3 spins
        setSelectedPills(randomPills);
        setTimeout(() => {
          onComplete(randomPills);
          onClose();
        }, 2000);
      }
    }, 3000);
  };

  const getPillColor = (pillName: string) => {
    const pill = passionsPills.find(p => p.name === pillName);
    return pill?.color || '#00ff88';
  };

  const getPillIcon = (pillName: string) => {
    const pill = passionsPills.find(p => p.name === pillName);
    return pill?.icon || '💊';
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-8 border-4 border-yellow-400 shadow-2xl max-w-2xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            animate={{ rotate: isSpinning ? 360 : 0 }}
            transition={{ duration: 0.5, repeat: isSpinning ? Infinity : 0 }}
            className="text-6xl mb-4"
          >
            🎰
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-2 glow-text">
            KASYNOWA MASZYNA LOSUJĄCA
          </h2>
          <p className="text-cyan-300 text-lg">
            Losowanie Passions Pills na nadchodzący tydzień
          </p>
        </div>

        {/* Casino Machine Display */}
        <div className="bg-black bg-opacity-50 rounded-xl p-6 mb-6 border-2 border-yellow-400">
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[0, 1, 2].map((slot) => (
              <motion.div
                key={slot}
                className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg p-4 text-center border-2 border-gray-600"
                animate={isSpinning ? {
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                } : {}}
                transition={{ duration: 0.3, repeat: isSpinning ? Infinity : 0 }}
              >
                <div className="text-4xl mb-2">
                  {currentPills[slot] ? getPillIcon(currentPills[slot]) : '💊'}
                </div>
                <div 
                  className="text-sm font-bold text-white"
                  style={{ color: currentPills[slot] ? getPillColor(currentPills[slot]) : '#666' }}
                >
                  {currentPills[slot] || '...'}
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Spin Counter */}
          <div className="text-center text-yellow-400 font-bold">
            Spin {spinCount + 1}/3
          </div>
        </div>

        {/* Selected Pills Display */}
        {selectedPills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              🎉 WYBRANE PASSIONS PILLS 🎉
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {selectedPills.map((pill, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-3 text-center border-2 border-purple-400"
                >
                  <div className="text-2xl mb-1">{getPillIcon(pill)}</div>
                  <div className="text-white font-bold text-sm">{pill}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Controls */}
        <div className="flex gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startSpin}
            disabled={isSpinning || spinCount >= 3}
            className={`btn-primary text-lg px-6 py-3 ${
              isSpinning || spinCount >= 3 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <RotateCcw size={20} className="inline mr-2" />
            {isSpinning ? 'Losowanie...' : spinCount >= 3 ? 'Zakończone' : 'Losuj'}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="btn-secondary text-lg px-6 py-3"
          >
            <X size={20} className="inline mr-2" />
            Zamknij
          </motion.button>
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center text-sm text-gray-300">
          <p>🎲 Kliknij "Losuj" aby wylosować 3 Passions Pills na nadchodzący tydzień</p>
          <p>✨ Każdy spin to nowa szansa na idealne połączenie!</p>
        </div>

        {/* Sparkle Effects */}
        <AnimatePresence>
          {isSpinning && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: Math.random() * 400 - 200,
                    y: Math.random() * 200 - 100
                  }}
                  transition={{ 
                    duration: 1,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatDelay: 0.5
                  }}
                  className="absolute pointer-events-none"
                >
                  <Sparkles className="text-yellow-400" size={20} />
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default CasinoAnimation;
