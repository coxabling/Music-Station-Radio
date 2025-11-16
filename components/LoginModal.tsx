import React, { useState } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onLogin: (username: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onLogin }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

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
    onLogin(username.trim());
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
        className="bg-gray-800/80 backdrop-blur-lg border accent-color-border/30 rounded-xl shadow-2xl shadow-black/50 w-full max-w-sm flex flex-col animate-slide-up-fast"
      >
        <header className="p-4 border-b border-gray-700/50">
          <h2 id="login-modal-title" className="text-lg font-bold accent-color-text font-orbitron text-center">
            Welcome to Music Station
          </h2>
        </header>
        
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <p className="text-sm text-gray-400 text-center">Please enter a username to continue. Your preferences will be saved locally.</p>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1 sr-only">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 text-center focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-all"
              placeholder="Enter your username"
              required
              autoFocus
            />
          </div>
          
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          
          <div className="pt-2 flex justify-center">
            <button
              type="submit"
              className="w-full bg-[var(--accent-color)] hover:opacity-80 text-black font-bold py-2 px-4 rounded-md transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-[var(--accent-color)]"
            >
              Login & Start Listening
            </button>
          </div>
        </form>
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
