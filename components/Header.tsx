import React from 'react';
import type { User } from '../types';
import { StarIcon, UserIcon, FireIcon } from '../constants';
import { RoleBadge } from './RoleBadge';

interface HeaderProps {
    currentUser: User | null;
    onLogout: () => void;
    points: number;
    onGoToHome: () => void;
    isVisible: boolean;
    customAvatarUrl?: string;
    isHypeStormActive?: boolean;
    stormRemaining?: number;
}

const MusicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 accent-color-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;

export const Header: React.FC<HeaderProps> = ({ currentUser, onLogout, points, onGoToHome, isVisible, customAvatarUrl, isHypeStormActive, stormRemaining }) => {
  return (
    <header className={`fixed top-0 left-0 w-full bg-gray-950/60 backdrop-blur-xl px-4 border-b border-white/10 flex-shrink-0 h-16 z-30 transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container mx-auto flex items-center justify-between h-full relative">
        {isHypeStormActive && (
            <div className="absolute inset-x-0 -bottom-8 flex justify-center pointer-events-none">
                <div className="bg-gradient-to-r from-orange-600 via-yellow-500 to-orange-600 px-6 py-1.5 rounded-b-xl shadow-lg border-x border-b border-white/20 animate-bounce text-black font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3">
                    <FireIcon className="w-4 h-4" />
                    NETWORK VIBE TAKEOVER: {stormRemaining}S REMAINING (2x POINTS)
                    <FireIcon className="w-4 h-4" />
                </div>
            </div>
        )}

        <div className="flex items-center gap-4 flex-1">
           {currentUser && (
            <button
              onClick={onGoToHome}
              className="flex items-center gap-4 text-gray-300 bg-gray-800/50 border border-gray-700/50 rounded-full pr-4 transition-all hover:border-[var(--accent-color)]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]"
              aria-label="Go to home dashboard"
            >
                <div className="flex items-center gap-2 bg-gray-700/50 rounded-full p-1.5 pr-3">
                    {customAvatarUrl ? (
                         <img src={customAvatarUrl} alt="User Avatar" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-cyan-300" />
                        </div>
                    )}
                    <span className="font-semibold text-sm hidden md:inline text-white">{currentUser.username}</span>
                    <RoleBadge role={currentUser.role} />
                </div>
                <div className="flex items-center gap-1.5 text-yellow-300 text-sm font-mono">
                    <StarIcon className="h-4 w-4" />
                    <span>{points.toLocaleString()}</span>
                </div>
            </button>
          )}
        </div>
        <button 
          onClick={onGoToHome} 
          className="flex-1 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] rounded-lg cursor-pointer"
          aria-label="Go to home dashboard"
        >
          <MusicIcon />
          <h1 className="ml-3 text-xl font-bold font-orbitron tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-color)] to-purple-500 uppercase">
            Music Station Radio
          </h1>
        </button>
        <div className="flex-1 flex items-center justify-end gap-2 sm:gap-4 text-gray-400">
            {currentUser && (
                <button onClick={onLogout} className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/50 rounded-full py-1.5 px-3 transition-colors duration-300 text-sm font-semibold" title="Logout">
                    <LogoutIcon />
                    <span className="hidden lg:inline">Logout</span>
                </button>
            )}
        </div>
      </div>
    </header>
  );
};
