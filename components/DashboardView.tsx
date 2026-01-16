import React, { useMemo } from 'react';
import type { User, ListeningStats, UnlockedAchievement, StationPlayData, SongHistoryItem, Quest } from '../types';
import { formatTime, formatTimeAgo } from '../utils/time';
import { ACHIEVEMENTS, StarIcon, TrophyIcon, CheckCircleIcon } from '../constants';
import { BarChart } from './BarChart';

interface DashboardViewProps {
    user: User | null;
    stats: ListeningStats;
    favoritesCount: number;
    unlockedAchievements: Record<string, UnlockedAchievement>;
    onBack: () => void; 
    quests: Quest[];
    onClaimQuest: (id: string) => void;
}

const StatHighlight: React.FC<{ icon: React.ReactNode; value: string | number; label: string; }> = ({ icon, value, label }) => (
    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50 flex items-center gap-4 transition-all hover:border-[var(--accent-color)]/50 hover:bg-gray-900">
        <div className="p-2 bg-gray-800/80 rounded-full border border-gray-700">
            {icon}
        </div>
        <div>
          <p className="text-2xl font-bold font-orbitron text-white">{value}</p>
          <p className="text-xs text-gray-400 mt-1">{label}</p>
        </div>
    </div>
);

const RadioIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" /><path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 4a1 1 0 10-2 0v1a1 1 0 102 0v-1zm5-1a1 1 0 00-1 1v1a1 1 0 102 0v-1a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
const HistoryIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>;
const ClipboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;

const Section: React.FC<{title: string, icon: React.ReactNode, children: React.ReactNode, className?: string}> = ({ title, icon, children, className }) => (
    <section className={`bg-gray-900/50 p-6 rounded-lg border border-gray-700/50 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
            <div className="text-cyan-400">{icon}</div>
            <h2 className="text-xl font-bold text-gray-200">{title}</h2>
        </div>
        {children}
    </section>
);


export const DashboardView: React.FC<DashboardViewProps> = ({ user, stats, favoritesCount, unlockedAchievements, onBack, quests, onClaimQuest }) => {
    
    if (!user) return null;
    
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
    
    const recentHistory = useMemo(() => stats.songHistory.slice(0, 5), [stats.songHistory]);
    const recentAchievements = useMemo(() => 
        Object.values(unlockedAchievements)
            .sort((a: UnlockedAchievement, b: UnlockedAchievement) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
            .slice(0, 4)
            .map((ua: UnlockedAchievement) => ACHIEVEMENTS[ua.id]), 
        [unlockedAchievements]
    );

    return (
        <div className="p-4 md:p-8 animate-fade-in">
             <div className="max-w-6xl mx-auto">
                <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[var(--accent-color)] transition-colors mb-6 group">
                    <BackIcon />
                    <span className="uppercase tracking-widest group-hover:pl-1 transition-all">Back to Explore</span>
                </button>

                <header className="text-center mb-8">
                    <h1 className="text-3xl font-bold font-orbitron accent-color-text">
                        Welcome, {user.username}
                    </h1>
                    <p className="text-gray-400 mt-2">Here's a look at your listening journey.</p>
                </header>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <main className="lg:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                icon={<RadioIcon className="h-6 w-6 text-fuchsia-400" />}
                                value={Object.keys(stats.stationPlays).length}
                                label="Stations Played"
                            />
                        </div>

                        <Section title="Active Quests" icon={<ClipboardIcon />}>
                            <div className="space-y-4">
                                {quests.map(quest => {
                                    const isComplete = quest.progress >= quest.goal;
                                    return (
                                        <div key={quest.id} className={`p-4 rounded-xl border transition-all ${quest.isClaimed ? 'bg-gray-800/20 border-gray-800 opacity-50' : 'bg-gray-800/40 border-gray-700'}`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-bold text-white">{quest.title}</h4>
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-black uppercase border ${quest.type === 'daily' ? 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10' : 'border-purple-500/30 text-purple-400 bg-purple-500/10'}`}>{quest.type}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-1">{quest.description}</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center gap-1.5 text-yellow-400 font-bold text-sm">
                                                        <span>+{quest.reward}</span>
                                                        <StarIcon className="w-3.5 h-3.5"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex-grow bg-gray-900 rounded-full h-2 overflow-hidden">
                                                    <div 
                                                        className={`h-full transition-all duration-500 ${isComplete ? 'bg-green-500' : 'bg-[var(--accent-color)]'}`}
                                                        style={{ width: `${(quest.progress / quest.goal) * 100}%` }}
                                                    />
                                                </div>
                                                {isComplete && !quest.isClaimed ? (
                                                    <button onClick={() => onClaimQuest(quest.id)} className="flex-shrink-0 bg-green-500 hover:bg-green-400 text-black font-bold py-1 px-4 rounded text-xs transition-colors">Claim</button>
                                                ) : quest.isClaimed ? (
                                                    <div className="flex items-center gap-1 text-gray-500 text-xs font-bold uppercase"><CheckCircleIcon className="w-4 h-4"/> Claimed</div>
                                                ) : (
                                                    <span className="text-[10px] font-mono text-gray-500">{quest.progress}/{quest.goal}</span>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </Section>

                        <BarChart data={topGenresChartData} title="Your Top Genres" />
                    </main>

                    <aside className="lg:col-span-1 space-y-8">
                        <Section title="Recent Activity" icon={<HistoryIcon className="h-6 w-6"/>}>
                            <div className="space-y-4">
                                {recentHistory.length > 0 ? recentHistory.map((item: SongHistoryItem, index) => (
                                    <div key={`${item.songId}-${item.playedAt}`} className="flex items-center gap-3 animate-fade-in-up" style={{animationDelay: `${index * 50}ms`}}>
                                        <img src={item.albumArt} alt={item.title} className="w-10 h-10 rounded-md object-cover" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-white truncate">{item.title}</p>
                                            <p className="text-xs text-gray-400 truncate">{item.artist}</p>
                                        </div>
                                        <p className="text-xs text-gray-500 font-mono flex-shrink-0">{formatTimeAgo(item.playedAt)}</p>
                                    </div>
                                )) : <p className="text-sm text-gray-500 text-center py-4">Your recently played songs will appear here.</p>}
                            </div>
                        </Section>

                        <Section title="Recent Achievements" icon={<TrophyIcon className="h-6 w-6"/>}>
                            <div className="space-y-3">
                                {recentAchievements.length > 0 ? recentAchievements.map((ach, index) => (
                                    <div key={ach.id} className="bg-gray-800/50 p-2 rounded-lg flex items-center gap-3 animate-fade-in-up" style={{animationDelay: `${index * 50}ms`}}>
                                        <div className="p-2 bg-[var(--accent-color)]/20 rounded-full text-[var(--accent-color)]">
                                            <ach.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">{ach.name}</p>
                                        </div>
                                    </div>
                                )) : <p className="text-sm text-gray-500 text-center py-4">Your unlocked achievements will show here.</p>}
                            </div>
                        </Section>
                    </aside>
                </div>
            </div>
        </div>
    );
};