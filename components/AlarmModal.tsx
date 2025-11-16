import React, { useState, useEffect } from 'react';
import type { Alarm, Station } from '../types';

interface AlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  alarm: Alarm | null;
  onSetAlarm: (alarm: Alarm | null) => void;
  favoriteStations: Station[];
}

export const AlarmModal: React.FC<AlarmModalProps> = ({ isOpen, onClose, alarm, onSetAlarm, favoriteStations }) => {
  const [time, setTime] = useState('07:00');
  const [stationUrl, setStationUrl] = useState('');

  useEffect(() => {
    if (alarm) {
      setTime(alarm.time);
      setStationUrl(alarm.stationUrl);
    } else if (favoriteStations.length > 0) {
      setStationUrl(favoriteStations[0].streamUrl);
    }
  }, [alarm, favoriteStations]);

  const handleSave = () => {
    const selectedStation = favoriteStations.find(s => s.streamUrl === stationUrl);
    if (!time || !selectedStation) return;

    const newAlarm: Alarm = {
      time,
      stationUrl: selectedStation.streamUrl,
      stationName: selectedStation.name,
      isActive: true,
    };
    onSetAlarm(newAlarm);
    localStorage.setItem('alarm', JSON.stringify(newAlarm));
    onClose();
  };
  
  const handleCancel = () => {
    if (alarm) {
        const cancelledAlarm = { ...alarm, isActive: false };
        onSetAlarm(cancelledAlarm);
        localStorage.setItem('alarm', JSON.stringify(cancelledAlarm));
    }
    onClose();
  }
  
  const handleDisable = () => {
    if(alarm){
        const disabledAlarm = { ...alarm, isActive: false };
        onSetAlarm(disabledAlarm);
        localStorage.setItem('alarm', JSON.stringify(disabledAlarm));
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="alarm-modal-title">
      <div className="bg-gray-800/80 backdrop-blur-lg border accent-color-border/30 rounded-xl shadow-2xl shadow-black/50 w-full max-w-sm flex flex-col animate-slide-up-fast" onClick={(e) => e.stopPropagation()}>
        <header className="p-4 border-b border-gray-700/50 flex justify-between items-center">
          <h2 id="alarm-modal-title" className="text-lg font-bold accent-color-text font-orbitron">Set Alarm</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </header>
        
        <div className="p-6 space-y-4">
            {alarm?.isActive && (
                 <div className="text-center bg-green-900/50 border border-green-500/50 text-green-200 p-3 rounded-lg">
                    <p>Alarm is set for <strong>{alarm.time}</strong></p>
                    <p className="text-xs">Station: {alarm.stationName}</p>
                    <button onClick={handleDisable} className="mt-2 text-xs text-red-300 hover:underline">Disable</button>
                 </div>
            )}
          <div>
            <label htmlFor="alarm-time" className="block text-sm font-medium text-gray-300 mb-1">Wake-up time</label>
            <input id="alarm-time" type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]" />
          </div>
          <div>
            <label htmlFor="alarm-station" className="block text-sm font-medium text-gray-300 mb-1">Wake-up station</label>
            {favoriteStations.length > 0 ? (
                <select id="alarm-station" value={stationUrl} onChange={e => setStationUrl(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]">
                    {favoriteStations.map(station => <option key={station.streamUrl} value={station.streamUrl}>{station.name}</option>)}
                </select>
            ) : (
                <p className="text-sm text-gray-400 bg-gray-900/50 p-3 rounded-md">Add some favorite stations to use them for your alarm.</p>
            )}
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button onClick={handleCancel} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={favoriteStations.length === 0} className="bg-[var(--accent-color)] hover:opacity-80 text-black font-bold py-2 px-4 rounded-md transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">Set Alarm</button>
          </div>
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
