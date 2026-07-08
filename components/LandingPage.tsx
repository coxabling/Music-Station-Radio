import React, { useMemo, useState, useEffect, useRef } from 'react';
import { stations, TrophyIcon, MusicNoteIcon, BriefcaseIcon, UserIcon, ChatBubbleIcon, RocketIcon, StarIcon, ExploreIcon, UploadIcon, ClockIcon, DeviceIcon, HomeIcon, UserGroupIcon } from '../constants';
import { BLOG_POSTS, BlogPost } from '../blogPosts';

interface LandingPageProps {
  onEnter: () => void;
  onInstantPlay: (station?: typeof stations[0]) => void;
}

const HighFiIcon = ({className = "h-6 w-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V7.5A2.25 2.25 0 009 5.25v1.5" />
    </svg>
);

const AIIcon = ({className = "h-6 w-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.456-2.455L18 2.25l.259 1.036a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.456 2.455zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
);

const CardCollectorIcon = ({className = "h-6 w-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
);

const roles = [
    { id: 'listener', title: 'Curator', icon: <UserIcon className="w-8 h-8"/>, desc: "Discover world-class radio and shape the global charts with your votes.", color: "from-cyan-400 to-blue-600" },
    { id: 'artist', title: 'Creator', icon: <MusicNoteIcon className="w-8 h-8"/>, desc: "Submit your rhythms directly to station managers and build your audience.", color: "from-purple-500 to-pink-600" },
    { id: 'manager', title: 'Director', icon: <BriefcaseIcon className="w-8 h-8"/>, desc: "Claim, manage, and monetize your own station on our enterprise network.", color: "from-yellow-400 to-orange-600" },
];

const FeaturedStationCard: React.FC<{station: typeof stations[0], index: number}> = ({station, index}) => (
    <div 
      className="relative w-64 h-80 rounded-2xl p-5 flex flex-col justify-end text-white overflow-hidden transition-all duration-700 hover:scale-105 group ring-1 ring-white/5 hover:ring-cyan-500/40 bg-gray-900 shadow-2xl"
    >
        <img src={station.coverArt} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/60 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
        
        <div className="relative z-10 transform transition-all duration-500 group-hover:-translate-y-2">
            <div className="inline-block px-2.5 py-1 rounded-md bg-cyan-500/20 backdrop-blur-md text-[10px] font-black uppercase mb-3 border border-cyan-500/30 text-cyan-400 tracking-tighter">
                {station.genre.split(',')[0]}
            </div>
            <h4 className="font-bold text-2xl leading-tight mb-2 shadow-black drop-shadow-lg font-orbitron">{station.name}</h4>
            <p className="text-xs text-gray-400 line-clamp-2 font-medium">{station.description}</p>
        </div>
        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md rounded-full p-1.5 opacity-0 group-hover:opacity-10 transition-opacity">
            <ExploreIcon className="w-4 h-4 text-cyan-500" />
        </div>
    </div>
);

const FeatureSection: React.FC<{
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    align?: 'left' | 'right';
    features: string[];
    color: string;
    demoNode?: React.ReactNode;
}> = ({ id, title, description, icon, align = 'left', features, color, demoNode }) => (
    <div id={id} className="py-24 container mx-auto px-4">
        <div className={`flex flex-col lg:flex-row items-center gap-16 ${align === 'right' ? 'lg:flex-row-reverse' : ''}`}>
            <div className="flex-1 space-y-8 text-left">
                <div className={`inline-flex p-4 rounded-2xl bg-${color}-500/10 text-${color}-400 border border-${color}-500/20 shadow-xl shadow-${color}-900/10 animate-pulse`}>
                    {icon}
                </div>
                <h2 className="text-4xl md:text-6xl font-black font-orbitron leading-none tracking-tighter text-white uppercase">
                    {title}
                </h2>
                <p className="text-xl text-gray-400 leading-relaxed font-medium">
                    {description}
                </p>
                <ul className="space-y-4">
                    {features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-4 text-gray-300 group">
                            <div className={`w-2 h-2 rounded-full bg-${color}-500 shadow-[0_0_12px_rgba(var(--tw-color-${color}-500),0.8)] transition-transform group-hover:scale-125`}></div>
                            <span className="font-semibold tracking-wide uppercase text-sm">{feat}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex-1 w-full">
                 {demoNode ? (
                     demoNode
                 ) : (
                     <div className="perspective-1000">
                          <div className={`relative aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black shadow-2xl shadow-${color}-900/20 group transform transition-transform duration-700 hover:rotate-y-6 hover:rotate-x-2`}>
                             <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-80"></div>
                             <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-${color}-500/10 rounded-full blur-[100px] group-hover:scale-150 transition-transform duration-1000`}></div>
                             <div className="relative z-10 h-full flex items-center justify-center p-12">
                                  <div className="text-center space-y-4">
                                      <div className={`text-6xl font-black text-${color}-500/10 group-hover:text-${color}-500/30 transition-all duration-700 font-orbitron select-none scale-150`}>
                                         {title.split(' ')[0]}
                                      </div>
                                      <div className="h-0.5 w-24 bg-white/10 mx-auto group-hover:w-full transition-all duration-700"></div>
                                  </div>
                             </div>
                          </div>
                     </div>
                 )}
            </div>
        </div>
    </div>
);

const NavItem: React.FC<{ icon: React.ReactNode; label: string; href: string; active: boolean }> = ({ icon, label, href, active }) => (
    <a 
        href={href} 
        className={`group relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${active ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-white'}`}
    >
        {icon}
        <span className="absolute left-20 px-3 py-1.5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10 shadow-2xl whitespace-nowrap z-50">
            {label}
        </span>
    </a>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter, onInstantPlay }) => {
    const backgroundStations = useMemo(() => [...stations].sort(() => 0.5 - Math.random()).slice(0, 16), []);
    const featuredStations = useMemo(() => stations.slice(0, 3), []);
    const trendingStations = useMemo(() => stations.slice(3, 6), []);
    const [activeSection, setActiveSection] = useState('hero');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [activePost, setActivePost] = useState<BlogPost | null>(null);
    const [visibleCount, setVisibleCount] = useState(3);
    const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

    // Global Quick Play & Instant Stream State
    const [quickPlayStation, setQuickPlayStation] = useState<typeof stations[0] | null>(null);
    const [isQuickPlaying, setIsQuickPlaying] = useState(false);
    const [quickVolume, setQuickVolume] = useState(0.8);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Global Search & Vibe-Based Discovery State
    const [landingSearch, setLandingSearch] = useState('');
    const [selectedVibe, setSelectedVibe] = useState('All');

    // Interactive Showcase Demo States
    const [isPlayingHiFiDemo, setIsPlayingHiFiDemo] = useState(false);
    const [demoLyricLang, setDemoLyricLang] = useState<'original' | 'english'>('original');
    const [demoGeminiStatus, setDemoGeminiStatus] = useState<'idle' | 'asking' | 'done'>('idle');
    const [demoGeminiResponse, setDemoGeminiResponse] = useState('');
    const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });

    // Manage local quick play audio element
    useEffect(() => {
        if (quickPlayStation && isQuickPlaying) {
            if (!audioRef.current) {
                audioRef.current = new Audio(quickPlayStation.streamUrl);
            } else if (audioRef.current.src !== quickPlayStation.streamUrl) {
                audioRef.current.src = quickPlayStation.streamUrl;
            }
            audioRef.current.volume = quickVolume;
            audioRef.current.play().catch(err => {
                console.warn("Audio play failed on landing page (due to browser autoplay policies)", err);
                setIsQuickPlaying(false);
            });
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        }
    }, [quickPlayStation, isQuickPlaying]);

    // Volume syncing
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = quickVolume;
        }
    }, [quickVolume]);

    // Audio cleanup
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const handleQuickEnter = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setIsQuickPlaying(false);
        onInstantPlay(quickPlayStation || stations[0]);
    };

    const triggerQuickPlay = (station?: typeof stations[0]) => {
        const target = station || stations[0];
        setQuickPlayStation(target);
        setIsQuickPlaying(true);
    };

    const filteredPosts = useMemo(() => {
        if (selectedCategory === 'All') return BLOG_POSTS;
        return BLOG_POSTS.filter(post => post.category === selectedCategory);
    }, [selectedCategory]);

    const recommendations = useMemo(() => {
        if (!activePost) return [];
        const candidates = BLOG_POSTS.filter(post => post.id !== activePost.id);
        return candidates.sort((a, b) => {
            if (a.category === activePost.category && b.category !== activePost.category) return -1;
            if (b.category === activePost.category && a.category !== activePost.category) return 1;
            return 0;
        }).slice(0, 2);
    }, [activePost]);

    const handleShare = (e: React.MouseEvent, post: BlogPost) => {
        e.stopPropagation();
        const shareUrl = `${window.location.origin}${window.location.pathname}?blog=${post.id}#blog`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            setCopiedPostId(post.id);
            setTimeout(() => setCopiedPostId(null), 2000);
        }).catch((err) => {
            console.error('Failed to copy: ', err);
        });
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const blogId = params.get('blog');
        if (blogId) {
            const found = BLOG_POSTS.find(p => p.id === blogId);
            if (found) {
                setActivePost(found);
                setTimeout(() => {
                    const blogSec = document.getElementById('blog');
                    if (blogSec) {
                        blogSec.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 300);
            }
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['hero', 'signature', 'features', 'roles', 'upgrade'];
            const scrollPos = window.scrollY + 200;
            for (const sectionId of sections) {
                const element = document.getElementById(sectionId);
                if (element && element.offsetTop <= scrollPos && (element.offsetTop + element.offsetHeight) > scrollPos) {
                    setActiveSection(sectionId);
                    break;
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

  return (
    <div className="min-h-screen bg-[#030712] text-white font-poppins selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      
      {/* LEFT NAVIGATION MENU */}
      <nav className="fixed left-6 top-1/2 -translate-y-1/2 z-[100] hidden xl:flex flex-col gap-4 animate-fade-in-left">
          <div className="flex flex-col gap-4 p-2 bg-black/40 backdrop-blur-2xl rounded-[2rem] border border-white/5 shadow-2xl">
              <NavItem icon={<HomeIcon className="w-6 h-6"/>} label="Home" href="#hero" active={activeSection === 'hero'} />
              <NavItem icon={<MusicNoteIcon className="w-6 h-6"/>} label="Network" href="#signature" active={activeSection === 'signature'} />
              <NavItem icon={<HighFiIcon className="w-6 h-6"/>} label="Tech" href="#features" active={activeSection === 'features'} />
              <NavItem icon={<UserGroupIcon className="w-6 h-6"/>} label="Join" href="#roles" active={activeSection === 'roles'} />
              <NavItem icon={<RocketIcon className="w-6 h-6"/>} label="Enter" href="#upgrade" active={activeSection === 'upgrade'} />
          </div>
          <div className="h-20 w-[1px] bg-gradient-to-b from-white/10 to-transparent mx-auto"></div>
      </nav>

      {/* HERO SECTION */}
      <header id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Obsidian Grid Background */}
        <div className="absolute inset-0 grid grid-cols-4 md:grid-cols-8 opacity-20" id="landing-grid-overlay">
            {[...Array(32)].map((_, i) => (
                <div key={i} className="border-[0.5px] border-white/5 transition-colors duration-[4s] hover:bg-white/5"></div>
            ))}
        </div>

        {/* Dynamic Atmospheric Elements */}
        <div className="absolute inset-0" id="landing-bg-grid">
            {backgroundStations.map((station, i) => (
                <div key={i} className="bg-cover bg-center opacity-10 grayscale mix-blend-overlay transition-all duration-[5s] hover:opacity-30 hover:grayscale-0" style={{ backgroundImage: `url(${station.coverArt})` }}></div>
            ))}
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030712]/90 to-[#030712]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent opacity-60"></div>

        <div className="relative z-10 container mx-auto px-4 text-center flex flex-col items-center animate-fade-in-up">
             <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-cyan-500 text-[10px] font-black tracking-[0.2em] mb-10 shadow-[0_0_40px_rgba(6,182,212,0.15)] uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                Global Audio Network
             </div>

             <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black font-orbitron tracking-tighter leading-none mb-4 text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                MUSIC STATION
             </h1>
             <p className="text-3xl md:text-5xl font-light text-cyan-500 font-orbitron tracking-[0.4em] uppercase mb-12 drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                 RADIO NETWORK
             </p>
             
             <p className="text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-16 font-medium">
                The ultimate destination for independent broadcasting. Connect with thousands of high-fidelity streams and a global community of music lovers.
             </p>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl mx-auto mb-10">
                 <button 
                    onClick={() => triggerQuickPlay()}
                    className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-black font-black text-xl py-5 rounded-2xl hover:brightness-110 transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(245,158,11,0.5)] flex items-center justify-center gap-3 group relative overflow-hidden"
                 >
                     <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                     <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-40"></span>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 fill-current text-black" viewBox="0 0 20 20">
                             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8.006v3.988a1 1 0 001.555.832l3.197-2.005a1 1 0 000-1.664L9.555 7.168z" clipRule="evenodd" />
                         </svg>
                     </span>
                     Listen Now
                 </button>
                 <button 
                    onClick={onEnter}
                    className="bg-cyan-500 text-black font-black text-xl py-5 rounded-2xl hover:bg-cyan-400 transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(6,182,212,0.4)] flex items-center justify-center gap-3 group"
                 >
                     <ExploreIcon className="w-6 h-6 transform group-hover:rotate-12 transition-transform" />
                     Explore Network
                 </button>
                 <button 
                    onClick={onEnter}
                    className="bg-white/5 text-white font-bold text-xl py-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all backdrop-blur-md flex items-center justify-center gap-3"
                 >
                     <RocketIcon className="w-6 h-6 text-gray-400" />
                     Enter Platform
                 </button>
             </div>

             {/* GLASSMORPHIC QUICK PLAY STREAM DOCK */}
             {quickPlayStation && (
                 <div className="w-full max-w-2xl bg-black/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 shadow-2xl shadow-cyan-950/20 text-left animate-fade-in-up space-y-6 relative overflow-hidden group">
                     {/* Dynamic neon ambient glow */}
                     <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-cyan-500 to-purple-600 animate-pulse"></div>
                     <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

                     <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                         {/* Station details */}
                         <div className="flex items-center gap-4">
                             <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-lg border border-white/10 bg-gray-900">
                                 <img src={quickPlayStation.coverArt} alt={quickPlayStation.name} className={`w-full h-full object-cover ${isQuickPlaying ? 'animate-[spin_10s_linear_infinite]' : ''}`} />
                                 {isQuickPlaying && (
                                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                         <span className="flex gap-0.5 items-end h-4">
                                             <span className="w-0.5 h-2 bg-cyan-400 animate-[pulse_0.8s_ease-in-out_infinite_alternate]"></span>
                                             <span className="w-0.5 h-4 bg-cyan-400 animate-[pulse_0.6s_ease-in-out_infinite_alternate_0.2s]"></span>
                                             <span className="w-0.5 h-3 bg-cyan-400 animate-[pulse_0.7s_ease-in-out_infinite_alternate_0.4s]"></span>
                                         </span>
                                     </div>
                                 )}
                             </div>
                             <div>
                                 <div className="flex items-center gap-2">
                                     <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md">{quickPlayStation.genre.split(',')[0]}</span>
                                     <span className="text-[9px] font-mono text-gray-500 font-bold">192KBPS AAC</span>
                                 </div>
                                 <h4 className="text-xl font-bold font-orbitron text-white mt-1 leading-tight">{quickPlayStation.name}</h4>
                                 <p className="text-xs text-gray-400 line-clamp-1 mt-0.5 font-medium">{quickPlayStation.description}</p>
                             </div>
                         </div>

                         {/* Play & Vol controls */}
                         <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                             {/* Vol slider */}
                             <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-3 py-2 rounded-xl">
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 18.75V5.25L8.75 8.5H6a2 2 0 00-2 2v3a2 2 0 002 2h2.75L12 18.75z" />
                                 </svg>
                                 <input 
                                     type="range" 
                                     min="0" 
                                     max="1" 
                                     step="0.05" 
                                     value={quickVolume} 
                                     onChange={(e) => setQuickVolume(parseFloat(e.target.value))} 
                                     className="w-16 accent-cyan-400 h-1 bg-gray-700 rounded-lg cursor-pointer"
                                 />
                             </div>

                             {/* Play toggle */}
                             <button 
                                 onClick={() => setIsQuickPlaying(!isQuickPlaying)}
                                 className={`p-4 rounded-full transition-all hover:scale-105 flex items-center justify-center shadow-lg ${isQuickPlaying ? 'bg-purple-600 text-white shadow-purple-900/30' : 'bg-cyan-500 text-black shadow-cyan-900/30'}`}
                             >
                                 {isQuickPlaying ? (
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                     </svg>
                                 ) : (
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8.006v3.988a1 1 0 001.555.832l3.197-2.005a1 1 0 000-1.664L9.555 7.168z" clipRule="evenodd" />
                                     </svg>
                                 )}
                             </button>
                         </div>
                     </div>

                     {/* Handover & select grid */}
                     <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/5 pt-4 gap-4">
                         {/* Mini grid of stations */}
                         <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none py-1">
                             {stations.slice(0, 4).map((st) => (
                                 <button 
                                     key={st.streamUrl}
                                     onClick={() => triggerQuickPlay(st)}
                                     className={`flex-shrink-0 text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border transition-all ${quickPlayStation.streamUrl === st.streamUrl ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)]' : 'bg-white/5 text-gray-400 border-transparent hover:bg-white/10'}`}
                                 >
                                     {st.name}
                                 </button>
                             ))}
                         </div>

                         {/* Handover action */}
                         <button 
                             onClick={handleQuickEnter}
                             className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black text-xs uppercase tracking-widest px-5 py-3 rounded-xl transition-all hover:brightness-110 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 shrink-0 group"
                         >
                             <span>Enter Full Experience</span>
                             <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                         </button>
                     </div>
                 </div>
             )}
        </div>

        {/* Status Ticker */}
        <div className="absolute bottom-0 left-0 right-0 h-14 bg-black/60 backdrop-blur-2xl border-t border-white/5 flex items-center overflow-hidden z-20">
            <div className="animate-scroll flex items-center gap-20 px-8 whitespace-nowrap text-xs font-black tracking-widest text-gray-500 uppercase">
                {[...Array(6)].map((_, i) => (
                    <React.Fragment key={i}>
                        <span className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(6,182,212,1)]"></span> MUSIC STATION RADIO: LIVE</span>
                        <span className="flex items-center gap-3"><HighFiIcon className="w-4 h-4 text-purple-400"/> PREMIUM ENCODING ACTIVE</span>
                        <span className="flex items-center gap-3"><StarIcon className="w-4 h-4 text-yellow-400"/> SYNDICATE STATIONS GROWING</span>
                        <span className="flex items-center gap-3"><ChatBubbleIcon className="w-4 h-4 text-cyan-400"/> GLOBAL VIBES FLOWING</span>
                    </React.Fragment>
                ))}
            </div>
        </div>
      </header>

      {/* LIVE BROADCAST HUB */}
      <section id="signature" className="bg-black py-24 relative z-20 border-b border-white/5">
          <div className="container mx-auto max-w-6xl px-4">
              <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-6xl font-black font-orbitron mb-4 tracking-tighter uppercase text-white">Live Broadcast Hub</h2>
                  <p className="text-gray-400 max-w-xl mx-auto text-sm font-medium">Explore the high-fidelity premium channels currently active on the Music Station Radio Network.</p>
              </div>

              {/* FILTER BAR & SEARCH */}
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12 bg-gray-950/40 border border-white/5 rounded-3xl p-6 backdrop-blur-md">
                  {/* Vibe Filter Pills */}
                  <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                      {['All', 'Chill ☕', 'Energetic ⚡', 'Focus 🧠', 'Party 🎉', 'Spiritual 🌟'].map((vibe) => {
                          const vibeKey = vibe.split(' ')[0];
                          const isActive = selectedVibe === vibeKey;
                          return (
                              <button
                                  key={vibe}
                                  onClick={() => setSelectedVibe(vibeKey)}
                                  className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border ${
                                      isActive
                                          ? 'bg-cyan-500 text-black border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                                          : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/10 hover:text-white'
                                  }`}
                              >
                                  {vibe}
                              </button>
                          );
                      })}
                  </div>

                  {/* Global Search Bar */}
                  <div className="relative w-full lg:w-80">
                      <input
                          type="text"
                          placeholder="Search stations, genres..."
                          value={landingSearch}
                          onChange={(e) => setLandingSearch(e.target.value)}
                          className="w-full px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-cyan-500 transition-all focus:ring-1 focus:ring-cyan-500 font-medium"
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                  </div>
              </div>

              {/* GRID OF MATCHING STATIONS */}
              {(() => {
                  const getStationVibes = (stName: string) => {
                      switch(stName) {
                          case 'High Grade Radio': return ['Energetic', 'Focus'];
                          case 'CRW Radio': return ['Chill', 'Focus', 'Spiritual'];
                          case 'Nam Radio': return ['Chill', 'Energetic', 'Spiritual'];
                          case 'Pamtengo Radio': return ['Chill', 'Spiritual'];
                          case 'Power Ace Radio': return ['Energetic', 'Party'];
                          case 'Global Groove Radio': return ['Focus', 'Party'];
                          default: return ['Chill'];
                      }
                  };

                  const matchingStations = stations.filter(st => {
                      const matchesSearch = st.name.toLowerCase().includes(landingSearch.toLowerCase()) || 
                                            st.genre.toLowerCase().includes(landingSearch.toLowerCase()) ||
                                            st.description.toLowerCase().includes(landingSearch.toLowerCase());
                      const matchesVibe = selectedVibe === 'All' || getStationVibes(st.name).includes(selectedVibe);
                      return matchesSearch && matchesVibe;
                  });

                  if (matchingStations.length === 0) {
                      return (
                          <div className="text-center py-20 border border-dashed border-white/5 rounded-3xl bg-gray-900/10">
                              <p className="text-gray-500 font-medium text-sm">No live stations found matching your search parameters.</p>
                          </div>
                      );
                  }

                  return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                          {matchingStations.map((st, index) => {
                              const isCurrentQuick = quickPlayStation?.streamUrl === st.streamUrl;
                              return (
                                  <div 
                                      key={st.streamUrl}
                                      className={`group relative p-6 bg-gray-900/30 backdrop-blur-xl border rounded-3xl transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between ${isCurrentQuick && isQuickPlaying ? 'border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.1)]' : 'border-white/5 hover:border-white/10'}`}
                                  >
                                      {/* Station Art & Overlay */}
                                      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-gray-950 mb-4 border border-white/5">
                                          <img src={st.coverArt} alt={st.name} className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105" />
                                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                          
                                          {/* Interactive hover overlay */}
                                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                              <button 
                                                  onClick={() => {
                                                      setQuickPlayStation(st);
                                                      setIsQuickPlaying(isCurrentQuick ? !isQuickPlaying : true);
                                                  }}
                                                  className="p-4 bg-cyan-500 hover:bg-cyan-400 text-black rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-all hover:scale-105"
                                              >
                                                  {isCurrentQuick && isQuickPlaying ? (
                                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                      </svg>
                                                  ) : (
                                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-current" viewBox="0 0 20 20">
                                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8.006v3.988a1 1 0 001.555.832l3.197-2.005a1 1 0 000-1.664L9.555 7.168z" clipRule="evenodd" />
                                                      </svg>
                                                  )}
                                              </button>
                                          </div>

                                          {/* Listener badge */}
                                          <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md flex items-center gap-1.5 tracking-wider">
                                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                              {120 + index * 42} Listening
                                          </span>
                                      </div>

                                      {/* Info */}
                                      <div>
                                          <div className="flex items-center gap-2 mb-2">
                                              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md">{st.genre.split(',')[0]}</span>
                                              <span className="text-[9px] font-mono text-gray-500 font-bold">192KBPS AAC</span>
                                          </div>
                                          <h4 className="text-xl font-bold font-orbitron text-white leading-tight group-hover:text-cyan-400 transition-colors">{st.name}</h4>
                                          <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed font-medium">{st.description}</p>
                                      </div>

                                      {/* Action buttons */}
                                      <div className="flex gap-3 mt-6 border-t border-white/5 pt-4">
                                          <button 
                                              onClick={() => {
                                                  setQuickPlayStation(st);
                                                  setIsQuickPlaying(isCurrentQuick ? !isQuickPlaying : true);
                                              }}
                                              className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${isCurrentQuick && isQuickPlaying ? 'bg-purple-600 text-white border-purple-600' : 'bg-white/5 text-cyan-400 border-white/5 hover:bg-cyan-500/10'}`}
                                          >
                                              {isCurrentQuick && isQuickPlaying ? 'Pause Stream' : 'Instant Stream'}
                                          </button>
                                          <button 
                                              onClick={() => {
                                                  if (audioRef.current) {
                                                      audioRef.current.pause();
                                                      audioRef.current = null;
                                                  }
                                                  setIsQuickPlaying(false);
                                                  onInstantPlay(st);
                                              }}
                                              className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] font-black"
                                              title="Enter Immersive Mode"
                                          >
                                              Enter App &rarr;
                                          </button>
                                      </div>
                                  </div>
                              );
                          })}
                      </div>
                  );
              })()}
          </div>
      </section>

      {/* FEATURE SHOWCASE */}
      <section id="features" className="bg-[#030712] relative z-20">
          <FeatureSection 
            id="feat-visual"
            title="High-Fi Player"
            description="Our custom audio engine delivers lossless-quality streaming with a stunning 3D visualizer. Experience radio as it was meant to be seen."
            icon={<HighFiIcon className="w-8 h-8"/>}
            align="left"
            color="cyan"
            features={[' Lossless Audio Support', 'Interactive 3D Visualizer', 'Picture-in-Picture Mode']}
            demoNode={
                <div className="w-full max-w-lg mx-auto bg-gray-950 border border-cyan-500/20 rounded-3xl p-6 shadow-2xl shadow-cyan-900/10 text-left relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-bl-full pointer-events-none"></div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl flex items-center justify-center font-black font-orbitron text-lg shadow-inner">
                            HiFi
                        </div>
                        <div>
                            <h4 className="text-white font-bold font-orbitron tracking-tight text-lg">Interactive 3D Visualizer</h4>
                            <p className="text-gray-500 text-xs font-medium">Click play to test-drive our WebGL frequency visualizer</p>
                        </div>
                    </div>

                    {/* Animated visualizer bars */}
                    <div className="bg-black/80 border border-white/5 rounded-2xl p-6 aspect-video flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400">SPECTRUM_ANALYSIS_OK</span>
                        </div>

                        {/* Frequency lines */}
                        <div className="flex items-end justify-center gap-1.5 h-32 mt-4">
                            {[24, 45, 68, 35, 82, 53, 90, 71, 58, 32, 60, 48, 85, 95, 62, 38, 50, 28].map((val, i) => (
                                <div 
                                    key={i} 
                                    style={{
                                        height: isPlayingHiFiDemo ? `${val}%` : '6px',
                                        transition: 'height 0.15s ease-in-out',
                                        animationDelay: `${i * 0.05}s`
                                    }}
                                    className={`w-1.5 rounded-full bg-gradient-to-t from-cyan-600 via-cyan-400 to-white shadow-[0_0_8px_rgba(6,182,212,0.4)] ${isPlayingHiFiDemo ? 'animate-[pulse_0.7s_ease-in-out_infinite_alternate]' : ''}`}
                                />
                            ))}
                        </div>

                        <div className="flex items-center justify-between border-t border-white/5 pt-4">
                            <span className="text-[9px] font-mono text-gray-500 font-bold uppercase tracking-wider">Codec: Lossless FLAC 1411kbps</span>
                            <button 
                                onClick={() => setIsPlayingHiFiDemo(!isPlayingHiFiDemo)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 border ${isPlayingHiFiDemo ? 'bg-cyan-500 text-black border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'bg-white/5 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/10'}`}
                            >
                                {isPlayingHiFiDemo ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <span>Pause Demo</span>
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 fill-current" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8.006v3.988a1 1 0 001.555.832l3.197-2.005a1 1 0 000-1.664L9.555 7.168z" clipRule="evenodd" />
                                        </svg>
                                        <span>Animate spectrum</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            }
          />
          
          <FeatureSection 
            id="feat-ai"
            title="AI Curation"
            description="Powered by Gemini AI, Music Station Radio provides real-time lyric translation and deep contextual info for every track on the network."
            icon={<AIIcon className="w-8 h-8"/>}
            align="right"
            color="purple"
            features={['Live Lyric Translation', 'Artist Contextual Intelligence', 'Vibe-Based Discovery']}
            demoNode={
                <div className="w-full max-w-lg mx-auto bg-gray-950 border border-purple-500/20 rounded-3xl p-6 shadow-2xl shadow-purple-900/10 text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-full pointer-events-none"></div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center font-black font-orbitron text-lg shadow-inner">
                            AI
                        </div>
                        <div>
                            <h4 className="text-white font-bold font-orbitron tracking-tight text-lg">Live Translation & Curation</h4>
                            <p className="text-gray-500 text-xs font-medium">Experience real-time stream translation and contextual analysis</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Lyric Display Glass Card */}
                        <div className="bg-black/80 border border-white/5 rounded-2xl p-5 relative">
                            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                                <span className="text-[10px] font-mono font-bold tracking-widest text-purple-400 uppercase">Live Translating Feed</span>
                                <div className="flex bg-white/5 p-1 rounded-lg border border-white/5">
                                    <button 
                                        onClick={() => setDemoLyricLang('original')}
                                        className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider transition-all ${demoLyricLang === 'original' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        Original
                                    </button>
                                    <button 
                                        onClick={() => setDemoLyricLang('english')}
                                        className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider transition-all ${demoLyricLang === 'english' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        English
                                    </button>
                                </div>
                            </div>

                            <p className="font-orbitron font-bold text-white text-sm tracking-tight leading-relaxed transition-all">
                                {demoLyricLang === 'original' ? '♪ Emancipate yourselves from mental slavery ♪' : '♪ Free yourselves from the chains of mental slavery ♪'}
                            </p>
                            <p className="font-orbitron text-gray-500 text-xs mt-1 leading-relaxed transition-all">
                                {demoLyricLang === 'original' ? '♪ None but ourselves can free our minds ♪' : '♪ Only we ourselves are capable of freeing our minds ♪'}
                            </p>
                        </div>

                        {/* Ask Gemini Context box */}
                        <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[9px] font-mono text-gray-500 font-bold uppercase tracking-wider">Ask Gemini contextual intelligence</span>
                                <button 
                                    onClick={() => {
                                        if (demoGeminiStatus === 'idle') {
                                            setDemoGeminiStatus('asking');
                                            setTimeout(() => {
                                                setDemoGeminiStatus('done');
                                                setDemoGeminiResponse("This legendary lyric comes from 'Redemption Song' by Bob Marley (1980). It was inspired by a 1937 speech given by Pan-Africanist Marcus Garvey in Nova Scotia, urging spiritual independence.");
                                            }, 1500);
                                        } else {
                                            setDemoGeminiStatus('idle');
                                            setDemoGeminiResponse('');
                                        }
                                    }}
                                    className="px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all"
                                >
                                    {demoGeminiStatus === 'idle' ? 'Analyze Track' : 'Reset AI'}
                                </button>
                            </div>

                            {demoGeminiStatus === 'asking' && (
                                <div className="flex items-center gap-2 py-2">
                                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                    <span className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-wider ml-1">Gemini is analyzing...</span>
                                </div>
                            )}

                            {demoGeminiStatus === 'done' && (
                                <p className="text-xs text-gray-300 leading-relaxed font-medium animate-fade-in-up">
                                    {demoGeminiResponse}
                                </p>
                            )}

                            {demoGeminiStatus === 'idle' && (
                                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                    Click analyze above to query Gemini about the active track's deep cultural and historical origins.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            }
          />

          <FeatureSection 
            id="feat-cards"
            title="Holographic Cards"
            description="Tune in to stations to unlock shiny virtual cards. Experience 3D parallax angles and trade them with peers in the live Trading Post terminal!"
            icon={<CardCollectorIcon className="w-8 h-8"/>}
            align="left"
            color="yellow"
            features={['Interactive 3D Metallic Shine', 'Live P2P Trading Post Terminal', 'Score & Passive Multiplier Boosts']}
            demoNode={
                <div className="w-full max-w-lg mx-auto bg-transparent perspective-1000">
                    <div 
                        onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
                            const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
                            setCardTilt({ x: x * 30, y: -y * 30 });
                        }}
                        onMouseLeave={() => setCardTilt({ x: 0, y: 0 })}
                        style={{
                            transform: `rotateY(${cardTilt.x}deg) rotateX(${cardTilt.y}deg)`,
                            transformStyle: 'preserve-3d',
                            transition: cardTilt.x === 0 ? 'transform 0.5s ease-out' : 'none'
                        }}
                        className="relative w-72 aspect-[3/4.2] mx-auto bg-gradient-to-br from-gray-900 to-black border border-yellow-500/30 rounded-3xl p-6 shadow-2xl shadow-yellow-900/10 flex flex-col justify-between overflow-hidden cursor-pointer group"
                    >
                        {/* Metallic shining hologram overlay */}
                        <div 
                            style={{
                                background: `radial-gradient(circle at ${50 + cardTilt.x * 2}% ${50 - cardTilt.y * 2}%, rgba(250, 204, 21, 0.15) 0%, transparent 60%)`,
                                mixBlendMode: 'color-dodge'
                            }}
                            className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-3xl"
                        />

                        {/* Top card metadata */}
                        <div className="flex items-center justify-between" style={{ transform: 'translateZ(20px)' }}>
                            <span className="text-[10px] font-black text-yellow-400 bg-yellow-500/10 px-2.5 py-1 border border-yellow-500/20 rounded-md tracking-wider uppercase">LEGENDARY STATION</span>
                            <span className="text-[10px] font-mono text-gray-500 font-bold">#001</span>
                        </div>

                        {/* Centered beautiful high-fi visualizer art */}
                        <div className="relative flex-1 my-5 bg-gradient-to-b from-gray-950 to-gray-900 border border-white/5 rounded-2xl overflow-hidden flex items-center justify-center p-4 shadow-inner" style={{ transform: 'translateZ(30px)' }}>
                            <div className="absolute inset-0 bg-cover bg-center opacity-20 filter grayscale blur-sm" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1484876065684-b683cf17d276?w=600&auto=format&fit=crop&q=60)` }} />
                            <div className="relative w-28 h-28 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center text-black font-black text-4xl shadow-2xl shadow-yellow-900/30 font-orbitron tracking-tighter hover:scale-105 transition-transform">
                                HGR
                            </div>
                        </div>

                        {/* Card footer details */}
                        <div style={{ transform: 'translateZ(15px)' }} className="text-left">
                            <h4 className="text-lg font-black font-orbitron text-white leading-tight uppercase">High Grade Radio</h4>
                            <div className="flex items-center justify-between mt-2 text-[9px] font-mono text-gray-500 font-bold">
                                <span>Rarity: 0.12% Drop</span>
                                <span className="text-yellow-400 uppercase tracking-widest font-black">Score Boost: +2.5x</span>
                            </div>
                        </div>
                    </div>
                </div>
            }
          />
      </section>

      {/* ROLE SELECTION */}
      <section id="roles" className="py-40 px-4 relative overflow-hidden bg-black">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(6,182,212,0.05),_transparent)] pointer-events-none"></div>
         <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center mb-24">
                <h2 className="text-5xl md:text-7xl font-black font-orbitron mb-8 tracking-tighter uppercase text-white">Join the Network</h2>
                <p className="text-gray-500 max-w-xl mx-auto text-xl font-medium">Find your role in the world's most advanced digital radio ecosystem.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {roles.map((role) => (
                    <div key={role.id} className="group relative p-10 rounded-3xl bg-gray-900 border border-white/5 hover:border-cyan-500/30 transition-all duration-500 hover:-translate-y-4 shadow-2xl">
                        <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-10 rounded-bl-full transition-opacity duration-700`}></div>
                        
                        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center text-black shadow-xl mb-10 group-hover:scale-110 transition-transform duration-700`}>
                            {role.icon}
                        </div>
                        
                        <h3 className="text-3xl font-black text-white mb-4 font-orbitron tracking-tight">{role.title}</h3>
                        <p className="text-gray-400 mb-10 leading-relaxed font-medium">{role.desc}</p>
                        
                        <button onClick={onEnter} className="flex items-center gap-3 text-sm font-black text-white tracking-widest group-hover:gap-6 transition-all uppercase">
                            Get Started <span className="text-cyan-500">&rarr;</span>
                        </button>
                    </div>
                ))}
            </div>
         </div>
      </section>

      {/* SUBTLE SEO BLOG SECTION */}
      <section id="blog" className="py-24 px-4 bg-[#030712] relative z-20 border-t border-white/5">
         <div className="container mx-auto max-w-6xl relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                <div>
                    <h2 className="text-4xl md:text-5xl font-black font-orbitron tracking-tight text-white uppercase mb-4">Broadcast Journal</h2>
                    <p className="text-gray-400 max-w-xl text-sm font-medium">Subtle insights, trends, and tutorials on the future of independent digital broadcasting.</p>
                </div>
                
                {/* CATEGORY FILTERS */}
                <div className="flex flex-wrap gap-2 mt-6 md:mt-0">
                    {['All', 'Broadcasting', 'AI Tech', 'Audio Tech', 'Artist Guides', 'Culture'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => { setSelectedCategory(cat); setVisibleCount(3); }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                                selectedCategory === cat
                                    ? 'bg-cyan-500 text-black border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                                    : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/10 hover:text-white'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* BLOG GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {filteredPosts.slice(0, visibleCount).map((post) => (
                    <article 
                        key={post.id} 
                        onClick={() => setActivePost(post)}
                        className="group bg-gray-900/40 backdrop-blur-md rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col h-full"
                    >
                        <div className="relative aspect-video w-full overflow-hidden bg-gray-950">
                            <img 
                                src={post.coverImage} 
                                alt={post.title} 
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent opacity-80" />
                            <span className="absolute top-4 left-4 bg-cyan-500/10 backdrop-blur-md border border-cyan-500/30 text-cyan-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider">
                                {post.category}
                            </span>
                        </div>
                        
                        <div className="p-6 flex flex-col flex-1">
                            <div className="flex items-center gap-3 text-[10px] font-mono text-gray-500 mb-3">
                                <span>{post.date}</span>
                                <span className="w-1 h-1 bg-gray-700 rounded-full" />
                                <span>{post.readTime}</span>
                            </div>
                            
                            <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug mb-3">
                                {post.title}
                            </h3>
                            
                            <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed mb-6 font-medium">
                                {post.excerpt}
                            </p>
                            
                            <div className="mt-auto flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider group-hover:gap-3 transition-all">
                                    Read Article &rarr;
                                </div>
                                <button
                                    onClick={(e) => handleShare(e, post)}
                                    className="p-2 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 border border-white/5 hover:border-cyan-500/30 transition-all text-xs flex items-center gap-1.5 font-bold uppercase tracking-wider relative z-30"
                                    title="Share Article"
                                >
                                    {copiedPostId === post.id ? (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-[10px] text-cyan-400">Copied</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l4.062-2.031M8.684 13.258l4.062 2.031M14 11a3 3 0 11-6 0 3 3 0 016 0zm6-5a3 3 0 11-6 0 3 3 0 016 0zm0 10a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="text-[10px]">Share</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {/* LOAD MORE BUTTON */}
            {filteredPosts.length > visibleCount && (
                <div className="text-center mt-12">
                    <button 
                        onClick={() => setVisibleCount(prev => prev + 3)}
                        className="bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-xl border border-white/10 transition-all"
                    >
                        Load More Articles
                    </button>
                </div>
            )}
         </div>

         {/* ARTICLE MODAL POPUP */}
         {activePost && (
             <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-[200] flex items-center justify-center p-4 md:p-10" onClick={() => setActivePost(null)}>
                 <div className="bg-gray-950 border border-white/10 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative scrollbar-thin scrollbar-thumb-gray-800" onClick={(e) => e.stopPropagation()}>
                     
                     {/* Hero Image inside Modal */}
                     <div className="relative h-64 md:h-80 w-full overflow-hidden bg-gray-900">
                         <img 
                             src={activePost.coverImage} 
                             alt={activePost.title} 
                             referrerPolicy="no-referrer"
                             className="w-full h-full object-cover" 
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
                         
                         {/* Share Button in Modal Header */}
                         <button 
                             onClick={(e) => handleShare(e, activePost)}
                             className="absolute top-6 right-20 bg-black/60 backdrop-blur-md hover:bg-black text-white px-4 py-2.5 rounded-full transition-all border border-white/10 hover:scale-105 flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
                             title="Share Article"
                         >
                             {copiedPostId === activePost.id ? (
                                 <>
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                                         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                     </svg>
                                     <span className="text-cyan-400">Copied!</span>
                                 </>
                             ) : (
                                 <>
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                         <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l4.062-2.031M8.684 13.258l4.062 2.031M14 11a3 3 0 11-6 0 3 3 0 016 0zm6-5a3 3 0 11-6 0 3 3 0 016 0zm0 10a3 3 0 11-6 0 3 3 0 016 0z" />
                                     </svg>
                                     <span>Share</span>
                                 </>
                             )}
                         </button>

                         {/* Close Button */}
                         <button 
                             onClick={() => setActivePost(null)}
                             className="absolute top-6 right-6 bg-black/60 backdrop-blur-md hover:bg-black text-white p-3 rounded-full transition-all border border-white/10 hover:scale-105"
                             aria-label="Close"
                         >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                             </svg>
                         </button>

                         <div className="absolute bottom-6 left-6 md:left-8 right-6 md:right-8">
                             <span className="bg-cyan-500 text-black text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider">
                                 {activePost.category}
                             </span>
                             <h1 className="text-2xl md:text-4xl font-black font-orbitron text-white leading-tight mt-3">
                                 {activePost.title}
                             </h1>
                         </div>
                     </div>

                     {/* Article Metadata & Content */}
                     <div className="p-6 md:p-8">
                         <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-500 border-b border-white/5 pb-6 mb-6">
                             <div className="flex items-center gap-2">
                                 <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px]">{activePost.author[0]}</div>
                                 <span className="font-semibold text-gray-300">{activePost.author}</span>
                             </div>
                             <span className="hidden md:inline">|</span>
                             <span>Published: {activePost.date}</span>
                             <span className="hidden md:inline">|</span>
                             <span>{activePost.readTime}</span>
                         </div>

                         {/* Article Body */}
                         <div 
                             className="text-gray-300 text-sm md:text-base leading-relaxed space-y-6 font-medium prose prose-invert max-w-none"
                             dangerouslySetInnerHTML={{ __html: activePost.content }}
                         />

                         {/* Dynamic Station Cross-Promotion Widget */}
                         {(() => {
                             let recommendedStationsForArticle: typeof stations = [];
                             if (activePost.category === 'AI Tech' || activePost.category === 'Audio Tech') {
                                 recommendedStationsForArticle = stations.filter(s => s.name === 'High Grade Radio' || s.name === 'Global Groove Radio');
                             } else if (activePost.category === 'Broadcasting' || activePost.category === 'Culture') {
                                 recommendedStationsForArticle = stations.filter(s => s.name === 'Nam Radio' || s.name === 'Power Ace Radio');
                             } else {
                                 recommendedStationsForArticle = stations.filter(s => s.name === 'CRW Radio' || s.name === 'Pamtengo Radio');
                             }

                             if (recommendedStationsForArticle.length === 0) {
                                 recommendedStationsForArticle = stations.slice(0, 2);
                             }

                             return (
                                 <div className="mt-12 p-6 rounded-2xl bg-gray-900/60 border border-white/5 text-left">
                                     <span className="text-[10px] font-mono font-black tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-2.5 py-1 rounded-md">Live Station Spotlight</span>
                                     <h4 className="text-lg font-bold font-orbitron text-white mt-3 mb-1">Experience lossless-quality broadcast audio live</h4>
                                     <p className="text-xs text-gray-400 mb-6 font-medium">Enjoy premium high-fidelity audio, 3D visualizers, and interactive live reactions on our partner stations:</p>
                                     
                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                         {recommendedStationsForArticle.map(st => (
                                             <div key={st.streamUrl} className="flex items-center justify-between p-3.5 rounded-xl bg-black/40 border border-white/5 hover:border-cyan-500/30 transition-all group">
                                                 <div className="flex items-center gap-3">
                                                     <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 bg-gray-950">
                                                         <img src={st.coverArt} alt={st.name} className="w-full h-full object-cover" />
                                                     </div>
                                                     <div>
                                                         <h5 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors leading-tight">{st.name}</h5>
                                                         <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider font-bold">{st.genre.split(',')[0]}</span>
                                                     </div>
                                                 </div>
                                                 <button 
                                                     onClick={() => {
                                                         setActivePost(null);
                                                         setQuickPlayStation(st);
                                                         setIsQuickPlaying(true);
                                                         window.scrollTo({ top: 0, behavior: 'smooth' });
                                                     }}
                                                     className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-[10px] uppercase tracking-wider rounded-lg transition-all hover:shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                                                 >
                                                     Stream &rarr;
                                                 </button>
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                             );
                         })()}

                         {/* Creator Lead Magnet Card */}
                         <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-blue-950/40 border border-cyan-500/20 shadow-2xl relative overflow-hidden group text-left">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
                             <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                 <div className="max-w-xl">
                                     <span className="text-[10px] font-black tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-2.5 py-1 rounded-md">Creator Opportunity</span>
                                     <h4 className="text-xl font-bold font-orbitron text-white mt-3 mb-2">Claim Your Independent Station Today</h4>
                                     <p className="text-xs text-gray-400 leading-relaxed font-medium">Ready to broadcast your audio or curations in lossless quality? Establish your presence on our Global Premium Network, receive direct tips, and connect with 50,000+ active music lovers. Try the Director role free for 30 days.</p>
                                 </div>
                                 <button 
                                     onClick={() => { setActivePost(null); onEnter(); }} 
                                     className="bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-widest px-6 py-4 rounded-xl transition-all whitespace-nowrap self-start md:self-auto hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                                 >
                                     Get Started Now &rarr;
                                 </button>
                             </div>
                         </div>

                         {/* Smart Recommendations */}
                         {recommendations.length > 0 && (
                             <div className="mt-12 pt-8 border-t border-white/5 text-left">
                                 <h4 className="text-xs font-black font-orbitron text-gray-500 tracking-[0.2em] uppercase mb-6 text-gray-400">Related Reading</h4>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     {recommendations.map(rec => (
                                         <div 
                                             key={rec.id}
                                             onClick={() => {
                                                 setActivePost(rec);
                                                 const modalBody = document.querySelector('.max-h-\\[90vh\\]');
                                                 if (modalBody) modalBody.scrollTo({ top: 0, behavior: 'smooth' });
                                             }}
                                             className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/20 cursor-pointer transition-all duration-300 group"
                                         >
                                             <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-950">
                                                 <img src={rec.coverImage} alt={rec.title} referrerPolicy="no-referrer" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                                             </div>
                                             <div className="flex flex-col justify-center">
                                                 <span className="text-[9px] font-black tracking-wider text-cyan-400 uppercase mb-1">{rec.category}</span>
                                                 <h5 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2 leading-tight mb-1">{rec.title}</h5>
                                                 <span className="text-[10px] text-gray-500 font-medium">{rec.readTime}</span>
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                         )}

                         <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center">
                             <button
                                 onClick={(e) => handleShare(e, activePost)}
                                 className="px-5 py-3 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl transition-all border border-white/10 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                             >
                                 {copiedPostId === activePost.id ? (
                                     <>
                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                                             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                         </svg>
                                         <span className="text-cyan-400">Copied Link!</span>
                                     </>
                                 ) : (
                                     <>
                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                             <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l4.062-2.031M8.684 13.258l4.062 2.031M14 11a3 3 0 11-6 0 3 3 0 016 0zm6-5a3 3 0 11-6 0 3 3 0 016 0zm0 10a3 3 0 11-6 0 3 3 0 016 0z" />
                                         </svg>
                                         <span>Copy Share Link</span>
                                     </>
                                 )}
                             </button>

                             <button 
                                 onClick={() => setActivePost(null)}
                                 className="bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all hover:scale-105"
                             >
                                 Done Reading
                             </button>
                         </div>
                     </div>
                 </div>
             </div>
         )}
      </section>
      
      {/* MINIMAL FOOTER */}
      <footer className="bg-black text-center py-20 border-t border-white/5">
        <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center gap-6 mb-12">
               <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-black font-black text-2xl shadow-2xl shadow-cyan-900/20 font-orbitron">M</div>
               <span className="font-orbitron font-bold text-2xl tracking-[0.5em] text-white">MUSIC STATION RADIO</span>
            </div>
            <p className="text-[10px] text-gray-800 font-bold tracking-widest uppercase mb-4">
                Global Independent Broadcasting Platform
            </p>
            <p className="text-[10px] text-gray-900 font-bold tracking-widest uppercase">
                &copy; {new Date().getFullYear()} Music Station Radio. All Rights Reserved.
            </p>
        </div>
      </footer>

      <style>{`
        #landing-bg-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: repeat(4, 1fr);
            width: 100%;
            height: 100%;
        }
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-scroll {
            animation: scroll 80s linear infinite;
        }
        @keyframes scroll-reverse {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        .animate-scroll-reverse {
            animation: scroll-reverse 80s linear infinite;
        }
        .hover\\:pause:hover {
            animation-play-state: paused;
        }
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fade-in-left {
            from { opacity: 0; transform: translate(-20px, -50%); }
            to { opacity: 1; transform: translate(0, -50%); }
        }
        .animate-fade-in-left {
            animation: fade-in-left 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        html { scroll-behavior: smooth; }
        
        /* Prose style overrides for static SEO blog post rendering */
        .prose h2 {
            font-size: 1.5rem;
            font-weight: 800;
            color: #ffffff;
            margin-top: 1.75rem;
            margin-bottom: 0.75rem;
            font-family: 'Orbitron', sans-serif;
            letter-spacing: -0.025em;
        }
        .prose h3 {
            font-size: 1.25rem;
            font-weight: 700;
            color: #22d3ee;
            margin-top: 1.5rem;
            margin-bottom: 0.5rem;
            font-family: 'Orbitron', sans-serif;
        }
        .prose p {
            margin-bottom: 1.25rem;
            color: #9ca3af;
        }
        .prose ul {
            list-style-type: disc;
            padding-left: 1.5rem;
            margin-bottom: 1.25rem;
            color: #9ca3af;
        }
        .prose li {
            margin-bottom: 0.5rem;
        }
        .prose strong {
            color: #ffffff;
            font-weight: 700;
        }
      `}</style>
    </div>
  );
};