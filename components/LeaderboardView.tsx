import React, { useMemo } from 'react';
import type { User } from '../types';
import { LEADERBOARD_DATA } from '../constants';

interface LeaderboardViewProps {
  currentUser: User | null;
  userPoints: number;
}

const TrophyIcon: React.FC<{className: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M11.68 1.33a1 1 0 011.64 0l1.35 2.22a1 1 0 00.82.55l2.45.36a1 1 0 01.56 1.7l-1.78 1.73a1 1 0 00-.29.89l.42 2.44a1 1 0 01-1.45 1.05L12 11.45a1 1 0 00-.94 0l-2.19 1.15a1 1 0 01-1.45-1.05l.42-2.44a1 1 0 00-.29-.89L5.78 6.16a1 1 0 01.56-1.7l2.45-.36a1 1 0 00.82-.55L11.68 1.33zM10 14a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1zM6 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM14 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z" /></svg>;

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ currentUser, userPoints }) => {
  const rankedList = useMemo(() => {
    if (!currentUser) return [];

    const userEntry = { username: currentUser.username, points: userPoints };
    const combined = [...LEADERBOARD_DATA, userEntry]
      .sort((a, b) => b.points - a.points)
      .map((user, index) => ({ ...user, rank: index + 1 }));
      
    return combined;
  }, [currentUser, userPoints]);

  return (
    <div className="p-4 md:p-8 animate-fade-in">
        <div className="max-w-2xl mx-auto">
            <header className="text-center mb-8">
                <h1 className="text-3xl font-bold font-orbitron accent-color-text">
                    Listener Leaderboard
                </h1>
                <p className="text-gray-400 mt-2">See how you stack up against the top 10 all-time listeners (simulated).</p>
            </header>
            
            <ul className="space-y-2">
                {rankedList.slice(0, 10).map((user, index) => {
                    const isCurrentUser = user.username === currentUser?.username;
                    const rankColor = index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-yellow-600' : 'text-gray-400';
                    return (
                        <li key={user.username} className={`flex items-center gap-4 p-3 rounded-lg transition-all ${isCurrentUser ? 'bg-[var(--accent-color)]/20 border border-[var(--accent-color)]/50 scale-105' : 'bg-gray-900/50'}`}>
                            <div className={`w-8 text-center font-bold text-lg ${rankColor} flex items-center justify-center`}>
                                {user.rank}
                                {user.rank <= 3 && <TrophyIcon className="w-4 h-4 ml-1" />}
                            </div>
                            <div className="flex-1 font-semibold text-white truncate">{user.username}</div>
                            <div className="font-mono text-cyan-300">{user.points.toLocaleString()} pts</div>
                        </li>
                    )
                })}
            </ul>
            
            {rankedList.findIndex(u => u.username === currentUser?.username) >= 10 && (
                 <div className="mt-4 pt-4 border-t border-gray-700/50">
                     <p className="text-center text-sm text-gray-400 mb-2">Your Ranking</p>
                     <div className="flex items-center gap-4 p-3 rounded-lg bg-[var(--accent-color)]/20 border border-[var(--accent-color)]/50">
                        <div className="w-8 text-center font-bold text-lg text-gray-400">{rankedList.find(u => u.username === currentUser?.username)?.rank}</div>
                        <div className="flex-1 font-semibold text-white truncate">{currentUser?.username}</div>
                        <div className="font-mono text-cyan-300">{userPoints.toLocaleString()} pts</div>
                     </div>
                 </div>
            )}
        </div>
    </div>
  );
};
