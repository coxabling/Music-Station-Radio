import React, { useMemo } from 'react';
import { stations } from '../constants';

interface LandingPageProps {
  onEnter: () => void;
}

// --- Icons ---
const AIIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.5 1.591L5.25 15.25v5.25a2.25 2.25 0 002.25 2.25h3a2.25 2.25 0 002.25-2.25v-5.25l-3.9-4.841a2.25 2.25 0 01-.5-1.591V3.104a2.25 2.25 0 00-2.25-2.25h-3a2.25 2.25 0 00-2.25 2.25z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9.75v5.714a2.25 2.25 0 01-.5 1.591l-3.9 4.841v5.25a2.25 2.25 0 002.25 2.25h3a2.25 2.25 0 002.25-2.25v-5.25l-3.9-4.841a2.25 2.25 0 01-.5-1.591V9.75a2.25 2.25 0 00-2.25-2.25h-3a2.25 2.25 0 00-2.25 2.25z" /></svg>;
const WorldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>;
const VisualizerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /></svg>;

const features = [
    { icon: <WorldIcon />, title: "Global Stations", description: "Explore thousands of hand-picked stations from every corner of the globe." },
    { icon: <AIIcon />, title: "AI-Powered Discovery", description: "Get fascinating facts and lyrics for the playing song, powered by Gemini." },
    { icon: <VisualizerIcon />, title: "Immersive Experience", description: "Engage with dynamic audio visualizers and customize your sound with an EQ." }
];

const cardGradients = [
    'from-cyan-500 to-blue-600',
    'from-purple-500 to-pink-600',
    'from-green-400 to-teal-500',
    'from-yellow-400 to-orange-500',
    'from-red-500 to-rose-600',
    'from-indigo-500 to-violet-600',
];

