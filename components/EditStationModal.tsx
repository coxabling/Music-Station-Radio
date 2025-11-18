import React, { useState, useEffect } from 'react';
import type { Station } from '../types';

interface EditStationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (station: Station) => void;
  station: Station | null;
}

export const EditStationModal: React.FC<EditStationModalProps> = ({ isOpen, onClose, onSubmit, station }) => {
  const [name, setName] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [coverArt, setCoverArt] = useState('');
  const [tippingUrl, setTippingUrl] = useState('');
  const [acceptsSubmissions, setAcceptsSubmissions] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (station) {
      setName(station.name);
      setGenre(station.genre);
      setDescription(station.description);
      setCoverArt(station.coverArt);
      setTippingUrl(station.tippingUrl || '');
      setAcceptsSubmissions(station.acceptsSubmissions || false);
    }
  }, [station]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !genre || !description || !coverArt) {
      setError('All fields except Tipping URL are required.');
      return;
    }
    if (description.length > 100) {
        setError('Description must be 100 characters or less.');
        return;
    }
    try {
        new URL(coverArt);
        if (tippingUrl) new URL(tippingUrl);
    } catch (_) {
        setError('Please enter a valid URL for Cover Art and Tipping URL.');
        return;
    }

    if (station) {
        const updatedStation: Station = {
            ...station,
            name,
            genre,
            description,
            coverArt,
            tippingUrl: tippingUrl || undefined,
            acceptsSubmissions,
        };
        onSubmit(updatedStation);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-station-title"
    >
      <div 
        className="bg-gray-800/80 backdrop-blur-lg border accent-color-border/30 rounded-xl shadow-2xl shadow-black/50 w-full max-w-md flex flex-col animate-slide-up-fast"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-700/50 flex justify-between items-center">
          <h2 id="edit-station-title" className="text-lg font-bold accent-color-text font-orbitron">
            Edit Station
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="edit-station-name" className="block text-sm font-medium text-gray-300 mb-1">Station Name</label>
            <input id="edit-station-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-md py-2 px-3 text-white" required />
          </div>
          <div>
            <label htmlFor="edit-station-genre" className="block text-sm font-medium text-gray-300 mb-1">Genre</label>
            <input id="edit-station-genre" type="text" value={genre} onChange={(e) => setGenre(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-md py-2 px-3 text-white" required />
          </div>
          <div>
            <label htmlFor="edit-station-description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <input id="edit-station-description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={100} className="w-full bg-gray-900/50 border border-gray-600 rounded-md py-2 px-3 text-white" required />
          </div>
          <div>
            <label htmlFor="edit-cover-art" className="block text-sm font-medium text-gray-300 mb-1">Cover Art URL</label>
            <input id="edit-cover-art" type="url" value={coverArt} onChange={(e) => setCoverArt(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-md py-2 px-3 text-white" required />
          </div>
          <div>
            <label htmlFor="edit-tipping-url" className="block text-sm font-medium text-gray-300 mb-1">Tipping URL (Optional)</label>
            <input id="edit-tipping-url" type="url" value={tippingUrl} onChange={(e) => setTippingUrl(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-md py-2 px-3 text-white" />
          </div>

           <div className="flex items-center justify-between bg-gray-900/50 p-3 rounded-md border border-gray-600/50">
            <div>
                <label htmlFor="accepts-submissions" className="font-medium text-gray-300">Accept Music Submissions</label>
                <p className="text-xs text-gray-400">Allow artists to submit their music to this station.</p>
            </div>
            <button
                type="button"
                onClick={() => setAcceptsSubmissions(!acceptsSubmissions)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${acceptsSubmissions ? 'bg-[var(--accent-color)]' : 'bg-gray-600'}`}
                aria-pressed={acceptsSubmissions}
            >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${acceptsSubmissions ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          
          {error && <p className="text-sm text-red-400">{error}</p>}
          
          <div className="pt-2 flex justify-end">
            <button type="submit" className="bg-[var(--accent-color)] hover:opacity-80 text-black font-bold py-2 px-4 rounded-md transition-opacity">
              Save Changes
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