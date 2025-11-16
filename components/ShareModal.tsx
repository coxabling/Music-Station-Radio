import React, { useState, useEffect, useCallback } from 'react';
import type { NowPlaying, Station } from '../types';
import { generateSongCard } from '../utils/cardGenerator';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  nowPlaying: NowPlaying | null;
  station: Station | null;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col justify-center items-center h-full text-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent-color)] mb-4"></div>
    <p className="text-gray-300 font-semibold">Generating your song card...</p>
    <p className="text-xs text-gray-500">This may take a moment.</p>
  </div>
);

const DownloadIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;


export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, nowPlaying, station }) => {
  const [cardImageUrl, setCardImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && nowPlaying && station) {
      setIsLoading(true);
      setError('');
      setCardImageUrl(null);
      
      // Generate card
      generateSongCard(nowPlaying, station)
        .then(url => {
          setCardImageUrl(url);
        })
        .catch(err => {
          console.error("Card generation failed:", err);
          setError('Could not generate the song card. Please try again.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, nowPlaying, station]);
  
  const handleDownload = useCallback(() => {
    if (!cardImageUrl || !nowPlaying) return;
    
    const link = document.createElement('a');
    link.href = cardImageUrl;
    const artist = nowPlaying.artist.replace(/[^a-zA-Z0-9]/g, '_');
    const title = nowPlaying.title.replace(/[^a-zA-Z0-9]/g, '_');
    link.download = `music-station-radio-${artist}-${title}.png`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  }, [cardImageUrl, nowPlaying]);


  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div 
        className="bg-gray-800/80 backdrop-blur-lg border accent-color-border/30 rounded-xl shadow-2xl shadow-black/50 w-full max-w-lg flex flex-col animate-slide-up-fast"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-700/50 flex justify-between items-center">
          <h2 id="share-modal-title" className="text-lg font-bold accent-color-text font-orbitron">
            Share Song
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>
        
        <div className="p-6 aspect-[5/6] flex items-center justify-center">
          {isLoading && <LoadingSpinner />}
          {error && <p className="text-center text-red-400">{error}</p>}
          {cardImageUrl && <img src={cardImageUrl} alt="Generated song card" className="max-w-full max-h-full object-contain rounded-lg shadow-lg" />}
        </div>
        
        <footer className="p-4 border-t border-gray-700/50 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
                onClick={handleDownload}
                disabled={isLoading || !cardImageUrl}
                className="w-full sm:w-auto flex items-center justify-center bg-[var(--accent-color)] hover:opacity-80 text-black font-bold py-2.5 px-6 rounded-md transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <DownloadIcon />
                Download Card
            </button>
            <p className="text-xs text-gray-500 text-center sm:text-left">Download the image to share on social media!</p>
        </footer>
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