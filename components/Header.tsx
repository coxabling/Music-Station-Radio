import React from 'react';
import type { User } from '../types';
import { StarIcon, UserIcon, FireIcon } from '../constants';
import { RoleBadge } from './RoleBadge';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
    currentUser: User | null;
    onLogout: () => void;
    points: number;
    onGoToHome: () => void;
    isVisible: boolean;
    customAvatarUrl?: string;
    isHypeStormActive?: boolean;
    stormRemaining?: number;
    onToggleMobileMenu?: () => void;
}

const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;

export const Header: React.FC<HeaderProps> = ({ currentUser, onLogout, points, onGoToHome, isVisible, customAvatarUrl, isHypeStormActive, stormRemaining, onToggleMobileMenu }) => {
  return (
    <header className={`fixed top-0 left-0 w-full bg-gray-950/75 backdrop-blur-xl px-4 border-b border-white/10 flex-shrink-0 h-16 z-30 transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container mx-auto flex items-center justify-between h-full relative gap-2">
        {isHypeStormActive && (
            <div className="absolute inset-x-0 -bottom-8 flex justify-center pointer-events-none">
                <div className="bg-gradient-to-r from-orange-600 via-yellow-500 to-orange-600 px-6 py-1.5 rounded-b-xl shadow-lg border-x border-b border-white/20 animate-bounce text-black font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3">
                    <FireIcon className="w-4 h-4" />
                    NETWORK VIBE TAKEOVER: {stormRemaining}S REMAINING (2x POINTS)
                    <FireIcon className="w-4 h-4" />
                </div>
            </div>
        )}

        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
           {currentUser && onToggleMobileMenu && (
             <button
               onClick={onToggleMobileMenu}
               className="md:hidden flex items-center justify-center p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
               aria-label="Toggle Navigation Drawer"
             >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
               </svg>
             </button>
           )}

           {currentUser && (
            <button
              onClick={onGoToHome}
              className="flex items-center gap-2 sm:gap-4 text-gray-300 bg-gray-900/40 border border-white/5 hover:border-cyan-500/20 rounded-full pr-3 sm:pr-4 py-0.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 shrink-0"
              aria-label="Go to home dashboard"
            >
                <div className="flex items-center gap-1.5 sm:gap-2 bg-white/5 rounded-full p-1 pr-2 sm:pr-3">
                    {customAvatarUrl ? (
                         <img src={customAvatarUrl} alt="User Avatar" className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover" />
                    ) : (
                         <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                            <UserIcon className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-cyan-300" />
                         </div>
                    )}
                    <span className="font-semibold text-xs sm:text-sm hidden sm:inline text-white max-w-[80px] truncate">{currentUser.username}</span>
                    <RoleBadge role={currentUser.role} />
                </div>
                <div className="flex items-center gap-1 text-yellow-300 text-xs sm:text-sm font-mono font-bold shrink-0">
                    <StarIcon className="h-3.5 w-3.5" />
                    <span>{points.toLocaleString()}</span>
                </div>
            </button>
          )}
        </div>

        <button 
          onClick={onGoToHome} 
          className="flex-1 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A8FF]/50 rounded-lg cursor-pointer min-w-0"
          aria-label="Go to home dashboard"
        >
          <BrandLogo variant="horizontal" size="md" animated={true} />
        </button>

        <div className="flex-1 flex items-center justify-end gap-1.5 sm:gap-4 text-gray-400 shrink-0">
            {currentUser && (
                <button onClick={onLogout} className="flex items-center justify-center p-2 sm:py-1.5 sm:px-3 bg-red-500/10 hover:bg-red-500/25 text-red-300 border border-red-500/30 hover:border-red-500/50 rounded-full transition-all text-xs sm:text-sm font-bold" title="Logout">
                    <LogoutIcon />
                    <span className="hidden md:inline ml-1.5">Logout</span>
                </button>
            )}
        </div>
      </div>
    </header>
  );
};
