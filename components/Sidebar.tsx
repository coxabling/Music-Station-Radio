import React from 'react';
import type { ActiveView } from '../types';
import { HomeIcon, ExploreIcon, CommunityIcon, StoreIcon, LeaderboardIconSidebar, MapIconSidebar } from '../constants';

interface SidebarProps {
    activeView: ActiveView;
    setActiveView: (view: ActiveView) => void;
    onOpenAlarm: () => void;
    onOpenSongChart: () => void;
    onOpenEvents: () => void;
}

const NavButton: React.FC<{
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${
            isActive
            ? 'bg-[var(--accent-color)] text-black shadow-lg shadow-[var(--accent-color)]/30'
            : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
        }`}
        aria-current={isActive ? 'page' : undefined}
    >
        {icon}
        <span className="text-xs font-semibold mt-1">{label}</span>
    </button>
);

const CalendarIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const AlarmIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ChartBarIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>;


export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, onOpenAlarm, onOpenSongChart, onOpenEvents }) => {
    return (
        <nav className="w-20 bg-gray-900/50 p-2 flex-shrink-0 flex flex-col items-center gap-2 border-r border-gray-700/50">
            <NavButton label="Dashboard" icon={<HomeIcon className="w-6 h-6"/>} isActive={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
            <NavButton label="Explore" icon={<ExploreIcon className="w-6 h-6"/>} isActive={activeView === 'explore'} onClick={() => setActiveView('explore')} />
            <NavButton label="Community" icon={<CommunityIcon className="w-6 h-6"/>} isActive={activeView === 'community'} onClick={() => setActiveView('community')} />
            
            <div className="w-full h-px bg-gray-700 my-2" />

            <NavButton label="Store" icon={<StoreIcon className="w-6 h-6"/>} isActive={activeView === 'store'} onClick={() => setActiveView('store')} />
            <NavButton label="Top Charts" icon={<LeaderboardIconSidebar className="w-6 h-6"/>} isActive={activeView === 'leaderboard'} onClick={() => setActiveView('leaderboard')} />
            <NavButton label="Map" icon={<MapIconSidebar className="w-6 h-6"/>} isActive={activeView === 'map'} onClick={() => setActiveView('map')} />

            <div className="w-full h-px bg-gray-700 my-2" />
            
            <NavButton label="Song Chart" icon={<ChartBarIcon className="w-6 h-6"/>} isActive={false} onClick={onOpenSongChart} />
            <NavButton label="Events" icon={<CalendarIcon className="w-6 h-6"/>} isActive={false} onClick={onOpenEvents} />
            <NavButton label="Alarm" icon={<AlarmIcon className="w-6 h-6"/>} isActive={false} onClick={onOpenAlarm} />
        </nav>
    );
};
