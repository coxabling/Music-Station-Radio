import React, { useState } from 'react';
import type { Station, MusicSubmission } from '../types';
import { StarIcon } from '../constants';
import { MUSIC_SUBMISSION_COST } from '../constants';

interface MusicSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (stationStreamUrl: string, submission: Omit<MusicSubmission, 'id' | 'submittedAt' | 'status' | 'submittedBy' | 'stationStreamUrl' | 'stationName'>) => void;
  station: Station | null;
  userPoints: number;
}

export const MusicSubmissionModal: React.FC<MusicSubmissionModalProps> = ({ isOpen, onClose, onSubmit, station, userPoints }) => {
  const [artistName, setArtistName] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [trackUrl, setTrackUrl] = useState('');
  const [error, setError] = useState('');

  const canAfford = userPoints >= MUSIC_SUBMISSION_COST;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAfford) {
        setError(`You need ${MUSIC_SUBMISSION_COST} points to submit.`);
        return;
    }
    if (!artistName || !songTitle || !trackUrl) {
      setError('All fields are required.');
      return;
    }
    try {
      new URL(trackUrl);
    } catch (_) {
      setError('Please enter a valid track URL (e.g., Soundcloud, Dropbox).');
      return;
    }
    setError('');
    
    if(station) {
        onSubmit(station.streamUrl, { artistName, songTitle, trackUrl });
    }

    // Reset form for next time
    setArtistName('');
    setSongTitle('');
    setTrackUrl('');
  };

  if (!isOpen || !station) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-music-title"
    >
      <div 
        className="bg-gray-800/80 backdrop-blur-lg border accent-color-border/30 rounded-xl shadow-2xl shadow-black/50 w-full max-w-md flex flex-col animate-slide-up-fast"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-700/50">
          <div className="flex justify-between items-center">
            <h2 id="submit-music-title" className="text-lg font-bold accent-color-text font-orbitron">
              Submit Music
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-1">Submitting to: <span className="font-semibold text-white">{station.name}</span></p>
        </header>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="artist-name" className="block text-sm font-medium text-gray-300 mb-1">Artist Name</label>
            <input id="artist-name" type="text" value={artistName} onChange={(e) => setArtistName(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-md py-2 px-3 text-white" required />
          </div>
          <div>
            <label htmlFor="song-title" className="block text-sm font-medium text-gray-300 mb-1">Song Title</label>
            <input id="song-title" type="text" value={songTitle} onChange={(e) => setSongTitle(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-md py-2 px-3 text-white" required />
          </div>
          <div>
            <label htmlFor="track-url" className="block text-sm font-medium text-gray-300 mb-1">Track URL</label>
            <input id="track-url" type="url" value={trackUrl} onChange={(e) => setTrackUrl(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-md py-2 px-3 text-white" placeholder="https://soundcloud.com/..." required />
          </div>
          
          <div className={`p-3 rounded-md text-sm border ${canAfford ? 'bg-green-900/50 border-green-500/50 text-green-200' : 'bg-red-900/50 border-red-500/50 text-red-200'}`}>
            <div className="flex justify-between items-center"><span>Your Balance:</span> <span className="font-mono flex items-center gap-1">{userPoints} <StarIcon className="w-4 h-4 text-yellow-400"/></span></div>
            <div className="flex justify-between items-center"><span>Cost:</span> <span className="font-mono flex items-center gap-1">{MUSIC_SUBMISSION_COST} <StarIcon className="w-4 h-4 text-yellow-400"/></span></div>
            <div className="w-full h-px bg-white/20 my-2"></div>
            <div className="flex justify-between items-center font-bold"><span>New Balance:</span> <span className="font-mono flex items-center gap-1">{userPoints - MUSIC_SUBMISSION_COST} <StarIcon className="w-4 h-4 text-yellow-400"/></span></div>
            {!canAfford && <p className="text-xs text-center mt-2">You need more points. Keep listening to earn!</p>}
          </div>
          
          {error && <p className="text-sm text-red-400">{error}</p>}
          
          <div className="pt-2 flex justify-end">
            <button type="submit" disabled={!canAfford} className="bg-[var(--accent-color)] hover:opacity-80 text-black font-bold py-2 px-4 rounded-md transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
              Submit for {MUSIC_SUBMISSION_COST} Points
            </button>
          </div>
        </form>
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