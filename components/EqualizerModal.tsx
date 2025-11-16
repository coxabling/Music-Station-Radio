import React from 'react';
import type { EQSettings } from '../types';
import { EQ_BANDS, EQ_PRESETS } from '../constants';

interface EqualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: EQSettings;
  onSettingsChange: (settings: EQSettings) => void;
}

export const EqualizerModal: React.FC<EqualizerModalProps> = ({ isOpen, onClose, settings, onSettingsChange }) => {
  if (!isOpen) return null;

  const handleGainChange = (index: number, value: number) => {
    const newValues = [...settings.values];
    newValues[index] = value;
    onSettingsChange({ ...settings, values: newValues });
  };
  
  const handleToggle = () => {
      onSettingsChange({ ...settings, on: !settings.on });
  }
  
  const handlePreset = (presetValues: number[]) => {
      onSettingsChange({ ...settings, values: presetValues });
  }

  const handleReset = () => {
    onSettingsChange({ ...settings, values: EQ_PRESETS[0].values });
  }

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="eq-modal-title"
    >
      <div 
        className="bg-gray-800/80 backdrop-blur-lg border accent-color-border/30 rounded-xl shadow-2xl shadow-black/50 w-full max-w-sm flex flex-col animate-slide-up-fast"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-700/50 flex justify-between items-center">
          <h2 id="eq-modal-title" className="text-lg font-bold accent-color-text font-orbitron">
            Audio Equalizer
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>
        
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">EQ {settings.on ? 'On' : 'Off'}</span>
                    <button onClick={handleToggle} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.on ? 'bg-[var(--accent-color)]' : 'bg-gray-600'}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.on ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
                <button onClick={handleReset} className="text-sm text-gray-400 hover:text-white">Reset</button>
            </div>
          
            <div className="flex justify-around items-end h-48" style={{ opacity: settings.on ? 1 : 0.5, transition: 'opacity 0.3s' }}>
                {EQ_BANDS.map((band, index) => (
                    <div key={band.freq} className="flex flex-col items-center">
                        <span className="text-xs text-gray-400 mb-2">{settings.values[index].toFixed(1)}</span>
                        <input
                            type="range"
                            min="-12"
                            max="12"
                            step="0.1"
                            value={settings.values[index]}
                            onChange={(e) => handleGainChange(index, parseFloat(e.target.value))}
                            className="w-24 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-[var(--accent-color)]"
                            style={{ writingMode: 'vertical-lr', direction: 'rtl', width: '8px', height: '120px' }}
                            disabled={!settings.on}
                        />
                        <span className="text-xs mt-2 font-mono">{band.freq < 1000 ? `${band.freq}` : `${band.freq / 1000}k`}</span>
                    </div>
                ))}
            </div>
            
            <div className="mt-6">
                <label className="text-sm font-semibold mb-2 block">Presets</label>
                <div className="grid grid-cols-3 gap-2">
                    {EQ_PRESETS.map(preset => (
                        <button key={preset.name} onClick={() => handlePreset(preset.values)} disabled={!settings.on} className="text-xs px-2 py-1.5 bg-gray-700/50 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                            {preset.name}
                        </button>
                    ))}
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
