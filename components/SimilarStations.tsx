import React, { useMemo } from 'react';
import type { Station } from '../types';

interface SimilarStationsProps {
  isOpen: boolean;
  station: Station;
  allStations: Station[];
  onSelectStation: (station: Station) => void;
  onClose: () => void;
}

export const SimilarStations: React.FC<SimilarStationsProps> = ({ isOpen, station, allStations, onSelectStation, onClose }) => {
  const similar = useMemo(() => {
    const currentGenre = station.genre.split('/')[0].trim().toLowerCase();
    return allStations.filter(s => 
      s.streamUrl !== station.streamUrl && 
      s.genre.toLowerCase().includes(currentGenre)
    ).slice(0, 4);
  }, [station, allStations]);

  if (!isOpen) return null;

  return (
    <div className="absolute bottom-full mb-2 w-64 right-0 bg-gray-800/80 backdrop-blur-lg border border-gray-600 rounded-lg shadow-2xl p-3 z-20 animate-fade-in-fast">
      <h4 className="text-sm font-bold text-white mb-2">Similar Stations</h4>
      {similar.length > 0 ? (
        <ul className="space-y-2">
          {similar.map(s => (
            <li key={s.streamUrl}>
              <button 
                onClick={() => { onSelectStation(s); onClose(); }} 
                className="w-full text-left flex items-center gap-2 p-1.5 rounded-md hover:bg-gray-700/50 transition-colors"
              >
                <img src={s.coverArt} alt={s.name} className="w-8 h-8 rounded-md object-cover" />
                <div>
                    <p className="text-xs font-semibold text-gray-200 truncate">{s.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{s.genre}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-gray-400">No similar stations found.</p>
      )}
      <style>{`
        @keyframes fade-in-fast { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out; }
      `}</style>
    </div>
  );
};
