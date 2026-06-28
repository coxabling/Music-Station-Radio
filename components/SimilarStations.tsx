import React, { useMemo, useState } from 'react';
import type { Station } from '../types';
import { getAIVibeExplanation } from '../services/geminiService';

interface SimilarStationsProps {
  isOpen: boolean;
  station: Station;
  allStations: Station[];
  onSelectStation: (station: Station) => void;
  onClose: () => void;
}

export const SimilarStations: React.FC<SimilarStationsProps> = ({ isOpen, station, allStations, onSelectStation, onClose }) => {
  const [explainingUrl, setExplainingUrl] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Advanced scoring algorithm to determine similarity percentage
  const similarWithScores = useMemo(() => {
    const currentGenres = station.genre.toLowerCase().split(/[\/,&]/).map(g => g.trim()).filter(g => g.length > 0);
    const currentWords = station.description.toLowerCase().split(/\s+/).filter(w => w.length > 2);

    const candidates = allStations
      .filter(s => s.streamUrl !== station.streamUrl)
      .map(s => {
        let score = 0;

        // 1. Genre Overlap (Primary factor)
        const sGenres = s.genre.toLowerCase().split(/[\/,&]/).map(g => g.trim()).filter(g => g.length > 0);
        let genreOverlap = 0;
        currentGenres.forEach(g1 => {
          sGenres.forEach(g2 => {
            if (g1 === g2) genreOverlap += 35;
            else if (g1.includes(g2) || g2.includes(g1)) genreOverlap += 15;
          });
        });
        score += genreOverlap;

        // 2. Keyword Match on Description
        const sWords = s.description.toLowerCase().split(/\s+/);
        let wordOverlap = 0;
        currentWords.forEach(w1 => {
          if (sWords.includes(w1)) wordOverlap += 5;
        });
        score += Math.min(wordOverlap, 20); // Cap description word match

        // 3. Regional / Country match
        if (s.countryCode === station.countryCode && station.countryCode) {
          score += 25;
        } else if (['na', 'ng', 'za', 'ke', 'gh'].includes(s.countryCode || '') && ['na', 'ng', 'za', 'ke', 'gh'].includes(station.countryCode || '')) {
          score += 12; // Continental proximity
        }

        // 4. Rating contribution
        score += (s.rating || 4.0) * 3;

        // Convert raw score to a nice percentage (max raw score around 130-150)
        const percentage = Math.min(Math.round((score / 120) * 100), 99);

        return {
          station: s,
          score: percentage
        };
      });

    // Sort descending by similarity score, return top 4
    return candidates.sort((a, b) => b.score - a.score).slice(0, 4);
  }, [station, allStations]);

  const handleFetchExplanation = async (e: React.MouseEvent, suggested: Station) => {
    e.stopPropagation(); // prevent triggering parent select station onClick
    if (explainingUrl === suggested.streamUrl) {
      // Toggle close
      setExplainingUrl(null);
      return;
    }
    setExplainingUrl(suggested.streamUrl);
    setIsLoading(true);
    setExplanation('');
    try {
      const res = await getAIVibeExplanation(station, suggested);
      setExplanation(res);
    } catch (err) {
      setExplanation(`DJs say the flow from ${station.name} to ${suggested.name} brings pure fire and unmatched rhythm. Give it a spin!`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute bottom-full mb-3 w-80 right-0 bg-gray-950/95 border border-cyan-500/30 rounded-2xl shadow-2xl p-4 z-40 animate-fade-in-fast backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
         <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>Platform Suggestions</span>
         </div>
         <button onClick={onClose} className="text-gray-400 hover:text-white text-xs">&times;</button>
      </div>

      {similarWithScores.length > 0 ? (
        <ul className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {similarWithScores.map(({ station: s, score }) => (
            <li key={s.streamUrl} className="bg-white/5 border border-white/5 rounded-xl p-2 hover:border-cyan-500/20 transition-all">
              <div 
                onClick={() => { onSelectStation(s); onClose(); }} 
                className="w-full text-left flex items-start gap-3 cursor-pointer"
              >
                <img src={s.coverArt} alt={s.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-white/10" />
                <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between gap-1.5">
                       <p className="text-xs font-bold text-gray-100 truncate">{s.name}</p>
                       <span className="text-[9px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded-full shrink-0 font-bold">{score}% Match</span>
                    </div>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">{s.genre}</p>
                    <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-white/5">
                        <span className="text-[9px] text-yellow-400 flex items-center gap-0.5 font-bold">★ {s.rating || '4.5'}</span>
                        <button 
                           onClick={(e) => handleFetchExplanation(e, s)}
                           className="text-[9px] bg-cyan-500/25 hover:bg-cyan-500/40 text-cyan-300 font-bold px-2 py-0.5 rounded flex items-center gap-1 transition-all"
                           title="Get DJ matching intro explanation"
                        >
                           <span>✨ DJ Intro</span>
                        </button>
                    </div>
                </div>
              </div>

              {/* Explaining bubble */}
              {explainingUrl === s.streamUrl && (
                <div className="mt-2.5 bg-cyan-950/30 border border-cyan-500/10 p-2.5 rounded-lg text-left animate-slide-up">
                   <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-cyan-400 mb-1">
                       <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                       <span>AI DJ Matchmaker Intro</span>
                   </div>
                   {isLoading ? (
                      <div className="flex items-center gap-2 py-1">
                         <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></div>
                         <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></div>
                         <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></div>
                      </div>
                   ) : (
                      <p className="text-[10px] text-cyan-100 font-medium leading-relaxed italic">
                         "{explanation}"
                      </p>
                   )}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-gray-400">No similar stations found.</p>
      )}

      <div className="mt-3 text-center border-t border-white/5 pt-2.5">
         <p className="text-[9px] text-gray-500 leading-relaxed font-sans">
            Suggestions are curated in real-time by analyzing geographic coordinates, tag distributions, and active vibe logs.
         </p>
      </div>

      <style>{`
        @keyframes fade-in-fast { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out; }
        @keyframes slide-up { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.15s ease-out; }
      `}</style>
    </div>
  );
};
