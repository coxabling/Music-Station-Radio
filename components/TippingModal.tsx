import React from 'react';
import type { Station } from '../types';

interface TippingModalProps {
  isOpen: boolean;
  onClose: () => void;
  station: Station | null;
}

const TipIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm3 1a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
);

const ExternalLinkIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
);

export const TippingModal: React.FC<TippingModalProps> = ({ isOpen, onClose, station }) => {
  if (!isOpen || !station || !station.tippingUrl) return null;

  const handleProceed = () => {
    window.open(station.tippingUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tipping-modal-title"
    >
      <div 
        className="bg-gray-800/80 backdrop-blur-lg border accent-color-border/30 rounded-xl shadow-2xl shadow-black/50 w-full max-w-sm flex flex-col animate-slide-up-fast"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-700/50 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <TipIcon className="h-6 w-6 accent-color-text"/>
                <h2 id="tipping-modal-title" className="text-lg font-bold accent-color-text font-orbitron">
                    Support Station
                </h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </header>
        
        <div className="p-6 text-center">
            <img src={station.coverArt} alt={station.name} className="w-24 h-24 rounded-lg object-cover shadow-lg mx-auto mb-4" />
            <p className="text-gray-300">
                You're about to leave Music Station Radio to visit the tipping page for:
            </p>
            <p className="font-bold text-white text-lg my-2">{station.name}</p>
            <p className="text-xs text-gray-500 break-all">{station.tippingUrl}</p>
        </div>
        
        <footer className="p-4 bg-gray-900/30 rounded-b-xl flex flex-col sm:flex-row gap-2">
            <button onClick={onClose} className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2.5 px-4 rounded-md transition-colors duration-200">
                Cancel
            </button>
            <button
              onClick={handleProceed}
              className="w-full flex items-center justify-center gap-2 bg-[var(--accent-color)] hover:opacity-80 text-black font-bold py-2.5 px-4 rounded-md transition-opacity duration-300"
            >
              Proceed to Tip Page
              <ExternalLinkIcon className="h-4 w-4"/>
            </button>
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