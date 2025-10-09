import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertTriangle, Zap } from 'lucide-react';
import { Task } from '../types';

interface AutomaticPenaltiesProps {
  tasks: Task[];
  onAddPoints: (points: number) => void;
}

const AutomaticPenalties: React.FC<AutomaticPenaltiesProps> = ({ tasks, onAddPoints }) => {
  const [showNotification, setShowNotification] = useState<boolean>(false);

  const applyEveningPenalties = useCallback(() => {
    const eveningTasks = tasks.filter(task => task.category === 'evening');
    let totalPenalty = 0;
    const penalties: string[] = [];

    eveningTasks.forEach(task => {
      if (!task.completed) {
        switch (task.text.toLowerCase()) {
          case '22:00-22:30 - czytanie/komiksy (30 min)':
            totalPenalty -= 1;
            penalties.push('Brak czytania/komiksów: -1BS');
            break;
          case '22:30-23:00 - gaming lub rozciąganie (30 min)':
            totalPenalty -= 0.5;
            penalties.push('Brak gaming/rozciągania: -0.5BS');
            break;
          case '23:00-23:15 - kąpiel + przygotowanie na jutro':
            totalPenalty -= 1;
            penalties.push('Brak kąpieli: -1BS');
            break;
          case '23:15 - mantra/refleksja + mental checklist':
            totalPenalty -= 2;
            penalties.push('Brak mantry/refleksji: -2BS');
            break;
        }
      }
    });

    if (totalPenalty < 0) {
      onAddPoints(totalPenalty);
      
      // Zapisz kary do localStorage
      const penaltyData = {
        date: new Date().toISOString(),
        penalties: penalties,
        totalPenalty: totalPenalty
      };
      localStorage.setItem(`penalties_${new Date().toISOString().split('T')[0]}`, JSON.stringify(penaltyData));
    }
  }, [tasks, onAddPoints]);

  // Sprawdź czy jest 23:30 i czy nie zostały już zastosowane kary
  useEffect(() => {
    const checkPenalties = () => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const penaltyTime = 23 * 60 + 30; // 23:30

      // Sprawdź czy jest 23:30 lub później
      if (currentTime >= penaltyTime) {
        const today = now.toISOString().split('T')[0];
        const lastCheck = localStorage.getItem(`penalty_check_${today}`);
        
        if (!lastCheck) {
          applyEveningPenalties();
          localStorage.setItem(`penalty_check_${today}`, now.toISOString());
          setShowNotification(true);
          
          // Ukryj powiadomienie po 5 sekundach
          setTimeout(() => setShowNotification(false), 5000);
        }
      }
    };

    // Sprawdź co minutę
    const interval = setInterval(checkPenalties, 60000);
    
    // Sprawdź od razu
    checkPenalties();

    return () => clearInterval(interval);
  }, [tasks, applyEveningPenalties]);

  const getPenaltyStatus = () => {
    const today = new Date().toISOString().split('T')[0];
    const penaltyData = localStorage.getItem(`penalties_${today}`);
    
    if (penaltyData) {
      return JSON.parse(penaltyData);
    }
    return null;
  };

  const penaltyData = getPenaltyStatus();

  return (
    <>
      {/* Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.8 }}
            className="fixed top-4 right-4 z-50 bg-gradient-to-r from-red-600 to-red-800 rounded-lg p-4 border-2 border-red-400 shadow-lg max-w-sm"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-yellow-400" size={24} />
              <div>
                <div className="text-white font-bold">Automatyczne Kary!</div>
                <div className="text-red-200 text-sm">Sprawdź wieczorne zadania</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Penalty Status */}
      {penaltyData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6 bg-gradient-to-r from-red-900/30 to-red-800/30 border-red-500"
        >
          <div className="flex items-center gap-3 mb-4">
            <Clock className="text-red-400" size={24} />
            <h3 className="text-xl font-bold text-red-400">Automatyczne Kary - 23:30</h3>
          </div>
          
          <div className="space-y-2">
            {penaltyData.penalties.map((penalty: string, index: number) => (
              <div key={index} className="text-red-200 text-sm flex items-center gap-2">
                <Zap size={16} className="text-red-400" />
                {penalty}
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-red-800/50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-300">
                Łączna kara: {penaltyData.totalPenalty}BS[🦇]
              </div>
              <div className="text-sm text-red-200 mt-1">
                Zastosowano o {new Date(penaltyData.date).toLocaleTimeString('pl-PL')}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Next Check Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card mb-6 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-500"
      >
        <div className="flex items-center gap-3 mb-2">
          <Clock className="text-yellow-400" size={20} />
          <h4 className="text-lg font-bold text-yellow-400">Następna kontrola kar</h4>
        </div>
        <div className="text-yellow-200 text-sm">
          System automatycznie sprawdzi ukończenie zadań wieczornych o 23:30
        </div>
        <div className="text-yellow-300 text-xs mt-1">
          Kary: Brak czytania (-1BS), Brak gaming/rozciągania (-0.5BS), Brak kąpieli (-1BS), Brak mantry (-2BS)
        </div>
      </motion.div>
    </>
  );
};

export default AutomaticPenalties;
