
import React, { useMemo } from 'react';
import { stations, TrophyIcon, MusicNoteIcon, BriefcaseIcon, UserIcon, ChatBubbleIcon, RocketIcon, StarIcon, ShieldCheckIcon, ExploreIcon } from '../constants';

interface LandingPageProps {
  onEnter: () => void;
}

// Custom Icons for Landing Page specific visuals
const AIIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.5 1.591L5.25 15.25v5.25a2.25 2.25 0 002.25 2.25h3a2.25 2.25 0 002.25-2.25v-5.25l-3.9-4.841a2.25 2.25 0 01-.5-1.591V3.104a2.25 2.25 0 00-2.25-2.25h-3a2.25 2.25 0 00-2.25 2.25z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9.75v5.714a2.25 2.25 0 01-.5 1.591l-3.9 4.841v5.25a2.25 2.25 0 002.25 2.25h3a2.25 2.25 0 002.25-2.25v-5.25l-3.9-4.841a2.25 2.25 0 01-.5-1.591V9.75a2.25 2.25 0 00-2.25-2.25h-3a2.25 2.25 0 00-2.25 2.25z" /></svg>;
const WorldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>;
const VisualizerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /></svg>;

const features = [
    { icon: <WorldIcon />, title: "Global Stations", description: "Explore thousands of hand-picked stations from every corner of the globe.", color: "text-cyan-400", bg: "bg-cyan-500/10" },
    { icon: <AIIcon />, title: "AI Intelligence", description: "Get fascinating facts, lyrics, and 'Vibe Search' recommendations powered by Gemini.", color: "text-purple-400", bg: "bg-purple-500/10" },
    { icon: <TrophyIcon className="w-8 h-8" />, title: "Gamified Listening", description: "Earn XP, unlock themes, climb leaderboards, and collect achievements.", color: "text-yellow-400", bg: "bg-yellow-500/10" },
    { icon: <ChatBubbleIcon className="w-8 h-8" />, title: "Social & Interactive", description: "Join genre chat rooms, participate in Listening Parties, and raid stations.", color: "text-pink-400", bg: "bg-pink-500/10" },
    { icon: <VisualizerIcon />, title: "Immersive Visuals", description: "Engage with dynamic audio visualizers and customize your sound with a 5-band EQ.", color: "text-green-400", bg: "bg-green-500/10" },
    { icon: <RocketIcon className="w-8 h-8" />, title: "Artist & Manager Tools", description: "Submit your music directly to station managers or run your own station.", color: "text-orange-400", bg: "bg-orange-500/10" },
];

const roles = [
    { id: 'listener', title: 'Listener', icon: <UserIcon className="w-6 h-6"/>, desc: "Tune in, chat, and level up.", color: "from-cyan-500 to-blue-600" },
    { id: 'artist', title: 'Artist', icon: <MusicNoteIcon className="w-6 h-6"/>, desc: "Submit tracks & get heard.", color: "from-purple-500 to-pink-600" },
    { id: 'manager', title: 'Manager', icon: <BriefcaseIcon className="w-6 h-6"/>, desc: "Curate & grow your station.", color: "from-orange-500 to-red-600" },
];

