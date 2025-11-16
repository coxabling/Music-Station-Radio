import React, { useState, useEffect } from 'react';
import { getGenreInfo } from '../services/geminiService';

interface GenreSpotlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  genre: string | null;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent-color)]"></div>
    </div>
);

const MusicIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V7.5A2.25 2.25 0 009 5.25v1.5" /></svg>;


export const GenreSpotlightModal: React.FC<GenreSpotlightModalProps> = ({ isOpen, onClose, genre }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && genre) {
      const fetchGenreInfo = async () => {
        setIsLoading(true);
        try {
          const info = await getGenreInfo(genre);
          setContent(info);
        } catch (error) {
          console.error("Failed to fetch genre info:", error);
          setContent("Could not retrieve information about this genre at this time. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchGenreInfo();
    }
  }, [isOpen, genre]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="genre-modal-title"
    >
      <div 
        className="bg-gray-800/80 backdrop-blur-lg border accent-color-border/30 rounded-xl shadow-2xl shadow-black/50 w-full max-w-md max-h-[80vh] flex flex-col animate-slide-up-fast"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-700/50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <MusicIcon className="w-6 h-6 accent-color-text"/>
            <h2 id="genre-modal-title" className="text-lg font-bold accent-color-text font-orbitron">
              Genre Spotlight: {genre}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        
        <div className="p-6 overflow-y-auto flex-grow">
          {isLoading ? <LoadingSpinner /> : <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{content}</p>}
        </div>
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
      `}</style>
    </div>
  );
};