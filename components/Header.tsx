import React from 'react';
import type { User } from '../types';
import { StarIcon } from '../constants';

interface HeaderProps {
    currentUser: User | null;
    onLogout: () => void;
    onOpenDashboard: () => void;
    points: number;
}

const MusicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 accent-color-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;

export const Header: React.FC<HeaderProps> = ({ currentUser, onLogout, onOpenDashboard, points }) => {
  return (
    <header className="bg-black/30 backdrop-blur-sm p-4 border-b border-gray-700/50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="w-1/3 flex items-center gap-4">
           {currentUser && (
            <div className="flex items-center gap-4 text-gray-300">
                <div className="flex items-center gap-2">
                    <UserIcon />
                    <span className="font-semibold text-sm hidden md:inline">{currentUser.username}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 rounded-full px-2.5 py-1 text-xs font-mono">
                    <StarIcon className="h-3 w-3" />
                    <span>{points.toLocaleString()}</span>
                </div>
            </div>
          )}
        </div>
        <div className="w-1/3 flex items-center justify-center">
          <MusicIcon />
          <h1 className="ml-3 text-xl font-bold font-orbitron tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-color)] to-purple-500">
            MUSIC STATION RADIO
          </h1>
        </div>
        <div className="w-1/3 flex items-center justify-end gap-2 sm:gap-4 text-gray-400">
            {currentUser && (
                <>
                    <button onClick={onOpenDashboard} className="hover:text-white transition-colors" title="Open Dashboard"><DashboardIcon/></button>
                    <button onClick={onLogout} className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/50 rounded-full py-1.5 px-3 transition-colors duration-300 text-sm font-semibold" title="Logout">
                        <LogoutIcon />
                        <span className="hidden lg:inline">Logout</span>
                    </button>
                </>
            )}
        </div>
      </div>
    </header>
  );
};
