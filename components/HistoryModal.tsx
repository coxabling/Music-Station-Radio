import React from 'react';
import type { SongHistoryItem } from '../types';
import { formatTimeAgo } from '../utils/time';

interface SongHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: SongHistoryItem[];
}

const ShoppingCartIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /></svg>;


export const SongHistoryModal: React.FC<SongHistoryModalProps> = ({ isOpen, onClose, history }) => {
  if (!isOpen) return null;

  const handleBuyNow = (item: SongHistoryItem) => {
    const affiliateTag = 'coxabling0e-21';
    const searchQuery = encodeURIComponent(`${item.artist} ${item.title}`);
    const url = `https://www.amazon.com/s?k=${searchQuery}&tag=${affiliateTag}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-modal-title"
    >
      <div 
        className="bg-gray-800/80 backdrop-blur-lg border accent-color-border/30 rounded-xl shadow-2xl shadow-black/50 w-full max-w-md max-h-[80vh] flex flex-col animate-slide-up-fast"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-700/50 flex justify-between items-center">
          <h2 id="history-modal-title" className="text-lg font-bold accent-color-text font-orbitron">
            Listening History
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>
        
        <div className="p-6 overflow-y-auto">
          {history.length > 0 ? (
            <ul className="space-y-4">
              {history.map((item) => (
                <li key={`${item.songId}-${item.playedAt}`} className="flex items-center gap-4 animate-fade-in">
                  <img src={item.albumArt} alt={item.title} className="w-12 h-12 rounded-md object-cover shadow-lg" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate" title={item.title}>{item.title}</p>
                    <p className="text-sm text-gray-300 truncate" title={item.artist}>{item.artist}</p>
                    <p className="text-xs text-gray-500 truncate" title={item.stationName}>on {item.stationName}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <p className="text-xs text-gray-400 font-mono">{formatTimeAgo(item.playedAt)}</p>
                    <button
                        onClick={() => handleBuyNow(item)}
                        className="flex items-center gap-1.5 bg-gray-700/50 hover:bg-gray-700 text-xs text-gray-300 font-semibold py-1 px-2.5 rounded-full transition-colors"
                        title={`Buy ${item.title} on Amazon`}
                    >
                        <ShoppingCartIcon /> Buy
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-gray-400 py-10">
              <p className="text-lg font-semibold">No History Yet</p>
              <p className="text-sm mt-1">Start listening to a station to see your history appear here.</p>
            </div>
          )}
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