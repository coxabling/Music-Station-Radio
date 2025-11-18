
import React from 'react';
import type { KingOfTheHillEntry, Station } from '../types';
import { CrownIcon } from '../constants';
import { formatTime } from '../utils/time';

interface KingOfTheHillProps {
    station: Station | null;
    leaderboard: KingOfTheHillEntry[];
    currentUserEntry?: KingOfTheHillEntry;
}

export const KingOfTheHill: React.FC<KingOfTheHillProps> = ({ station, leaderboard, currentUserEntry }) => {
    if (!station) return null;

    const topListener = leaderboard[0];

    return (
        <div className="bg-gradient-to-b from-amber-900/20 to-gray-900/50 rounded-lg border border-amber-500/30 p-4 mt-4">
            <div className="flex items-center gap-2 mb-3">
                <CrownIcon className="w-5 h-5 text-yellow-400" />
                <h3 className="text-sm font-bold text-yellow-100 uppercase tracking-wider">Station Superfan</h3>
            </div>

            {topListener ? (
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-500/20 border-2 border-yellow-400 flex items-center justify-center text-yellow-200 font-bold text-lg shadow-[0_0_15px_rgba(250,204,21,0.3)]">
                        {topListener.avatar ? <img src={topListener.avatar} className="w-full h-full rounded-full" /> : topListener.username.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-white">{topListener.username}</p>
                        <p className="text-xs text-yellow-200/70 font-mono">{formatTime(topListener.timeListened)} listened today</p>
                    </div>
                </div>
            ) : (
                <p className="text-xs text-gray-400 mb-4">Be the first to claim the crown today!</p>
            )}

            <div className="border-t border-gray-700/50 pt-2">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Your Time</span>
                    <span className="font-mono text-white">{currentUserEntry ? formatTime(currentUserEntry.timeListened) : '00:00'}</span>
                </div>
                {currentUserEntry && topListener && currentUserEntry.username !== topListener.username && (
                     <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                        <div 
                            className="bg-cyan-500 h-1.5 rounded-full transition-all duration-1000" 
                            style={{ width: `${Math.min((currentUserEntry.timeListened / topListener.timeListened) * 100, 100)}%` }} 
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
