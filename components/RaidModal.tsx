import React, { useState, useMemo } from 'react';
import type { Station } from '../types';

interface RaidModalProps {
  isOpen: boolean;
  onClose: () => void;
  allStations: Station[];
  currentStation: Station;
  onStartRaid: (targetStation: Station) => void;
}

const SearchIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const RocketIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v.01l-.001.001l-.001.001a5.98 5.98 0 01-5.03-1.93l-1.5-1.5a5.984 5.984 0 01-1.42-2.37l-.29-1.01a5.982 5.982 0 01-1.04-3.12 5.982 5.982 0 013.12-1.04l1.01-.29a5.984 5.984 0 012.37-1.42l1.5-1.5a5.984 5.984 0 011.93-5.03l.001-.001.001-.001.01 0a6 6 0 017.38 5.84z" /></svg>;


export const RaidModal: React.FC<RaidModalProps> = ({ isOpen, onClose, allStations, currentStation, onStartRaid }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const raidTargets = useMemo(() => {
    return allStations.filter(station => 
      station.streamUrl !== currentStation.streamUrl &&
      (station.name.toLowerCase().includes(searchQuery.toLowerCase()) || station.genre.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allStations, currentStation, searchQuery]);

  const handleRaidClick = (station: Station) => {
    onStartRaid(station);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="raid-modal-title"
    >
      <div 
        className="bg-gray-800/80 backdrop-blur-lg border accent-color-border/30 rounded-xl shadow-2xl shadow-black/50 w-full max-w-lg max-h-[80vh] flex flex-col animate-slide-up-fast"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-700/50 flex justify-between items-center">
          <h2 id="raid-modal-title" className="text-lg font-bold accent-color-text font-orbitron">
            Select a Raid Target
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>
        
        <div className="p-4">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search for a station to raid..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-900/50 border border-gray-600 rounded-md py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-all"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                    <SearchIcon className="h-5 w-5" />
                </div>
            </div>
        </div>

        <div className="flex-grow overflow-y-auto p-4 pt-0">
          <ul className="space-y-2">
            {raidTargets.map(station => (
              <li key={station.streamUrl}>
                <button 
                  onClick={() => handleRaidClick(station)}
                  className="w-full text-left flex items-center gap-4 p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/60 transition-colors"
                >
                  <img src={station.coverArt} alt={station.name} className="w-12 h-12 rounded-md object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">{station.name}</p>
                    <p className="text-sm text-gray-400 truncate">{station.genre}</p>
                  </div>
                  <div className="flex items-center gap-2 text-purple-400 bg-purple-500/10 border border-purple-500/30 px-3 py-1.5 rounded-full text-sm font-semibold">
                    <RocketIcon className="w-4 h-4" />
                    Raid
                  </div>
                </button>
              </li>
            ))}
          </ul>
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
