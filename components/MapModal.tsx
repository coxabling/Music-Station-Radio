import React from 'react';
import { AfricaMap } from './AfricaMap';
import type { Station } from '../types';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: {
    lat: number;
    lng: number;
    zoom: number;
  };
  stations: Station[];
  currentStation: Station | null;
  onSelectStation: (station: Station) => void;
}

export const MapModal: React.FC<MapModalProps> = ({ isOpen, onClose, location, stations, currentStation, onSelectStation }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="map-modal-title"
    >
      <div 
        className="modal-content bg-gray-800/80 backdrop-blur-lg border accent-color-border/30 rounded-xl shadow-2xl shadow-black/50 w-full max-w-4xl h-[80vh] flex flex-col animate-slide-up-fast relative"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-700/50 flex justify-between items-center flex-shrink-0">
          <h2 id="map-modal-title" className="text-lg font-bold accent-color-text font-orbitron">
            Explore Station Origins
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>
        
        <div className="overflow-hidden flex-grow relative">
          {/* The key ensures the map re-initializes if the modal is closed and re-opened, preventing state issues. */}
          <AfricaMap 
            key={isOpen ? 'map-active' : 'map-inactive'} 
            center={location} 
            zoom={location.zoom}
            stations={stations}
            currentStation={currentStation}
            onSelectStation={onSelectStation}
          />
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