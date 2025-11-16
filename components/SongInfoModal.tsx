import React, { useState, useEffect } from 'react';
import type { NowPlaying } from '../types';
import { getSongInfo, fetchLyrics } from '../services/geminiService';

interface SongInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  nowPlaying: NowPlaying | null;
}

type ActiveTab = 'info' | 'lyrics';

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent-color)]"></div>
    </div>
);

const AmazonIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M20.95 13.62c-1.1-1.3-2.85-2.02-4.88-2.02-2.58 0-4.58 1.58-4.58 3.93 0 1.63.85 2.93 2.15 3.65.58.3 1.25.48 1.95.48 1.98 0 3.73-.9 4.88-2.33l.28-.35c.35-.45.3-.8-.15-.95-.45-.15-.8-.05-.95.15l-.28.33c-.85 1.05-2.18 1.65-3.63 1.65-.53 0-1.03-.13-1.45-.38-.85-.5-1.3-1.35-1.3-2.45 0-1.78 1.43-2.93 3.38-2.93 1.55 0 2.85.65 3.63 1.48l-2.45.83c-.53.15-.8.65-.65 1.1.15.5.65.8 1.1.65l3.8-1.3c.5-.15.8-.65.65-1.1l-.1-.36Zm-3.08-5.75c-.2-.2-.5-.2-.7 0l-1.43 1.4-1.4-1.4c-.2-.2-.5-.2-.7 0-.2.2-.2.5 0 .7l1.4 1.4-1.4 1.4c-.2.2-.2.5 0 .7.1.1.25.15.35.15s.25-.05.35-.15l1.4-1.4 1.43 1.4c.1.1.25.15.35.15s.25-.05.35-.15c.2-.2.2-.5 0-.7l-1.4-1.4 1.4-1.4c.2-.2.2-.5 0-.7Z" />
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm7.23 16.95C17.58 20.3 15.1 21 12.55 21c-2.85 0-5.4-1-7.25-2.73-1.55-1.43-2.6-3.2-3.05-5.18-.1-.4-.2-1.3-.2-1.45l.03-1.35c.1-2 .78-3.9 1.9-5.5.15-.2.35-.35.55-.45 1.5-1.05 3.3-1.6 5.15-1.7.2-.03.4-.03.6-.03.7 0 1.4.05 2.08.15.3.05.5.1.7.15l2.45.5c.2.05.4.1.55.15.6.15 1.15.35 1.7.6.15.1.3.15.45.25.55.3 1.05.7 1.5 1.1.4.35.75.8 1.05 1.25.3.45.55.95.78 1.5.05.1.1.2.15.3.15.35.3.7.4 1.1.15.55.25 1.15.28 1.75.03.2.03.4.03.6.03.8-.08 1.55-.2 2.3-.05.3-.1.55-.18.8-.05.15-.1.3-.15.45Z" />
    </svg>
);


