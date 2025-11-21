

import React, { useState } from 'react';
import type { GuestbookEntry, User } from '../types';
import { formatTimeAgo } from '../utils/time';

interface StationGuestbookProps {
    entries: GuestbookEntry[];
    onAddEntry: (stationStreamUrl: string, message: string) => void; // Modified signature
    currentUser: User | null;
    stationStreamUrl: string; // New prop
}

export const StationGuestbook: React.FC<StationGuestbookProps> = ({ entries, onAddEntry, currentUser, stationStreamUrl }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onAddEntry(stationStreamUrl, message); // Pass stationStreamUrl
            setMessage('');
        }
    }

    return (
        <div className="space-y-4 animate-fade-in">
            {currentUser && (
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input 
                        type="text" 
                        value={message} 
                        onChange={e => setMessage(e.target.value)} 
                        placeholder="Sign the guestbook..."
                        className="flex-grow bg-gray-800 border border-gray-600 rounded p-2 text-white text-sm focus:border-[var(--accent-color)] outline-none"
                    />
                    <button type="submit" className="bg-[var(--accent-color)] text-black font-bold px-4 py-2 rounded text-sm">Sign</button>
                </form>
            )}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {entries.length === 0 && <p className="text-gray-500 text-center text-sm">Be the first to sign!</p>}
                {entries.map(entry => (
                    <div key={entry.id} className="bg-gray-800/30 p-3 rounded border-l-2 border-[var(--accent-color)]">
                        <div className="flex justify-between items-baseline">
                            <span className="font-bold text-gray-300 text-sm">{entry.username}</span>
                            <span className="text-xs text-gray-600">{formatTimeAgo(entry.timestamp)}</span>
                        </div>
                        <p className="text-white text-sm mt-1">{entry.message}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};