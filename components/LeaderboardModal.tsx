import React, { useMemo } from 'react';
import type { User } from '../types';
import { LEADERBOARD_DATA } from '../constants';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  userPoints: number;
}

const TrophyIcon: React.FC<{className: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M11.68 1.33a1 1 0 011.64 0l1.35 2.22a1 1 0 00.82.55l2.45.36a1 1 0 01.56 1.7l-1.78 1.73a1 1 0 00-.29.89l.42 2.44a1 1 0 01-1.45 1.05L12 11.45a1 1 0 00-.94 0l-2.19 1.15a1 1 0 01-1.45-1.05l.42-2.44a1 1 0 00-.29-.89L5.78 6.16a1 1 0 01.56-1.7l2.45-.36a1 1 0 00.82-.55L11.68 1.33zM10 14a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1zM6 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM14 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z" /></svg>;

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose, currentUser, userPoints }) => {
  const rankedList = useMemo(() => {
    if (!currentUser) return [];

    const userEntry = { username: currentUser.username, points: userPoints };
    const combined = [...LEADERBOARD_DATA, userEntry]
      .sort((a, b) => b.points - a.points)
      .map((user, index) => ({ ...user, rank: index + 1 }));
      
    return combined;
  }, [currentUser, userPoints]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="leaderboard-modal-title"
    >
      <div 
        className="bg-gray-800/80 backdrop-blur-lg border accent-color-border/30 rounded-xl shadow-2xl shadow-black/50 w-full max-w-md max-h-[80vh] flex flex-col animate-slide-up-fast"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-700/50 flex justify-between items-center">
          <h2 id="leaderboard-modal-title" className="text-lg font-bold accent-color-text font-orbitron">
            Listener Leaderboard
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>
        
        <div className="p-6 overflow-y-auto">
            <p className="text-center text-sm text-gray-400 mb-4">Top 10 All-Time Listeners (Simulated)</p>
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
                     <div className="flex items-center gap-4 p-3 rounded-lg bg-[var(--accent-color)]/20 border border-[var(--accent-color)]/50">
                        <div className="w-8 text-center font-bold text-lg text-gray-400">{rankedList.find(u => u.username === currentUser?.username)?.rank}</div>
                        <div className="flex-1 font-semibold text-white truncate">{currentUser?.username}</div>
                        <div className="font-mono text-cyan-300">{userPoints.toLocaleString()} pts</div>
                     </div>
                 </div>
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
