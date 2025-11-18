
import React, { useMemo } from 'react';
import { stations, TrophyIcon, MusicNoteIcon, BriefcaseIcon, UserIcon, ChatBubbleIcon, RocketIcon, StarIcon, ExploreIcon, UploadIcon, ClockIcon } from '../constants';

interface LandingPageProps {
  onEnter: () => void;
}

// Custom Icons
const AIIcon = ({className = "h-6 w-6"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.5 1.591L5.25 15.25v5.25a2.25 2.25 0 002.25 2.25h3a2.25 2.25 0 002.25-2.25v-5.25l-3.9-4.841a2.25 2.25 0 01-.5-1.591V3.104a2.25 2.25 0 00-2.25-2.25h-3a2.25 2.25 0 00-2.25 2.25z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9.75v5.714a2.25 2.25 0 01-.5 1.591l-3.9 4.841v5.25a2.25 2.25 0 002.25 2.25h3a2.25 2.25 0 002.25-2.25v-5.25l-3.9-4.841a2.25 2.25 0 01-.5-1.591V9.75a2.25 2.25 0 00-2.25-2.25h-3a2.25 2.25 0 00-2.25 2.25z" /></svg>;
const WorldIcon = ({className = "h-6 w-6"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>;
const VisualizerIcon = ({className = "h-6 w-6"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /></svg>;
const DeviceIcon = ({className = "h-6 w-6"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>;


const roles = [
    { id: 'listener', title: 'Listener', icon: <UserIcon className="w-8 h-8"/>, desc: "Tune in, chat, and level up.", color: "from-cyan-500 to-blue-600" },
    { id: 'artist', title: 'Artist', icon: <MusicNoteIcon className="w-8 h-8"/>, desc: "Submit tracks & get heard.", color: "from-purple-500 to-pink-600" },
    { id: 'manager', title: 'Manager', icon: <BriefcaseIcon className="w-8 h-8"/>, desc: "Curate & grow your station.", color: "from-orange-500 to-red-600" },
];

const FeaturedStationCard: React.FC<{station: typeof stations[0], index: number}> = ({station, index}) => (
    <div 
      className="relative w-64 h-80 rounded-2xl p-4 flex flex-col justify-end text-white overflow-hidden transition-all duration-500 hover:scale-105 group ring-1 ring-white/10 hover:ring-[var(--accent-color)]/50"
    >
        <img src={station.coverArt} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
        
        <div className="relative z-10 transform transition-transform duration-300 group-hover:-translate-y-2">
            <div className="inline-block px-2 py-1 rounded-md bg-white/10 backdrop-blur-md text-[10px] font-bold uppercase mb-2 border border-white/10 text-cyan-300">
                {station.genre.split('/')[0]}
            </div>
            <h4 className="font-bold text-xl leading-tight mb-1 shadow-black drop-shadow-lg">{station.name}</h4>
            <p className="text-xs text-gray-300 line-clamp-2">{station.description}</p>
        </div>
    </div>
);

const FeatureSection: React.FC<{
    title: string;
    description: string;
    icon: React.ReactNode;
    image?: string;
    align?: 'left' | 'right';
    features: string[];
    color: string;
}> = ({ title, description, icon, align = 'left', features, color }) => (
    <div className="py-20 container mx-auto px-4">
        <div className={`flex flex-col lg:flex-row items-center gap-12 ${align === 'right' ? 'lg:flex-row-reverse' : ''}`}>
            <div className="flex-1 space-y-6">
                <div className={`inline-flex p-3 rounded-2xl bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`}>
                    {icon}
                </div>
                <h2 className="text-3xl md:text-5xl font-bold font-orbitron leading-tight">
                    {title}
                </h2>
                <p className="text-lg text-gray-400 leading-relaxed">
                    {description}
                </p>
                <ul className="space-y-3">
                    {features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-300">
                            <div className={`w-1.5 h-1.5 rounded-full bg-${color}-400 shadow-[0_0_8px_rgba(0,0,0,1)] shadow-${color}-400`}></div>
                            {feat}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex-1 w-full">
                 <div className={`relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-gray-900/50 shadow-2xl shadow-${color}-900/20 group`}>
                    {/* Abstract UI Representation */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-950 opacity-50"></div>
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-${color}-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700`}></div>
                    <div className="relative z-10 h-full flex items-center justify-center">
                         <span className={`font-orbitron text-6xl font-bold text-${color}-500/20 group-hover:text-${color}-500/40 transition-colors select-none`}>
                             {title.split(' ')[0].toUpperCase()}
                         </span>
                    </div>
                 </div>
            </div>
        </div>
    </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
    const backgroundStations = useMemo(() => stations.sort(() => 0.5 - Math.random()).slice(0, 16), []);

  return (
    <div className="min-h-screen bg-[#030712] text-white font-poppins selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      
      {/* HERO SECTION */}
      <header className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0" id="landing-bg-grid">
            {backgroundStations.map((station, i) => (
                <div key={i} className="bg-cover bg-center opacity-20 grayscale mix-blend-overlay transition-all duration-[3s]" style={{ backgroundImage: `url(${station.coverArt})` }}></div>
            ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030712]/80 to-[#030712]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent"></div>

        <div className="relative z-10 container mx-auto px-4 text-center flex flex-col items-center animate-fade-in-up">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-cyan-300 text-xs font-bold mb-8 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                LIVE RADIO • REIMAGINED
             </div>

             <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold font-orbitron tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 mb-6 drop-shadow-2xl">
                MUSIC STATION
             </h1>
             <p className="text-2xl md:text-4xl font-light text-cyan-500 font-orbitron tracking-widest uppercase mb-8 text-shadow-glow">
                 RADIO
             </p>
             
             <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12">
                 The next-generation web player. Stream thousands of global stations, connect with fans in real-time, and experience music with AI intelligence.
             </p>

             <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
                 <button 
                    onClick={onEnter}
                    className="flex-1 bg-white text-black font-bold text-lg py-4 rounded-full hover:bg-cyan-50 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2"
                 >
                     <ExploreIcon className="w-6 h-6" />
                     Start Listening
                 </button>
                 <button 
                    onClick={onEnter}
                    className="flex-1 bg-white/5 text-white font-bold text-lg py-4 rounded-full border border-white/10 hover:bg-white/10 transition-all backdrop-blur-sm flex items-center justify-center gap-2"
                 >
                     <RocketIcon className="w-6 h-6 text-gray-400" />
                     Join Community
                 </button>
             </div>
        </div>

        {/* Bottom Stats Ticker */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white/5 backdrop-blur-md border-t border-white/10 flex items-center overflow-hidden">
            <div className="animate-scroll flex items-center gap-12 px-4 whitespace-nowrap text-sm font-mono text-cyan-400/80">
                {[...Array(4)].map((_, i) => (
                    <React.Fragment key={i}>
                        <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> 12,403 Listeners Online</span>
                        <span className="flex items-center gap-2"><MusicNoteIcon className="w-4 h-4"/> 584 Tracks Playing Now</span>
                        <span className="flex items-center gap-2"><StarIcon className="w-4 h-4"/> 1.2M Points Earned Today</span>
                        <span className="flex items-center gap-2"><ChatBubbleIcon className="w-4 h-4"/> 89 Active Parties</span>
                    </React.Fragment>
                ))}
            </div>
        </div>
      </header>

      {/* STATION TICKER */}
      <section className="bg-black py-16 border-b border-white/5 relative z-20">
          <div className="container mx-auto px-4 mb-8 flex items-center justify-between">
              <h3 className="text-sm font-orbitron text-gray-500 tracking-widest uppercase">Trending Now</h3>
              <div className="h-px flex-1 bg-gray-800 ml-6"></div>
          </div>
          <div className="w-full group cursor-grab active:cursor-grabbing">
              <div className="flex gap-6 animate-scroll group-hover:pause px-4">
                  {[...stations, ...stations].map((station, index) => (
                      <div key={`${station.streamUrl}-${index}`} className="flex-shrink-0">
                          <FeaturedStationCard station={station} index={index} />
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* FEATURE DEEP DIVES */}
      <section className="bg-[#030712] relative z-20">
          <FeatureSection 
            title="AI-Powered Immersion"
            description="Gemini AI transforms your listening experience. Get instant lyric translations, behind-the-scenes song facts, and intelligent 'Vibe Search' recommendations that understand exactly what you want to hear."
            icon={<AIIcon className="w-8 h-8"/>}
            align="left"
            color="purple"
            features={['Real-time Lyrics & Translation', 'Contextual Song Facts', 'Natural Language Station Search']}
          />
          
          <FeatureSection 
            title="Social & Competitive"
            description="Music is better together. Join live listening parties, chat in genre-specific rooms, and climb the global leaderboards. Earn XP for every minute you listen and unlock exclusive themes."
            icon={<TrophyIcon className="w-8 h-8"/>}
            align="right"
            color="yellow"
            features={['Global Leaderboards & XP', 'Live Chat Rooms', 'Station Raids & Parties']}
          />

          <FeatureSection 
            title="Tools for Creators"
            description="Whether you're an artist looking for airplay or a curator wanting to manage a station, we have the tools for you. Submit tracks directly to station managers and track your performance."
            icon={<BriefcaseIcon className="w-8 h-8"/>}
            align="left"
            color="cyan"
            features={['Direct Music Submissions', 'Station Management Dashboard', 'Detailed Analytics']}
          />
      </section>

      {/* ROLES GRID */}
      <section className="py-32 px-4 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-gray-900 to-[#030712]"></div>
         <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-bold font-orbitron mb-6">Find Your Place</h2>
                <p className="text-gray-400 max-w-xl mx-auto text-lg">A complete ecosystem for every music lover.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {roles.map((role) => (
                    <div key={role.id} className="group relative p-8 rounded-3xl bg-gray-900/50 border border-white/5 hover:bg-gray-800/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${role.color} opacity-10 rounded-bl-full transition-opacity group-hover:opacity-20`}></div>
                        
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center text-white shadow-lg mb-8 group-hover:scale-110 transition-transform duration-500`}>
                            {role.icon}
                        </div>
                        
                        <h3 className="text-2xl font-bold text-white mb-3">{role.title}</h3>
                        <p className="text-gray-400 mb-8 leading-relaxed">{role.desc}</p>
                        
                        <button onClick={onEnter} className="flex items-center gap-2 text-sm font-bold text-white group-hover:gap-4 transition-all">
                            Get Started <span className="text-cyan-400">&rarr;</span>
                        </button>
                    </div>
                ))}
            </div>
         </div>
      </section>
      
      {/* APP DOWNLOAD PROMO */}
      <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-3xl border border-cyan-500/20 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="relative z-10 text-center md:text-left">
                  <h2 className="text-3xl font-bold font-orbitron text-white mb-2">Take it Anywhere</h2>
                  <p className="text-cyan-200/80">Install Music Station Radio as a PWA for a native app experience.</p>
                  <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
                      <div className="flex items-center gap-2 px-4 py-2 bg-black/40 rounded-lg border border-white/10 text-sm text-gray-300">
                          <ClockIcon className="w-4 h-4 text-cyan-400"/> Offline Ready
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-black/40 rounded-lg border border-white/10 text-sm text-gray-300">
                          <DeviceIcon className="w-4 h-4 text-cyan-400"/> Mobile Optimized
                      </div>
                  </div>
              </div>
              <div className="relative z-10">
                   <button onClick={onEnter} className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-cyan-50 transition-colors shadow-xl shadow-cyan-900/20 flex items-center gap-3">
                       <ExploreIcon className="w-6 h-6"/>
                       Launch Web Player
                   </button>
              </div>
          </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-center py-12 border-t border-gray-900/50">
        <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center gap-4 mb-8 opacity-80 hover:opacity-100 transition-opacity">
               <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20">M</div>
               <span className="font-orbitron font-bold text-xl tracking-wider">MSR</span>
            </div>
            <div className="flex flex-wrap justify-center gap-8 mb-8 text-sm text-gray-500 font-medium">
                <button className="hover:text-cyan-400 transition-colors">Explore</button>
                <button className="hover:text-cyan-400 transition-colors">Features</button>
                <button className="hover:text-cyan-400 transition-colors">For Artists</button>
                <button className="hover:text-cyan-400 transition-colors">Support</button>
            </div>
            <p className="text-xs text-gray-700">&copy; {new Date().getFullYear()} Music Station Radio. High Grade Audio Experience.</p>
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
            animation: bg-pulse 8s ease-in-out infinite alternate;
        }
        .text-shadow-glow {
            text-shadow: 0 0 20px rgba(6,182,212,0.5);
        }

        @keyframes bg-pulse {
            0% { opacity: 0.1; transform: scale(1); }
            100% { opacity: 0.3; transform: scale(1.1); }
        }

        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-scroll {
            animation: scroll 60s linear infinite;
        }
        .group-hover\\:pause:hover {
            animation-play-state: paused;
        }
        
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};
