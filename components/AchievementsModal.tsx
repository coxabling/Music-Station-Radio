import React from 'react';
import type { UnlockedAchievement } from '../types';
import { ACHIEVEMENTS } from '../constants';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedAchievements: Record<string, UnlockedAchievement>;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ isOpen, onClose, unlockedAchievements }) => {
  if (!isOpen) return null;

  const sortedAchievements = Object.values(ACHIEVEMENTS).sort((a, b) => {
    const aUnlocked = !!unlockedAchievements[a.id];
    const bUnlocked = !!unlockedAchievements[b.id];
    if (aUnlocked === bUnlocked) return 0;
    return aUnlocked ? -1 : 1;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="achievements-modal-title"
    >
      <div 
        className="bg-gray-800/80 backdrop-blur-lg border accent-color-border/30 rounded-xl shadow-2xl shadow-black/50 w-full max-w-lg max-h-[80vh] flex flex-col animate-slide-up-fast"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-700/50 flex justify-between items-center">
          <h2 id="achievements-modal-title" className="text-lg font-bold accent-color-text font-orbitron">
            Achievements
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>
        
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sortedAchievements.map(ach => {
              const isUnlocked = !!unlockedAchievements[ach.id];
              const unlockedDate = isUnlocked ? formatDate(unlockedAchievements[ach.id].unlockedAt) : null;
              
              return (
                <div 
                  key={ach.id} 
                  className={`p-4 rounded-lg flex items-center gap-4 transition-all duration-300 ${isUnlocked ? 'bg-gray-700/50 border border-[var(--accent-color)]/30' : 'bg-gray-900/50 border border-gray-700/50'}`}
                >
                  <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full transition-colors ${isUnlocked ? 'bg-[var(--accent-color)] text-black' : 'bg-gray-800 text-gray-500'}`}>
                    <ach.icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold transition-colors ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>{ach.name}</h3>
                    <p className={`text-sm transition-colors ${isUnlocked ? 'text-gray-300' : 'text-gray-500'}`}>{ach.description}</p>
                    {isUnlocked && <p className="text-xs text-[var(--accent-color)]/80 mt-1 font-mono">{unlockedDate}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
       <style>{`
        @keyframes fade-in-fast { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in-fast { animation: fade-in-fast 0.3s ease-out; }
        @keyframes slide-up-fast { from { transform: translateY(20px) scale(0.98); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        .animate-slide-up-fast { animation: slide-up-fast 0.3s ease-out; }
      `}</style>
    </div>
  );
};
