import React, { useState, useEffect } from 'react';
import { fetchStationSchedule, getStationIdFromUrl } from '../services/azuracastService';
import type { AzuraCastScheduleEntry, Station } from '../types';

interface EventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stations: Station[];
  currentStation: Station | null;
  onSelectStation: (stationName: string) => void; // Used for tuning in
}

const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

const formatCountdown = (ms: number) => {
    if (ms <= 0) return "Live Now!";
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    let parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (parts.length < 3) parts.push(`${seconds}s`);
    
    return parts.join(' ');
};

export const EventsModal: React.FC<EventsModalProps> = ({ isOpen, onClose, stations, currentStation, onSelectStation }) => {
  const [selectedStationUrl, setSelectedStationUrl] = useState<string>('');
  const [schedule, setSchedule] = useState<AzuraCastScheduleEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());

  // Initialize selected station when modal opens
  useEffect(() => {
      if (isOpen) {
          if (currentStation) {
              setSelectedStationUrl(currentStation.streamUrl);
          } else if (stations.length > 0) {
              setSelectedStationUrl(stations[0].streamUrl);
          }
      }
  }, [isOpen, currentStation, stations]);

  // Timer for countdown
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  // Fetch schedule when selected station changes
  useEffect(() => {
      const fetchSchedule = async () => {
          if (!selectedStationUrl || !isOpen) return;
          
          const station = stations.find(s => s.streamUrl === selectedStationUrl);
          if (!station) return;

          setIsLoading(true);
          setError(null);
          setSchedule([]); // Clear previous schedule

          try {
              const fetchedSchedule = await fetchStationSchedule(station);
              if (fetchedSchedule.length > 0) {
                  setSchedule(fetchedSchedule);
              } else {
                  // Check if it's a supported AzuraCast station
                  const stationId = getStationIdFromUrl(station.streamUrl);
                  if (!stationId) {
                      setError("Schedule not available for this station.");
                  } else {
                      setError("No upcoming events scheduled.");
                  }
              }
          } catch (err) {
              console.error(err);
              setError("Failed to load schedule.");
          } finally {
              setIsLoading(false);
          }
      };

      fetchSchedule();
  }, [selectedStationUrl, isOpen, stations]);

  if (!isOpen) return null;
  
  const selectedStation = stations.find(s => s.streamUrl === selectedStationUrl);

  // Filter for current and future events
  const upcomingEvents = schedule
    .filter(event => new Date(event.end) > now)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  const currentEvent = upcomingEvents.find(event => {
      const start = new Date(event.start);
      const end = new Date(event.end);
      return now >= start && now < end;
  });

  // Get next event (first event starting in the future)
  const nextEvent = upcomingEvents.find(event => new Date(event.start) > now);
  const timeToNextEvent = nextEvent ? new Date(nextEvent.start).getTime() - now.getTime() : 0;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="events-modal-title"
    >
      <div 
        className="bg-gray-800/80 backdrop-blur-lg border accent-color-border/30 rounded-xl shadow-2xl shadow-black/50 w-full max-w-lg max-h-[80vh] flex flex-col animate-slide-up-fast"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-700/50 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <CalendarIcon />
              <h2 id="events-modal-title" className="text-lg font-bold accent-color-text font-orbitron">
                Station Schedule
              </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>
        
        <div className="p-4 border-b border-gray-700/50 bg-gray-900/30">
            <label htmlFor="station-select" className="block text-xs text-gray-400 mb-1 font-semibold uppercase">View Schedule For:</label>
            <select 
                id="station-select"
                value={selectedStationUrl}
                onChange={(e) => setSelectedStationUrl(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]"
            >
                {stations.map(s => (
                    <option key={s.streamUrl} value={s.streamUrl}>{s.name}</option>
                ))}
            </select>
        </div>

        <div className="p-6 overflow-y-auto flex-1 min-h-0">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--accent-color)] mb-2"></div>
                    <p className="text-gray-400 text-sm">Loading schedule...</p>
                </div>
            ) : error ? (
                 <div className="text-center text-gray-400 py-10">
                    <p className="text-lg font-semibold mb-1">Info Unavailable</p>
                    <p className="text-sm">{error}</p>
                </div>
            ) : upcomingEvents.length === 0 ? (
                <div className="text-center text-gray-400 py-10">
                    <p className="text-lg font-semibold">No Events Found</p>
                    <p className="text-sm mt-1">There are no upcoming events scheduled for this station.</p>
                </div>
            ) : (
                <>
                    {currentEvent && (
                        <div className="mb-6 p-4 bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="relative flex h-3 w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                                <p className="text-xs text-red-400 font-bold tracking-wider uppercase">ON AIR NOW</p>
                            </div>
                            <p className="text-xl font-bold text-white">{currentEvent.name}</p>
                            <p className="text-sm text-gray-300 mt-1">
                                {new Date(currentEvent.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(currentEvent.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                             {currentStation?.streamUrl !== selectedStation?.streamUrl && (
                                <button 
                                    onClick={() => onSelectStation(selectedStation?.name || '')}
                                    className="mt-3 w-full bg-[var(--accent-color)] text-black text-xs font-bold py-2 px-3 rounded-md transition-colors hover:opacity-90"
                                >
                                    Tune In Now
                                </button>
                            )}
                        </div>
                    )}
                    
                    {nextEvent && !currentEvent && (
                        <div className="mb-6 p-4 bg-gray-900/50 border border-gray-700 rounded-lg text-center">
                          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">NEXT SHOW STARTS IN</p>
                          <p className="text-3xl font-mono font-bold text-[var(--accent-color)] tracking-widest">
                            {formatCountdown(timeToNextEvent)}
                          </p>
                          <p className="text-white mt-2 font-semibold">{nextEvent.name}</p>
                        </div>
                    )}
                
                    <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Upcoming</h3>
                    <ul className="space-y-3">
                        {upcomingEvents.filter(e => e !== currentEvent).map(event => {
                             const startDate = new Date(event.start);
                             const isToday = startDate.toDateString() === now.toDateString();
                             const dateString = isToday ? 'Today' : startDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

                            return (
                                <li key={`${event.id}-${event.start}`} className="bg-gray-700/30 p-3 rounded-lg border border-gray-600/50 flex gap-4">
                                    <div className="flex-shrink-0 text-center w-16 pt-1">
                                        <p className="text-xs font-bold text-gray-400 uppercase">{dateString}</p>
                                        <p className="text-sm font-bold text-white mt-1">{startDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                    </div>
                                    <div className="flex-1 border-l border-gray-600/50 pl-4">
                                        <h4 className="font-bold text-gray-200">{event.name}</h4>
                                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                            <ClockIcon />
                                            <span>
                                                {startDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(event.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                        {event.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{event.description}</p>}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </>
            )}
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