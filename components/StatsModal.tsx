import React, { useMemo } from 'react';
import type { ListeningStats, StationPlayData } from '../types';
import { formatTime } from '../utils/time';
import { ACHIEVEMENTS } from '../constants';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: ListeningStats;
}

const RadioIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" /><path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 4a1 1 0 10-2 0v1a1 1 0 102 0v-1zm5-1a1 1 0 00-1 1v1a1 1 0 102 0v-1a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;

const StatCard: React.FC<{ icon: React.ReactNode; value: string | number; label: string; }> = ({ icon, value, label }) => (
    <div className="bg-gray-900/50 p-3 rounded-lg text-center flex flex-col justify-between">
        <div className="flex-grow flex justify-center items-center h-8 mb-1">
            {icon}
        </div>
        <div>
          <p className="text-xl font-bold font-orbitron accent-color-text">{value}</p>
          <p className="text-xs text-gray-400">{label}</p>
        </div>
    </div>
);

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, stats }) => {
  const topStations = useMemo(() => 
    (Object.entries(stats.stationPlays) as [string, StationPlayData][])
      .sort(([, a], [, b]) => b.time - a.time)
      .slice(0, 5),
    [stats]
  );

  const topGenres = useMemo(() => {
    const genreTimes: Record<string, number> = {};
    (Object.values(stats.stationPlays) as StationPlayData[]).forEach(play => {
      const mainGenre = play.genre.split('/')[0].trim();
      genreTimes[mainGenre] = (genreTimes[mainGenre] || 0) + play.time;
    });
    return Object.entries(genreTimes)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }, [stats]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="stats-modal-title">
      <div className="bg-gray-800/80 backdrop-blur-lg border accent-color-border/30 rounded-xl shadow-2xl shadow-black/50 w-full max-w-md max-h-[80vh] flex flex-col animate-slide-up-fast" onClick={(e) => e.stopPropagation()}>
        <header className="p-4 border-b border-gray-700/50 flex justify-between items-center">
          <h2 id="stats-modal-title" className="text-lg font-bold accent-color-text font-orbitron">Listening Stats</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </header>
        
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="text-center bg-gray-900/50 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Total Listening Time</p>
            <p className="text-3xl font-bold font-orbitron accent-color-text">{formatTime(stats.totalTime)}</p>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-300 mb-2">Highlights</h3>
            <div className="grid grid-cols-3 gap-3">
              <StatCard 
                  icon={<ACHIEVEMENTS.streak_3.icon className="h-6 w-6 text-orange-400" />} 
                  value={`${stats.currentStreak || 0} days`} 
                  label="Current Streak" 
              />
              <StatCard 
                  icon={<RadioIcon className="h-6 w-6 text-fuchsia-400" />}
                  value={Object.keys(stats.stationPlays).length} 
                  label="Stations Played" 
              />
              <StatCard 
                  icon={<ACHIEVEMENTS.explorer_3.icon className="h-6 w-6 text-emerald-400" />}
                  value={stats.genresPlayed?.length || 0} 
                  label="Genres Explored" 
              />
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-300 mb-2">Top Stations</h3>
            <ul className="space-y-2">
              {topStations.length > 0 ? topStations.map(([url, data]) => (
                <li key={url} className="flex justify-between items-center bg-gray-700/30 p-2 rounded-md text-sm">
                  <span className="font-semibold text-white truncate pr-4">{data.name}</span>
                  <span className="text-gray-400 font-mono">{formatTime(data.time)}</span>
                </li>
              )) : <p className="text-sm text-gray-500 text-center">Start listening to see your top stations!</p>}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-300 mb-2">Top Genres</h3>
            <ul className="space-y-2">
              {topGenres.length > 0 ? topGenres.map(([genre, time]) => (
                <li key={genre} className="flex justify-between items-center bg-gray-700/30 p-2 rounded-md text-sm">
                  <span className="font-semibold text-white">{genre}</span>
                  <span className="text-gray-400 font-mono">{formatTime(time)}</span>
                </li>
              )) : <p className="text-sm text-gray-500 text-center">Your top genres will appear here.</p>}
            </ul>
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
