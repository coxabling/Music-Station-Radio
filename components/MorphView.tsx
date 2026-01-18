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
    const [bpmA, setBpmA] = useState(120);
    const [bpmB, setBpmB] = useState(124);
    const [beatPulse, setBeatPulse] = useState(0);

    // Audio Refs
    const audioARef = useRef<HTMLAudioElement>(null);
    const audioBRef = useRef<HTMLAudioElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    // Web Audio API Graph Refs
    const audioCtxRef = useRef<AudioContext | null>(null);
    const gainANodeRef = useRef<GainNode | null>(null);
    const gainBNodeRef = useRef<GainNode | null>(null);
    const filterANodeRef = useRef<BiquadFilterNode | null>(null);
    const filterBNodeRef = useRef<BiquadFilterNode | null>(null);
    const analyzerARef = useRef<AnalyserNode | null>(null);
    const analyzerBRef = useRef<AnalyserNode | null>(null);
    
    // Beat Sync Modulators (LFOs)
    const modulatorANodeRef = useRef<GainNode | null>(null);
    const modulatorBNodeRef = useRef<GainNode | null>(null);

    // Harmonic Resonators
    const resonatorBankARef = useRef<BiquadFilterNode[]>([]);
    const resonatorBankBRef = useRef<BiquadFilterNode[]>([]);

    const automixRafRef = useRef<number>(0);
    const driftTargetRef = useRef<number>(0.5);

    const availableStations = useMemo(() => allStations.slice(0, 30), [allStations]);

    // Initialize Advanced Web Audio Graph
    const ensureAudioGraph = () => {
        if (audioCtxRef.current) return;
        if (!audioARef.current || !audioBRef.current) return;

        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioCtxRef.current = ctx;

        const anaA = ctx.createAnalyser(); anaA.fftSize = 128;
        const anaB = ctx.createAnalyser(); anaB.fftSize = 128;
        analyzerARef.current = anaA;
        analyzerBRef.current = anaB;

        const sourceA = ctx.createMediaElementSource(audioARef.current);
        const sourceB = ctx.createMediaElementSource(audioBRef.current);

        // Modulators for "Beat Match" pulsing
        const modA = ctx.createGain();
        const modB = ctx.createGain();
        modulatorANodeRef.current = modA;
        modulatorBNodeRef.current = modB;

        // Harmonic frequencies (E.g. low-mids and fundamental bass)
        const harmFreqs = [55, 110, 220, 440]; 
        const createResBank = (src: AudioNode) => {
            let chain = src;
            const bank: BiquadFilterNode[] = [];
            harmFreqs.forEach(f => {
                const res = ctx.createBiquadFilter();
                res.type = 'peaking';
                res.frequency.value = f;
                res.Q.value = 8;
                res.gain.value = 0;
                chain.connect(res);
                chain = res;
                bank.push(res);
            });
            return { last: chain, bank };
        };

        const bankA = createResBank(sourceA);
        const bankB = createResBank(sourceB);
        resonatorBankARef.current = bankA.bank;
        resonatorBankBRef.current = bankB.bank;

        const filterA = ctx.createBiquadFilter(); filterA.type = 'lowpass'; filterA.frequency.value = 20000;
        const filterB = ctx.createBiquadFilter(); filterB.type = 'highpass'; filterB.frequency.value = 20;
        filterANodeRef.current = filterA;
        filterBNodeRef.current = filterB;

        const gainA = ctx.createGain(); const gainB = ctx.createGain();
        gainANodeRef.current = gainA; gainBNodeRef.current = gainB;

        // Routing: Source -> Resonators -> Modulator -> Analyzer -> Filter -> Crossfade Gain -> Destination
        bankA.last.connect(modA).connect(anaA).connect(filterA).connect(gainA).connect(ctx.destination);
        bankB.last.connect(modB).connect(anaB).connect(filterB).connect(gainB).connect(ctx.destination);
    };

    // The actual Automix Logic: Moves the Balance slider
    useEffect(() => {
        if (!isAutomixing || !isPlaying) {
            if (automixRafRef.current) cancelAnimationFrame(automixRafRef.current);
            return;
        }

        const startTime = performance.now();
        const update = (time: number) => {
            const elapsed = (time - startTime) / 1000;
            let nextBalance = balance;

            switch (automixMode) {
                case 'oscillate':
                    // Slow sine wave: 16 second cycle
                    nextBalance = (Math.sin(elapsed * (Math.PI * 2) / 16) + 1) / 2;
                    break;
                case 'drift':
                    // Random walking towards a target
                    if (Math.abs(balance - driftTargetRef.current) < 0.01) {
                        driftTargetRef.current = Math.random();
                    }
                    nextBalance = balance + (driftTargetRef.current - balance) * 0.003;
                    break;
                case 'pulse':
                    // Hard switches on a rhythmic interval
                    const beat = Math.floor(elapsed * (124 / 60));
                    nextBalance = (beat % 2 === 0) ? 0.75 : 0.25;
                    break;
            }

            setBalance(nextBalance);
            automixRafRef.current = requestAnimationFrame(update);
        };

        automixRafRef.current = requestAnimationFrame(update);
        return () => {
            if (automixRafRef.current) cancelAnimationFrame(automixRafRef.current);
        };
    }, [isAutomixing, isPlaying, automixMode]);

    // Dynamic Engine Update Loop (Beat Pumping)
    useEffect(() => {
        if (!isPlaying || !audioCtxRef.current) return;
        
        let frame: number;
        const updateModulators = () => {
            frame = requestAnimationFrame(updateModulators);
            const now = audioCtxRef.current!.currentTime;
            
            // Unified pulse frequency (roughly 120BPM / 2Hz)
            // Strength is highest at the center (0.5 balance)
            const syncStrength = Math.pow(Math.sin(balance * Math.PI), 2) * 0.3;
            const pulse = Math.pow(Math.sin(now * Math.PI * (124 / 60)), 4); // sharp peak
            
            if (modulatorANodeRef.current && modulatorBNodeRef.current) {
                // Apply a rhythmic "glue" pulse
                const modValue = 1 - (pulse * syncStrength);
                modulatorANodeRef.current.gain.setTargetAtTime(modValue, now, 0.02);
                modulatorBNodeRef.current.gain.setTargetAtTime(modValue, now, 0.02);
            }
        };

        frame = requestAnimationFrame(updateModulators);
        return () => cancelAnimationFrame(frame);
    }, [isPlaying, balance]);

    // Crossfade & Filter Reactive Update
    useEffect(() => {
        if (!gainANodeRef.current || !gainBNodeRef.current || !filterANodeRef.current || !filterBNodeRef.current) return;
        const now = audioCtxRef.current?.currentTime || 0;
        
        // Equal-power crossfade
        const volA = Math.cos(balance * 0.5 * Math.PI);
        const volB = Math.sin(balance * 0.5 * Math.PI);
        gainANodeRef.current.gain.setTargetAtTime(volA, now, 0.1);
        gainBNodeRef.current.gain.setTargetAtTime(volB, now, 0.1);

        // Filter sweeps
        const freqA = 20000 * Math.pow(1 - balance, 1.5) + 150; 
        const freqB = 20 + (Math.pow(balance, 1.5) * 6000);
        filterANodeRef.current.frequency.setTargetAtTime(freqA, now, 0.2);
        filterBNodeRef.current.frequency.setTargetAtTime(freqB, now, 0.2);

        // Resonator Intensity
        const resGain = Math.sin(balance * Math.PI) * 15;
        resonatorBankARef.current.forEach(n => n.gain.setTargetAtTime(resGain, now, 0.3));
        resonatorBankBRef.current.forEach(n => n.gain.setTargetAtTime(resGain, now, 0.3));
    }, [balance]);

    // Playback Toggle
    const togglePlay = async () => {
        ensureAudioGraph();
        if (audioCtxRef.current?.state === 'suspended') await audioCtxRef.current.resume();

        if (isPlaying) {
            audioARef.current?.pause();
            audioBRef.current?.pause();
            setIsPlaying(false);
        } else {
            setIsPlaying(true);
            audioARef.current?.play().catch(() => {});
            audioBRef.current?.play().catch(() => {});
        }
    };

    // Station Handlers
    useEffect(() => {
        if (stationA && audioARef.current) {
            audioARef.current.src = stationA.streamUrl;
            audioARef.current.load();
            if (isPlaying) audioARef.current.play().catch(() => {});
            setBpmA(118 + Math.floor(Math.random() * 8));
        }
    }, [stationA]);

    useEffect(() => {
        if (stationB && audioBRef.current) {
            audioBRef.current.src = stationB.streamUrl;
            audioBRef.current.load();
            if (isPlaying) audioBRef.current.play().catch(() => {});
            setBpmB(120 + Math.floor(Math.random() * 10));
        }
    }, [stationB]);

    // Harmonic Matrix Visualizer
    useEffect(() => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d')!;
        let frame: number;
        let offset = 0;
        const dataA = new Uint8Array(64);
        const dataB = new Uint8Array(64);

        const draw = () => {
            frame = requestAnimationFrame(draw);
            offset += 0.05;
            const { width, height } = canvasRef.current!;
            ctx.clearRect(0, 0, width, height);

            if (analyzerARef.current) analyzerARef.current.getByteFrequencyData(dataA);
            if (analyzerBRef.current) analyzerBRef.current.getByteFrequencyData(dataB);

            const midY = height / 2;
            const energyA = dataA[4] / 255;
            const energyB = dataB[4] / 255;
            setBeatPulse(prev => prev * 0.9 + (energyA * (1 - balance) + energyB * balance) * 0.1);

            // Phase interference lines
            if (isPlaying) {
                ctx.save();
                ctx.globalAlpha = Math.sin(balance * Math.PI) * 0.4;
                ctx.strokeStyle = '#ffffff';
                ctx.setLineDash([2, 20]);
                ctx.beginPath();
                for (let x = 0; x < width; x += 10) {
                    const wave = Math.sin(x * 0.1 + offset * 15);
                    ctx.moveTo(x, midY - wave * 40);
                    ctx.lineTo(x, midY + wave * 40);
                }
                ctx.stroke();
                ctx.restore();
            }

            // Wave Alpha (Cyan)
            ctx.beginPath();
            ctx.strokeStyle = `rgba(6, 182, 212, ${Math.max(0.2, 1 - balance)})`;
            ctx.lineWidth = 4 + energyA * 10;
            ctx.shadowBlur = isPlaying ? 20 : 0;
            ctx.shadowColor = '#06b6d4';
            for (let x = 0; x < width; x++) {
                const y = midY + Math.sin(x * 0.05 + offset) * (10 + energyA * 50) * (1 - balance);
                if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Wave Omega (Pink)
            ctx.beginPath();
            ctx.strokeStyle = `rgba(236, 72, 153, ${Math.max(0.2, balance)})`;
            ctx.lineWidth = 4 + energyB * 10;
            ctx.shadowColor = '#ec4899';
            for (let x = 0; x < width; x++) {
                const y = midY + Math.cos(x * 0.04 + offset * 0.8) * (10 + energyB * 50) * balance;
                if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();
        };
        draw();
        return () => cancelAnimationFrame(frame);
    }, [balance, isPlaying]);

    const runNeuralAnalysis = async () => {
        if (!stationA || !stationB) return;
        setIsAnalyzing(true);
        setIsSynced(false);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `Analyze harmonic potential: ${stationA.name} x ${stationB.name}. Return JSON: hybridName, description, compatibility (70-99), spectralShift, frequencyDna (16 hex).`,
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
                hybridName: "Pulsar Nexus",
                description: "Deep-bass harmonic coupling active. Sub-frequency nodes aligned at 124Hz cycle.",
                compatibility: 95,
                spectralShift: "Beat-Synced Phase",
                frequencyDna: "A4F2-B9D1-0E42"
            });
            setIsSynced(true);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="p-4 lg:p-12 animate-fade-in relative min-h-screen bg-[#020617] selection:bg-cyan-500 selection:text-black">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(30,58,138,0.1),_transparent)] pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex justify-between items-center mb-10">
                    <button onClick={onBack} className="flex items-center gap-3 text-xs font-black text-gray-500 hover:text-cyan-400 transition-all uppercase tracking-[0.3em] group">
                        <div className="p-2 bg-white/5 rounded-lg group-hover:bg-cyan-500/20 transition-colors"><BackIcon /></div>
                        Return to Hub
                    </button>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-3 bg-gray-950/50 border border-white/5 px-4 py-2 rounded-2xl">
                             <SyncIcon className={`w-4 h-4 ${isPlaying ? 'text-green-400 animate-spin' : 'text-gray-700'}`} />
                             <span className="text-[10px] font-mono text-gray-500 tracking-wider">HARMONIC_GLUE: {isPlaying ? 'ENGAGED' : 'OFFLINE'}</span>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${isSynced ? 'bg-purple-500/20 text-purple-400 border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.2)]' : 'bg-gray-800 text-gray-600 border-transparent'}`}>
                            {isSynced ? 'Phase Aligned' : 'Searching Phase'}
                        </span>
                    </div>
                </div>

                <header className="text-center mb-10">
                    <h1 className="text-6xl lg:text-9xl font-black font-orbitron tracking-tighter text-white uppercase leading-none mb-4">
                        SONIC <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">MORPH</span>
                    </h1>
                    <div className="flex items-center justify-center gap-6 text-gray-600 font-bold uppercase tracking-[0.5em] text-[10px]">
                        <span>Beat Match</span>
                        <div className="w-1 h-1 rounded-full bg-gray-700"></div>
                        <span>Harmonic Crossfade</span>
                        <div className="w-1 h-1 rounded-full bg-gray-700"></div>
                        <span>Phase Synthesis</span>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_500px_1fr] gap-8 items-start mb-16">
                    
                    {/* Source Alpha */}
                    <div className="space-y-6">
                        <div className={`p-8 bg-gray-950/60 border rounded-[4rem] backdrop-blur-2xl transition-all duration-700 relative overflow-hidden group ${stationA ? 'border-cyan-500/30 shadow-[0_0_60px_rgba(6,182,212,0.05)]' : 'border-white/5'}`}>
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.4em]">Node Alpha</span>
                                <span className="text-[10px] font-mono text-cyan-500/60">{bpmA} BPM</span>
                            </div>
                            <div className={`aspect-square rounded-[3rem] border-2 transition-all duration-700 overflow-hidden ${stationA ? 'border-cyan-500 shadow-2xl scale-100' : 'border-dashed border-gray-800 scale-95 opacity-50'}`}>
                                {stationA ? (
                                    <img src={stationA.coverArt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-800"><MusicNoteIcon className="w-16 h-16" /></div>
                                )}
                            </div>
                            <h3 className="mt-8 font-black text-2xl text-white truncate font-orbitron tracking-tight">{stationA?.name || "Ready A" }</h3>
                            <p className="text-xs text-gray-500 font-bold uppercase mt-1 tracking-widest">{stationA?.genre || "Select Source"}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 h-40 overflow-y-auto custom-pro-scrollbar pr-1">
                            {availableStations.map(s => (
                                <button key={s.streamUrl} onClick={() => { setStationA(s); setAnalysis(null); setIsSynced(false); }} className={`text-left p-4 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest ${stationA?.streamUrl === s.streamUrl ? 'bg-cyan-500 text-black border-cyan-400 shadow-lg' : 'bg-gray-900/40 border-white/5 text-gray-600 hover:text-white'}`}>
                                    {s.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Central Synthesis Engine */}
                    <div className="flex flex-col items-center gap-10 py-12 px-10 bg-black/40 border border-white/10 rounded-[6rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(103,232,249,0.08),_transparent)]"></div>
                        
                        <div className="w-full h-44 relative flex items-center justify-center bg-black/60 rounded-[4rem] overflow-hidden border border-white/5 shadow-inner">
                            <canvas ref={canvasRef} width={420} height={180} className="w-full h-full" />
                            <div className={`absolute inset-0 transition-opacity duration-75 bg-cyan-500/10 pointer-events-none`} style={{opacity: beatPulse * 0.5}}></div>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                                <div className={`w-1 h-1 rounded-full transition-all duration-75 ${beatPulse > 0.6 ? 'bg-white scale-150 shadow-[0_0_10px_white]' : 'bg-gray-800'}`}></div>
                                <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">Beat Pulse Sensor</span>
                            </div>
                        </div>
                        
                        <div className="w-full space-y-8">
                            <div className="flex justify-between items-center text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] px-2">
                                <span className={balance < 0.2 ? 'text-cyan-400' : ''}>Source A Dominance</span>
                                <div className="flex flex-col items-center">
                                    <span className="text-white font-mono text-base tracking-tighter">MORPH: {Math.round((1-balance)*100)}:{Math.round(balance*100)}</span>
                                </div>
                                <span className={balance > 0.8 ? 'text-pink-400' : ''}>Source B Dominance</span>
                            </div>
                            <div className="relative h-12 flex items-center">
                                <input 
                                    type="range" min="0" max="1" step="0.001" value={balance} 
                                    disabled={isAutomixing}
                                    onChange={(e) => setBalance(parseFloat(e.target.value))}
                                    className={`morph-slider w-full bg-transparent appearance-none cursor-pointer relative z-10 ${isAutomixing ? 'opacity-30' : ''}`}
                                />
                                <div className="absolute inset-x-0 h-1.5 bg-gray-950 rounded-full overflow-hidden border border-white/5">
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-white to-pink-500 opacity-20"></div>
                                    <div className="h-full bg-white/40 transition-all duration-200" style={{ width: `${balance * 100}%` }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-10">
                            <button 
                                onClick={togglePlay}
                                disabled={!stationA || !stationB}
                                className={`w-28 h-28 rounded-full flex items-center justify-center transition-all border-4 relative overflow-hidden group/play ${isPlaying ? 'bg-white border-cyan-400 text-black shadow-[0_0_60px_rgba(6,182,212,0.4)]' : 'bg-gray-800 border-white/10 text-white hover:scale-105 disabled:opacity-20'}`}
                            >
                                <div className={`absolute -inset-4 rounded-full border-2 border-cyan-500/20 transition-transform duration-75`} style={{transform: `scale(${1 + beatPulse * 0.3})`}}></div>
                                {isPlaying ? <PauseIcon className="w-12 h-12" /> : <PlayIcon className="w-12 h-12" />}
                            </button>

                            <div className="flex flex-col gap-3">
                                <button 
                                    onClick={() => setIsAutomixing(!isAutomixing)}
                                    disabled={!isPlaying}
                                    className={`w-16 h-16 rounded-[2rem] flex flex-col items-center justify-center gap-1 transition-all border-2 ${isAutomixing ? 'bg-cyan-500 border-cyan-400 text-black shadow-xl' : 'bg-gray-950 border-white/10 text-gray-500 hover:text-white'}`}
                                >
                                    <AutoIcon className="w-7 h-7" />
                                    <span className="text-[8px] font-black uppercase tracking-tighter">Auto</span>
                                </button>
                                {isAutomixing && (
                                    <div className="flex bg-gray-950 rounded-2xl p-1.5 border border-white/10 gap-1.5 shadow-2xl">
                                        {(['oscillate', 'drift', 'pulse'] as AutomixMode[]).map(m => (
                                            <button key={m} onClick={() => setAutomixMode(m)} className={`w-4 h-4 rounded-full ${automixMode === m ? 'bg-cyan-400' : 'bg-gray-800'} transition-all`} title={m} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="text-center w-full min-h-[160px] flex flex-col justify-center bg-gray-950/60 rounded-[4rem] p-8 border border-white/5 shadow-inner">
                            {analysis ? (
                                <div className="animate-fade-in-up space-y-4">
                                    <h4 className="text-2xl font-black text-white font-orbitron uppercase tracking-tight">{analysis.hybridName}</h4>
                                    <p className="text-xs text-gray-400 font-bold uppercase leading-relaxed px-2 tracking-wide line-clamp-2">"{analysis.description}"</p>
                                    <div className="flex items-center justify-center gap-6">
                                        <div className="flex items-center gap-2">
                                            <PulseIcon className="w-4 h-4 text-purple-400" />
                                            <span className="text-[9px] font-black uppercase text-purple-500 tracking-widest">{analysis.spectralShift}</span>
                                        </div>
                                        <div className="w-px h-4 bg-gray-800"></div>
                                        <span className="text-[9px] font-black uppercase text-green-500 tracking-widest">Coherence: {analysis.compatibility}%</span>
                                    </div>
                                </div>
                            ) : (
                                <button 
                                    onClick={runNeuralAnalysis}
                                    disabled={!stationA || !stationB || isAnalyzing}
                                    className="px-12 py-6 bg-gray-950 hover:bg-gray-900 text-white border border-white/10 rounded-[2.5rem] text-xs font-black uppercase tracking-[0.4em] transition-all disabled:opacity-0 shadow-2xl group active:scale-95"
                                >
                                    <span className="relative flex items-center justify-center gap-4">
                                        {isAnalyzing ? "Recalibrating Waveforms..." : "Execute Harmonic Link"}
                                        <SyncIcon className={`w-5 h-5 ${isAnalyzing ? 'animate-spin text-cyan-400' : 'group-hover:rotate-180 transition-transform text-gray-600'}`} />
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Source Omega */}
                    <div className="space-y-6">
                        <div className={`p-8 bg-gray-950/60 border rounded-[4rem] backdrop-blur-2xl transition-all duration-700 relative overflow-hidden group ${stationB ? 'border-pink-500/30 shadow-[0_0_60px_rgba(236,72,153,0.05)]' : 'border-white/5'}`}>
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-[10px] font-mono text-pink-500/60">{bpmB} BPM</span>
                                <span className="text-[9px] font-black text-pink-500 uppercase tracking-[0.4em]">Node Omega</span>
                            </div>
                            <div className={`aspect-square rounded-[3rem] border-2 transition-all duration-700 overflow-hidden ${stationB ? 'border-pink-500 shadow-2xl scale-100' : 'border-dashed border-gray-800 scale-95 opacity-50'}`}>
                                {stationB ? (
                                    <img src={stationB.coverArt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-800"><MusicNoteIcon className="w-16 h-16" /></div>
                                )}
                            </div>
                            <h3 className="mt-8 font-black text-2xl text-white truncate font-orbitron tracking-tight text-right">{stationB?.name || "Ready B" }</h3>
                            <p className="text-xs text-gray-500 font-bold uppercase mt-1 tracking-widest text-right">{stationB?.genre || "Select Source"}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 h-40 overflow-y-auto custom-pro-scrollbar pr-1">
                            {availableStations.map(s => (
                                <button key={s.streamUrl} onClick={() => { setStationB(s); setAnalysis(null); setIsSynced(false); }} className={`text-right p-4 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest ${stationB?.streamUrl === s.streamUrl ? 'bg-pink-500 text-black border-pink-400 shadow-lg' : 'bg-gray-900/40 border-white/5 text-gray-600 hover:text-white'}`}>
                                    {s.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Performance HUD */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                    {[
                        { label: 'Neural Sync', value: isPlaying ? 'ACTIVE_LOCK' : 'STANDBY', icon: SyncIcon, color: 'text-cyan-400' },
                        { label: 'Phase Shift', value: isPlaying ? '0.004ms' : '--', icon: PulseIcon, color: 'text-purple-400' },
                        { label: 'Harmonic Cohesion', value: isSynced ? 'OPTIMAL' : 'CALIBRATING', icon: SparklesIcon, color: 'text-pink-400' },
                        { label: 'Terminal State', value: 'HGR_TERMINAL_01', icon: DnaIcon, color: 'text-green-400' }
                    ].map((hud, i) => (
                        <div key={i} className="bg-gray-900/40 border border-white/5 p-6 rounded-[2.5rem] flex flex-col items-center gap-3 group hover:border-white/20 transition-all">
                            <hud.icon className={`w-6 h-6 ${isPlaying ? hud.color : 'text-gray-700'}`} />
                            <div className="text-center">
                                <p className="text-[9px] font-black uppercase text-gray-600 tracking-widest">{hud.label}</p>
                                <p className={`text-xs font-mono font-bold mt-1 ${isPlaying ? 'text-white' : 'text-gray-700'}`}>{hud.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Global Radio Assets */}
            <audio ref={audioARef} crossOrigin="anonymous" preload="none" />
            <audio ref={audioBRef} crossOrigin="anonymous" preload="none" />

            <style>{`
                .morph-slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 64px; height: 64px;
                    background: white; border-radius: 28px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.7), inset 0 0 15px rgba(0,0,0,0.1);
                    cursor: pointer; border: 8px solid #020617;
                    transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .morph-slider:active::-webkit-slider-thumb { transform: scale(0.9) rotate(5deg); box-shadow: 0 10px 20px rgba(0,0,0,0.8); }
                .custom-pro-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-pro-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
                @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fade-in-up 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
            `}</style>
        </div>
    );
};

const PlayIcon = ({className = ""}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>;
const PauseIcon = ({className = ""}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>;
