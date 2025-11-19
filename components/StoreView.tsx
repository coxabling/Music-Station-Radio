


import React, { useState } from 'react';
import type { Theme, ThemeName, AvatarFrame, SkinID, PlayerSkin } from '../types';
import { THEMES, AVATAR_FRAMES, PLAYER_SKINS, StarIcon, LockIcon, CheckCircleIcon } from '../constants';

interface StoreViewProps {
  activeTheme: ThemeName;
  onSetTheme: (themeName: ThemeName) => void;
  unlockedThemes: Set<ThemeName>;
  onUnlockTheme: (theme: Theme) => void;
  
  activeFrame?: string;
  unlockedFrames: string[];
  onSetFrame: (frameId: string) => void;
  onUnlockFrame: (frame: AvatarFrame) => void;
  
  activeSkin: SkinID;
  unlockedSkins: SkinID[];
  onSetSkin: (skinId: SkinID) => void;
  onUnlockSkin: (skin: PlayerSkin) => void;

  currentPoints: number;
}

const PaintBrushIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>;
const UserCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CubeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;


export const StoreView: React.FC<StoreViewProps> = ({ activeTheme, onSetTheme, unlockedThemes, onUnlockTheme, activeFrame, unlockedFrames, onSetFrame, onUnlockFrame, activeSkin, unlockedSkins, onSetSkin, onUnlockSkin, currentPoints }) => {
  const [activeTab, setActiveTab] = useState<'themes' | 'frames' | 'skins'>('skins');

  return (
    <div className="p-4 md:p-8 animate-fade-in h-full overflow-y-auto">
        <div className="max-w-6xl mx-auto">
            <header className="text-center mb-8 relative">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[var(--accent-color)]/10 rounded-full blur-[100px] pointer-events-none"></div>
                <h1 className="text-4xl font-bold font-orbitron text-white flex items-center justify-center gap-3 mb-2 relative z-10">
                    Item Shop
                </h1>
                <p className="text-gray-400 max-w-xl mx-auto relative z-10 mb-6">
                    Spend your points on exclusive visual upgrades.
                </p>
                
                <div className="inline-flex bg-gray-800 rounded-full p-1 border border-gray-700 relative z-10 flex-wrap justify-center">
                    <button onClick={() => setActiveTab('skins')} className={`px-6 py-2 rounded-full text-sm font-bold transition-colors flex items-center gap-2 ${activeTab === 'skins' ? 'bg-[var(--accent-color)] text-black' : 'text-gray-400 hover:text-white'}`}>
                        <CubeIcon /> Skins
                    </button>
                    <button onClick={() => setActiveTab('themes')} className={`px-6 py-2 rounded-full text-sm font-bold transition-colors flex items-center gap-2 ${activeTab === 'themes' ? 'bg-[var(--accent-color)] text-black' : 'text-gray-400 hover:text-white'}`}>
                        <PaintBrushIcon /> Themes
                    </button>
                    <button onClick={() => setActiveTab('frames')} className={`px-6 py-2 rounded-full text-sm font-bold transition-colors flex items-center gap-2 ${activeTab === 'frames' ? 'bg-[var(--accent-color)] text-black' : 'text-gray-400 hover:text-white'}`}>
                        <UserCircleIcon /> Avatars
                    </button>
                </div>

                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gray-800/80 rounded-full border border-yellow-500/30 text-yellow-400 shadow-lg relative z-10">
                    <StarIcon className="w-5 h-5"/>
                    <span className="font-bold text-lg">{currentPoints.toLocaleString()}</span>
                    <span className="text-xs uppercase tracking-wider opacity-80 ml-1">Points Available</span>
                </div>
            </header>

            {activeTab === 'skins' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                     {PLAYER_SKINS.map((skin) => {
                        const isUnlocked = unlockedSkins.includes(skin.id);
                        const isActive = activeSkin === skin.id;
                        const canAfford = currentPoints >= skin.cost;

                        return (
                            <div key={skin.id} className={`group bg-gray-900 rounded-2xl border p-4 flex flex-col transition-all duration-300 hover:shadow-2xl ${isActive ? 'border-[var(--accent-color)] shadow-[0_0_20px_rgba(var(--accent-color-rgb),0.2)]' : 'border-gray-800 hover:border-gray-600'}`}>
                                <div className="h-32 bg-black/50 rounded-xl mb-4 overflow-hidden relative">
                                    <img src={skin.previewImage} alt={skin.name} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                    {isActive && <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircleIcon className="w-3 h-3" /> Active</div>}
                                </div>
                                <h3 className="text-lg font-bold text-white font-orbitron mb-1">{skin.name}</h3>
                                <p className="text-xs text-gray-400 mb-4 flex-grow">{skin.description}</p>
                                
                                {!isUnlocked ? (
                                     <button onClick={() => onUnlockSkin(skin)} disabled={!canAfford} className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${canAfford ? 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-black' : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'}`}>
                                         {canAfford ? <LockIcon className="w-4 h-4"/> : <LockIcon className="w-4 h-4 opacity-50"/>} <span>Unlock for {skin.cost}</span> <StarIcon className="w-3 h-3"/>
                                     </button>
                                ) : (
                                     <button onClick={() => onSetSkin(skin.id)} disabled={isActive} className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 ${isActive ? 'bg-gray-800 text-[var(--accent-color)] border border-[var(--accent-color)]/30 cursor-default' : 'bg-white text-black hover:bg-gray-200'}`}>
                                         {isActive ? 'Equipped' : 'Equip Skin'}
                                     </button>
                                )}
                            </div>
                        );
                     })}
                </div>
            )}

            {activeTab === 'themes' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
                    {THEMES.map((theme, index) => {
                        const isUnlocked = unlockedThemes.has(theme.name);
                        const isActive = activeTheme === theme.name;
                        const canAfford = theme.cost ? currentPoints >= theme.cost : true;

                        return (
                            <div key={theme.name} className={`group relative flex flex-col bg-gray-900 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl overflow-hidden ${isActive ? 'border-[var(--accent-color)] shadow-[0_0_20px_rgba(var(--accent-color-rgb),0.2)]' : 'border-gray-800 hover:border-gray-600'}`}>
                                <div className="h-32 w-full relative overflow-hidden" style={{ background: theme.gradient || theme.color }}>
                                    {isActive && <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircleIcon className="w-3 h-3" /> Active</div>}
                                </div>
                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="font-bold text-lg text-white font-orbitron mb-2">{theme.displayName}</h3>
                                    <p className="text-xs text-gray-400 mb-6 flex-grow leading-relaxed">{theme.description || 'A unique visual style.'}</p>
                                    {!isUnlocked && theme.cost ? (
                                        <button onClick={() => onUnlockTheme(theme)} disabled={!canAfford} className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${canAfford ? 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-black' : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'}`}>
                                            {canAfford ? <LockIcon className="w-4 h-4"/> : <LockIcon className="w-4 h-4 opacity-50"/>} <span>Unlock for {theme.cost}</span> <StarIcon className="w-3 h-3"/>
                                        </button>
                                    ) : (
                                        <button onClick={() => onSetTheme(theme.name)} disabled={isActive} className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 ${isActive ? 'bg-gray-800 text-[var(--accent-color)] border border-[var(--accent-color)]/30 cursor-default' : 'bg-white text-black hover:bg-gray-200'}`}>{isActive ? 'Selected' : 'Apply Theme'}</button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {activeTab === 'frames' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    {AVATAR_FRAMES.map((frame, index) => {
                         const isUnlocked = unlockedFrames.includes(frame.id);
                         const isActive = activeFrame === frame.id;
                         const canAfford = currentPoints >= frame.cost;

                         return (
                            <div key={frame.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col items-center text-center hover:border-gray-600 transition-all">
                                <div className="relative w-24 h-24 mb-4">
                                    <div className={`w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-2xl font-bold text-gray-500 ${frame.cssClass}`}>
                                        You
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1">{frame.name}</h3>
                                <p className="text-xs text-gray-400 mb-4">{frame.cost} Points</p>
                                
                                {!isUnlocked ? (
                                     <button onClick={() => onUnlockFrame(frame)} disabled={!canAfford} className={`w-full py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${canAfford ? 'bg-yellow-500 hover:bg-yellow-400 text-black' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}>
                                         Unlock <StarIcon className="w-3 h-3"/>
                                     </button>
                                ) : (
                                     <button onClick={() => onSetFrame(frame.id)} disabled={isActive} className={`w-full py-2 rounded-lg font-bold text-sm transition-all ${isActive ? 'bg-gray-800 text-[var(--accent-color)]' : 'bg-white text-black hover:bg-gray-200'}`}>
                                         {isActive ? 'Equipped' : 'Equip'}
                                     </button>
                                )}
                            </div>
                         )
                    })}
                </div>
            )}
        </div>
    </div>
  );
};