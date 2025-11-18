
import React, { useState } from 'react';
import type { Lounge } from '../types';
import { LockIcon, UserGroupIcon } from '../constants';

interface LoungeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateLounge: (name: string, isPrivate: boolean, password?: string) => void;
    onJoinLounge: (loungeId: string) => void;
    activeLounge: Lounge | null;
    onLeaveLounge: () => void;
}

export const LoungeModal: React.FC<LoungeModalProps> = ({ isOpen, onClose, onCreateLounge, onJoinLounge, activeLounge, onLeaveLounge }) => {
    const [mode, setMode] = useState<'create' | 'join'>('create');
    const [name, setName] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [password, setPassword] = useState('');

    if (!isOpen) return null;

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (name) {
            onCreateLounge(name, isPrivate, password);
            onClose();
        }
    };

    if (activeLounge) {
        return (
             <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast" onClick={onClose}>
                <div className="bg-gray-800/90 backdrop-blur-lg border accent-color-border/30 rounded-xl p-6 w-full max-w-sm text-center" onClick={e => e.stopPropagation()}>
                    <div className="w-16 h-16 bg-[var(--accent-color)]/20 rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--accent-color)]">
                        <UserGroupIcon className="w-8 h-8"/>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">{activeLounge.name}</h2>
                    <p className="text-gray-400 text-sm mb-6">Hosted by {activeLounge.host}</p>
                    
                    <div className="bg-gray-900/50 p-4 rounded-lg mb-6">
                         <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Now Playing Control</p>
                         <p className="text-white font-semibold">{activeLounge.host === 'You' ? 'You are the DJ' : `${activeLounge.host} is the DJ`}</p>
                    </div>

                    <button 
                        onClick={() => { onLeaveLounge(); onClose(); }}
                        className="w-full bg-red-500/20 hover:bg-red-500/40 text-red-300 font-bold py-3 rounded-lg transition-colors"
                    >
                        Leave Lounge
                    </button>
                </div>
             </div>
        )
    }

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast" onClick={onClose}>
            <div className="bg-gray-800/90 backdrop-blur-lg border border-gray-700 rounded-xl w-full max-w-md flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="flex border-b border-gray-700">
                    <button onClick={() => setMode('create')} className={`flex-1 py-4 font-bold text-sm transition-colors ${mode === 'create' ? 'bg-gray-800 text-white' : 'bg-gray-900 text-gray-500 hover:text-gray-300'}`}>Create Lounge</button>
                    <button onClick={() => setMode('join')} className={`flex-1 py-4 font-bold text-sm transition-colors ${mode === 'join' ? 'bg-gray-800 text-white' : 'bg-gray-900 text-gray-500 hover:text-gray-300'}`}>Join Lounge</button>
                </div>

                <div className="p-6">
                    {mode === 'create' ? (
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Lounge Name</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-[var(--accent-color)] outline-none" placeholder="e.g. Late Night Vibes" required />
                            </div>
                            
                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsPrivate(!isPrivate)}>
                                <div className={`w-5 h-5 rounded border flex items-center justify-center ${isPrivate ? 'bg-[var(--accent-color)] border-[var(--accent-color)]' : 'border-gray-500'}`}>
                                    {isPrivate && <LockIcon className="w-3 h-3 text-black"/>}
                                </div>
                                <span className="text-sm text-gray-300">Private (Password Protected)</span>
                            </div>

                            {isPrivate && (
                                <div className="animate-fade-in">
                                    <label className="block text-xs text-gray-400 mb-1">Password</label>
                                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-[var(--accent-color)] outline-none" />
                                </div>
                            )}

                            <button type="submit" className="w-full bg-[var(--accent-color)] hover:opacity-90 text-black font-bold py-3 rounded-lg mt-2 transition-opacity">Create & Start DJing</button>
                        </form>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-400 mb-4">No public lounges active right now.</p>
                            <button onClick={() => setMode('create')} className="text-[var(--accent-color)] hover:underline text-sm">Create one instead?</button>
                        </div>
                    )}
                </div>
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
