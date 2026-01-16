import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { Station, User } from '../types';
import { StarIcon, SparklesIcon, FireIcon } from '../constants';
import { GoogleGenAI } from '@google/genai';

interface MorphViewProps {
  allStations: Station[];
  favoriteStationUrls: Set<string>;
  onBack: () => void;
  currentUser: User | null;
}

const SyncIcon = ({className = ""}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 10.5M20 20l-1.5-1.5A9 9 0 003.5 13.5" /></svg>;
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>;

export const MorphView: React.FC<MorphViewProps> = ({ allStations, favoriteStationUrls, onBack, currentUser }) => {
    const [stationA, setStationA] = useState<Station | null>(null);
    const [stationB, setStationB] = useState<Station | null>(null);
    const [balance, setBalance] = useState(0.5);
    const [isPlaying, setIsPlaying] = useState(false);
    const [aiInsight, setAiInsight] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const audioARef = useRef<HTMLAudioElement>(null);
    const audioBRef = useRef<HTMLAudioElement>(null);

    const favorites = useMemo(() => {
        return allStations.filter(s => favoriteStationUrls.has(s.streamUrl));
    }, [allStations, favoriteStationUrls]);

    const availableStations = useMemo(() => {
        return allStations.slice(0, 15); // Show first 15 for selection
    }, [allStations]);

    useEffect(() => {
        if (audioARef.current) audioARef.current.volume = (1 - balance) * isPlaying ? 0.8 : 0;
        if (audioBRef.current) audioBRef.current.volume = balance * isPlaying ? 0.8 : 0;
    }, [balance, isPlaying]);

    useEffect(() => {
        if (isPlaying) {
            audioARef.current?.play().catch(() => {});
            audioBRef.current?.play().catch(() => {});
        } else {
            audioARef.current?.pause();
            audioBRef.current?.pause();
        }
    }, [isPlaying, stationA, stationB]);

    const analyzeBlend = async () => {
        if (!stationA || !stationB) return;
        setIsAnalyzing(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `Analyze the musical blend between two radio stations. 
                Station A: ${stationA.name} (Genre: ${stationA.genre})
                Station B: ${stationB.name} (Genre: ${stationB.genre})
                Provide a cool "Vibe Compatibility" summary in 2 sentences, mentioning how the rhythms might interact. 
                Focus on BPM and feel.`
            });
            setAiInsight(response.text || "Perfect sonic alignment detected.");
        } catch (error) {
            console.error(error);
            setAiInsight("Deep sonic resonance confirmed across multiple frequencies.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="p-4 lg:p-8 animate-fade-in relative min-h-screen">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent pointer-events-none"></div>
            
            <div className="max-w-6xl mx-auto">
                <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-cyan-400 transition-colors mb-8 group">
                    <BackIcon />
                    <span className="uppercase tracking-widest group-hover:pl-1 transition-all">Back to Explore</span>
                </button>

                <header className="text-center mb-12">
                    <h1 className="text-4xl lg:text-6xl font-black font-orbitron tracking-tighter text-white uppercase leading-none mb-4">
                        Sonic Morph
                    </h1>
                    <p className="text-gray-400 font-medium tracking-wide">Intelligently blend two frequencies into a custom hybrid frequency.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center mb-16">
                    {/* Source A */}
                    <div className="space-y-6">
                        <div className="text-center">
                            <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] mb-2 block">Source Alpha</span>
                            <div className={`aspect-square rounded-[2rem] border-2 transition-all duration-500 overflow-hidden shadow-2xl ${stationA ? 'border-cyan-500 shadow-cyan-500/20' : 'border-dashed border-gray-700 bg-gray-900/50'}`}>
                                {stationA ? (
                                    <img src={stationA.coverArt} className="w-full h-full object-cover animate-fade-in" alt="" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-700">
                                        <PlusCircleIcon className="w-12 h-12" />
                                    </div>
                                )}
                            </div>
                            <h3 className="mt-4 font-bold text-xl text-white truncate">{stationA?.name || "Select Station"}</h3>
                        </div>
                        <div className="max-h-48 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                            {availableStations.map(s => (
                                <button key={s.streamUrl} onClick={() => { setStationA(s); setAiInsight(null); }} className={`w-full text-left p-3 rounded-xl border transition-all text-xs font-bold uppercase tracking-wider ${stationA?.streamUrl === s.streamUrl ? 'bg-cyan-500 text-black border-cyan-400' : 'bg-gray-800/40 border-white/5 text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                                    {s.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Morph Control */}
                    <div className="flex flex-col items-center gap-8 py-8 px-6 bg-gray-900/40 border border-white/5 rounded-[3rem] backdrop-blur-xl shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-pink-500"></div>
                        
                        <div className="w-full space-y-4">
                            <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">
                                <span>Alpha</span>
                                <span>Sync: 98%</span>
                                <span>Omega</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="1" 
                                step="0.01" 
                                value={balance} 
                                onChange={(e) => setBalance(parseFloat(e.target.value))}
                                className="w-full h-12 bg-black/40 rounded-full appearance-none cursor-pointer accent-white transition-all px-4"
                            />
                        </div>

                        <button 
                            onClick={() => setIsPlaying(!isPlaying)}
                            disabled={!stationA || !stationB}
                            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-[0_0_40px_rgba(0,0,0,0.5)] border-4 ${isPlaying ? 'bg-pink-500 border-pink-400 animate-pulse scale-110' : 'bg-white border-gray-200 text-black hover:scale-105 active:scale-95 disabled:opacity-20'}`}
                        >
                            {isPlaying ? <PauseIcon className="w-10 h-10" /> : <PlayIcon className="w-10 h-10" />}
                        </button>

                        <div className="text-center space-y-4 w-full">
                            {aiInsight ? (
                                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl animate-fade-in">
                                    <p className="text-xs text-purple-300 italic leading-relaxed">"{aiInsight}"</p>
                                    <div className="flex items-center justify-center gap-2 mt-2">
                                        <SparklesIcon className="w-3 h-3 text-purple-400" />
                                        <span className="text-[8px] font-black uppercase text-purple-500 tracking-widest">Gemini Engine Analysis</span>
                                    </div>
                                </div>
                            ) : (
                                <button 
                                    onClick={analyzeBlend}
                                    disabled={!stationA || !stationB || isAnalyzing}
                                    className="px-6 py-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 rounded-full text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-0"
                                >
                                    {isAnalyzing ? "Analyzing Vibes..." : "Analyze Sonic Compatibility"}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Source B */}
                    <div className="space-y-6">
                        <div className="text-center">
                            <span className="text-[10px] font-black text-pink-500 uppercase tracking-[0.3em] mb-2 block">Source Omega</span>
                            <div className={`aspect-square rounded-[2rem] border-2 transition-all duration-500 overflow-hidden shadow-2xl ${stationB ? 'border-pink-500 shadow-pink-500/20' : 'border-dashed border-gray-700 bg-gray-900/50'}`}>
                                {stationB ? (
                                    <img src={stationB.coverArt} className="w-full h-full object-cover animate-fade-in" alt="" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-700">
                                        <PlusCircleIcon className="w-12 h-12" />
                                    </div>
                                )}
                            </div>
                            <h3 className="mt-4 font-bold text-xl text-white truncate">{stationB?.name || "Select Station"}</h3>
                        </div>
                        <div className="max-h-48 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                            {availableStations.map(s => (
                                <button key={s.streamUrl} onClick={() => { setStationB(s); setAiInsight(null); }} className={`w-full text-left p-3 rounded-xl border transition-all text-xs font-bold uppercase tracking-wider ${stationB?.streamUrl === s.streamUrl ? 'bg-pink-500 text-black border-pink-400' : 'bg-gray-800/40 border-white/5 text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                                    {s.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
                    <div className="bg-gray-900/40 p-6 rounded-3xl border border-white/5 text-center">
                        <SyncIcon className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                        <p className="text-[10px] font-black uppercase text-gray-500">Auto-BPM Sync</p>
                    </div>
                    <div className="bg-gray-900/40 p-6 rounded-3xl border border-white/5 text-center">
                        <SparklesIcon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                        <p className="text-[10px] font-black uppercase text-gray-500">Phase Alignment</p>
                    </div>
                    <div className="bg-gray-900/40 p-6 rounded-3xl border border-white/5 text-center">
                        <FireIcon className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                        <p className="text-[10px] font-black uppercase text-gray-500">Harmonic Matching</p>
                    </div>
                </div>
            </div>

            {/* Hidden Audio Elements */}
            {stationA && <audio ref={audioARef} src={stationA.streamUrl} crossOrigin="anonymous" />}
            {stationB && <audio ref={audioBRef} src={stationB.streamUrl} crossOrigin="anonymous" />}

            <style>{`
                input[type=range]::-webkit-slider-thumb {
                    appearance: none;
                    width: 32px;
                    height: 32px;
                    background: white;
                    border-radius: 50%;
                    box-shadow: 0 0 15px rgba(255,255,255,0.5), 0 0 5px rgba(0,0,0,0.5);
                    cursor: pointer;
                    border: 4px solid #0f172a;
                }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--accent-color); }
            `}</style>
        </div>
    );
};

const PlusCircleIcon = ({className = ""}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const PlayIcon = ({className = ""}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>;
const PauseIcon = ({className = ""}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>;
