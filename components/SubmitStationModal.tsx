import React, { useState } from 'react';
import type { Station } from '../types';

interface SubmitStationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (station: Station) => void;
}

export const SubmitStationModal: React.FC<SubmitStationModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [genre, setGenre] = useState('');
  const [streamUrl, setStreamUrl] = useState('');
  const [description, setDescription] = useState('');
  const [tippingUrl, setTippingUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !genre || !streamUrl || !description) {
      setError('All fields except Tipping URL are required.');
      return;
    }
     if (description.length > 100) {
      setError('Description must be 100 characters or less.');
      return;
    }
    // Basic URL validation
    try {
      new URL(streamUrl);
    } catch (_) {
      setError('Please enter a valid stream URL.');
      return;
    }
    if (tippingUrl) {
        try {
            new URL(tippingUrl);
        } catch (_) {
            setError('Please enter a valid tipping URL or leave it blank.');
            return;
        }
    }
    setError('');
    
    // Use a placeholder image for user-submitted stations
    const coverArt = `https://picsum.photos/seed/${name.replace(/\s+/g, '')}/200`;

    onSubmit({ name, genre, streamUrl, coverArt, description, tippingUrl: tippingUrl || undefined });
    // Reset form
    setName('');
    setGenre('');
    setStreamUrl('');
    setDescription('');
    setTippingUrl('');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-station-title"
    >
      <div 
        className="bg-gray-800/80 backdrop-blur-lg border accent-color-border/30 rounded-xl shadow-2xl shadow-black/50 w-full max-w-md flex flex-col animate-slide-up-fast"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-700/50 flex justify-between items-center">
          <h2 id="submit-station-title" className="text-lg font-bold accent-color-text font-orbitron">
            Suggest a Station
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="station-name" className="block text-sm font-medium text-gray-300 mb-1">Station Name</label>
            <input
              id="station-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-all"
              placeholder="e.g., Chill Vibes FM"
              required
            />
          </div>
          <div>
            <label htmlFor="station-genre" className="block text-sm font-medium text-gray-300 mb-1">Genre</label>
            <input
              id="station-genre"
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-all"
              placeholder="e.g., Lo-fi & Hip Hop"
              required
            />
          </div>
           <div>
            <label htmlFor="station-description" className="block text-sm font-medium text-gray-300 mb-1">Description (for SEO)</label>
            <input
              id="station-description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-all"
              placeholder="A short, catchy tagline (max 100 chars)"
              maxLength={100}
              required
            />
          </div>
          <div>
            <label htmlFor="stream-url" className="block text-sm font-medium text-gray-300 mb-1">Stream URL</label>
            <input
              id="stream-url"
              type="url"
              value={streamUrl}
              onChange={(e) => setStreamUrl(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-all"
              placeholder="https://..."
              required
            />
          </div>
          <div>
            <label htmlFor="tipping-url" className="block text-sm font-medium text-gray-300 mb-1">Tipping URL (Optional)</label>
            <input
              id="tipping-url"
              type="url"
              value={tippingUrl}
              onChange={(e) => setTippingUrl(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-all"
              placeholder="https://ko-fi.com/..."
            />
          </div>
          
          {error && <p className="text-sm text-red-400">{error}</p>}
          
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="bg-[var(--accent-color)] hover:opacity-80 text-black font-bold py-2 px-4 rounded-md transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-[var(--accent-color)]"
            >
              Submit Station
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
