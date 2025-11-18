
import React, { useState, useRef, useEffect } from 'react';
import type { UserData } from '../types';
import { UserIcon, MusicNoteIcon, ShieldCheckIcon, BriefcaseIcon, CheckCircleIcon } from '../constants';
import { getUserData } from '../services/apiService';
import { RoleBadge } from './RoleBadge';

interface LoginModalProps {
  isOpen: boolean;
  onLogin: (username: string, role: UserData['role']) => void;
}

const LoadingSpinner = () => (
    <div className="flex justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
    </div>
);

const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>;

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
        className={`w-full p-4 rounded-xl border text-left transition-all duration-200 group relative overflow-hidden ${
            isSelected
                ? 'bg-[var(--accent-color)]/10 border-[var(--accent-color)] ring-1 ring-[var(--accent-color)]'
                : 'bg-gray-800/40 border-gray-700 hover:border-gray-500 hover:bg-gray-800/60'
        }`}
    >
        <div className="flex items-start gap-4 relative z-10">
            <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg transition-colors ${isSelected ? 'bg-[var(--accent-color)] text-black' : 'bg-gray-700/50 text-gray-400 group-hover:text-white'}`}>
                {icon}
            </div>
            <div className="flex-1">
                <h4 className={`font-bold text-base ${isSelected ? 'text-[var(--accent-color)]' : 'text-white'}`}>{title}</h4>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{description}</p>
            </div>
            {isSelected && (
                <div className="absolute top-4 right-4 text-[var(--accent-color)] animate-fade-in">
                    <CheckCircleIcon className="w-5 h-5" />
                </div>
            )}
        </div>
    </button>
);

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onLogin }) => {
  const [step, setStep] = useState<'input' | 'returning' | 'signup'>('input');
  const [username, setUsername] = useState('');
  const [existingUser, setExistingUser] = useState<UserData | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserData['role']>('user');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && step === 'input') {
        // Focus input on open
        setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, step]);

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      setError('Letters, numbers, and underscores only.');
      return;
    }
    
    setError('');
    setIsLoading(true);

    try {
        // Check if user exists (admin always considered existing logic-wise for role bypass)
        if (username.toLowerCase() === 'admin') {
             // Specific admin handling
             onLogin(username.trim(), 'admin');
             return; 
        }

        const userData = await getUserData(username.trim());
        
        if (userData) {
            setExistingUser(userData);
            setStep('returning');
        } else {
            setExistingUser(null);
            setStep('signup');
        }
    } catch (err) {
        console.error(err);
        setError("Something went wrong. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleFinalLogin = () => {
      if (step === 'returning' && existingUser) {
          onLogin(username.trim(), existingUser.role);
      } else if (step === 'signup') {
          onLogin(username.trim(), selectedRole);
      }
  };
  
  const reset = () => {
      setStep('input');
      setError('');
      setExistingUser(null);
      setSelectedRole('user');
  }

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md relative perspective-1000">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden relative">
            
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[var(--accent-color)]/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header */}
            <header className="p-6 text-center pb-0">
                <h2 className="text-2xl font-bold font-orbitron tracking-wide text-white mb-1">
                    {step === 'input' ? 'Welcome' : step === 'returning' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-sm text-gray-400">
                    {step === 'input' ? 'Enter your username to start listening.' : 
                     step === 'returning' ? 'Good to see you again!' : 
                     'Choose your persona.'}
                </p>
            </header>

            {/* Content */}
            <div className="p-6">
                {step === 'input' && (
                    <form onSubmit={handleContinue} className="space-y-6 animate-fade-in-right">
                        <div className="relative group">
                            <input
                                ref={inputRef}
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl py-4 px-4 text-center text-xl font-bold text-white placeholder-gray-600 focus:outline-none focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] transition-all"
                                placeholder="Username"
                                autoComplete="username"
                            />
                            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-gray-600 to-transparent group-focus-within:via-[var(--accent-color)] transition-all"></div>
                        </div>
                        
                        {error && <p className="text-sm text-red-400 text-center bg-red-900/20 py-2 rounded-lg border border-red-500/20">{error}</p>}
                        
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-[var(--accent-color)] to-cyan-600 hover:from-cyan-300 hover:to-cyan-500 text-black font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-cyan-900/20 transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <LoadingSpinner /> : 'Continue'}
                        </button>
                    </form>
                )}

                {step === 'returning' && existingUser && (
                     <div className="space-y-6 animate-fade-in-right text-center">
                        <div className="flex flex-col items-center gap-3 py-4">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 p-1 border-2 border-[var(--accent-color)] shadow-[0_0_20px_rgba(103,232,249,0.3)]">
                                <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                                     <UserIcon className="w-10 h-10 text-gray-300"/>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">{username}</h3>
                                <div className="flex items-center justify-center gap-2 mt-1">
                                    <RoleBadge role={existingUser.role} className="w-4 h-4" />
                                    <span className="text-sm text-gray-400 capitalize">{existingUser.role}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleFinalLogin}
                            className="w-full bg-gradient-to-r from-[var(--accent-color)] to-cyan-600 hover:from-cyan-300 hover:to-cyan-500 text-black font-bold py-3.5 px-4 rounded-xl shadow-lg transform transition-all hover:scale-[1.02]"
                        >
                            Start Listening
                        </button>
                        
                        <button onClick={reset} className="text-sm text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-1 w-full">
                           <BackIcon /> Switch Account
                        </button>
                    </div>
                )}

                {step === 'signup' && (
                    <div className="space-y-4 animate-fade-in-right">
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                             <RoleCard 
                                icon={<UserIcon className="w-6 h-6"/>} 
                                title="Listener" 
                                description="Discover new music, create playlists, and join the community chat." 
                                isSelected={selectedRole === 'user'} 
                                onClick={() => setSelectedRole('user')} 
                            />
                            <RoleCard 
                                icon={<MusicNoteIcon className="w-6 h-6"/>} 
                                title="Artist" 
                                description="Submit your tracks to stations, get feedback, and grow your fanbase." 
                                isSelected={selectedRole === 'artist'} 
                                onClick={() => setSelectedRole('artist')} 
                            />
                            <RoleCard 
                                icon={<BriefcaseIcon className="w-6 h-6"/>} 
                                title="Station Manager" 
                                description="Own and manage radio stations, review submissions, and curate content." 
                                isSelected={selectedRole === 'owner'} 
                                onClick={() => setSelectedRole('owner')} 
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                onClick={handleFinalLogin}
                                className="w-full bg-gradient-to-r from-[var(--accent-color)] to-cyan-600 hover:from-cyan-300 hover:to-cyan-500 text-black font-bold py-3.5 px-4 rounded-xl shadow-lg transform transition-all hover:scale-[1.02]"
                            >
                                Create Account & Enter
                            </button>
                             <button onClick={reset} className="mt-3 text-sm text-gray-500 hover:text-white transition-colors w-full text-center">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }
        @keyframes fade-in-right {
            from { opacity: 0; transform: translateX(10px); }
            to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-right { animation: fade-in-right 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};
    