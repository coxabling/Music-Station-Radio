import React, { useMemo, useState, useEffect } from 'react';
import type { User, UserData } from '../types';
import { getAllUsersData } from '../services/apiService';
import { RoleBadge } from './RoleBadge';

const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>;

interface LeaderboardViewProps {
  currentUser: User | null;
  userPoints: number;
  onBack: () => void; // New prop
}

const TrophyIcon: React.FC<{className: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M11.68 1.33a1 1 0 011.64 0l1.35 2.22a1 1 0 00.82.55l2.45.36a1 1 0 01.56 1.7l-1.78 1.73a1 1 0 00-.29.89l.42 2.44a1 1 0 01-1.45 1.05L12 11.45a1 1 0 00-.94 0l-2.19 1.15a1 1 0 01-1.45-1.05l.42-2.44a1 1 0 00-.29-.89L5.78 6.16a1 1 0 01.56-1.7l2.45-.36a1 1 0 00.82-.55L11.68 1.33zM10 14a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1zM6 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM14 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z" /></svg>;

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ currentUser, userPoints, onBack }) => {
  const [dbUsers, setDbUsers] = useState<{ username: string, data: UserData }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getAllUsersData().then(users => {
      if (active) {
        setDbUsers(users);
        setIsLoading(false);
      }
    }).catch(err => {
      console.error("Failed to fetch leaderboard users", err);
      if (active) {
        setIsLoading(false);
      }
    });
    return () => { active = false; };
  }, []);

  const rankedList = useMemo(() => {
    if (!currentUser) return [];

    const otherUsers = dbUsers
      .filter(u => u.username !== currentUser.username)
      .map(u => ({
        username: u.username,
        points: u.data.stats?.points || 0,
        role: u.data.role
      }));

    const userEntry = { username: currentUser.username, points: userPoints, role: currentUser.role };
    
    const combined = [...otherUsers, userEntry]
      .sort((a, b) => b.points - a.points)
      .map((user, index) => ({ ...user, rank: index + 1 }));
      
    return combined;
  }, [currentUser, userPoints, dbUsers]);

  return (
    <div className="p-4 md:p-8 animate-fade-in">
        <div className="max-w-2xl mx-auto">
            <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[var(--accent-color)] transition-colors mb-6 group">
                <BackIcon />
                <span className="uppercase tracking-widest group-hover:pl-1 transition-all">Back to Explore</span>
            </button>

            <header className="text-center mb-8">
                <h1 className="text-3xl font-bold font-orbitron accent-color-text">
                    Listener Leaderboard
                </h1>
                <p className="text-gray-400 mt-2">See how you stack up against the top 10 all-time listeners.</p>
            </header>
            
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--accent-color)] mb-4"></div>
                    <p className="text-gray-400 text-sm">Loading dynamic leaderboards...</p>
                </div>
            ) : (
                <>
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
                                    <div className="flex-1 font-semibold text-white truncate flex items-center gap-2">
                                        <span>{user.username}</span>
                                        {user.role && <RoleBadge role={user.role} />}
                                    </div>
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
                                <div className="flex-1 font-semibold text-white truncate flex items-center gap-2">
                                    <span>{currentUser?.username}</span>
                                    {currentUser?.role && <RoleBadge role={currentUser.role} />}
                                </div>
                                <div className="font-mono text-cyan-300">{userPoints.toLocaleString()} pts</div>
                             </div>
                         </div>
                    )}
                </>
            )}
        </div>
    </div>
  );
};