export const SongInfoModal: React.FC<SongInfoModalProps> = ({ isOpen, onClose, nowPlaying }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('info');
  
  const [infoContent, setInfoContent] = useState('');
  const [lyricsContent, setLyricsContent] = useState('');
  
  const [isInfoLoading, setIsInfoLoading] = useState(false);
  const [isLyricsLoading, setIsLyricsLoading] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState('Copy Lyrics');

  useEffect(() => {
    if (isOpen && nowPlaying && nowPlaying.title !== 'Live Stream' && nowPlaying.title !== 'Station Data Unavailable') {
      // Reset state on open
      setActiveTab('info');
      setLyricsContent('');
      setCopyButtonText('Copy Lyrics');
      
      const fetchInitialInfo = async () => {
        setIsInfoLoading(true);
        const info = await getSongInfo(nowPlaying.artist, nowPlaying.title);
        setInfoContent(info);
        setIsInfoLoading(false);
      };
      
      fetchInitialInfo();
    }
  }, [isOpen, nowPlaying]);

  const handleFetchLyrics = async () => {
      if (!nowPlaying || lyricsContent) return; // Don't re-fetch
      
      setIsLyricsLoading(true);
      const lyrics = await fetchLyrics(nowPlaying.artist, nowPlaying.title);
      setLyricsContent(lyrics.trim());
      setIsLyricsLoading(false);
  }
  
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === 'lyrics') {
        handleFetchLyrics();
    }
  }

  if (!isOpen) return null;
  
  const handleBuyNow = () => {
    if (!nowPlaying) return;
    const affiliateTag = 'coxabling0e-21';
    const searchQuery = encodeURIComponent(`${nowPlaying.artist} ${nowPlaying.title}`);
    const url = `https://www.amazon.com/s?k=${searchQuery}&tag=${affiliateTag}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLyrics = () => {
      if (!lyricsContent || lyricsContent === 'LYRICS_NOT_FOUND') return;
      navigator.clipboard.writeText(lyricsContent).then(() => {
          setCopyButtonText('Copied!');
          setTimeout(() => setCopyButtonText('Copy Lyrics'), 2000);
      }).catch(err => {
          console.error('Failed to copy lyrics: ', err);
          setCopyButtonText('Failed to copy');
          setTimeout(() => setCopyButtonText('Copy Lyrics'), 2000);
      });
  }

  const isSong = nowPlaying && nowPlaying.title !== 'Live Stream' && nowPlaying.title !== 'Station Data Unavailable';


  const renderContent = () => {
      if (activeTab === 'info') {
          if (isInfoLoading) return <LoadingSpinner />;
          return <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{infoContent}</p>;
      }
      
      if (activeTab === 'lyrics') {
          if (isLyricsLoading) return <LoadingSpinner />;
          if (lyricsContent === 'LYRICS_NOT_FOUND') {
              return <p className="text-gray-400 text-center">Sorry, lyrics for this song could not be found.</p>;
          }
          // The pre tag respects whitespace and newlines, perfect for lyrics
          return <pre className="text-gray-300 whitespace-pre-wrap leading-relaxed font-sans">{lyricsContent}</pre>;
      }
      return null;
  }

  const TabButton: React.FC<{tab: ActiveTab, label: string}> = ({ tab, label }) => (
    <button
        onClick={() => handleTabChange(tab)}
        className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors focus:outline-none ${
            activeTab === tab 
            ? 'bg-gray-700/50 text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]' 
            : 'text-gray-400 hover:text-white'
        }`}
        aria-label={`Switch to ${label} tab`}
    >
        {label}
    </button>
  );

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="info-modal-title"
    >
      <div 
        className="bg-gray-800/80 backdrop-blur-lg border accent-color-border/30 rounded-xl shadow-2xl shadow-black/50 w-full max-w-md max-h-[80vh] flex flex-col animate-slide-up-fast"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-700/50 flex justify-between items-center">
          <div className="flex-1 min-w-0">
            <h2 id="info-modal-title" className="text-lg font-bold accent-color-text truncate font-orbitron">
              {`${nowPlaying?.title}`}
            </h2>
            <p className="text-sm text-gray-400 truncate">{nowPlaying?.artist}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        
        <div className="border-b border-gray-700/50 px-4">
            <nav className="flex space-x-2" role="tablist" aria-label="Song Information">
                <TabButton tab="info" label="Info" />
                <TabButton tab="lyrics" label="Lyrics" />
            </nav>
        </div>
        
        <div className="p-6 overflow-y-auto flex-grow" role="tabpanel">
          {renderContent()}
        </div>

        {isSong && (
          <footer className="p-4 border-t border-gray-700/50 flex items-center gap-2">
            {activeTab === 'lyrics' && lyricsContent && lyricsContent !== 'LYRICS_NOT_FOUND' && (
                <button onClick={handleCopyLyrics} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2.5 px-4 rounded-md transition-colors duration-200">
                    {copyButtonText}
                </button>
            )}
            <button
              onClick={handleBuyNow}
              className="flex-1 flex items-center justify-center gap-2 bg-[#FF9900] hover:opacity-90 text-black font-bold py-2.5 px-4 rounded-md transition-opacity duration-300"
            >
              <AmazonIcon className="w-6 h-6"/>
              Buy on Amazon
            </button>
          </footer>
        )}
      </div>
      <style>{`
        @keyframes fade-in-fast {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-fast {
          animation: fade-in-fast 0.3s ease-out;
        }
        @keyframes slide-up-fast {
          from { transform: translateY(20px) scale(0.98); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-slide-up-fast {
          animation: slide-up-fast 0.3s ease-out;
        }
        /* Use font-sans for lyrics to override potential global font settings on pre */
        .font-sans {
            font-family: 'Poppins', sans-serif;
        }
      `}</style>
    </div>
  );
};