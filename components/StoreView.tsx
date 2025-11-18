
import React from 'react';
import type { Theme, ThemeName } from '../types';
import { THEMES, StarIcon, LockIcon, CheckCircleIcon } from '../constants';

interface StoreViewProps {
  activeTheme: ThemeName;
  onSetTheme: (themeName: ThemeName) => void;
  unlockedThemes: Set<ThemeName>;
  onUnlockTheme: (theme: Theme) => void;
  currentPoints: number;
}

const PaintBrushIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>;

export const StoreView: React.FC<StoreViewProps> = ({ activeTheme, onSetTheme, unlockedThemes, onUnlockTheme, currentPoints }) => {
  return (
    <div className="p-4 md:p-8 animate-fade-in h-full overflow-y-auto">
        <div className="max-w-6xl mx-auto">
            <header className="text-center mb-12 relative">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[var(--accent-color)]/10 rounded-full blur-[100px] pointer-events-none"></div>
                <h1 className="text-4xl font-bold font-orbitron text-white flex items-center justify-center gap-3 mb-2 relative z-10">
                    <PaintBrushIcon />
                    Theme Store
                </h1>
                <p className="text-gray-400 max-w-xl mx-auto relative z-10">
                    Personalize your radio interface. Spend your hard-earned points on exclusive visual themes.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gray-800/80 rounded-full border border-yellow-500/30 text-yellow-400 shadow-lg relative z-10">
                    <StarIcon className="w-5 h-5"/>
                    <span className="font-bold text-lg">{currentPoints.toLocaleString()}</span>
                    <span className="text-xs uppercase tracking-wider opacity-80 ml-1">Points Available</span>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {THEMES.map((theme, index) => {
                    const isUnlocked = unlockedThemes.has(theme.name);
                    const isActive = activeTheme === theme.name;
                    const canAfford = theme.cost ? currentPoints >= theme.cost : true;

                    return (
                        <div
                            key={theme.name}
                            className={`group relative flex flex-col bg-gray-900 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl overflow-hidden ${
                                isActive 
                                ? 'border-[var(--accent-color)] shadow-[0_0_20px_rgba(var(--accent-color-rgb),0.2)]' 
                                : 'border-gray-800 hover:border-gray-600'
                            } animate-fade-in-up`}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Preview Area */}
                            <div 
                                className="h-32 w-full relative overflow-hidden"
                                style={{ background: theme.gradient || theme.color }}
                            >
                                {isActive && (
                                    <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                        <CheckCircleIcon className="w-3 h-3" /> Active
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
                            </div>

                            {/* Content */}
                            <div className="p-5 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-white font-orbitron">{theme.displayName}</h3>
                                </div>
                                <p className="text-xs text-gray-400 mb-6 flex-grow leading-relaxed">
                                    {theme.description || 'A unique visual style for your player.'}
                                </p>

                                {!isUnlocked && theme.cost ? (
                                    <button
                                        onClick={() => onUnlockTheme(theme)}
                                        disabled={!canAfford}
                                        className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                                            canAfford 
                                            ? 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-black shadow-lg shadow-orange-900/20 transform active:scale-95' 
                                            : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                                        }`}
                                        aria-label={`Unlock ${theme.displayName} for ${theme.cost} points`}
                                    >
                                        {canAfford ? <LockIcon className="w-4 h-4"/> : <LockIcon className="w-4 h-4 opacity-50"/>}
                                        <span>Unlock for {theme.cost}</span>
                                        <StarIcon className="w-3 h-3"/>
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => onSetTheme(theme.name)}
                                        disabled={isActive}
                                        className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                                            isActive
                                            ? 'bg-gray-800 text-[var(--accent-color)] border border-[var(--accent-color)]/30 cursor-default'
                                            : 'bg-white text-black hover:bg-gray-200 hover:shadow-lg transform active:scale-95'
                                        }`}
                                    >
                                        {isActive ? 'Selected' : 'Apply Theme'}
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    </div>
  );
};