const FeaturedStationCard: React.FC<{station: typeof stations[0], index: number}> = ({station, index}) => (
    <div 
      className={`relative w-72 h-36 rounded-xl p-4 flex flex-col justify-end text-white bg-gradient-to-br ${cardGradients[index % cardGradients.length]} shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/30`}
    >
        <img src={station.coverArt} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay transition-transform duration-500 group-hover:scale-110" />
        <div className="relative z-10">
            <h4 className="font-bold text-lg truncate">{station.name}</h4>
            <p className="text-sm opacity-80 truncate">{station.genre}</p>
        </div>
    </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
    const genres = useMemo(() => Array.from(new Set(stations.flatMap(s => s.genre.split('/').map(g => g.trim())))), []);
    const backgroundStations = useMemo(() => stations.sort(() => 0.5 - Math.random()).slice(0, 16), []);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-poppins">
      <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-8 text-center">
        <div className="absolute inset-0 opacity-20" id="landing-bg-grid">
            {backgroundStations.map((station, i) => (
                <div key={i} className="bg-cover bg-center" style={{ backgroundImage: `url(${station.coverArt})`, animationDelay: `${Math.random() * 5}s` }}></div>
            ))}
        </div>
        <div className="absolute inset-0 bg-gray-950/70 backdrop-blur-sm" />

        <div className="relative z-10 animate-fade-in-slow">
          <h1 className="text-5xl md:text-7xl font-bold font-orbitron tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500" style={{ animationDelay: '200ms' }}>
            MUSIC STATION RADIO
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-sky-100/80 animate-fade-in-slow" style={{ animationDelay: '400ms' }}>
            Tune in to a world of music. Discover thousands of live radio stations with our modern, AI-enhanced web player.
          </p>
          <button
            onClick={onEnter}
            className="mt-10 px-12 py-4 bg-cyan-500 text-gray-900 font-bold text-lg rounded-full shadow-lg transform transition-all duration-300 hover:bg-cyan-400 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-500 focus:ring-opacity-50 animate-fade-in-slow landing-cta"
            style={{ animationDelay: '600ms' }}
          >
            START LISTENING
          </button>
        </div>
      </main>
      
      <section className="bg-gray-950 py-20 px-0 relative z-10 overflow-hidden">
          <div className="container mx-auto text-center px-4">
              <h2 className="text-3xl font-bold mb-4 font-orbitron">Featured Stations</h2>
              <p className="text-gray-400 mb-12 max-w-xl mx-auto">Here's a taste of what's playing right now. Dive in to discover thousands more.</p>
          </div>
          <div className="w-full group" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
              <div className="flex gap-8 animate-scroll group-hover:pause">
                  {[...stations, ...stations].map((station, index) => (
                      <div key={`${station.streamUrl}-${index}`} className="flex-shrink-0">
                          <FeaturedStationCard station={station} index={index} />
                      </div>
                  ))}
              </div>
          </div>
      </section>

      <section className="bg-gray-900 py-20 px-8">
        <div className="container mx-auto text-center">
             <h2 className="text-3xl font-bold text-center mb-4 font-orbitron">A World of Genres Awaits</h2>
             <p className="text-center text-gray-400 mb-12 max-w-xl mx-auto">From Afropop to Reggae, find the soundtrack to your moment.</p>
            <div className="flex flex-wrap justify-center items-center gap-3 max-w-4xl mx-auto">
                {genres.slice(0, 15).map((genre, index) => (
                    <div 
                        key={genre} 
                        className="genre-tag animate-fade-in-up-staggered"
                        style={{ animationDelay: `${index * 70}ms` }}
                    >
                        {genre}
                    </div>
                ))}
            </div>
        </div>
      </section>

      <section className="bg-gray-950 py-20 px-8">
        <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4 font-orbitron">Why Tune In?</h2>
            <p className="text-center text-gray-400 mb-12 max-w-xl mx-auto">More than just a player. It's a new way to experience radio.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto">
                {features.map((feature, index) => (
                    <div 
                      key={index} 
                      className="group p-8 bg-gray-900/50 rounded-xl border border-gray-700/50 flex flex-col items-center transition-all duration-300 hover:border-cyan-500/50 hover:-translate-y-2 animate-fade-in" 
                      style={{animationDelay: `${index * 150}ms`}}
                    >
                        <div className="p-4 bg-sky-900/50 rounded-full mb-6 border border-sky-700 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-cyan-500/20">{feature.icon}</div>
                        <h3 className="text-xl font-bold text-cyan-400 mb-2">{feature.title}</h3>
                        <p className="text-sky-100/70 max-w-xs">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      <footer className="bg-gray-950 text-center p-6 border-t border-gray-800">
        <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Music Station Radio. All Rights Reserved.</p>
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
            animation: bg-image-pan 25s ease-in-out infinite alternate;
        }
        @keyframes bg-image-pan {
            from { transform: scale(1.1) translate(-5%, 5%); opacity: 0.8; }
            to { transform: scale(1.3) translate(5%, -5%); opacity: 1; }
        }

        @keyframes button-glow {
            0%, 100% { box-shadow: 0 0 20px 0 rgba(56, 189, 248, 0.4), 0 0 40px 0 rgba(56, 189, 248, 0.2); }
            50% { box-shadow: 0 0 30px 5px rgba(56, 189, 248, 0.6), 0 0 60px 0 rgba(56, 189, 248, 0.4); }
        }
        .landing-cta {
             animation: button-glow 4s ease-in-out infinite, fade-in-slow 1s ease-out forwards;
        }

        .genre-tag {
            background-color: rgba(30, 41, 59, 0.5);
            border: 1px solid #334155;
            padding: 8px 16px;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 600;
            color: #cbd5e1;
            transition: all 0.2s ease-in-out;
        }
        .genre-tag:hover {
            background-color: rgba(56, 189, 248, 0.1);
            border-color: rgba(56, 189, 248, 0.5);
            color: #7dd3fc;
        }
        
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; opacity: 0; }
        
        @keyframes fade-in-slow { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-slow { animation: fade-in-slow 1s ease-out forwards; opacity: 0; }
        
        @keyframes fade-in-up-staggered { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up-staggered { animation: fade-in-up-staggered 0.5s ease-out forwards; opacity: 0; }

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
      `}</style>
    </div>
  );
};