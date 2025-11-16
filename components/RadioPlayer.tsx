import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Station, NowPlaying, EQSettings, SongVote } from '../types';
import { fetchNowPlaying } from '../services/geminiService';
import { Visualizer } from './Visualizer';
import { SongInfoModal } from './SongInfoModal';
import { EqualizerModal } from './EqualizerModal';
import { ShareModal } from './ShareModal';
import { StarRating } from './StarRating';
import { LiveReactions } from './LiveReactions';
import { SimilarStations } from './SimilarStations';
import { Marquee } from './Marquee';
import { EQ_BANDS, EQ_PRESETS } from '../constants';

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
const AmazonIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M20.95 13.62c-1.1-1.3-2.85-2.02-4.88-2.02-2.58 0-4.58 1.58-4.58 3.93 0 1.63.85 2.93 2.15 3.65.58.3 1.25.48 1.95.48 1.98 0 3.73-.9 4.88-2.33l.28-.35c.35-.45.3-.8-.15-.95-.45-.15-.8-.05-.95.15l-.28.33c-.85 1.05-2.18 1.65-3.63 1.65-.53 0-1.03-.13-1.45-.38-.85-.5-1.3-1.35-1.3-2.45 0-1.78 1.43-2.93 3.38-2.93 1.55 0 2.85.65 3.63 1.48l-2.45.83c-.53.15-.8.65-.65 1.1.15.5.65.8 1.1.65l3.8-1.3c.5-.15.8-.65.65-1.1l-.1-.36Zm-3.08-5.75c-.2-.2-.5-.2-.7 0l-1.43 1.4-1.4-1.4c-.2-.2-.5-.2-.7 0-.2.2-.2.5 0 .7l1.4 1.4-1.4 1.4c-.2.2-.2.5 0 .7.1.1.25.15.35.15s.25-.05.35-.15l1.4-1.4 1.43 1.4c.1.1.25.15.35.15s.25-.05.35-.15c.2-.2.2-.5 0-.7l-1.4-1.4 1.4-1.4c.2-.2.2-.5 0-.7Z" />
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm7.23 16.95C17.58 20.3 15.1 21 12.55 21c-2.85 0-5.4-1-7.25-2.73-1.55-1.43-2.6-3.2-3.05-5.18-.1-.4-.2-1.3-.2-1.45l.03-1.35c.1-2 .78-3.9 1.9-5.5.15-.2.35-.35.55-.45 1.5-1.05 3.3-1.6 5.15-1.7.2-.03.4-.03.6-.03.7 0 1.4.05 2.08.15.3.05.5.1.7.15l2.45.5c.2.05.4.1.55.15.6.15 1.15.35 1.7.6.15.1.3.15.45.25.55.3 1.05.7 1.5 1.1.4.35.75.8 1.05 1.25.3.45.55.95.78 1.5.05.1.1.2.15.3.15.35.3.7.4 1.1.15.55.25 1.15.28 1.75.03.2.03.4.03.6.03.8-.08 1.55-.2 2.3-.05.3-.1.55-.18.8-.05.15-.1.3-.15.45Z" />
    </svg>
);

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
}

