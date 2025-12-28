
import React, { useMemo, useState, useEffect } from 'react';
import { stations, TrophyIcon, MusicNoteIcon, BriefcaseIcon, UserIcon, ChatBubbleIcon, RocketIcon, StarIcon, ExploreIcon, UploadIcon, ClockIcon, DeviceIcon, HomeIcon } from '../constants';

interface LandingPageProps {
  onEnter: () => void;
}

// Custom Icons for High Grade Identity
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

const WorldIcon = ({className = "h-6 w-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582" />
    </svg>
);

const roles = [
    { id: 'listener', title: 'Curator', icon: <UserIcon className="w-8 h-8"/>, desc: "Tune in to premium selections and shape the global charts.", color: "from-yellow-400 to-amber-600" },
    { id: 'artist', title: 'Creator', icon: <MusicNoteIcon className="w-8 h-8"/>, desc: "Submit your high-grade tracks directly to the world's ears.", color: "from-orange-500 to-red-600" },
    { id: 'manager', title: 'Owner', icon: <BriefcaseIcon className="w-8 h-8"/>, desc: "Run your own station and command the soundwaves.", color: "from-gray-400 to-gray-700" },
];

const FeaturedStationCard: React.FC<{station: typeof stations[0], index: number}> = ({station, index}) => (
    <div 
      className="relative w-64 h-80 rounded-2xl p-5 flex flex-col justify-end text-white overflow-hidden transition-all duration-700 hover:scale-105 group ring-1 ring-white/5 hover:ring-yellow-500/40 bg-gray-900 shadow-2xl"
    >
        <img src={station.coverArt} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/60 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
        
        <div className="relative z-10 transform transition-all duration-500 group-hover:-translate-y-2">
            <div className="inline-block px-2.5 py-1 rounded-md bg-yellow-500/20 backdrop-blur-md text-[10px] font-black uppercase mb-3 border border-yellow-500/30 text-yellow-400 tracking-tighter">
                {station.genre.split(',')[0]}
            </div>
            <h4 className="font-bold text-2xl leading-tight mb-2 shadow-black drop-shadow-lg font-orbitron">{station.name}</h4>
            <p className="text-xs text-gray-400 line-clamp-2 font-medium">{station.description}</p>
        </div>
        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <ExploreIcon className="w-4 h-4 text-yellow-500" />
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
}> = ({ id, title, description, icon, align = 'left', features, color }) => (
    <div id={id} className="py-24 container mx-auto px-4">
        <div className={`flex flex-col lg:flex-row items-center gap-16 ${align === 'right' ? 'lg:flex-row-reverse' : ''}`}>
            <div className="flex-1 space-y-8">
                <div className={`inline-flex p-4 rounded-2xl bg-${color}-500/10 text-${color}-400 border border-${color}-500/20 shadow-xl shadow-${color}-900/10 animate-pulse`}>
                    {icon}
                </div>
                <h2 className="text-4xl md:text-6xl font-black font-orbitron leading-none tracking-tighter text-white">
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
            <div className="flex-1 w-full perspective-1000">
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
        </div>
    </div>
);

const NavItem: React.FC<{ icon: React.ReactNode; label: string; href: string; active: boolean }> = ({ icon, label, href, active }) => (
    <a 
        href={href} 
        className={`group relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${active ? 'bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.4)]' : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-white'}`}
    >
        {icon}
        <span className="absolute left-20 px-3 py-1.5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10 shadow-2xl whitespace-nowrap z-50">
            {label}
        </span>
    </a>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
    const backgroundStations = useMemo(() => [...stations].sort(() => 0.5 - Math.random()).slice(0, 16), []);
    const [activeSection, setActiveSection] = useState('hero');

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
    <div className="min-h-screen bg-[#030712] text-white font-poppins selection:bg-yellow-500 selection:text-black overflow-x-hidden">
      
      {/* LEFT NAVIGATION MENU */}
      <nav className="fixed left-6 top-1/2 -translate-y-1/2 z-[100] hidden xl:flex flex-col gap-4 animate-fade-in-left">
          <div className="flex flex-col gap-4 p-2 bg-black/40 backdrop-blur-2xl rounded-[2rem] border border-white/5 shadow-2xl">
              <NavItem icon={<HomeIcon className="w-6 h-6"/>} label="Home" href="#hero" active={activeSection === 'hero'} />
              <NavItem icon={<MusicNoteIcon className="w-6 h-6"/>} label="Signature" href="#signature" active={activeSection === 'signature'} />
              <NavItem icon={<HighFiIcon className="w-6 h-6"/>} label="Features" href="#features" active={activeSection === 'features'} />
              <NavItem icon={<UserGroupIcon className="w-6 h-6"/>} label="Join" href="#roles" active={activeSection === 'roles'} />
              <NavItem icon={<RocketIcon className="w-6 h-6"/>} label="Upgrade" href="#upgrade" active={activeSection === 'upgrade'} />
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-900/10 via-transparent to-transparent opacity-60"></div>

        <div className="relative z-10 container mx-auto px-4 text-center flex flex-col items-center animate-fade-in-up">
             <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-yellow-500 text-[10px] font-black tracking-[0.2em] mb-10 shadow-[0_0_40px_rgba(234,179,8,0.15)] uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                </span>
                High Grade Audio Culture
             </div>

             <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black font-orbitron tracking-tighter leading-none mb-4 text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                HIGH GRADE
             </h1>
             <p className="text-3xl md:text-5xl font-light text-yellow-500 font-orbitron tracking-[0.4em] uppercase mb-12 drop-shadow-[0_0_20px_rgba(234,179,8,0.4)]">
                 RADIO
             </p>
             
             <p className="text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-16 font-medium">
                The pinnacle of independent broadcasting. High-fidelity streams, global community, and AI-driven curation for the modern audiophile.
             </p>

             <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg mx-auto">
                 <button 
                    onClick={onEnter}
                    className="flex-1 bg-yellow-500 text-black font-black text-xl py-5 rounded-2xl hover:bg-yellow-400 transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(234,179,8,0.4)] flex items-center justify-center gap-3 group"
                 >
                     <ExploreIcon className="w-6 h-6 transform group-hover:rotate-12 transition-transform" />
                     Tune In Now
                 </button>
                 <button 
                    onClick={onEnter}
                    className="flex-1 bg-white/5 text-white font-bold text-xl py-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all backdrop-blur-md flex items-center justify-center gap-3"
                 >
                     <RocketIcon className="w-6 h-6 text-gray-400" />
                     Enter App
                 </button>
             </div>
        </div>

        {/* Status Ticker - Premium Edition */}
        <div className="absolute bottom-0 left-0 right-0 h-14 bg-black/60 backdrop-blur-2xl border-t border-white/5 flex items-center overflow-hidden z-20">
            <div className="animate-scroll flex items-center gap-20 px-8 whitespace-nowrap text-xs font-black tracking-widest text-gray-500 uppercase">
                {[...Array(6)].map((_, i) => (
                    <React.Fragment key={i}>
                        <span className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(234,179,8,1)]"></span> LIVE LISTENERS: 12.4K</span>
                        <span className="flex items-center gap-3"><HighFiIcon className="w-4 h-4 text-cyan-400"/> PREMIUM BITRATE ACTIVE</span>
                        <span className="flex items-center gap-3"><StarIcon className="w-4 h-4 text-yellow-400"/> XP MULTIPLIER: 2.0X</span>
                        <span className="flex items-center gap-3"><ChatBubbleIcon className="w-4 h-4 text-purple-400"/> 42 ACTIVE LOUNGES</span>
                    </React.Fragment>
                ))}
            </div>
        </div>
      </header>

      {/* HORIZONTAL STATION STRIP */}
      <section id="signature" className="bg-black py-24 relative z-20 overflow-hidden border-b border-white/5">
          <div className="container mx-auto px-4 mb-12 flex items-center justify-between">
              <h3 className="text-xs font-black font-orbitron text-gray-500 tracking-[0.3em] uppercase">Signature Sounds</h3>
              <div className="h-[1px] flex-1 bg-white/10 ml-8"></div>
          </div>
          <div className="flex gap-8 animate-scroll group cursor-grab active:cursor-grabbing hover:pause px-8">
              {[...stations, ...stations].map((station, index) => (
                  <div key={`${station.streamUrl}-${index}`} className="flex-shrink-0">
                      <FeaturedStationCard station={station} index={index} />
                  </div>
              ))}
          </div>
      </section>

      {/* FEATURE SHOWCASE */}
      <section id="features" className="bg-[#030712] relative z-20">
          <FeatureSection 
            id="feat-visual"
            title="Premium Visualizer"
            description="Experience sound in 3D. Our WebGL-powered visualizer engine renders your music in real-time with stunning accuracy and high-fidelity aesthetics."
            icon={<HighFiIcon className="w-8 h-8"/>}
            align="left"
            color="cyan"
            features={['3D Tunnel & Landscape Modes', 'Dynamic Color Sampling', 'PiP (Picture-in-Picture) Support']}
          />
          
          <FeatureSection 
            id="feat-ai"
            title="AI Integration"
            description="High Grade Radio uses Gemini AI to bridge cultures. Translate lyrics instantly, learn song history, and discover new vibes through our intuitive 'AI Search'."
            icon={<AIIcon className="w-8 h-8"/>}
            align="right"
            color="purple"
            features={['Multilingual Translation', 'Contextual Song Intel', 'Vibe-Based Station Search']}
          />

          <FeatureSection 
            id="feat-market"
            title="Global Market"
            description="The first-of-its-kind station stock market. Invest your points in the sounds you love and watch your portfolio grow as stations gain listeners."
            icon={<TrophyIcon className="w-8 h-8"/>}
            align="left"
            color="yellow"
            features={['Real-time Trading Desk', 'Listener-Driven Valuation', 'Exclusive Reward Drops']}
          />
      </section>

      {/* ROLE SELECTION - CARDS */}
      <section id="roles" className="py-40 px-4 relative overflow-hidden bg-black">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(234,179,8,0.05),_transparent)] pointer-events-none"></div>
         <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center mb-24">
                <h2 className="text-5xl md:text-7xl font-black font-orbitron mb-8 tracking-tighter">JOIN THE SOUND</h2>
                <p className="text-gray-500 max-w-xl mx-auto text-xl font-medium">Choose your role in the High Grade ecosystem.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {roles.map((role) => (
                    <div key={role.id} className="group relative p-10 rounded-3xl bg-gray-900 border border-white/5 hover:border-yellow-500/30 transition-all duration-500 hover:-translate-y-4 shadow-2xl">
                        <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-10 rounded-bl-full transition-opacity duration-700`}></div>
                        
                        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center text-black shadow-xl mb-10 group-hover:scale-110 transition-transform duration-700`}>
                            {role.icon}
                        </div>
                        
                        <h3 className="text-3xl font-black text-white mb-4 font-orbitron tracking-tight">{role.title}</h3>
                        <p className="text-gray-400 mb-10 leading-relaxed font-medium">{role.desc}</p>
                        
                        <button onClick={onEnter} className="flex items-center gap-3 text-sm font-black text-white tracking-widest group-hover:gap-6 transition-all uppercase">
                            Get Involved <span className="text-yellow-500">&rarr;</span>
                        </button>
                    </div>
                ))}
            </div>
         </div>
      </section>
      
      {/* FINAL CTA */}
      <section id="upgrade" className="py-32 px-4 bg-[#030712]">
          <div className="container mx-auto max-w-5xl bg-gradient-to-br from-gray-900 to-black rounded-[3rem] border border-white/5 p-12 md:p-20 flex flex-col items-center text-center gap-12 relative overflow-hidden shadow-[0_20px_100px_rgba(0,0,0,0.8)]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600 opacity-50"></div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
              
              <div className="relative z-10 space-y-4">
                  <h2 className="text-4xl md:text-6xl font-black font-orbitron text-white tracking-tight">UPGRADE YOUR SOUND</h2>
                  <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">Install the High Grade Radio web app for low-latency streaming and offline control.</p>
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row gap-6">
                   <button onClick={onEnter} className="px-12 py-5 bg-white text-black font-black rounded-2xl hover:bg-yellow-50 transition-all shadow-2xl flex items-center justify-center gap-4 text-lg hover:scale-105">
                       <ExploreIcon className="w-7 h-7"/>
                       LAUNCH PLAYER
                   </button>
                   <div className="flex gap-4 items-center">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10" title="Cross-Platform Ready">
                            <DeviceIcon className="w-8 h-8 text-yellow-500"/>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10" title="Low Latency Stream">
                            <HighFiIcon className="w-8 h-8 text-cyan-400"/>
                        </div>
                   </div>
              </div>
          </div>
      </section>

      {/* MINIMAL FOOTER */}
      <footer className="bg-black text-center py-20 border-t border-white/5">
        <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center gap-6 mb-12">
               <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center text-black font-black text-2xl shadow-2xl shadow-yellow-900/20 font-orbitron">H</div>
               <span className="font-orbitron font-bold text-2xl tracking-[0.5em] text-white">HIGH GRADE</span>
            </div>
            <div className="flex flex-wrap justify-center gap-10 mb-12 text-xs font-black tracking-widest text-gray-600 uppercase">
                <button onClick={onEnter} className="hover:text-yellow-500 transition-colors">Stations</button>
                <button onClick={onEnter} className="hover:text-yellow-500 transition-colors">Charts</button>
                <button onClick={onEnter} className="hover:text-yellow-500 transition-colors">Creators</button>
                <button onClick={onEnter} className="hover:text-yellow-500 transition-colors">Market</button>
                <button onClick={onEnter} className="hover:text-yellow-500 transition-colors">Help</button>
            </div>
            <p className="text-[10px] text-gray-800 font-bold tracking-widest uppercase">
                &copy; {new Date().getFullYear()} High Grade Audio Syndicate. All Rights Reserved.
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
        #landing-bg-grid > div {
            animation: bg-pulse 10s ease-in-out infinite alternate;
        }
        .text-shadow-glow {
            text-shadow: 0 0 30px rgba(234,179,8,0.5);
        }

        @keyframes bg-pulse {
            0% { opacity: 0.05; transform: scale(1); }
            100% { opacity: 0.2; transform: scale(1.05); }
        }

        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-scroll {
            animation: scroll 80s linear infinite;
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

        .perspective-1000 { perspective: 1000px; }
        .rotate-y-6 { transform: rotateY(6deg); }
        .rotate-x-2 { transform: rotateX(2deg); }
        
        html {
            scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};
