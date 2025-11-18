import React, { useState } from 'react';
import type { Station } from '../types';

interface ClaimOwnershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (station: Station, reason: string) => void;
  station: Station | null;
}

export const ClaimOwnershipModal: React.FC<ClaimOwnershipModalProps> = ({ isOpen, onClose, onSubmit, station }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim().length < 20) {
      setError('Please provide a detailed reason of at least 20 characters.');
      return;
    }
    setError('');
    if (station) {
        onSubmit(station, reason);
    }
    setReason('');
  };

  if (!isOpen || !station) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="claim-ownership-title"
    >
      <div 
        className="bg-gray-800/80 backdrop-blur-lg border accent-color-border/30 rounded-xl shadow-2xl shadow-black/50 w-full max-w-md flex flex-col animate-slide-up-fast"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-700/50">
          <div className="flex justify-between items-center">
            <h2 id="claim-ownership-title" className="text-lg font-bold accent-color-text font-orbitron">
              Claim Ownership
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-1">For station: <span className="font-semibold text-white">{station.name}</span></p>
        </header>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-gray-300">
            Please provide a reason for your claim. Include any information that can help us verify you are the owner (e.g., official website, social media links). Our admin team will review your request.
          </p>
          <div>
            <label htmlFor="claim-reason" className="sr-only">Reason for claim</label>
            <textarea
              id="claim-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-all"
              placeholder="I am the owner of this station because..."
              rows={4}
              required
            />
          </div>
          
          {error && <p className="text-sm text-red-400">{error}</p>}
          
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="bg-[var(--accent-color)] hover:opacity-80 text-black font-bold py-2 px-4 rounded-md transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-[var(--accent-color)]"
            >
              Submit Claim
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