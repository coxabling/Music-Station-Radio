
import React from 'react';
import type { FriendActivity, Station } from '../types';
import { MOCK_FRIENDS, AVATAR_FRAMES } from '../constants';

interface FriendActivityListProps {
    allStations: Station[];
    onJoinStation: (station: Station) => void;
    onUserClick?: (username: string) => void;
}

export const FriendActivityList: React.FC<FriendActivityListProps> = ({ allStations, onJoinStation, onUserClick }) => {
    const handleJoin = (friendStationUrl: string) => {
        const station = allStations.find(s => s.streamUrl === friendStationUrl);
        if (station) {
            onJoinStation(station);
        }
    };

    const getFrameClass = (frameId?: string) => {
        if (!frameId) return '';
        return AVATAR_FRAMES.find(f => f.id === frameId)?.cssClass || '';
    }

    return (
        <div className="p-4 space-y-4 animate-fade-in">
            {MOCK_FRIENDS.map((friend, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-gray-800/30 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <div className="relative cursor-pointer" onClick={() => onUserClick && onUserClick(friend.username)}>
                        <div 
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-black font-bold text-sm ${getFrameClass(friend.frame)}`}
                            style={{ backgroundColor: friend.avatarColor }}
                        >
                            {friend.username[0]}
                        </div>
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900 ${friend.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p 
                            className="font-bold text-sm text-white truncate cursor-pointer hover:underline"
                            onClick={() => onUserClick && onUserClick(friend.username)}
                        >
                            {friend.username}
                        </p>
                        <p className={`text-xs truncate ${friend.status === 'online' ? 'text-cyan-400' : 'text-gray-500'}`}>
                            {friend.stationName}
                        </p>
                    </div>
                    {friend.status === 'online' && friend.stationStreamUrl && (
                        <button 
                            onClick={() => handleJoin(friend.stationStreamUrl)}
                            className="px-3 py-1 text-xs font-bold bg-gray-700 hover:bg-[var(--accent-color)] hover:text-black text-white rounded-full transition-colors"
                        >
                            Join
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};
