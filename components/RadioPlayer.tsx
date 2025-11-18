import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Station, NowPlaying, EQSettings, SongVote } from '../types';
import { fetchNowPlaying } from '../services/geminiService';
import { Visualizer } from './Visualizer';
import { SongInfoModal } from './SongInfoModal';
import { EqualizerModal } from './EqualizerModal';
import { ShareModal } from './ShareModal';
import { LiveReactions } from './LiveReactions';
import { SimilarStations } from './SimilarStations';
import { Marquee } from './Marquee';
import { RaidModal } from './RaidModal';
import { EQ_BANDS, EQ_PRESETS, RocketIcon } from '../constants';
import { BuyNowModal } from './BuyNowModal';

// --- Icon Components ---
const PlayIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M8 5v14l11-7z"></path></svg>;
const PauseIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>;
const ChevronUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>;
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;
const BackwardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20"><path d="M8.445 14.832A1 1 0 0010 14.006V5.994a1 1 0 00-1.555-.832L2.445 9.168a1 1 0 000 1.664l6 4.001zM17.445 9.168a1 1 0 000 1.664l6 4.001A1 1 0 0025 14.006V5.994a1 1 0 00-1.555-.832l-6 4.001z" transform="scale(0.8) translate(-2, 0)" /></svg>;
const ForwardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20"><path d="M11.555 5.168A1 1 0 0010 5.994v8.012a1 1 0 001.555.832l6-4.001a1 1 0 000-1.664l-6-4.001zM2.555 5.168A1 1 0 001 5.994v8.012a1 1 0 001.555.832l6-4.001a1 1 0 000-1.664l-6-4.001z" transform="scale(0.8) translate(2, 0)"/></svg>;
const TipIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm3 1a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>;
const SimilarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM13 11a1 1 0 100 2h4a1 1 0 100-2h-4z" /></svg>;
const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const EqIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>;
const ThumbUpIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M2 20.5a1.5 1.5 0 0 1 3 0v-6a1.5 1.5 0 0 1-3 0v6ZM20.45 8.14a2.25 2.25 0 0 0-1.8-1.14H14.5V4.75a2.75 2.75 0 0 0-5.5 0v3.83l-1.32.74a2.25 2.25 0 0 0-1.18 2V17.5a2.25 2.25 0 0 0 2.25 2.25h8.32a2.25 2.25 0 0 0 2.16-1.66l1.75-6.33a2.25 2.25 0 0 0-.5-2.28Z" /></svg>;
const ThumbDownIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M22 3.5a1.5 1.5 0 0 1-3 0v6a1.5 1.5 0 0 1 3 0v-6ZM3.55 15.86a2.25 2.25 0 0 0 1.8 1.14h4.15v2.25a2.75 2.75 0 0 0 5.5 0v-3.83l1.32-.74a2.25 2.25 0 0 0 1.18-2V6.5a2.25 2.25 0 0 0-2.25-2.25H6.88a2.25 2.25 0 0 0-2.16 1.66l-1.75 6.33a2.25 2.25 0 0 0 .5 2.28Z" /></svg>;
const ShareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg>;
const VolumeUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>;
const VolumeOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" /><path d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>;
const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const ShoppingCartIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /></svg>;

interface RadioPlayerProps {
  station: Station;
  allStations: Station[];
  onNowPlayingUpdate: (nowPlaying: NowPlaying | null) => void;
  onNextStation: () => void;
  onPreviousStation: () => void;
  isImmersive: boolean;
  onToggleImmersive: () => void;
  songVotes: Record<string, SongVote>;
  onVote: (songId: string, voteType: 'like' | 'dislike') => void;
  onRateStation: (stationUrl: string, rating: number) => void;
  userRating: number;
  onOpenTippingModal: () => void;
  onSelectStation: (station: Station) => void;
  userSongVotes?: Record<string, 'like' | 'dislike'>;
  onToggleChat: () => void;
  onStartRaid: (targetStation: Station) => void;
  raidStatus: 'idle' | 'voting';
  raidTarget: Station | null;
}

