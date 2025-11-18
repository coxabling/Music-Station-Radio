
import React, { useState, useEffect } from 'react';
import type { ListeningEvent } from '../types';
import { TicketIcon, LockIcon, StarIcon } from '../constants';

interface EventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStation: (stationName: string) => void;
  events?: ListeningEvent[];
  purchasedTickets?: Set<string>;
  onPurchaseTicket?: (event: ListeningEvent) => void;
}

const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;

const formatCountdown = (ms: number) => {
    if (ms <= 0) return "Starting soon!";
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

export const EventsModal: React.FC<EventsModalProps> = ({ isOpen, onClose, onSelectStation, events = [], purchasedTickets = new Set(), onPurchaseTicket }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;
  
  const upcomingEvents = events
    .filter(event => new Date(event.endTime) > now)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    
  const nextEvent = upcomingEvents[0];
  const timeToNextEvent = nextEvent ? new Date(nextEvent.startTime).getTime() - now.getTime() : 0;

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
                Scheduled Events
              </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>
        
        <div className="p-6 overflow-y-auto">
          {nextEvent && (
            <div className="mb-6 p-4 bg-gray-900/50 border border-[var(--accent-color)]/50 rounded-lg text-center">
              <p className="text-sm text-[var(--accent-color)] font-semibold">NEXT EVENT STARTS IN</p>
              <p className="text-4xl font-mono font-bold text-white tracking-wider my-2">
                {formatCountdown(timeToNextEvent)}
              </p>
              <p className="text-gray-300">{nextEvent.title}</p>
            </div>
          )}
        
          <ul className="space-y-4">
            {upcomingEvents.map(event => {
                const hasTicket = !event.isPremium || purchasedTickets.has(event.id);
                const isPremium = event.isPremium;

                return (
                  <li key={event.id} className={`p-4 rounded-lg border relative overflow-hidden ${isPremium ? 'bg-yellow-900/20 border-yellow-500/30' : 'bg-gray-700/30 border-gray-600/50'}`}>
                    {isPremium && (
                        <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                            PREMIUM
                        </div>
                    )}
                    
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-gray-400 font-semibold">{new Date(event.startTime).toLocaleString(undefined, { weekday: 'long', hour: 'numeric', minute: 'numeric' })}</p>
                            <h3 className={`font-bold mt-1 ${isPremium ? 'text-yellow-100' : 'text-white'}`}>{event.title}</h3>
                        </div>
                    </div>
                    
                    <p className="text-sm text-gray-300 mt-1">{event.description}</p>
                    
                    <div className="mt-3 pt-3 border-t border-gray-600/50 flex justify-between items-center">
                        <p className="text-xs text-gray-400">
                            on <span className="font-semibold text-gray-200">{event.stationName}</span>
                        </p>
                        
                        {hasTicket ? (
                             <button 
                                onClick={() => onSelectStation(event.stationName)}
                                className={`text-xs font-bold py-1.5 px-3 rounded-full transition-colors ${isPremium ? 'bg-yellow-500/80 hover:bg-yellow-500 text-black' : 'bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-200'}`}
                            >
                                Tune In
                            </button>
                        ) : (
                            <button 
                                onClick={() => onPurchaseTicket && onPurchaseTicket(event)}
                                className="bg-yellow-600 hover:bg-yellow-500 text-white text-xs font-bold py-1.5 px-3 rounded-full transition-colors flex items-center gap-1"
                            >
                                <LockIcon className="w-3 h-3"/>
                                Buy Ticket ({event.ticketCost} <StarIcon className="w-3 h-3 inline mb-0.5"/>)
                            </button>
                        )}
                    </div>
                  </li>
                )
            })}
          </ul>
          {upcomingEvents.length === 0 && (
              <p className="text-center text-gray-500">No upcoming events scheduled.</p>
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
