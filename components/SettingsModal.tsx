
import React, { useState, useEffect } from 'react';
import { ClockIcon, MoonIcon, DeviceIcon } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDataSaver: boolean;
  onToggleDataSaver: () => void;
  sleepTimerTarget: number | null;
  onSetSleepTimer: (minutes: number | null) => void;
}

const ShortcutRow: React.FC<{ keys: string[]; action: string }> = ({ keys, action }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-700/50 last:border-0">
    <span className="text-sm text-gray-300">{action}</span>
    <div className="flex gap-1">
      {keys.map(k => (
        <kbd key={k} className="px-2 py-1 bg-gray-700 rounded text-xs font-mono text-gray-200 border border-gray-600 shadow-sm">
          {k}
        </kbd>
      ))}
    </div>
  </div>
);

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, onClose, isDataSaver, onToggleDataSaver, sleepTimerTarget, onSetSleepTimer 
}) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!sleepTimerTarget) return;
    const interval = setInterval(() => {
      const diff = sleepTimerTarget - Date.now();
      if (diff <= 0) {
        setTimeLeft('00:00');
      } else {
        const m = Math.floor(diff / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${m}:${s.toString().padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [sleepTimerTarget]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800/90 backdrop-blur-xl border accent-color-border/30 rounded-xl shadow-2xl shadow-black/50 w-full max-w-md flex flex-col animate-slide-up-fast max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-700/50 flex justify-between items-center">
          <h2 className="text-lg font-bold accent-color-text font-orbitron">Settings & Preferences</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </header>

        <div className="p-6 space-y-8">
            {/* Sleep Timer */}
            <section>
                <h3 className="text-white font-bold flex items-center gap-2 mb-3">
                    <ClockIcon className="w-5 h-5 text-[var(--accent-color)]"/> Sleep Timer
                </h3>
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
                    {sleepTimerTarget ? (
                        <div className="flex justify-between items-center">
                             <span className="text-green-400 font-mono text-xl animate-pulse">{timeLeft}</span>
                             <button 
                                onClick={() => onSetSleepTimer(null)} 
                                className="text-xs bg-red-500/20 hover:bg-red-500/40 text-red-300 px-3 py-1.5 rounded"
                             >
                                 Cancel Timer
                             </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 gap-2">
                            {[15, 30, 45, 60].map(min => (
                                <button 
                                    key={min} 
                                    onClick={() => onSetSleepTimer(min)}
                                    className="py-2 bg-gray-700 hover:bg-[var(--accent-color)] hover:text-black text-gray-200 rounded font-semibold text-sm transition-colors"
                                >
                                    {min}m
                                </button>
                            ))}
                        </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">Audio will fade out in the last minute.</p>
                </div>
            </section>

            {/* Data Saver */}
            <section>
                 <h3 className="text-white font-bold flex items-center gap-2 mb-3">
                    <DeviceIcon className="w-5 h-5 text-[var(--accent-color)]"/> Performance
                </h3>
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50 flex justify-between items-center">
                    <div>
                        <p className="text-sm font-semibold text-gray-200">Data Saver Mode</p>
                        <p className="text-xs text-gray-400">Disables visualizer & animations.</p>
                    </div>
                    <button 
                        onClick={onToggleDataSaver}
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isDataSaver ? 'bg-[var(--accent-color)]' : 'bg-gray-600'}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isDataSaver ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                </div>
            </section>

            {/* Shortcuts */}
            <section>
                 <h3 className="text-white font-bold flex items-center gap-2 mb-3">
                    <span className="text-xl">⌨️</span> Keyboard Shortcuts
                </h3>
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
                    <ShortcutRow keys={['Space']} action="Play / Pause" />
                    <ShortcutRow keys={['M']} action="Mute / Unmute" />
                    <ShortcutRow keys={['F']} action="Favorite Station" />
                    <ShortcutRow keys={['←', '→']} action="Change Station" />
                    <ShortcutRow keys={['Esc']} action="Close Modals" />
                </div>
            </section>
        </div>
      </div>
    </div>
  );
};
