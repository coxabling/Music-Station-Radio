import React from 'react';
import type { Station } from '../types';

interface TippingModalProps {
  isOpen: boolean;
  onClose: () => void;
  station: Station | null;
}

const ExternalLinkIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
);

export const TippingModal: React.FC<TippingModalProps> = ({ isOpen, onClose, station }) => {
  if (!isOpen || !station || !station.tippingUrl) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tipping-modal-title"
    >
      <div 
        className="bg-gray-800/80 backdrop-blur-lg border accent-color-border/30 rounded-xl shadow-2xl shadow-black/50 w-full max-w-sm flex flex-col animate-slide-up-fast text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-700/50 flex justify-between items-center">
            <div className="flex-1"></div>
            <h2 id="tipping-modal-title" className="text-lg font-bold accent-color-text font-orbitron text-center">
                Support Station
            </h2>
            <div className="flex-1 flex justify-end">
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </header>
        
        <div className="p-6 flex flex-col items-center">
          <img src={station.coverArt} alt={station.name} className="w-24 h-24 rounded-lg shadow-lg mb-4" />
          <p className="text-gray-300">
            Show your appreciation for <span className="font-bold text-white">{station.name}</span> by sending a small tip.
          </p>
          <p className="text-sm text-gray-400 mt-1">Your support helps keep the music playing!</p>

          <a
            href={station.tippingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 w-full flex items-center justify-center bg-[var(--accent-color)] hover:opacity-80 text-black font-bold py-3 px-4 rounded-md transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-[var(--accent-color)]"
          >
            Go to Tipping Page
            <ExternalLinkIcon />
          </a>

          <p className="text-xs text-gray-500 mt-6">
            You will be redirected to an external website. Tipping links for user-submitted stations are not verified by Music Station Radio.
          </p>
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