export const RadioPlayer: React.FC<RadioPlayerProps> = (props) => {
  const { station, allStations, onNowPlayingUpdate, onNextStation, onPreviousStation, isImmersive, onToggleImmersive, songVotes, onVote, onRateStation, userRating, onOpenTippingModal, userSongVotes, onToggleChat, onStartRaid, raidStatus, raidTarget } = props;

  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.75);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isEqModalOpen, setIsEqModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isRaidModalOpen, setIsRaidModalOpen] = useState(false);
  const [isSimilarStationsOpen, setIsSimilarStationsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBuyNowModalOpen, setIsBuyNowModalOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const eqNodesRef = useRef<BiquadFilterNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  const [eqSettings, setEqSettings] = useState<EQSettings>({ on: false, values: EQ_PRESETS[0].values, preamp: 1 });
  
  const isSong = nowPlaying && nowPlaying.title !== "Live Stream" && nowPlaying.title !== "Station Data Unavailable" && !!nowPlaying.songId;

  const getSong = useCallback(async () => {
    if (!station) return;
    const songInfo = await fetchNowPlaying(station);
    setNowPlaying(songInfo);
  }, [station]);
  
  useEffect(() => { onNowPlayingUpdate(nowPlaying); }, [nowPlaying, onNowPlayingUpdate]);
  
  const setupAudioContext = useCallback(() => {
    if (!audioRef.current) return;
    if (!audioContextRef.current) {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = context;
      const gainNode = context.createGain();
      gainNodeRef.current = gainNode;
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      eqNodesRef.current = EQ_BANDS.map(band => {
        const filter = context.createBiquadFilter();
        filter.type = band.type;
        filter.frequency.value = band.freq;
        return filter;
      });
      let lastNode: AudioNode = gainNode;
      for (const eqNode of eqNodesRef.current) { lastNode.connect(eqNode); lastNode = eqNode; }
      lastNode.connect(analyser);
      analyser.connect(context.destination);
    }
    try {
      const source = audioContextRef.current.createMediaElementSource(audioRef.current);
      source.connect(gainNodeRef.current!);
    } catch (e) { /* Expected if source is already connected */ }
  }, []);

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    audioEl.src = station.streamUrl;
    audioEl.crossOrigin = "anonymous";
    const playPromise = audioEl.play();
    if(playPromise !== undefined) {
      playPromise.then(() => {
        setIsPlaying(true);
        setupAudioContext();
      }).catch(error => {
        // This error is expected when a user changes stations quickly.
        // The new 'load' request for the next station interrupts the previous 'play' request.
        // We can safely ignore it to prevent console spam.
        if (error.name !== 'AbortError') {
            console.error("Audio playback failed:", error);
            setIsPlaying(false);
        }
      });
    }
    getSong();
    const songFetchInterval = setInterval(getSong, 15000);
    return () => clearInterval(songFetchInterval);
  }, [station, getSong, setupAudioContext]);
  
  const togglePlayPause = useCallback(async () => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
  
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
  
    if (isPlaying) {
      audioEl.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioEl.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlaying(true)).catch(error => { console.error("Playback failed:", error); setIsPlaying(false); });
      }
    }
  }, [isPlaying]);
  
  useEffect(() => { if (gainNodeRef.current) gainNodeRef.current.gain.value = volume * (eqSettings.on ? eqSettings.preamp : 1); }, [volume, eqSettings]);
  useEffect(() => {
    const contextTime = audioContextRef.current?.currentTime || 0;
    eqNodesRef.current.forEach((node, index) => node.gain.setValueAtTime(eqSettings.on ? eqSettings.values[index] : 0, contextTime));
  }, [eqSettings]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => { e.currentTarget.src = station.coverArt; };

  const ControlButton: React.FC<{icon: React.ReactNode; label: string; onClick?: () => void; hasFeature?: boolean}> = ({icon, label, onClick, hasFeature = true}) => {
    if(!hasFeature) return <div className="w-16 h-16" />;
    return (
        <button 
            onClick={onClick} 
            className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all text-xs w-16 h-16 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={!hasFeature}
            title={label}
        >
            {icon}
        </button>
    )
  }
  
  const userVote = isSong && nowPlaying.songId ? userSongVotes?.[nowPlaying.songId] : undefined;

  const renderContent = () => (
    <>
    <div 
      className={`fixed inset-0 bg-gray-900 z-50 flex flex-col p-4 transition-transform duration-500 ease-in-out ${isExpanded ? 'translate-y-0' : 'translate-y-full'}`}
      style={{
        backgroundImage: 'radial-gradient(ellipse at bottom, var(--accent-color-rgb, 103, 232, 249) 0.1%, transparent 40%)'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/50"></div>
      <div className="flex-shrink-0 text-center relative z-10">
        <button onClick={() => setIsExpanded(false)} className="absolute top-0 left-0 text-gray-400 hover:text-white"><ChevronDownIcon/></button>
        <p className="text-sm font-semibold uppercase tracking-wider">Now Playing</p>
        <p className="text-xs text-gray-400">{station.name}</p>
      </div>
      <div className="relative flex-grow flex flex-col items-center justify-center gap-4 text-center px-4 z-10">
        {raidStatus === 'voting' && raidTarget && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10 animate-fade-in">
            <p className="text-lg font-semibold text-purple-400">RAID IN PROGRESS</p>
            <p className="mt-2 text-2xl font-bold text-white max-w-xs truncate">Target: {raidTarget.name}</p>
            <div className="w-64 bg-gray-700 rounded-full h-2.5 mt-4 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-cyan-400 h-2.5 rounded-full animate-raid-progress"></div>
            </div>
            <p className="text-xs text-gray-400 mt-2 animate-pulse">Gathering raiders...</p>
          </div>
        )}
        <div 
            className="w-full max-w-xs aspect-square transition-all duration-300 ease-in-out"
            style={{ filter: `drop-shadow(0 10px 25px rgba(var(--accent-color-rgb), 0.3))`}}
        >
            <img 
                src={nowPlaying?.albumArt || station.coverArt} 
                alt={nowPlaying?.title || station.name} 
                className="w-full h-full rounded-2xl shadow-2xl shadow-black/50 object-cover animate-fade-in" 
                key={nowPlaying?.albumArt || station.name} 
                onError={handleImageError} 
            />
        </div>
        <div className="w-full max-w-xs mt-4">
          <Marquee text={nowPlaying?.title || station.name} className="text-2xl font-bold text-white" />
          <Marquee text={nowPlaying?.artist || 'Live Stream'} className="text-lg text-gray-300" />
        </div>

        <div className="flex items-center gap-6 my-2">
            <button 
                onClick={() => isSong && onVote(nowPlaying.songId, 'like')}
                disabled={!isSong}
                className={`p-2 rounded-full transition-all duration-200 active:scale-95 ${isSong ? 'hover:bg-white/10' : 'opacity-30 cursor-not-allowed'} ${userVote === 'like' ? 'text-green-400 scale-110 shadow-lg shadow-green-400/50' : 'text-gray-400 hover:text-white'}`}
                aria-label="Like this song"
            >
                <ThumbUpIcon className="w-7 h-7" />
            </button>
            <button
                onClick={() => isSong && onVote(nowPlaying.songId, 'dislike')}
                disabled={!isSong}
                className={`p-2 rounded-full transition-all duration-200 active:scale-95 ${isSong ? 'hover:bg-white/10' : 'opacity-30 cursor-not-allowed'} ${userVote === 'dislike' ? 'text-red-400 scale-110 shadow-lg shadow-red-400/50' : 'text-gray-400 hover:text-white'}`}
                aria-label="Dislike this song"
            >
                <ThumbDownIcon className="w-7 h-7" />
            </button>
        </div>
      </div>
      <div className="flex-shrink-0 flex flex-col gap-4 z-10">
        <div className="w-full max-w-sm mx-auto"><LiveReactions/></div>
        <div className="w-full h-16"><Visualizer analyser={analyserRef.current} isPlaying={isPlaying} /></div>
        <div className="flex items-center justify-center gap-8 text-white">
          <button onClick={onPreviousStation} className="text-gray-300 hover:text-white transition-colors"><BackwardIcon /></button>
          <button onClick={togglePlayPause} className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center text-[var(--accent-color)] ring-2 ring-white/20 hover:scale-105 transition-transform">
            <div className="w-10 h-10">{isPlaying ? <PauseIcon/> : <PlayIcon/>}</div>
          </button>
          <button onClick={onNextStation} className="text-gray-300 hover:text-white transition-colors"><ForwardIcon /></button>
        </div>
        <div className="w-full max-w-sm mx-auto">
            <div className="grid grid-cols-5 text-gray-400 relative gap-2">
                <ControlButton icon={<InfoIcon/>} label="Info" onClick={() => setIsInfoModalOpen(true)} hasFeature={isSong}/>
                <ControlButton icon={<EqIcon/>} label="Equalizer" onClick={() => setIsEqModalOpen(true)}/>
                <ControlButton icon={<ChatIcon/>} label="Chat" onClick={onToggleChat}/>
                <ControlButton icon={<ShareIcon/>} label="Share" onClick={() => setIsShareModalOpen(true)} hasFeature={isSong}/>
                <ControlButton icon={<RocketIcon className="h-5 w-5"/>} label="Raid" onClick={() => setIsRaidModalOpen(true)} hasFeature={raidStatus === 'idle'} />
            </div>
        </div>
      </div>
    </div>
    <div className={`fixed bottom-0 left-0 right-0 z-40 bg-gray-800/60 backdrop-blur-xl border-t border-white/10 transition-transform duration-500 ease-in-out animate-slide-up ${isExpanded ? 'translate-y-full' : 'translate-y-0'}`} onClick={() => setIsExpanded(true)}>
        <div className="container mx-auto px-4 flex items-center h-20">
            <div className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer">
                <img src={nowPlaying?.albumArt || station.coverArt} alt={nowPlaying?.title || station.name} className="w-12 h-12 rounded-lg shadow-lg object-cover" onError={handleImageError} />
                <div className="flex-1 min-w-0">
                    <Marquee text={nowPlaying?.title || station.name} className="font-bold text-white" />
                    <Marquee text={nowPlaying?.artist || 'Live Stream'} className="text-sm text-gray-300" />
                </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
                 <button onClick={(e) => { e.stopPropagation(); if(isSong) onVote(nowPlaying.songId, 'like'); }} disabled={!isSong} className={`p-1 rounded-full transition-all duration-200 active:scale-90 ${isSong ? '' : 'opacity-30 cursor-not-allowed'} ${userVote === 'like' ? 'text-green-400 drop-shadow-[0_0_4px_rgba(74,222,128,0.8)]' : 'text-gray-400 hover:text-white'}`} aria-label="Like song">
                    <ThumbUpIcon className="w-6 h-6"/>
                </button>
                 <button onClick={(e) => { e.stopPropagation(); if(isSong) onVote(nowPlaying.songId, 'dislike'); }} disabled={!isSong} className={`p-1 rounded-full transition-all duration-200 active:scale-90 ${isSong ? '' : 'opacity-30 cursor-not-allowed'} ${userVote === 'dislike' ? 'text-red-400 drop-shadow-[0_0_4px_rgba(248,113,113,0.8)]' : 'text-gray-400 hover:text-white'}`} aria-label="Dislike song">
                    <ThumbDownIcon className="w-6 h-6"/>
                </button>
                <button onClick={(e) => { e.stopPropagation(); setIsBuyNowModalOpen(true); }} disabled={!isSong} className={`p-1 rounded-full transition-all duration-200 active:scale-90 ${isSong ? '' : 'opacity-30 cursor-not-allowed'} text-gray-400 hover:text-white`} aria-label="Buy song">
                    <ShoppingCartIcon className="w-6 h-6"/>
                </button>
                 <div className="hidden md:flex items-center gap-2 group">
                    {volume > 0 ? <VolumeUpIcon /> : <VolumeOffIcon />}
                    <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-[var(--accent-color)] opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()} />
                </div>
                <button onClick={(e) => { e.stopPropagation(); togglePlayPause(); }} className="w-12 h-12 flex items-center justify-center text-white hover:text-[var(--accent-color)] transition-colors" aria-label={isPlaying ? 'Pause' : 'Play'}>
                  <div className="w-8 h-8">{isPlaying ? <PauseIcon/> : <PlayIcon/>}</div>
                </button>
                <button onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }} className="text-gray-400 hover:text-white hidden md:block" aria-label="Expand player">
                    <ChevronUpIcon />
                </button>
            </div>
        </div>
    </div>
    <style>{`
      @keyframes raid-progress {
        from { transform: translateX(-100%); }
        to { transform: translateX(0); }
      }
      .animate-raid-progress {
        animation: raid-progress 5s linear forwards;
      }
    `}</style>
    </>
  );

  return (
    <>
      <audio ref={audioRef} crossOrigin="anonymous" />
      {renderContent()}
      <SongInfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} nowPlaying={nowPlaying} />
      <EqualizerModal isOpen={isEqModalOpen} onClose={() => setIsEqModalOpen(false)} settings={eqSettings} onSettingsChange={setEqSettings} />
      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} nowPlaying={nowPlaying} station={station} />
      <BuyNowModal isOpen={isBuyNowModalOpen} onClose={() => setIsBuyNowModalOpen(false)} nowPlaying={nowPlaying} />
      <RaidModal isOpen={isRaidModalOpen} onClose={() => setIsRaidModalOpen(false)} allStations={allStations} currentStation={station} onStartRaid={onStartRaid} />
    </>
  );
};
