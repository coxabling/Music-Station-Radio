
import React from 'react';
import type { ActiveView, User } from '../types';
import { HomeIcon, ExploreIcon, CommunityIcon, StoreIcon, LeaderboardIconSidebar, ChatBubbleIcon, AdminIcon, BriefcaseIcon, MusicNoteIcon } from '../constants';

interface SidebarProps {
    activeView: ActiveView;
    setActiveView: (view: ActiveView) => void;
    onOpenAlarm: () => void;
    onOpenSongChart: () => void;
    onOpenEvents: () => void;
    onOpenHistory: () => void;
    onOpenStockMarket: () => void; // New
    currentUser: User | null;
}

const NavButton: React.FC<{
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 flex-shrink-0 ${
            isActive
            ? 'bg-[var(--accent-color)] text-black shadow-lg shadow-[var(--accent-color)]/30'
            : 'text-gray-400 hover:bg-gray-800 hover:text-cyan-300'
        }`}
        aria-current={isActive ? 'page' : undefined}
    >
        {icon}
        <span className="text-xs font-semibold mt-1 text-center leading-tight">{label}</span>
    </button>
);

const CalendarIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const AlarmIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ChartBarIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>;
const HistoryIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" /></svg>;
const TrendingUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const QuestionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9.75h4.875a2.625 2.625 0 010 5.25H12M12 18.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>;


export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, onOpenAlarm, onOpenSongChart, onOpenEvents, onOpenHistory, onOpenStockMarket, currentUser }) => {
    
    const handleDashboardClick = () => {
        let targetView: ActiveView = 'dashboard';
        if (currentUser?.role === 'artist') targetView = 'artist_dashboard';
        if (currentUser?.role === 'owner') targetView = 'station_manager_dashboard';
        if (currentUser?.role === 'admin') targetView = 'admin';
        setActiveView(targetView);
    };
    
    const isDashboardActive = ['dashboard', 'artist_dashboard', 'station_manager_dashboard', 'admin'].includes(activeView);

    const getHomeIcon = () => {
      switch (currentUser?.role) {
        case 'artist': return <MusicNoteIcon className="w-6 h-6"/>;
        case 'owner': return <BriefcaseIcon className="w-6 h-6"/>;
        case 'admin': return <AdminIcon className="w-6 h-6"/>;
        default: return <HomeIcon className="w-6 h-6"/>;
      }
    }

    return (
        <>
            <nav className="hidden md:flex w-20 bg-gray-950/30 p-2 flex-shrink-0 flex-col items-center gap-3 border-r border-white/10 h-full overflow-y-auto custom-sidebar-scrollbar">
                <NavButton label="Home" icon={getHomeIcon()} isActive={isDashboardActive} onClick={handleDashboardClick} />
                <NavButton label="Explore" icon={<ExploreIcon className="w-6 h-6"/>} isActive={activeView === 'explore'} onClick={() => setActiveView('explore')} />
                
                <div className="w-full h-px bg-gray-700 my-2 flex-shrink-0" />

                <NavButton label="Store" icon={<StoreIcon className="w-6 h-6"/>} isActive={activeView === 'store'} onClick={() => setActiveView('store')} />
                <NavButton label="Top Charts" icon={<LeaderboardIconSidebar className="w-6 h-6"/>} isActive={activeView === 'leaderboard'} onClick={() => setActiveView('leaderboard')} />
                
                <div className="w-full h-px bg-gray-700 my-2 flex-shrink-0" />
                
                <NavButton label="Stocks" icon={<TrendingUpIcon />} isActive={false} onClick={onOpenStockMarket} />
                <NavButton label="Song Chart" icon={<ChartBarIcon className="w-6 h-6"/>} isActive={false} onClick={onOpenSongChart} />
                <NavButton label="History" icon={<HistoryIcon className="w-6 h-6"/>} isActive={false} onClick={onOpenHistory} />
                <NavButton label="Events" icon={<CalendarIcon className="w-6 h-6"/>} isActive={false} onClick={onOpenEvents} />
                <NavButton label="Alarm" icon={<AlarmIcon className="w-6 h-6"/>} isActive={false} onClick={onOpenAlarm} />
                
                <div className="mt-auto w-full pt-2 border-t border-gray-700 flex-shrink-0">
                    <NavButton label="Help" icon={<QuestionIcon />} isActive={activeView === 'help'} onClick={() => setActiveView('help')} />
                </div>

                {/* Spacer for better bottom padding scrolling */}
                <div className="h-4 flex-shrink-0"></div>
            </nav>
            <style>{`
                .custom-sidebar-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-sidebar-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-sidebar-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: var(--accent-color);
                }
            `}</style>
        </>
    );
};
