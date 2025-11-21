

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

const SongInfoModal: React.FC<SongInfoModalProps> = ({ isOpen, onClose, nowPlaying }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('info');
  const [songInfo, setSongInfo] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [translatedLyrics, setTranslatedLyrics] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(SUPPORTED_TRANSLATION_LANGUAGES[0].code);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isSong = nowPlaying && nowPlaying.title !== "Live Stream" && nowPlaying.title !== "Station Data Unavailable";

  useEffect(() => {
    if (isOpen && isSong) {
      setError('');
      setSongInfo('');
      setLyrics('');
      setTranslatedLyrics('');
      setActiveTab('info'); // Reset tab on open
      
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const [info, fetchedLyrics] = await Promise.all([
            getSongInfo(nowPlaying.artist, nowPlaying.title),
            fetchLyrics(nowPlaying.artist, nowPlaying.title)
          ]);
          setSongInfo(info);
          setLyrics(fetchedLyrics === 'LYRICS_NOT_FOUND' ? '' : fetchedLyrics);
        } catch (err) {
          console.error("Error fetching song data:", err);
          setError("Failed to load song information or lyrics.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen, nowPlaying, isSong]);

  useEffect(() => {
    if (isOpen && activeTab === 'translate' && lyrics && selectedLanguage && selectedLanguage !== 'en') {
      const fetchTranslation = async () => {
        setIsLoading(true);
        setError('');
        try {
          const translation = await translateLyrics(lyrics, selectedLanguage);
          setTranslatedLyrics(translation === 'TRANSLATION_FAILED' ? "Could not translate lyrics to the selected language." : translation);
        } catch (err) {
          console.error("Error translating lyrics:", err);
          setError("Failed to translate lyrics.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchTranslation();
    } else if (activeTab !== 'translate') {
      setTranslatedLyrics('');
    }
  }, [isOpen, activeTab, lyrics, selectedLanguage]);

  if (!isOpen || !nowPlaying) return null;

  const TabButton: React.FC<{label: string; tab: ActiveTab; disabled?: boolean}> = ({ label, tab, disabled }) => (
    <button 
        onClick={() => setActiveTab(tab)} 
        disabled={disabled}
        className={`flex-1 py-2 text-sm font-semibold transition-colors focus:outline-none ${activeTab === tab ? 'text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]' : 'text-gray-400 hover:text-white border-b-2 border-transparent'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
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
      aria-labelledby="song-info-modal-title"
    >
      <div 
        className="bg-gray-800/80 backdrop-blur-lg border accent-color-border/30 rounded-xl shadow-2xl shadow-black/50 w-full max-w-lg max-h-[80vh] flex flex-col animate-slide-up-fast"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-700/50 flex justify-between items-start gap-4">
          <div className="flex items-start gap-4">
            <img src={nowPlaying.albumArt} alt={nowPlaying.title} className="w-20 h-20 rounded-lg object-cover shadow-lg" />
            <div>
                <h2 id="song-info-modal-title" className="text-xl font-bold accent-color-text font-orbitron">{nowPlaying.title}</h2>
                <p className="text-sm text-gray-300">{nowPlaying.artist}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors flex-shrink-0" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>
        
        <div className="flex-shrink-0 border-b border-gray-700/50">
            <nav className="flex items-center" role="tablist">
                <TabButton label="Info" tab="info" />
                <TabButton label="Lyrics" tab="lyrics" disabled={!lyrics && !isLoading && !error} />
                <TabButton label="Translate" tab="translate" disabled={!lyrics && !isLoading && !error} />
            </nav>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          {error && <p className="text-red-400 text-center">{error}</p>}
          {isLoading && <LoadingSpinner />}
          
          {!isLoading && !error && (
            <>
              {activeTab === 'info' && (
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{songInfo || "No additional information available for this song."}</p>
              )}
              
              {activeTab === 'lyrics' && (
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{lyrics || "Lyrics not found for this song."}</p>
              )}

              {activeTab === 'translate' && (
                <>
                  <div className="mb-4">
                    <label htmlFor="language-select" className="block text-sm font-medium text-gray-300 mb-2">Translate to:</label>
                    <select
                      id="language-select"
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full bg-gray-900/50 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-all"
                    >
                      {SUPPORTED_TRANSLATION_LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                      ))}
                    </select>
                  </div>
                  {translatedLyrics && (
                    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{translatedLyrics}</p>
                  )}
                  {!lyrics && <p className="text-gray-500 text-center">Lyrics must be available to translate.</p>}
                  {!translatedLyrics && lyrics && selectedLanguage !== 'en' && !isLoading && <p className="text-gray-500 text-center">Select a language to see translation.</p>}
                </>
              )}
            </>
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

export default SongInfoModal;