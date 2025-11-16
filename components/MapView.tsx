import React from 'react';
import { AfricaMap } from './AfricaMap';
import type { Station } from '../types';

interface MapViewProps {
  location: {
    lat: number;
    lng: number;
    zoom: number;
  };
  stations: Station[];
  currentStation: Station | null;
  onSelectStation: (station: Station) => void;
}

export const MapView: React.FC<MapViewProps> = ({ location, stations, currentStation, onSelectStation }) => {
  return (
    <div className="h-full flex flex-col animate-fade-in">
        <header className="p-4 text-center flex-shrink-0">
            <h1 className="text-3xl font-bold font-orbitron accent-color-text">
                Explore Station Origins
            </h1>
            <p className="text-gray-400 mt-1">Discover where your favorite sounds are broadcasted from.</p>
        </header>
        <div className="flex-grow rounded-lg overflow-hidden m-4 mt-0">
            <AfricaMap 
                center={location} 
                zoom={location.zoom}
                stations={stations}
                currentStation={currentStation}
                onSelectStation={onSelectStation}
            />
        </div>
    </div>
  );
};
