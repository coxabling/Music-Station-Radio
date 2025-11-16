import React from 'react';
import type { Theme, ThemeName } from '../types';
import { THEMES, StarIcon, LockIcon } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTheme: ThemeName;
  onSetTheme: (themeName: ThemeName) => void;
  unlockedThemes: Set<ThemeName>;
  onUnlockTheme: (theme: Theme) => void;
  currentPoints: number;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, activeTheme, onSetTheme, unlockedThemes, onUnlockTheme, currentPoints }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      <div 
        className="bg-gray-800/80 backdrop-blur-lg border accent-color-border/30 rounded-xl shadow-2xl shadow-black/50 w-full max-w-md flex flex-col animate-slide-up-fast"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-700/50 flex justify-between items-center">
          <h2 id="settings-modal-title" className="text-lg font-bold accent-color-text font-orbitron">
            Theme Store
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        
        <div className="p-6 space-y-4">
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {THEMES.map((theme) => {
                        const isUnlocked = unlockedThemes.has(theme.name);
                        const canAfford = theme.cost ? currentPoints >= theme.cost : true;

                        return (
                            <div
                                key={theme.name}
                                className={`p-3 rounded-lg border-2 transition-all duration-200 relative overflow-hidden ${
                                    activeTheme === theme.name 
                                    ? 'border-[var(--accent-color)] accent-color-shadow bg-gray-700/50' 
                                    : 'border-gray-700 hover:border-gray-500 bg-gray-900/50'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: theme.color }}></div>
                                    <span className="font-semibold text-white">{theme.displayName}</span>
                                </div>

                                {!isUnlocked && theme.cost && (
                                    <button
                                        onClick={() => onUnlockTheme(theme)}
                                        disabled={!canAfford}
                                        className={`mt-3 w-full text-xs font-bold py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                                            canAfford 
                                            ? 'bg-yellow-500/80 hover:bg-yellow-500 text-black' 
                                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        <LockIcon className="w-3 h-3"/>
                                        Unlock for {theme.cost}
                                        <StarIcon className="w-3 h-3"/>
                                    </button>
                                )}
                                
                                {isUnlocked && (
                                     <button
                                        onClick={() => onSetTheme(theme.name)}
                                        className={`mt-3 w-full text-xs font-bold py-1.5 rounded-md transition-colors ${
                                            activeTheme === theme.name
                                            ? 'bg-gray-600 text-gray-300'
                                            : 'bg-cyan-500/80 hover:bg-cyan-500 text-black'
                                        }`}
                                     >
                                        {activeTheme === theme.name ? 'Selected' : 'Select'}
                                     </button>
                                )}
                            </div>
                        )
                    })}
                </div>
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
