
import React, { useState, useEffect } from 'react';
import type { NowPlaying } from '../types';
import { getSongInfo, fetchLyrics, translateLyrics } from '../services/geminiService';
import { SUPPORTED_TRANSLATION_LANGUAGES } from '../constants';

interface SongInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  nowPlaying: NowPlaying | null;
}

type ActiveTab = 'info' | 'lyrics' | 'translate';

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent-color)]"></div>
    </div>
);

const AmazonIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.94,15.72a.49.49,0,0,0-.73,0L14.44,17a1.52,1.52,0,0,1-2.12,0l-1.77-1.28a.49.49,0,0,0-.73,0l-1.31,1a.51.51,0,0,0,0,.73l1.1,1.1a.52.52,0,0,0,.74,0l.47-.36a3.52,3.52,0,0,0,4.88,0l.47.36a.52.52,0,0,0,.74,0l1.1-1.1a.51.51,0,0,0,0-.73ZM12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm3.48,8.23a1,1,0,0,1-1,1H13.26V15.5a1,1,0,0,1-2,0V11.23H10.15a1,1,0,0,1,0-2h5.33A1,1,0,0,1,15.48,10.23Z"/>
    </svg>
);


export const SongInfoModal: React.FC<SongInfoModalProps> = ({ isOpen, onClose, nowPlaying }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('info');
  
  const [infoContent, setInfoContent] = useState('');
  const [lyricsContent, setLyricsContent] = useState('');
  const [translatedLyrics, setTranslatedLyrics] = useState('');
  
  const [isInfoLoading, setIsInfoLoading] = useState(false);
  const [isLyricsLoading, setIsLyricsLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  
  const [copyButtonText, setCopyButtonText] = useState('Copy Lyrics');
  const [targetLanguage, setTargetLanguage] = useState(SUPPORTED_TRANSLATION_LANGUAGES[0].name);

  const getErrorMessage = (error: unknown) => {
    let errorMessage = "An error occurred. Please try again later.";
    if (error instanceof Error && error.message.includes("RESOURCE_EXHAUSTED")) {
        errorMessage = "Our AI service is a bit overwhelmed! Please wait a moment and try again.";
    }
    return errorMessage;
  }

  useEffect(() => {
    if (isOpen && nowPlaying && nowPlaying.title !== 'Live Stream' && nowPlaying.title !== 'Station Data Unavailable') {
      setActiveTab('info');
      setLyricsContent('');
      setTranslatedLyrics('');
      setCopyButtonText('Copy Lyrics');
      
      const fetchInitialInfo = async () => {
        setIsInfoLoading(true);
        try {
          const info = await getSongInfo(nowPlaying.artist, nowPlaying.title);
          setInfoContent(info);
        } catch (error) {
          console.error("Failed to fetch song info:", error);
          setInfoContent(getErrorMessage(error));
        } finally {
          setIsInfoLoading(false);
        }
      };
      
      fetchInitialInfo();
    }
  }, [isOpen, nowPlaying]);

  const handleFetchLyrics = async () => {
      if (!nowPlaying || lyricsContent) return;
      
      setIsLyricsLoading(true);
      try {
        const lyrics = await fetchLyrics(nowPlaying.artist, nowPlaying.title);
        setLyricsContent(lyrics.trim());
      } catch (error) {
        console.error("Failed to fetch lyrics:", error);
        setLyricsContent(getErrorMessage(error));
      } finally {
        setIsLyricsLoading(false);
      }
  }
  
  const handleFetchTranslation = async () => {
    if (!lyricsContent || lyricsContent === 'LYRICS_NOT_FOUND') return;
    setIsTranslating(true);
    setTranslatedLyrics('');
    try {
      const translation = await translateLyrics(lyricsContent, targetLanguage);
      setTranslatedLyrics(translation.trim());
    } catch (error) {
      console.error("Failed to fetch translation:", error);
      setTranslatedLyrics(getErrorMessage(error));
    } finally {
      setIsTranslating(false);
    }
  };
  
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if ((tab === 'lyrics' || tab === 'translate') && !lyricsContent) {
        handleFetchLyrics();
    }
  }

  if (!isOpen) return null;
  
  const handleBuyNow = () => {
    if (!nowPlaying) return;
    const searchQuery = encodeURIComponent(`${nowPlaying.artist} ${nowPlaying.title}`);
    const url = `https://music.amazon.com/search/${searchQuery}`;
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
          return <pre className="text-gray-300 whitespace-pre-wrap leading-relaxed font-sans">{lyricsContent}</pre>;
      }

      if (activeTab === 'translate') {
        if (isLyricsLoading) return <div className="text-center text-gray-400"><LoadingSpinner /> <p className="mt-2">Loading original lyrics first...</p></div>;
        if (lyricsContent === 'LYRICS_NOT_FOUND') {
            return <p className="text-gray-400 text-center">Original lyrics not found, cannot translate.</p>;
        }

        return (
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <select
                        value={targetLanguage}
                        onChange={(e) => setTargetLanguage(e.target.value)}
                        className="flex-grow bg-gray-900/50 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]"
                    >
                        {SUPPORTED_TRANSLATION_LANGUAGES.map(lang => (
                            <option key={lang.code} value={lang.name}>{lang.name}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleFetchTranslation}
                        disabled={isTranslating}
                        className="bg-[var(--accent-color)] hover:opacity-80 text-black font-bold py-2 px-4 rounded-md transition-opacity disabled:opacity-50"
                    >
                        {isTranslating ? 'Translating...' : 'Translate'}
                    </button>
                </div>
                {isTranslating && <LoadingSpinner />}
                {translatedLyrics && translatedLyrics !== 'TRANSLATION_FAILED' && (
                    <pre className="text-gray-300 whitespace-pre-wrap leading-relaxed font-sans">{translatedLyrics}</pre>
                )}
                {translatedLyrics === 'TRANSLATION_FAILED' && (
                    <p className="text-gray-400 text-center">Sorry, we couldn't translate these lyrics.</p>
                )}
            </div>
        );
    }
      return null;
  }

  const TabButton: React.FC<{tab: ActiveTab, label: string, disabled?: boolean}> = ({ tab, label, disabled }) => (
    <button
        onClick={() => handleTabChange(tab)}
        disabled={disabled}
        className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors focus:outline-none ${
            activeTab === tab 
            ? 'bg-gray-700/50 text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]' 
            : 'text-gray-400 hover:text-white'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                <TabButton tab="info" label="Info" disabled={!isSong} />
                <TabButton tab="lyrics" label="Lyrics" disabled={!isSong} />
                <TabButton tab="translate" label="Translate" disabled={!isSong} />
            </nav>
        </div>
        
        <div className="p-6 overflow-y-auto flex-grow" role="tabpanel">
          {isSong ? renderContent() : <p className="text-gray-400 text-center">Detailed information is not available for this stream.</p>}
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
              className="flex-1 flex items-center justify-center gap-2 bg-[#00A8E1] hover:opacity-90 text-white font-bold py-2.5 px-4 rounded-md transition-opacity duration-300"
            >
              <AmazonIcon className="w-6 h-6"/>
              Buy on Amazon Music
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
