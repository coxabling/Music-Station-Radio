import React, { useState } from 'react';
import type { UserData } from '../types';
import { UserIcon, MusicNoteIcon, ShieldCheckIcon } from '../constants';

interface LoginModalProps {
  isOpen: boolean;
  onLogin: (username: string, role: UserData['role']) => void;
}

const RadioTowerIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-5.25-4.25-9.5-9.5-9.5S.5 6.75.5 12s4.25 9.5 9.5 9.5 9.5-4.25 9.5-9.5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v-2.25m0 16.5V21.5m-6.364-2.136L4.222 17.95m13.414 0l-1.414-1.414M4.222 6.05l1.414 1.414m13.414 0l-1.414-1.414" /></svg>;
const KeyIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>;


const RoleCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    isSelected: boolean;
    onClick: () => void;
}> = ({ icon, title, description, isSelected, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
            isSelected
                ? 'bg-[var(--accent-color)]/20 border-[var(--accent-color)] shadow-lg shadow-[var(--accent-color)]/20'
                : 'bg-gray-700/50 border-gray-600 hover:border-gray-500'
        }`}
    >
        <div className="flex items-center gap-3">
            <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${isSelected ? 'bg-[var(--accent-color)] text-black' : 'bg-gray-600 text-gray-300'}`}>
                {icon}
            </div>
            <div>
                <h4 className="font-bold text-white">{title}</h4>
                <p className="text-xs text-gray-400">{description}</p>
            </div>
        </div>
    </button>
);


export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onLogin }) => {
  const [username, setUsername] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserData['role']>('user');
  const [error, setError] = useState('');
  
  const isAdminLogin = username.toLowerCase() === 'admin';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      setError('Username can only contain letters, numbers, and underscores.');
      return;
    }
    setError('');
    onLogin(username.trim(), isAdminLogin ? 'admin' : selectedRole);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <div 
        className="bg-gray-800/80 backdrop-blur-lg border accent-color-border/30 rounded-xl shadow-2xl shadow-black/50 w-full max-w-md flex flex-col animate-slide-up-fast"
      >
        <>
            <header className="p-4 border-b border-gray-700/50">
            <h2 id="login-modal-title" className="text-lg font-bold accent-color-text font-orbitron text-center">
                Sign In or Sign Up
            </h2>
            </header>
            
            <form onSubmit={handleLogin} className="p-6 space-y-4">
            <p className="text-sm text-gray-400 text-center">Enter a username to begin. If it's your first time, choose a role!</p>
            <div>
                <label htmlFor="username" className="sr-only">Username</label>
                <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-600 rounded-md py-2.5 px-3 text-white placeholder-gray-400 text-center text-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-all"
                placeholder="Enter your username"
                required
                autoFocus
                />
            </div>

            {!isAdminLogin && (
                <div className="space-y-3">
                    <RoleCard icon={<UserIcon className="w-5 h-5"/>} title="Listener" description="Explore stations and enjoy the music." isSelected={selectedRole === 'user'} onClick={() => setSelectedRole('user')} />
                    <RoleCard icon={<MusicNoteIcon className="w-5 h-5"/>} title="Artist" description="Submit your music to stations." isSelected={selectedRole === 'artist'} onClick={() => setSelectedRole('artist')} />
                    <RoleCard icon={<RadioTowerIcon className="w-5 h-5"/>} title="Station Manager" description="Add and manage your own radio stations." isSelected={selectedRole === 'owner'} onClick={() => setSelectedRole('owner')} />
                </div>
            )}
            
            {error && <p className="text-sm text-red-400 text-center">{error}</p>}
            
            <div className="pt-2 flex justify-center">
                <button
                type="submit"
                className="w-full bg-[var(--accent-color)] hover:opacity-80 text-black font-bold py-3 px-4 rounded-md transition-opacity duration-300 text-lg"
                >
                {isAdminLogin ? 'Login as Admin' : 'Enter Radio'}
                </button>
            </div>
            </form>
        </>
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