export const RadioPlayer: React.FC<RadioPlayerProps> = (props) => {
  const { station, allStations, onNowPlayingUpdate, onNextStation, onPreviousStation, isImmersive, onToggleImmersive, songVotes, onVote, onRateStation, userRating, onOpenTippingModal, userSongVotes, onToggleChat } = props;

  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.75);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isEqModalOpen, setIsEqModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSimilarStationsOpen, setIsSimilarStationsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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
        console.error("Audio playback failed:", error);
        setIsPlaying(false);
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
  
  const handleBuyNow = useCallback(() => {
    if (!isSong || !nowPlaying) return;
    const affiliateTag = 'coxabling0e-21';
    const searchQuery = encodeURIComponent(`${nowPlaying.artist} ${nowPlaying.title}`);
    const url = `https://www.amazon.com/s?k=${searchQuery}&tag=${affiliateTag}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [isSong, nowPlaying]);

  const ControlButton: React.FC<{icon: React.ReactNode, label: string, onClick?: () => void, hasFeature?: boolean}> = ({icon, label, onClick, hasFeature = true}) => {
    if(!hasFeature) return null;
    return (
        <button onClick={onClick} className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors text-xs w-16">
            {icon}
            <span>{label}</span>
        </button>
    )
  }
  
  const userVote = isSong ? userSongVotes?.[nowPlaying.songId] : undefined;

  const renderContent = () => (
    <>
    <div className={`fixed inset-0 bg-gray-900/50 backdrop-blur-2xl z-50 flex flex-col p-4 transition-transform duration-500 ease-in-out ${isExpanded ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="flex-shrink-0 text-center relative">
        <button onClick={() => setIsExpanded(false)} className="absolute top-0 left-0 text-gray-400 hover:text-white"><ChevronDownIcon/></button>
        <p className="text-sm font-semibold">NOW PLAYING</p>
        <p className="text-xs text-gray-400">{station.name}</p>
      </div>
      <div className="flex-grow flex flex-col items-center justify-center gap-4 text-center px-4">
        <img src={nowPlaying?.albumArt || station.coverArt} alt={nowPlaying?.title || station.name} className="w-full max-w-xs aspect-square rounded-2xl shadow-2xl shadow-black/50 object-cover animate-fade-in" key={nowPlaying?.albumArt || station.name} onError={handleImageError} />
        <div className="w-full max-w-xs">
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

        <div className="w-full max-w-xs">
            <StarRating rating={userRating} onRate={(r) => onRateStation(station.streamUrl, r)} starClassName="h-8 w-8 text-yellow-400" />
            <p className="text-xs text-gray-500 mt-1">Rate this station</p>
        </div>
      </div>
      <div className="flex-shrink-0 flex flex-col gap-4">
        <div className="w-full max-w-sm mx-auto"><LiveReactions/></div>
        <div className="w-full h-16"><Visualizer analyser={analyserRef.current} isPlaying={isPlaying} /></div>
        <div className="flex items-center justify-center gap-8 text-white">
          <button onClick={onPreviousStation} className="text-gray-300 hover:text-white transition-colors"><BackwardIcon /></button>
          <button onClick={togglePlayPause} className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center text-[var(--accent-color)] ring-2 ring-white/20 hover:scale-105 transition-transform">
            <div className="w-10 h-10">{isPlaying ? <PauseIcon/> : <PlayIcon/>}</div>
          </button>
          <button onClick={onNextStation} className="text-gray-300 hover:text-white transition-colors"><ForwardIcon /></button>
        </div>
        <div className="w-full max-w-xs mx-auto">
            {isSong && (
                <button 
                    onClick={handleBuyNow} 
                    className="w-full flex items-center justify-center gap-2 bg-[#FF9900] hover:opacity-90 text-black font-bold py-3 px-4 rounded-md transition-opacity duration-300 mb-4"
                >
                    <AmazonIcon className="w-6 h-6"/>
                    Buy on Amazon
                </button>
            )}
            <div className="flex items-center justify-around text-gray-400 relative">
                <ControlButton icon={<InfoIcon/>} label="Info" onClick={() => setIsInfoModalOpen(true)} hasFeature={isSong}/>
                <ControlButton icon={<EqIcon/>} label="Equalizer" onClick={() => setIsEqModalOpen(true)}/>
                <ControlButton icon={<ChatIcon/>} label="Chat" onClick={onToggleChat}/>
                <div className="relative">
                    <ControlButton icon={<SimilarIcon/>} label="Similar" onClick={() => setIsSimilarStationsOpen(prev => !prev)}/>
                    {isSimilarStationsOpen && <SimilarStations isOpen={isSimilarStationsOpen} onClose={() => setIsSimilarStationsOpen(false)} station={station} allStations={allStations} onSelectStation={(s) => { setIsExpanded(false); props.onSelectStation(s); }} />}
                </div>
                <ControlButton icon={<ShareIcon/>} label="Share" onClick={() => setIsShareModalOpen(true)} hasFeature={isSong}/>
                <ControlButton icon={<TipIcon/>} label="Tip Jar" onClick={onOpenTippingModal} hasFeature={!!station.tippingUrl}/>
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
                 <button onClick={(e) => { e.stopPropagation(); isSong && onVote(nowPlaying.songId, 'like'); }} disabled={!isSong} className={`p-1 rounded-full transition-all duration-200 active:scale-90 ${isSong ? '' : 'opacity-30 cursor-not-allowed'} ${userVote === 'like' ? 'text-green-400 drop-shadow-[0_0_4px_rgba(74,222,128,0.8)]' : 'text-gray-400 hover:text-white'}`} aria-label="Like song">
                    <ThumbUpIcon className="w-6 h-6"/>
                </button>
                 <button onClick={(e) => { e.stopPropagation(); isSong && onVote(nowPlaying.songId, 'dislike'); }} disabled={!isSong} className={`p-1 rounded-full transition-all duration-200 active:scale-90 ${isSong ? '' : 'opacity-30 cursor-not-allowed'} ${userVote === 'dislike' ? 'text-red-400 drop-shadow-[0_0_4px_rgba(248,113,113,0.8)]' : 'text-gray-400 hover:text-white'}`} aria-label="Dislike song">
                    <ThumbDownIcon className="w-6 h-6"/>
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
    </>
  );

  return (
    <>
      <audio ref={audioRef} crossOrigin="anonymous" />
      {renderContent()}
      <SongInfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} nowPlaying={nowPlaying} />
      <EqualizerModal isOpen={isEqModalOpen} onClose={() => setIsEqModalOpen(false)} settings={eqSettings} onSettingsChange={setEqSettings} />
      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} nowPlaying={nowPlaying} station={station} />
    </>
  );
};