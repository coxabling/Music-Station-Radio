import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { Station, User } from '../types';
import { StarIcon, SparklesIcon, FireIcon, MusicNoteIcon } from '../constants';
import { GoogleGenAI, Type } from '@google/genai';

interface MorphViewProps {
  allStations: Station[];
  favoriteStationUrls: Set<string>;
  onBack: () => void;
  currentUser: User | null;
}

interface BlendAnalysis {
    hybridName: string;
    description: string;
    compatibility: number;
    spectralShift: string;
}

const SyncIcon = ({className = ""}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 10.5M20 20l-1.5-1.5A9 9 0 003.5 13.5" /></svg>;
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>;
const PulseIcon = ({className = ""}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;

export const MorphView: React.FC<MorphViewProps> = ({ allStations, favoriteStationUrls, onBack, currentUser }) => {
    const [stationA, setStationA] = useState<Station | null>(null);
    const [stationB, setStationB] = useState<Station | null>(null);
    const [balance, setBalance] = useState(0.5);
    const [isPlaying, setIsPlaying] = useState(false);
    const [analysis, setAnalysis] = useState<BlendAnalysis | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isSynced, setIsSynced] = useState(false);

    const audioARef = useRef<HTMLAudioElement>(null);
    const audioBRef = useRef<HTMLAudioElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const availableStations = useMemo(() => {
        return allStations.slice(0, 20); 
    }, [allStations]);

    // Handle "Frequency Filtering" Simulation through Volume/Fade
    useEffect(() => {
        if (audioARef.current) {
            // Power curve for smoother blending
            audioARef.current.volume = isPlaying ? Math.cos(balance * Math.PI / 2) * 0.8 : 0;
        }
        if (audioBRef.current) {
            audioBRef.current.volume = isPlaying ? Math.sin(balance * Math.PI / 2) * 0.8 : 0;
        }
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

    // Matrix Visualizer Logic
    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrame: number;
        let offset = 0;

        const draw = () => {
            offset += 0.05;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const midY = canvas.height / 2;
            const width = canvas.width;
            
            // Draw Wave Alpha (Cyan)
            ctx.beginPath();
            ctx.strokeStyle = `rgba(6, 182, 212, ${1 - balance})`;
            ctx.lineWidth = 3;
            for (let x = 0; x < width; x++) {
                const y = midY + Math.sin(x * 0.05 + offset) * (20 * (1 - balance));
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Draw Wave Omega (Pink)
            ctx.beginPath();
            ctx.strokeStyle = `rgba(236, 72, 153, ${balance})`;
            ctx.lineWidth = 3;
            for (let x = 0; x < width; x++) {
                const y = midY + Math.cos(x * 0.04 + offset * 0.8) * (20 * balance);
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Interference Logic (When playing)
            if (isPlaying) {
                ctx.beginPath();
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 1;
                ctx.globalAlpha = 0.2;
                for (let x = 0; x < width; x += 10) {
                    const yA = Math.sin(x * 0.05 + offset) * (20 * (1 - balance));
                    const yB = Math.cos(x * 0.04 + offset * 0.8) * (20 * balance);
                    ctx.moveTo(x, midY + yA);
                    ctx.lineTo(x, midY + yB);
                }
                ctx.stroke();
                ctx.globalAlpha = 1.0;
            }

            animationFrame = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animationFrame);
    }, [balance, isPlaying]);

    const runNeuralAnalysis = async () => {
        if (!stationA || !stationB) return;
        setIsAnalyzing(true);
        setIsSynced(false);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `Analyze the sonic fusion of these two radio stations:
                Source A: ${stationA.name} (${stationA.genre})
                Source B: ${stationB.name} (${stationB.genre})
                
                Return a JSON object with:
                "hybridName": A cool, futuristic genre name for this blend.
                "description": A 2-sentence technical musical analysis of the 'frequency overlap'.
                "compatibility": A number between 70 and 99.
                "spectralShift": A short phrase describing the mood (e.g., 'Deep Resonance', 'High-Energy Turbulence').`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            hybridName: { type: Type.STRING },
                            description: { type: Type.STRING },
                            compatibility: { type: Type.NUMBER },
                            spectralShift: { type: Type.STRING }
                        }
                    }
                }
            });
            const data = JSON.parse(response.text || '{}');
            setAnalysis(data);
            setIsSynced(true);
        } catch (error) {
            console.error(error);
            setAnalysis({
                hybridName: "Quantum Resonance",
                description: "Deep-level spectral alignment detected. Sub-bass frequencies are harmonically linked.",
                compatibility: 94,
                spectralShift: "Optimal Harmony"
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="p-4 lg:p-12 animate-fade-in relative min-h-screen bg-[#020617] selection:bg-cyan-500 selection:text-black">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(30,58,138,0.15),_transparent)] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex justify-between items-center mb-12">
                    <button onClick={onBack} className="flex items-center gap-3 text-xs font-black text-gray-500 hover:text-cyan-400 transition-all uppercase tracking-[0.3em] group">
                        <div className="p-2 bg-white/5 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                            <BackIcon />
                        </div>
                        Back to Network
                    </button>
                    <div className="flex items-center gap-3">
                         <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Neural Link:</span>
                         <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${isSynced ? 'bg-green-500/20 text-green-400 border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                            {isSynced ? 'Synced' : 'Floating'}
                         </span>
                    </div>
                </div>

                <header className="text-center mb-16">
                    <h1 className="text-6xl lg:text-8xl font-black font-orbitron tracking-tighter text-white uppercase leading-none mb-4 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                        SONIC <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">MORPH</span>
                    </h1>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.4em] text-sm">Advanced Neural Cross-Frequency Modulation</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px_1fr] gap-12 items-center mb-20">
                    
                    {/* Source Alpha Panel */}
                    <div className="space-y-6">
                        <div className="relative p-6 bg-gray-950/40 border border-white/5 rounded-[2.5rem] backdrop-blur-xl group hover:border-cyan-500/30 transition-all">
                            <div className="absolute top-4 right-6 flex gap-1">
                                {[...Array(3)].map((_, i) => <div key={i} className={`w-1 h-1 rounded-full ${isPlaying ? 'bg-cyan-500 animate-pulse' : 'bg-gray-700'}`} style={{animationDelay: `${i * 200}ms`}}></div>)}
                            </div>
                            <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] mb-4 block">Carrier Alpha</span>
                            <div className={`aspect-square rounded-2xl border-2 transition-all duration-700 overflow-hidden shadow-2xl ${stationA ? 'border-cyan-500 shadow-cyan-500/20' : 'border-dashed border-gray-800 bg-black/40'}`}>
                                {stationA ? (
                                    <img src={stationA.coverArt} className="w-full h-full object-cover animate-fade-in" alt="" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-800">
                                        <MusicNoteIcon className="w-16 h-16 opacity-20" />
                                    </div>
                                )}
                            </div>
                            <h3 className="mt-6 font-black text-2xl text-white truncate font-orbitron">{stationA?.name || "Ready..." }</h3>
                            <p className="text-xs text-gray-500 font-bold uppercase mt-1 tracking-wider">{stationA?.genre || "Select Source A"}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto custom-pro-scrollbar pr-2">
                            {availableStations.map(s => (
                                <button key={s.streamUrl} onClick={() => { setStationA(s); setAnalysis(null); setIsSynced(false); }} className={`text-left p-3 rounded-xl border transition-all text-[10px] font-black uppercase tracking-tighter ${stationA?.streamUrl === s.streamUrl ? 'bg-cyan-500 text-black border-cyan-400 shadow-lg' : 'bg-gray-900/40 border-white/5 text-gray-500 hover:bg-gray-800 hover:text-white'}`}>
                                    {s.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Neural Control Core */}
                    <div className="flex flex-col items-center gap-10 py-12 px-8 bg-black/60 border border-white/10 rounded-[4rem] shadow-2xl relative overflow-hidden ring-1 ring-white/5">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(103,232,249,0.1),_transparent)]"></div>
                        
                        <div className="w-full relative h-32 flex items-center justify-center">
                            <canvas ref={canvasRef} width={300} height={100} className="w-full h-full" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black pointer-events-none"></div>
                        </div>

                        <div className="w-full space-y-6">
                            <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] px-2">
                                <span>100% Alpha</span>
                                <span className="text-white font-mono">{Math.round((1 - balance) * 100)}:{Math.round(balance * 100)}</span>
                                <span>100% Omega</span>
                            </div>
                            <div className="relative h-12 flex items-center group">
                                <div className="absolute inset-x-0 h-1.5 bg-gray-900 rounded-full overflow-hidden border border-white/5">
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-white to-pink-500 opacity-20"></div>
                                </div>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="1" 
                                    step="0.001" 
                                    value={balance} 
                                    onChange={(e) => setBalance(parseFloat(e.target.value))}
                                    className="morph-slider w-full bg-transparent appearance-none cursor-pointer relative z-10"
                                />
                            </div>
                        </div>

                        <button 
                            onClick={() => setIsPlaying(!isPlaying)}
                            disabled={!stationA || !stationB}
                            className={`w-28 h-28 rounded-full flex items-center justify-center transition-all shadow-[0_0_60px_rgba(0,0,0,0.8)] border-4 group/play ${isPlaying ? 'bg-pink-500 border-pink-400 animate-pulse scale-105' : 'bg-white border-gray-200 text-black hover:scale-110 disabled:opacity-20 active:scale-95'}`}
                        >
                            {isPlaying ? <PauseIcon className="w-12 h-12" /> : <PlayIcon className="w-12 h-12" />}
                        </button>

                        <div className="text-center w-full min-h-[140px] flex flex-col justify-center">
                            {analysis ? (
                                <div className="space-y-4 animate-fade-in-up">
                                    <div className="px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-pink-500/10 border border-white/10 rounded-2xl">
                                        <p className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-1">Hybrid Identity</p>
                                        <h4 className="text-xl font-black text-white font-orbitron tracking-tight uppercase leading-none">{analysis.hybridName}</h4>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase leading-relaxed px-4">"{analysis.description}"</p>
                                    <div className="flex items-center justify-center gap-4">
                                        <div className="flex items-center gap-1.5">
                                            <SparklesIcon className="w-3 h-3 text-purple-400" />
                                            <span className="text-[8px] font-black uppercase text-purple-500 tracking-[0.2em]">{analysis.spectralShift}</span>
                                        </div>
                                        <div className="w-px h-3 bg-gray-800"></div>
                                        <span className="text-[8px] font-black uppercase text-green-500 tracking-[0.2em]">Match: {analysis.compatibility}%</span>
                                    </div>
                                </div>
                            ) : (
                                <button 
                                    onClick={runNeuralAnalysis}
                                    disabled={!stationA || !stationB || isAnalyzing}
                                    className="relative group/btn px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all disabled:opacity-0 active:scale-95 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-pink-500/20 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                                    <span className="relative flex items-center gap-2">
                                        {isAnalyzing ? "Processing modulation..." : "Initialize Link"}
                                        <SyncIcon className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Source Omega Panel */}
                    <div className="space-y-6">
                        <div className="relative p-6 bg-gray-950/40 border border-white/5 rounded-[2.5rem] backdrop-blur-xl group hover:border-pink-500/30 transition-all">
                             <div className="absolute top-4 left-6 flex gap-1">
                                {[...Array(3)].map((_, i) => <div key={i} className={`w-1 h-1 rounded-full ${isPlaying ? 'bg-pink-500 animate-pulse' : 'bg-gray-700'}`} style={{animationDelay: `${i * 200}ms`}}></div>)}
                            </div>
                            <span className="text-[10px] font-black text-pink-500 uppercase tracking-[0.3em] mb-4 block text-right">Carrier Omega</span>
                            <div className={`aspect-square rounded-2xl border-2 transition-all duration-700 overflow-hidden shadow-2xl ${stationB ? 'border-pink-500 shadow-pink-500/20' : 'border-dashed border-gray-800 bg-black/40'}`}>
                                {stationB ? (
                                    <img src={stationB.coverArt} className="w-full h-full object-cover animate-fade-in" alt="" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-800">
                                        <MusicNoteIcon className="w-16 h-16 opacity-20" />
                                    </div>
                                )}
                            </div>
                            <h3 className="mt-6 font-black text-2xl text-white truncate font-orbitron text-right">{stationB?.name || "Ready..." }</h3>
                            <p className="text-xs text-gray-500 font-bold uppercase mt-1 tracking-wider text-right">{stationB?.genre || "Select Source B"}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto custom-pro-scrollbar pr-2">
                            {availableStations.map(s => (
                                <button key={s.streamUrl} onClick={() => { setStationB(s); setAnalysis(null); setIsSynced(false); }} className={`text-right p-3 rounded-xl border transition-all text-[10px] font-black uppercase tracking-tighter ${stationB?.streamUrl === s.streamUrl ? 'bg-pink-500 text-black border-pink-400 shadow-lg' : 'bg-gray-900/40 border-white/5 text-gray-500 hover:bg-gray-800 hover:text-white'}`}>
                                    {s.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Console System Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="bg-gray-900/40 p-6 rounded-[2rem] border border-white/5 flex flex-col items-center gap-3 group hover:border-cyan-500/20 transition-all">
                        <SyncIcon className={`w-6 h-6 ${isPlaying ? 'text-cyan-400 animate-spin-slow' : 'text-gray-700'}`} />
                        <div className="text-center">
                            <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Spectral Sync</p>
                            <p className={`text-xs font-mono font-bold mt-1 ${isPlaying ? 'text-cyan-400' : 'text-gray-700'}`}>{isPlaying ? 'Locked' : 'Standby'}</p>
                        </div>
                    </div>
                    <div className="bg-gray-900/40 p-6 rounded-[2rem] border border-white/5 flex flex-col items-center gap-3 group hover:border-purple-500/20 transition-all">
                        <PulseIcon className={`w-6 h-6 ${isPlaying ? 'text-purple-400 animate-pulse' : 'text-gray-700'}`} />
                        <div className="text-center">
                            <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Phase Offset</p>
                            <p className={`text-xs font-mono font-bold mt-1 ${isPlaying ? 'text-purple-400' : 'text-gray-700'}`}>0.042ms</p>
                        </div>
                    </div>
                    <div className="bg-gray-900/40 p-6 rounded-[2rem] border border-white/5 flex flex-col items-center gap-3 group hover:border-pink-500/20 transition-all">
                        <div className="flex gap-1 h-6 items-end">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className={`w-1 rounded-full transition-all duration-300 ${isPlaying ? 'bg-pink-500' : 'bg-gray-700'}`} style={{height: isPlaying ? `${30 + Math.random() * 70}%` : '10%'}}></div>
                            ))}
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Harmonic Int.</p>
                            <p className={`text-xs font-mono font-bold mt-1 ${isPlaying ? 'text-pink-400' : 'text-gray-700'}`}>{Math.round(80 + Math.random() * 15)}%</p>
                        </div>
                    </div>
                    <div className="bg-gray-900/40 p-6 rounded-[2rem] border border-white/5 flex flex-col items-center gap-3 group hover:border-green-500/20 transition-all">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isPlaying ? 'border-green-400' : 'border-gray-700'}`}>
                             <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400' : 'bg-gray-700'}`}></div>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Master Clock</p>
                            <p className={`text-xs font-mono font-bold mt-1 ${isPlaying ? 'text-green-400' : 'text-gray-700'}`}>INTERNAL</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hidden Audio Elements */}
            {stationA && <audio ref={audioARef} src={stationA.streamUrl} crossOrigin="anonymous" />}
            {stationB && <audio ref={audioBRef} src={stationB.streamUrl} crossOrigin="anonymous" />}

            <style>{`
                .morph-slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 48px;
                    height: 48px;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 0 20px rgba(255,255,255,0.4), inset 0 0 10px rgba(0,0,0,0.1);
                    cursor: pointer;
                    border: 4px solid #0f172a;
                    transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .morph-slider:active::-webkit-slider-thumb {
                    transform: scale(0.9) rotate(45deg);
                }
                .custom-pro-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-pro-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-pro-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
                .custom-pro-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

const PlusCircleIcon = ({className = ""}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const PlayIcon = ({className = ""}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>;
const PauseIcon = ({className = ""}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>;
