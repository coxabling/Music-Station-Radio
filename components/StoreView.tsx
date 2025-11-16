import React from 'react';
import type { Theme, ThemeName } from '../types';
import { THEMES, StarIcon, LockIcon } from '../constants';

interface StoreViewProps {
  activeTheme: ThemeName;
  onSetTheme: (themeName: ThemeName) => void;
  unlockedThemes: Set<ThemeName>;
  onUnlockTheme: (theme: Theme) => void;
  currentPoints: number;
}

export const StoreView: React.FC<StoreViewProps> = ({ activeTheme, onSetTheme, unlockedThemes, onUnlockTheme, currentPoints }) => {
  return (
    <div className="p-4 md:p-8 animate-fade-in">
        <div className="max-w-2xl mx-auto">
            <header className="text-center mb-8">
                <h1 className="text-3xl font-bold font-orbitron accent-color-text">
                    Theme Store
                </h1>
                <p className="text-gray-400 mt-2">Customize your listening experience. Use your points to unlock new themes.</p>
            </header>

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
  );
};
