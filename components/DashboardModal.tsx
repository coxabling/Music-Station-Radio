import React, { useMemo } from 'react';
import type { User, ListeningStats, UnlockedAchievement, StationPlayData } from '../types';
import { formatTime } from '../utils/time';
import { ACHIEVEMENTS, StarIcon } from '../constants';
import { BarChart } from './BarChart';

const StatsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const AlarmIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const MapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2H10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.757 15.243l.001-.001M12 12h.01M16.243 15.243l-.001-.001M18.6 10.4c.18.62.292 1.284.325 1.975A9.723 9.723 0 0110.5 20.25a9.723 9.723 0 01-8.425-5.025 9.75 9.75 0 0116.55-4.825z" /></svg>;
const TrophyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-3-5v5m-3-2v2m-2 4h9M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" transform="scale(0.9)"/></svg>;
const HistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" /></svg>;
const LeaderboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const ChartBarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>;


interface DashboardModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    stats: ListeningStats;
    favoritesCount: number;
    unlockedAchievements: Record<string, UnlockedAchievement>;
    onOpenStats: () => void;
    onOpenAlarm: () => void;
    onOpenSettings: () => void;
    onOpenMap: () => void;
    onOpenAchievements: () => void;
    onOpenLeaderboard: () => void;
    onOpenHistory: () => void;
    onOpenSongChart: () => void;
}

const StatHighlight: React.FC<{ icon: React.ReactNode; value: string | number; label: string; }> = ({ icon, value, label }) => (
    <div className="bg-gray-900/50 p-3 rounded-lg text-center flex flex-col items-center">
        <div className="h-8 mb-2 flex items-center">{icon}</div>
        <div>
          <p className="text-xl font-bold font-orbitron accent-color-text">{value}</p>
          <p className="text-xs text-gray-400">{label}</p>
        </div>
    </div>
);

const ActionButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="bg-gray-700/50 hover:bg-gray-700/80 p-4 rounded-lg flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 hover:text-[var(--accent-color)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]">
        {icon}
        <span className="text-sm font-semibold">{label}</span>
    </button>
);


export const DashboardModal: React.FC<DashboardModalProps> = (props) => {
    const { isOpen, onClose, user, stats, favoritesCount, unlockedAchievements, onOpenStats, onOpenAlarm, onOpenSettings, onOpenMap, onOpenAchievements, onOpenLeaderboard, onOpenHistory, onOpenSongChart } = props;
    
    if (!isOpen || !user) return null;

    const unlockedCount = Object.keys(unlockedAchievements).length;
    const totalAchievements = Object.keys(ACHIEVEMENTS).length;
    
    const topGenresChartData = useMemo(() => {
        const genreTimes: Record<string, number> = {};
        Object.values(stats.stationPlays).forEach((play: StationPlayData) => {
            const mainGenre = play.genre.split('/')[0].trim();
            genreTimes[mainGenre] = (genreTimes[mainGenre] || 0) + play.time;
        });
        return Object.entries(genreTimes)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([label, value]) => ({ label, value }));
    }, [stats.stationPlays]);
    
    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="dashboard-modal-title">
            <div className="bg-gray-800/80 backdrop-blur-lg border accent-color-border/30 rounded-xl shadow-2xl shadow-black/50 w-full max-w-lg max-h-[80vh] flex flex-col animate-slide-up-fast" onClick={(e) => e.stopPropagation()}>
                <header className="p-4 border-b border-gray-700/50 flex justify-between items-center">
                    <h2 id="dashboard-modal-title" className="text-lg font-bold accent-color-text font-orbitron">
                        {user.username}'s Dashboard
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </header>

                <div className="p-6 overflow-y-auto space-y-6">
                    <div>
                        <h3 className="font-bold text-gray-300 mb-3">At a Glance</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <StatHighlight 
                                icon={<ACHIEVEMENTS.one_hour.icon className="h-6 w-6 text-cyan-400" />}
                                value={formatTime(stats.totalTime)}
                                label="Total Time"
                            />
                            <StatHighlight 
                                icon={<StarIcon className="h-6 w-6 text-yellow-400" />}
                                value={(stats.points || 0).toLocaleString()}
                                label="Listener Points"
                            />
                             <StatHighlight 
                                icon={<ACHIEVEMENTS.curator.icon className="h-6 w-6 text-pink-400" />}
                                value={favoritesCount}
                                label="Favorites"
                            />
                             <StatHighlight 
                                icon={<TrophyIcon />}
                                value={`${unlockedCount}/${totalAchievements}`}
                                label="Achievements"
                            />
                        </div>
                    </div>
                    
                    <BarChart data={topGenresChartData} title="Top Genres" />

                    <div>
                        <h3 className="font-bold text-gray-300 mb-3">Features</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                           <ActionButton icon={<LeaderboardIcon />} label="Leaderboard" onClick={onOpenLeaderboard} />
                           <ActionButton icon={<ChartBarIcon />} label="Song Chart" onClick={onOpenSongChart} />
                           <ActionButton icon={<HistoryIcon />} label="History" onClick={onOpenHistory} />
                           <ActionButton icon={<StatsIcon />} label="My Stats" onClick={onOpenStats} />
                           <ActionButton icon={<TrophyIcon />} label="Achievements" onClick={onOpenAchievements} />
                           <ActionButton icon={<AlarmIcon />} label="Alarm Clock" onClick={onOpenAlarm} />
                           <ActionButton icon={<MapIcon />} label="Explore Origins" onClick={onOpenMap} />
                           <ActionButton icon={<SettingsIcon />} label="Settings" onClick={onOpenSettings} />
                        </div>
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