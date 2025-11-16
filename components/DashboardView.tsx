import React, { useMemo } from 'react';
import type { User, ListeningStats, UnlockedAchievement, StationPlayData, SongHistoryItem } from '../types';
import { formatTime, formatTimeAgo } from '../utils/time';
import { ACHIEVEMENTS, StarIcon, TrophyIcon } from '../constants';
import { BarChart } from './BarChart';

interface DashboardViewProps {
    user: User | null;
    stats: ListeningStats;
    favoritesCount: number;
    unlockedAchievements: Record<string, UnlockedAchievement>;
}

const StatHighlight: React.FC<{ icon: React.ReactNode; value: string | number; label: string; }> = ({ icon, value, label }) => (
    <div className="bg-gray-900/50 p-4 rounded-lg text-center flex flex-col items-center justify-center">
        <div className="h-8 mb-2 flex items-center">{icon}</div>
        <div>
          <p className="text-2xl font-bold font-orbitron accent-color-text">{value}</p>
          <p className="text-xs text-gray-400 mt-1">{label}</p>
        </div>
    </div>
);

const RadioIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" /><path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 4a1 1 0 10-2 0v1a1 1 0 102 0v-1zm5-1a1 1 0 00-1 1v1a1 1 0 102 0v-1a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
const HistoryIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

const Section: React.FC<{title: string, icon: React.ReactNode, children: React.ReactNode}> = ({ title, icon, children }) => (
    <section>
        <div className="flex items-center gap-3 mb-4">
            <div className="text-cyan-400">{icon}</div>
            <h2 className="text-xl font-bold text-gray-200">{title}</h2>
        </div>
        {children}
    </section>
);


export const DashboardView: React.FC<DashboardViewProps> = ({ user, stats, favoritesCount, unlockedAchievements }) => {
    
    if (!user) return null;

    const unlockedCount = Object.keys(unlockedAchievements).length;
    
    const topGenresChartData = useMemo(() => {
        const genreTimes: Record<string, number> = {};
        Object.values(stats.stationPlays).forEach((play: StationPlayData) => {
            const mainGenre = play.genre.split('/')[0].trim();
            genreTimes[mainGenre] = (genreTimes[mainGenre] || 0) + play.time;
        });
        return Object.entries(genreTimes)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([label, value]) => ({ label, value }));
    }, [stats.stationPlays]);
    
    const recentHistory = useMemo(() => (stats.songHistory || []).slice(0, 5), [stats.songHistory]);
    const recentAchievements = useMemo(() => 
        Object.values(unlockedAchievements)
            .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
            .slice(0, 4)
            .map(ua => ACHIEVEMENTS[ua.id]), 
        [unlockedAchievements]
    );

    return (
        <div className="p-4 md:p-8 animate-fade-in space-y-8">
             <header className="text-center">
                <h1 className="text-3xl font-bold font-orbitron accent-color-text">
                    Welcome, {user.username}
                </h1>
                <p className="text-gray-400 mt-2">Here's a look at your listening journey.</p>
            </header>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatHighlight 
                    icon={<ACHIEVEMENTS.one_hour.icon className="h-8 w-8 text-cyan-400" />}
                    value={formatTime(stats.totalTime)}
                    label="Total Time"
                />
                <StatHighlight 
                    icon={<StarIcon className="h-8 w-8 text-yellow-400" />}
                    value={(stats.points || 0).toLocaleString()}
                    label="Listener Points"
                />
                 <StatHighlight 
                    icon={<ACHIEVEMENTS.curator.icon className="h-8 w-8 text-pink-400" />}
                    value={favoritesCount}
                    label="Favorites"
                />
                 <StatHighlight 
                    icon={<RadioIcon className="h-8 w-8 text-fuchsia-400" />}
                    value={Object.keys(stats.stationPlays).length}
                    label="Stations Played"
                />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Section title="Recent Activity" icon={<HistoryIcon className="h-6 w-6"/>}>
                    <div className="space-y-4">
                        {recentHistory.length > 0 ? recentHistory.map((item: SongHistoryItem) => (
                            <div key={`${item.songId}-${item.playedAt}`} className="flex items-center gap-3">
                                <img src={item.albumArt} alt={item.title} className="w-10 h-10 rounded-md object-cover" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-white truncate">{item.title}</p>
                                    <p className="text-xs text-gray-400 truncate">{item.artist}</p>
                                </div>
                                <p className="text-xs text-gray-500 font-mono flex-shrink-0">{formatTimeAgo(item.playedAt)}</p>
                            </div>
                        )) : <p className="text-sm text-gray-500 bg-gray-900/50 p-4 rounded-lg text-center">Your recently played songs will appear here.</p>}
                    </div>
                </Section>

                <Section title="Recent Achievements" icon={<TrophyIcon className="h-6 w-6"/>}>
                    <div className="grid grid-cols-2 gap-4">
                        {recentAchievements.length > 0 ? recentAchievements.map(ach => (
                            <div key={ach.id} className="bg-gray-900/50 p-3 rounded-lg flex items-center gap-3">
                                <div className="p-2 bg-[var(--accent-color)]/20 rounded-full text-[var(--accent-color)]">
                                    <ach.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">{ach.name}</p>
                                </div>
                            </div>
                        )) : <p className="text-sm text-gray-500 bg-gray-900/50 p-4 rounded-lg text-center">Your unlocked achievements will show here.</p>}
                    </div>
                </Section>
            </div>
            
            <BarChart data={topGenresChartData} title="Your Top Genres" />
        </div>
    );
};