const FeaturedStationCard: React.FC<{station: typeof stations[0], index: number}> = ({station, index}) => (
    <div 
      className="relative w-64 h-80 rounded-2xl p-4 flex flex-col justify-end text-white overflow-hidden transition-all duration-500 hover:scale-105 group"
    >
        <img src={station.coverArt} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
        
        <div className="relative z-10 transform transition-transform duration-300 group-hover:-translate-y-2">
            <div className="inline-block px-2 py-1 rounded-md bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase mb-2 border border-white/10">
                {station.genre.split('/')[0]}
            </div>
            <h4 className="font-bold text-xl leading-tight mb-1">{station.name}</h4>
            <p className="text-xs text-gray-300 line-clamp-2">{station.description}</p>
        </div>
    </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
    const backgroundStations = useMemo(() => stations.sort(() => 0.5 - Math.random()).slice(0, 16), []);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-poppins selection:bg-[var(--accent-color)] selection:text-black overflow-x-hidden">
      
      {/* HERO SECTION */}
      <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-4 text-center">
        {/* Dynamic Background Grid */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" id="landing-bg-grid">
            {backgroundStations.map((station, i) => (
                <div key={i} className="bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-1000" style={{ backgroundImage: `url(${station.coverArt})`, animationDelay: `${Math.random() * 5}s` }}></div>
            ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-gray-950/90 to-gray-950" />

        <div className="relative z-10 max-w-4xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold mb-6 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            LIVE RADIO REIMAGINED
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-orbitron tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-500 mb-6 leading-tight">
            MUSIC STATION <br/><span className="text-stroke-cyan text-transparent">RADIO</span>
          </h1>
          
          <p className="mt-4 text-lg md:text-2xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            The next-gen web player for the modern listener. Stream, chat, and level up your listening experience.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
                onClick={onEnter}
                className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-full shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] transform transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 group"
            >
                <span>START LISTENING</span>
                <ExploreIcon className="w-5 h-5 group-hover:rotate-45 transition-transform"/>
            </button>
            <button onClick={onEnter} className="px-10 py-4 bg-gray-800/50 border border-white/10 text-white font-bold text-lg rounded-full hover:bg-gray-700/50 transition-all backdrop-blur-sm">
                Explore Features
            </button>
          </div>
        </div>

        {/* Floating Stats/Elements */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-8 md:gap-16 opacity-60 text-xs md:text-sm font-mono text-cyan-500/80 animate-fade-in delay-500">
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div> 10,000+ STATIONS</div>
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div> AI POWERED</div>
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div> COMMUNITY DRIVEN</div>
        </div>
      </main>
      
      {/* MARQUEE SECTION */}
      <section className="bg-black py-12 overflow-hidden border-y border-white/5">
           <div className="container mx-auto px-4 mb-8 text-center">
              <h3 className="text-lg font-orbitron text-gray-400 tracking-widest uppercase">Trending Stations</h3>
          </div>
          <div className="w-full group relative" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
              <div className="flex gap-6 animate-scroll group-hover:pause px-4">
                  {[...stations, ...stations, ...stations].map((station, index) => (
                      <div key={`${station.streamUrl}-${index}`} className="flex-shrink-0">
                          <FeaturedStationCard station={station} index={index} />
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* ROLES SECTION */}
      <section className="py-24 px-4 bg-gray-900 relative overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
         <div className="container mx-auto max-w-5xl relative z-10">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold font-orbitron mb-4">Choose Your Path</h2>
                <p className="text-gray-400 max-w-xl mx-auto text-lg">Music Station Radio isn't just for listening. It's an ecosystem for everyone.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {roles.map((role, i) => (
                    <div key={role.id} className="group relative p-1 rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-white/20 transition-all duration-300 hover:-translate-y-2">
                        <div className="absolute inset-0 bg-gradient-to-b opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl" style={{ backgroundImage: `linear-gradient(to bottom, var(--tw-gradient-stops))` }}></div>
                        <div className="bg-gray-950 h-full rounded-xl p-8 flex flex-col items-center text-center border border-white/5 relative z-10">
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                {role.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{role.title}</h3>
                            <p className="text-gray-400">{role.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
         </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-24 px-4 bg-gray-950">
        <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-bold font-orbitron mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">More Than Just Audio</h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">We've packed Music Station Radio with features to make every listening session an experience.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                    <div 
                      key={index} 
                      className="p-8 rounded-2xl bg-gray-900/30 border border-white/5 hover:border-white/10 transition-all duration-300 hover:bg-gray-900/60 group"
                    >
                        <div className={`w-12 h-12 rounded-lg ${feature.bg} ${feature.color} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110`}>
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">{feature.title}</h3>
                        <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-center py-12 border-t border-gray-900">
        <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-2 mb-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
               {/* Simple logo representation */}
               <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg"></div>
               <span className="font-orbitron font-bold text-xl">MSR</span>
            </div>
            <div className="flex justify-center gap-8 mb-8 text-sm text-gray-500 font-medium">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Support</a>
                <a href="#" className="hover:text-white transition-colors">For Artists</a>
            </div>
            <p className="text-xs text-gray-600">&copy; {new Date().getFullYear()} Music Station Radio. All Rights Reserved.</p>
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
        
        .text-stroke-cyan {
            -webkit-text-stroke: 1px #22d3ee;
        }

        @keyframes bg-pulse {
            0% { opacity: 0.4; transform: scale(1); }
            100% { opacity: 0.8; transform: scale(1.1); }
        }

        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-scroll {
            animation: scroll 40s linear infinite;
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
