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
    frequencyDna: string;
}

type AutomixMode = 'oscillate' | 'drift' | 'pulse';

const SyncIcon = ({className = ""}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 10.5M20 20l-1.5-1.5A9 9 0 003.5 13.5" /></svg>;
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>;
const PulseIcon = ({className = ""}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const AutoIcon = ({className = ""}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>;
const DnaIcon = ({className = ""}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>;

export const MorphView: React.FC<MorphViewProps> = ({ allStations, favoriteStationUrls, onBack, currentUser }) => {
    const [stationA, setStationA] = useState<Station | null>(null);
    const [stationB, setStationB] = useState<Station | null>(null);
    const [balance, setBalance] = useState(0.5);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isAutomixing, setIsAutomixing] = useState(false);
    const [automixMode, setAutomixMode] = useState<AutomixMode>('oscillate');
    const [analysis, setAnalysis] = useState<BlendAnalysis | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isSynced, setIsSynced] = useState(false);
    const [loadState, setLoadState] = useState<{a: string, b: string}>({ a: 'idle', b: 'idle' });

    // Audio Refs for Web Audio API
    const audioARef = useRef<HTMLAudioElement>(null);
    const audioBRef = useRef<HTMLAudioElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    // Web Audio API Context and Nodes
    const audioCtxRef = useRef<AudioContext | null>(null);
    const sourceANodeRef = useRef<MediaElementAudioSourceNode | null>(null);
    const sourceBNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
    const gainANodeRef = useRef<GainNode | null>(null);
    const gainBNodeRef = useRef<GainNode | null>(null);
    const filterANodeRef = useRef<BiquadFilterNode | null>(null);
    const filterBNodeRef = useRef<BiquadFilterNode | null>(null);
    const analyzerARef = useRef<AnalyserNode | null>(null);
    const analyzerBRef = useRef<AnalyserNode | null>(null);
    
    const automixRafRef = useRef<number>(0);
    const automixStartTimeRef = useRef<number>(0);
    const driftTargetRef = useRef<number>(0.5);

    const availableStations = useMemo(() => allStations.slice(0, 30), [allStations]);

    // Initialize Web Audio Graph - Fixed to handle interaction better
    const ensureAudioGraph = () => {
        if (audioCtxRef.current) return;
        if (!audioARef.current || !audioBRef.current) return;

        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioCtxRef.current = ctx;

        // Create Analyzers for visual data
        const anaA = ctx.createAnalyser(); anaA.fftSize = 64;
        const anaB = ctx.createAnalyser(); anaB.fftSize = 64;
        analyzerARef.current = anaA;
        analyzerBRef.current = anaB;

        // Sources
        sourceANodeRef.current = ctx.createMediaElementSource(audioARef.current);
        sourceBNodeRef.current = ctx.createMediaElementSource(audioBRef.current);

        // Filters
        const filterA = ctx.createBiquadFilter(); filterA.type = 'lowpass'; filterA.frequency.value = 20000;
        const filterB = ctx.createBiquadFilter(); filterB.type = 'highpass'; filterB.frequency.value = 20;
        filterANodeRef.current = filterA;
        filterBNodeRef.current = filterB;

        // Gains
        const gainA = ctx.createGain(); const gainB = ctx.createGain();
        gainANodeRef.current = gainA; gainBNodeRef.current = gainB;

        // Graph
        sourceANodeRef.current.connect(anaA).connect(filterA).connect(gainA).connect(ctx.destination);
        sourceBNodeRef.current.connect(anaB).connect(filterB).connect(gainB).connect(ctx.destination);
    };

    // Fix: Handle station changes by explicitly updating src and calling .load()
    useEffect(() => {
        if (audioARef.current && stationA) {
            audioARef.current.src = stationA.streamUrl;
            audioARef.current.load();
            setLoadState(prev => ({ ...prev, a: 'loading' }));
            if (isPlaying) audioARef.current.play().catch(() => {});
        }
    }, [stationA]);

    useEffect(() => {
        if (audioBRef.current && stationB) {
            audioBRef.current.src = stationB.streamUrl;
            audioBRef.current.load();
            setLoadState(prev => ({ ...prev, b: 'loading' }));
            if (isPlaying) audioBRef.current.play().catch(() => {});
        }
    }, [stationB]);

    // Update Gains and Filters based on Balance
    useEffect(() => {
        if (!gainANodeRef.current || !gainBNodeRef.current || !filterANodeRef.current || !filterBNodeRef.current) return;
        const now = audioCtxRef.current?.currentTime || 0;
        
        // Equal-power crossfade curve
        const volA = Math.cos(balance * 0.5 * Math.PI);
        const volB = Math.sin(balance * 0.5 * Math.PI);
        
        gainANodeRef.current.gain.setTargetAtTime(volA, now, 0.1);
        gainBNodeRef.current.gain.setTargetAtTime(volB, now, 0.1);

        const freqA = 20000 * Math.pow(1 - balance, 2) + 100; 
        const freqB = 20 + (Math.pow(balance, 2) * 8000);

        filterANodeRef.current.frequency.setTargetAtTime(freqA, now, 0.2);
        filterBNodeRef.current.frequency.setTargetAtTime(freqB, now, 0.2);
    }, [balance]);

    const togglePlay = async () => {
        ensureAudioGraph();
        if (audioCtxRef.current?.state === 'suspended') await audioCtxRef.current.resume();

        if (isPlaying) {
            audioARef.current?.pause();
            audioBRef.current?.pause();
            setIsPlaying(false);
        } else {
            setIsPlaying(true);
            audioARef.current?.play().catch(e => console.error("Playback Alpha failed", e));
            audioBRef.current?.play().catch(e => console.error("Playback Omega failed", e));
        }
    };

    // Automix Logic
    useEffect(() => {
        if (!isAutomixing || !isPlaying) {
            if (automixRafRef.current) cancelAnimationFrame(automixRafRef.current);
            return;
        }

        automixStartTimeRef.current = performance.now();
        const updateAutomix = (time: number) => {
            const elapsed = (time - automixStartTimeRef.current) / 1000;
            let newBalance = balance;
            switch(automixMode) {
                case 'oscillate': newBalance = (Math.sin(elapsed * (Math.PI * 2) / 12) + 1) / 2; break;
                case 'drift':
                    if (Math.abs(balance - driftTargetRef.current) < 0.01) driftTargetRef.current = Math.random();
                    newBalance = balance + (driftTargetRef.current - balance) * 0.005;
                    break;
                case 'pulse': newBalance = (Math.sin(elapsed * 6) > 0) ? 0.75 : 0.25; break;
            }
            setBalance(newBalance);
            automixRafRef.current = requestAnimationFrame(updateAutomix);
        };
        automixRafRef.current = requestAnimationFrame(updateAutomix);
        return () => cancelAnimationFrame(automixRafRef.current);
    }, [isAutomixing, isPlaying, automixMode, balance]);

    // Canvas Visualizer with Real-Time Frequency Intercepts
    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrame: number;
        let offset = 0;
        const dataA = new Uint8Array(32);
        const dataB = new Uint8Array(32);

        const draw = () => {
            offset += 0.04;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (analyzerARef.current) analyzerARef.current.getByteFrequencyData(dataA);
            if (analyzerBRef.current) analyzerBRef.current.getByteFrequencyData(dataB);

            const midY = canvas.height / 2;
            const width = canvas.width;
            
            // Amp factor based on frequency data
            const ampA = isPlaying ? (dataA[5] / 255) * 50 : 0;
            const ampB = isPlaying ? (dataB[5] / 255) * 50 : 0;

            // Wave Alpha (Cyan)
            ctx.beginPath();
            ctx.strokeStyle = `rgba(6, 182, 212, ${Math.max(0.2, 1 - balance)})`;
            ctx.lineWidth = 4;
            ctx.shadowBlur = isPlaying ? 10 : 0;
            ctx.shadowColor = '#06b6d4';
            for (let x = 0; x < width; x++) {
                const y = midY + Math.sin(x * 0.04 + offset) * (10 + ampA) * (1 - balance);
                if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Wave Omega (Pink)
            ctx.beginPath();
            ctx.strokeStyle = `rgba(236, 72, 153, ${Math.max(0.2, balance)})`;
            ctx.lineWidth = 4;
            ctx.shadowColor = '#ec4899';
            for (let x = 0; x < width; x++) {
                const y = midY + Math.cos(x * 0.03 + offset * 0.8) * (10 + ampB) * balance;
                if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();

            if (isPlaying) {
                ctx.beginPath();
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 1;
                ctx.globalAlpha = 0.1;
                for (let x = 0; x < width; x += 20) {
                    const yA = Math.sin(x * 0.04 + offset) * (10 + ampA) * (1 - balance);
                    const yB = Math.cos(x * 0.03 + offset * 0.8) * (10 + ampB) * balance;
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
                contents: `Analyze the sonic fusion: ${stationA.name} x ${stationB.name}. JSON: hybridName, description (2 sentences tech-vibe analysis), compatibility (70-99), spectralShift (mood phrase), frequencyDna (16 hex chars).`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            hybridName: { type: Type.STRING },
                            description: { type: Type.STRING },
                            compatibility: { type: Type.NUMBER },
                            spectralShift: { type: Type.STRING },
                            frequencyDna: { type: Type.STRING }
                        }
                    }
                }
            });
            setAnalysis(JSON.parse(response.text || '{}'));
            setIsSynced(true);
        } catch (error) {
            setAnalysis({
                hybridName: "Quantum Flux",
                description: "Inter-dimensional frequency layering detected. Transient responses are optimized for high-bandwidth neural link.",
                compatibility: 91,
                spectralShift: "Resonant Harmony",
                frequencyDna: "F0A2B991C22E0D42"
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="p-4 lg:p-12 animate-fade-in relative min-h-screen bg-[#020617] selection:bg-cyan-500 selection:text-black">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(30,58,138,0.1),_transparent)] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex justify-between items-center mb-12">
                    <button onClick={onBack} className="flex items-center gap-3 text-xs font-black text-gray-500 hover:text-cyan-400 transition-all uppercase tracking-[0.3em] group">
                        <div className="p-2 bg-white/5 rounded-lg group-hover:bg-cyan-500/20 transition-colors"><BackIcon /></div>
                        Back to Network
                    </button>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-3 bg-gray-950/50 border border-white/5 px-4 py-2 rounded-2xl">
                             <DnaIcon className="w-4 h-4 text-purple-500" />
                             <span className="text-[10px] font-mono text-gray-500 tracking-wider">SIG: {analysis?.frequencyDna || 'NONE-LINKED-0000'}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${isSynced ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-800 text-gray-600'}`}>
                            {isSynced ? 'Synced' : 'Floating'}
                        </span>
                    </div>
                </div>

                <header className="text-center mb-16">
                    <h1 className="text-6xl lg:text-8xl font-black font-orbitron tracking-tighter text-white uppercase leading-none mb-4">
                        SONIC <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">MORPH</span>
                    </h1>
                    <p className="text-gray-600 font-bold uppercase tracking-[0.4em] text-sm">Neural-Link Multi-Source Modulation</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px_1fr] gap-8 items-start mb-20">
                    
                    {/* Carrier A */}
                    <div className="space-y-4">
                        <div className={`p-6 bg-gray-950/60 border rounded-[3rem] backdrop-blur-xl transition-all duration-700 ${stationA ? 'border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.1)]' : 'border-white/5'}`}>
                            <span className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.3em] mb-4 block">Carrier Alpha</span>
                            <div className={`aspect-square rounded-3xl border-2 transition-all duration-700 overflow-hidden ${stationA ? 'border-cyan-500 shadow-2xl' : 'border-dashed border-gray-800'}`}>
                                {stationA ? (
                                    <img src={stationA.coverArt} className="w-full h-full object-cover" alt="" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-800"><MusicNoteIcon className="w-12 h-12 opacity-10" /></div>
                                )}
                            </div>
                            <h3 className="mt-6 font-black text-xl text-white truncate font-orbitron">{stationA?.name || "Select Alpha" }</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase mt-1 tracking-widest">{stationA?.genre || "Standby"}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 h-48 overflow-y-auto custom-pro-scrollbar pr-1">
                            {availableStations.map(s => (
                                <button key={s.streamUrl} onClick={() => { setStationA(s); setAnalysis(null); setIsSynced(false); }} className={`text-left p-3 rounded-xl border transition-all text-[10px] font-black uppercase ${stationA?.streamUrl === s.streamUrl ? 'bg-cyan-500 text-black border-cyan-400' : 'bg-gray-900/40 border-white/5 text-gray-500 hover:text-white'}`}>
                                    {s.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Core Modulation Engine */}
                    <div className="flex flex-col items-center gap-8 py-10 px-8 bg-black/40 border border-white/10 rounded-[5rem] shadow-2xl relative overflow-hidden">
                        <canvas ref={canvasRef} width={400} height={140} className="w-full h-36" />
                        
                        <div className="w-full space-y-4">
                            <div className="flex justify-between text-[9px] font-black text-gray-600 uppercase tracking-widest">
                                <span className={balance < 0.2 ? 'text-cyan-400' : ''}>Full Alpha</span>
                                <span className="text-white font-mono">{Math.round((1 - balance) * 100)}:{Math.round(balance * 100)}</span>
                                <span className={balance > 0.8 ? 'text-pink-400' : ''}>Full Omega</span>
                            </div>
                            <input 
                                type="range" min="0" max="1" step="0.001" value={balance} 
                                disabled={isAutomixing}
                                onChange={(e) => setBalance(parseFloat(e.target.value))}
                                className={`morph-slider w-full bg-transparent appearance-none cursor-pointer ${isAutomixing ? 'opacity-30' : ''}`}
                            />
                        </div>

                        <div className="flex items-center gap-5">
                            <button 
                                onClick={togglePlay}
                                disabled={!stationA || !stationB}
                                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all border-4 ${isPlaying ? 'bg-white border-cyan-400 text-black shadow-[0_0_30px_rgba(6,182,212,0.5)]' : 'bg-gray-800 border-white/10 text-white hover:scale-105 disabled:opacity-20'}`}
                            >
                                {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />}
                            </button>

                            <div className="flex flex-col gap-2">
                                <button 
                                    onClick={() => setIsAutomixing(!isAutomixing)}
                                    disabled={!isPlaying}
                                    className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border-2 ${isAutomixing ? 'bg-cyan-500 border-cyan-400 text-black' : 'bg-gray-900 border-white/10 text-gray-500 hover:text-white'}`}
                                >
                                    <AutoIcon className="w-5 h-5" />
                                    <span className="text-[7px] font-black uppercase">Auto</span>
                                </button>
                                {isAutomixing && (
                                    <div className="flex bg-gray-950 rounded-lg p-1 border border-white/5 gap-1">
                                        {(['oscillate', 'drift', 'pulse'] as AutomixMode[]).map(m => (
                                            <button key={m} onClick={() => setAutomixMode(m)} className={`w-3.5 h-3.5 rounded-full ${automixMode === m ? 'bg-cyan-400' : 'bg-gray-700'}`} title={m} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="text-center w-full min-h-[120px]">
                            {analysis ? (
                                <div className="animate-fade-in-up">
                                    <h4 className="text-lg font-black text-white font-orbitron uppercase mb-1">{analysis.hybridName}</h4>
                                    <p className="text-[9px] text-gray-500 font-bold uppercase leading-relaxed px-2 mb-3">{analysis.description}</p>
                                    <div className="flex items-center justify-center gap-3">
                                        <SparklesIcon className="w-3 h-3 text-purple-400" />
                                        <span className="text-[8px] font-black uppercase text-purple-500 tracking-widest">{analysis.spectralShift}</span>
                                        <div className="w-px h-3 bg-gray-800"></div>
                                        <span className="text-[8px] font-black uppercase text-green-500">Compatibility: {analysis.compatibility}%</span>
                                    </div>
                                </div>
                            ) : (
                                <button 
                                    onClick={runNeuralAnalysis}
                                    disabled={!stationA || !stationB || isAnalyzing}
                                    className="px-8 py-4 bg-gray-950 hover:bg-gray-900 text-white border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] transition-all disabled:opacity-0"
                                >
                                    {isAnalyzing ? "Computing Phase Link..." : "Initialize Hybrid Sync"}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Carrier B */}
                    <div className="space-y-4">
                        <div className={`p-6 bg-gray-950/60 border rounded-[3rem] backdrop-blur-xl transition-all duration-700 ${stationB ? 'border-pink-500/40 shadow-[0_0_40px_rgba(236,72,153,0.1)]' : 'border-white/5'}`}>
                            <span className="text-[9px] font-black text-pink-500 uppercase tracking-[0.3em] mb-4 block text-right">Carrier Omega</span>
                            <div className={`aspect-square rounded-3xl border-2 transition-all duration-700 overflow-hidden ${stationB ? 'border-pink-500 shadow-2xl' : 'border-dashed border-gray-800'}`}>
                                {stationB ? (
                                    <img src={stationB.coverArt} className="w-full h-full object-cover" alt="" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-800"><MusicNoteIcon className="w-12 h-12 opacity-10" /></div>
                                )}
                            </div>
                            <h3 className="mt-6 font-black text-xl text-white truncate font-orbitron text-right">{stationB?.name || "Select Omega" }</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase mt-1 tracking-widest text-right">{stationB?.genre || "Standby"}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 h-48 overflow-y-auto custom-pro-scrollbar pr-1">
                            {availableStations.map(s => (
                                <button key={s.streamUrl} onClick={() => { setStationB(s); setAnalysis(null); setIsSynced(false); }} className={`text-right p-3 rounded-xl border transition-all text-[10px] font-black uppercase ${stationB?.streamUrl === s.streamUrl ? 'bg-pink-500 text-black border-pink-400' : 'bg-gray-900/40 border-white/5 text-gray-500 hover:text-white'}`}>
                                    {s.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Radio Assets */}
            <audio ref={audioARef} crossOrigin="anonymous" preload="none" />
            <audio ref={audioBRef} crossOrigin="anonymous" preload="none" />

            <style>{`
                .morph-slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 48px; height: 48px;
                    background: white; border-radius: 16px;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.5);
                    cursor: pointer; border: 4px solid #0f172a;
                    transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .morph-slider:active::-webkit-slider-thumb { transform: scale(0.9) rotate(45deg); }
                .custom-pro-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-pro-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
                @keyframes fade-in-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
            `}</style>
        </div>
    );
};

const PlayIcon = ({className = ""}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>;
const PauseIcon = ({className = ""}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>;
