import React from 'react';
import type { ActiveView, User } from '../types';
import { HomeIcon, ExploreIcon, CommunityIcon, StoreIcon, LeaderboardIconSidebar, ChatBubbleIcon, AdminIcon, BriefcaseIcon, MusicNoteIcon, CollectionIcon, GlobeIcon } from '../constants';
import { BrandLogo } from './BrandLogo';

interface SidebarProps {
    activeView: ActiveView;
    setActiveView: (view: ActiveView) => void;
    onOpenAlarm: () => void;
    onOpenSongChart: () => void;
    onOpenEvents: () => void;
    onOpenHistory: () => void;
    onOpenStockMarket: () => void; 
    onOpenCollection: () => void; 
    currentUser: User | null;
    isMobileOpen?: boolean;
    onCloseMobile?: () => void;
}

const NavButton: React.FC<{
    label: string;
    description?: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
    layout?: 'compact' | 'full';
}> = ({ label, description, icon, isActive, onClick, layout = 'compact' }) => {
    if (layout === 'compact') {
        return (
            <button
                onClick={onClick}
                className={`w-full flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 group relative ${
                    isActive
                    ? 'bg-[var(--accent-color)] text-black shadow-lg shadow-[var(--accent-color)]/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-cyan-300'
                }`}
                aria-current={isActive ? 'page' : undefined}
                title={label}
            >
                <div className="transition-transform duration-200 group-hover:scale-110">{icon}</div>
                <span className="text-[10px] font-bold mt-1 text-center leading-tight truncate w-full">{label}</span>
                
                {/* Floating Tooltip */}
                <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-gray-950 border border-white/10 rounded-lg text-[11px] font-bold text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50 shadow-xl">
                    {label} {description && <span className="text-gray-500 font-normal">| {description}</span>}
                </div>
            </button>
        );
    }

    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-left ${
                isActive
                ? 'bg-gradient-to-r from-[var(--accent-color)]/20 to-[var(--accent-color)]/5 text-cyan-300 border-l-4 border-[var(--accent-color)] font-bold'
                : 'text-gray-300 hover:bg-white/5 hover:text-cyan-300 border-l-4 border-transparent'
            }`}
            aria-current={isActive ? 'page' : undefined}
        >
            <div className={`p-1.5 rounded-lg shrink-0 ${isActive ? 'bg-[var(--accent-color)]/20 text-[var(--accent-color)]' : 'bg-white/5 text-gray-400'}`}>
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-xs font-bold tracking-wide">{label}</p>
                {description && <p className="text-[10px] text-gray-400 truncate mt-0.5">{description}</p>}
            </div>
        </button>
    );
};

const CalendarIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const AlarmIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ChartBarIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>;
const HistoryIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" /></svg>;
const TrendingUpIcon = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const QuestionIcon = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9.75h4.875a2.625 2.625 0 010 5.25H12M12 18.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>;
const ShopIcon = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>;

export const Sidebar: React.FC<SidebarProps> = ({ 
    activeView, 
    setActiveView, 
    onOpenAlarm, 
    onOpenSongChart, 
    onOpenEvents, 
    onOpenHistory, 
    onOpenStockMarket, 
    onOpenCollection, 
    currentUser,
    isMobileOpen = false,
    onCloseMobile
}) => {
    
    const handleDashboardClick = () => {
        let targetView: ActiveView = 'dashboard';
        if (currentUser?.role === 'artist') targetView = 'artist_dashboard';
        if (currentUser?.role === 'owner') targetView = 'station_manager_dashboard';
        if (currentUser?.role === 'admin') targetView = 'admin';
        setActiveView(targetView);
        if (onCloseMobile) onCloseMobile();
    };
    
    const isDashboardActive = ['dashboard', 'artist_dashboard', 'station_manager_dashboard', 'admin'].includes(activeView);

    const getHomeIcon = (className = "w-6 h-6") => {
      switch (currentUser?.role) {
        case 'artist': return <MusicNoteIcon className={className}/>;
        case 'owner': return <BriefcaseIcon className={className}/>;
        case 'admin': return <AdminIcon className={className}/>;
        default: return <HomeIcon className={className}/>;
      }
    };

    const getDashboardLabel = () => {
      switch (currentUser?.role) {
        case 'artist': return 'Artist Hub';
        case 'owner': return 'Station Desk';
        case 'admin': return 'HQ Panel';
        default: return 'Home Base';
      }
    };

    // Shared Nav Links data with descriptors for a highly professional feel
    const navSections = [
        {
            title: "MAIN BROADCASTS",
            links: [
                { id: 'dashboard', label: getDashboardLabel(), icon: getHomeIcon("w-5 h-5"), isActive: isDashboardActive, onClick: handleDashboardClick, desc: "Personal listening dashboard" },
                { id: 'explore', label: 'Explore Grid', icon: <ExploreIcon className="w-5 h-5"/>, isActive: activeView === 'explore', onClick: () => { setActiveView('explore'); if (onCloseMobile) onCloseMobile(); }, desc: "Discover curated radio waves" },
            ]
        },
        {
            title: "INTERACTIVE CORNER",
            links: [
                { id: 'store', label: 'VIP Emporium', icon: <StoreIcon className="w-5 h-5"/>, isActive: activeView === 'store', onClick: () => { setActiveView('store'); if (onCloseMobile) onCloseMobile(); }, desc: "Skins, badge frames, and custom tools" },
                { id: 'leaderboard', label: 'Broadcaster Standings', icon: <LeaderboardIconSidebar className="w-5 h-5"/>, isActive: activeView === 'leaderboard', onClick: () => { setActiveView('leaderboard'); if (onCloseMobile) onCloseMobile(); }, desc: "Check station and user rankings" },
                { id: 'prediction_market', label: 'Vibe Prediction', icon: <TrendingUpIcon className="w-5 h-5" />, isActive: activeView === 'prediction_market', onClick: () => { setActiveView('prediction_market'); if (onCloseMobile) onCloseMobile(); }, desc: "Predict music and rating shifts" },
                { id: 'trading_post', label: 'Collector Exchange', icon: <ShopIcon className="w-5 h-5" />, isActive: activeView === 'trading_post', onClick: () => { setActiveView('trading_post'); if (onCloseMobile) onCloseMobile(); }, desc: "Trade high-fidelity dynamic vinyl cards" },
            ]
        },
        {
            title: "LOGS & UTILITIES",
            links: [
                { id: 'cards', label: 'My Cards', icon: <CollectionIcon className="w-5 h-5" />, isActive: false, onClick: () => { onOpenCollection(); if (onCloseMobile) onCloseMobile(); }, desc: "View your earned artist cards" },
                { id: 'song_charts', label: 'Weekly Chart', icon: <ChartBarIcon className="w-5 h-5"/>, isActive: false, onClick: () => { onOpenSongChart(); if (onCloseMobile) onCloseMobile(); }, desc: "Current high-ranking community tracks" },
                { id: 'history', label: 'Fidelity Logs', icon: <HistoryIcon className="w-5 h-5"/>, isActive: false, onClick: () => { onOpenHistory(); if (onCloseMobile) onCloseMobile(); }, desc: "Uptime history and past tunes" },
                { id: 'events', label: 'Scheduled Raves', icon: <CalendarIcon className="w-5 h-5"/>, isActive: false, onClick: () => { onOpenEvents(); if (onCloseMobile) onCloseMobile(); }, desc: "Special schedule and party events" },
                { id: 'alarm', label: 'Wake-Up Clock', icon: <AlarmIcon className="w-5 h-5"/>, isActive: false, onClick: () => { onOpenAlarm(); if (onCloseMobile) onCloseMobile(); }, desc: "Alarm to wake up with your favorite radio" },
            ]
        }
    ];

    if (currentUser?.role === 'admin') {
        navSections[1].links.push({
            id: 'seo_geo',
            label: 'SEO & GEO Systems',
            icon: <GlobeIcon className="w-5 h-5" />,
            isActive: activeView === 'seo_geo',
            onClick: () => { setActiveView('seo_geo'); if (onCloseMobile) onCloseMobile(); },
            desc: "Global optimization matrices"
        });
    }

    return (
        <>
            {/* 1. DESKTOP RAIL (Shown on medium and larger screens) */}
            <nav className="hidden md:flex w-22 bg-gray-950/45 p-3.5 flex-shrink-0 flex-col items-center gap-4 border-r border-white/10 h-full overflow-y-auto custom-sidebar-scrollbar backdrop-blur-md">
                <div className="flex flex-col items-center gap-1.5 w-full">
                    <NavButton label="Home" icon={getHomeIcon("w-6 h-6")} isActive={isDashboardActive} onClick={handleDashboardClick} />
                    <NavButton label="Explore" icon={<ExploreIcon className="w-6 h-6"/>} isActive={activeView === 'explore'} onClick={() => setActiveView('explore')} />
                </div>
                
                <div className="w-full h-px bg-white/10 flex-shrink-0" />

                <div className="flex flex-col items-center gap-2 w-full">
                    <NavButton label="Store" icon={<StoreIcon className="w-6 h-6"/>} isActive={activeView === 'store'} onClick={() => setActiveView('store')} />
                    <NavButton label="Charts" icon={<LeaderboardIconSidebar className="w-6 h-6"/>} isActive={activeView === 'leaderboard'} onClick={() => setActiveView('leaderboard')} />
                </div>
                
                <div className="w-full h-px bg-white/10 flex-shrink-0" />
                
                <div className="flex flex-col items-center gap-2.5 w-full flex-grow">
                    <NavButton label="Market" icon={<TrendingUpIcon />} isActive={activeView === 'prediction_market'} onClick={() => setActiveView('prediction_market')} />
                    <NavButton label="Trade" icon={<ShopIcon />} isActive={activeView === 'trading_post'} onClick={() => setActiveView('trading_post')} />
                    {currentUser?.role === 'admin' && (
                        <NavButton label="SEO-GEO" icon={<GlobeIcon className="w-6 h-6" />} isActive={activeView === 'seo_geo'} onClick={() => setActiveView('seo_geo')} />
                    )}
                    <NavButton label="Cards" icon={<CollectionIcon className="w-6 h-6" />} isActive={false} onClick={onOpenCollection} />
                    <NavButton label="Chart Logs" icon={<ChartBarIcon className="w-6 h-6"/>} isActive={false} onClick={onOpenSongChart} />
                    <NavButton label="History" icon={<HistoryIcon className="w-6 h-6"/>} isActive={false} onClick={onOpenHistory} />
                    <NavButton label="Events" icon={<CalendarIcon className="w-6 h-6"/>} isActive={false} onClick={onOpenEvents} />
                    <NavButton label="Alarm" icon={<AlarmIcon className="w-6 h-6"/>} isActive={false} onClick={onOpenAlarm} />
                </div>
                
                <div className="mt-auto w-full pt-2 border-t border-white/10 flex-shrink-0">
                    <NavButton label="Help" icon={<QuestionIcon />} isActive={activeView === 'help'} onClick={() => setActiveView('help')} />
                </div>
            </nav>

            {/* 2. MOBILE COLLAPSIBLE DRAWER (Only on small screens) */}
            {isMobileOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
                    {/* Dark glass backdrop overlay */}
                    <div 
                        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
                        onClick={onCloseMobile}
                    ></div>
                    
                    {/* Drawer Content */}
                    <div className="relative w-80 max-w-[85vw] bg-gray-950/95 border-r border-white/15 h-full flex flex-col justify-between z-10 shadow-2xl animate-drawer-slide-in overflow-hidden">
                        
                        {/* Drawer Header */}
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-gray-900/40">
                            <BrandLogo variant="horizontal" size="sm" animated={true} />
                            <button 
                                onClick={onCloseMobile}
                                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                aria-label="Close navigation"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Navigation Scrollable Body */}
                        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5 custom-sidebar-scrollbar bg-gradient-to-b from-gray-950 via-gray-950 to-gray-900">
                            {navSections.map((section, idx) => (
                                <div key={idx} className="space-y-1.5">
                                    <h3 className="text-[10px] font-bold text-gray-500 tracking-[0.15em] px-3.5 uppercase">{section.title}</h3>
                                    <div className="space-y-1">
                                        {section.links.map((link) => (
                                            <NavButton 
                                                key={link.id} 
                                                label={link.label} 
                                                description={link.desc} 
                                                icon={link.icon} 
                                                isActive={link.isActive} 
                                                onClick={link.onClick} 
                                                layout="full" 
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer / Help FAQ shortcut */}
                        <div className="p-4 border-t border-white/10 bg-gray-900/40">
                            <NavButton 
                                label="Help Desk & FAQ" 
                                description="Need assistance or have feedback?" 
                                icon={<QuestionIcon className="w-5 h-5" />} 
                                isActive={activeView === 'help'} 
                                onClick={() => { setActiveView('help'); if (onCloseMobile) onCloseMobile(); }} 
                                layout="full" 
                            />
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .custom-sidebar-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-sidebar-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-sidebar-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(255, 255, 255, 0.08);
                    border-radius: 10px;
                }
                .custom-sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: var(--accent-color);
                }
                @keyframes drawer-slide-in {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(0); }
                }
                .animate-drawer-slide-in {
                    animation: drawer-slide-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </>
    );
};
