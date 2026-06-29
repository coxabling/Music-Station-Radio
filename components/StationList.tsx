
import React, { useState, useMemo } from 'react';
import type { Station, LayoutMode, SongVote, User } from '../types';
import { StarRating } from './StarRating';
import { findStationsByVibe, getAIVibeExplanation } from '../services/geminiService';
import { searchRadioBrowser } from '../services/apiService';
import { GlobeIcon } from '../constants';

interface StationListProps {
  stations: Station[];
  allStations: Station[];
  currentStation: Station | null;
  onSelectStation: (station: Station) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenSubmitModal: () => void;
  onToggleFavorite: (station: Station) => void;
  songVotes: Record<string, SongVote>;
  onOpenGenreSpotlight: (genre: string) => void;
  onShowDetails: (station: Station) => void;
  onPlayFromCommunity: (songId: string) => void;
  currentUser: User | null;
}

const PlayIndicator: React.FC = () => ( <div className="absolute top-2 right-2 bg-[var(--accent-color)] rounded-full p-1 shadow-lg animate-pulse"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-black" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3.546l-6.38 8.195A2 2 0 005.46 15H14.54a2 2 0 001.84-3.259L10 3.546z" transform="rotate(90 10 10)" /></svg></div>);
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const AddIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>;
const HeartIcon: React.FC<{isFavorite: boolean; className?: string}> = ({ isFavorite, className = 'h-6 w-6' }) => <svg xmlns="http://www.w3.org/2000/svg" className={`${className} transition-all duration-200 ${isFavorite ? 'text-pink-500 fill-current' : 'text-white/70'}`} viewBox="0 0 20 20" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5}><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>;
const GridIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;
const RadioIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /></svg>;
const SortIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9M3 12h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" /></svg>;
const InfoIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>;
const SparklesIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd"/></svg>;
const XIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const PinIcon: React.FC<{isPinned: boolean; className?: string}> = ({ isPinned, className = 'h-6 w-6' }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={`${className} transition-all duration-300 ${isPinned ? 'text-cyan-400 fill-current rotate-[45deg]' : 'text-white/70'}`} 
        viewBox="0 0 24 24" 
        fill={isPinned ? 'currentColor' : 'none'} 
        stroke="currentColor" 
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="12" y1="17" x2="12" y2="22" />
        <path d="M5 17h14v-1.76a2 2 0 0 0-.44-1.24l-2.33-2.9A2 2 0 0 1 15.79 9.86V5a1 1 0 0 0-1-1h-5.58a1 1 0 0 0-1 1v4.86a2 2 0 0 1-.44 1.24l-2.33 2.9a2 2 0 0 0-.44 1.24Z" />
    </svg>
);

const ShareIcon: React.FC<{ className?: string }> = ({ className = 'h-6 w-6' }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth={2} 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
);

const TabButton: React.FC<{label: string; isActive: boolean; onClick: () => void}> = ({ label, isActive, onClick }) => (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors focus:outline-none ${ isActive ? 'bg-gray-800/50 text-[var(--accent-color)] border-b-2 accent-color-border' : 'text-gray-400 hover:text-white' }`}>{label}</button>
);

const getTagColor = (t: string) => {
    const colors = [
        'bg-blue-500/20 text-blue-300 border-blue-500/30',
        'bg-purple-500/20 text-purple-300 border-purple-500/30',
        'bg-pink-500/20 text-pink-300 border-pink-500/30',
        'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        'bg-orange-500/20 text-orange-300 border-orange-500/30',
        'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        'bg-rose-500/20 text-rose-300 border-rose-500/30',
        'bg-amber-500/20 text-amber-300 border-amber-500/30',
    ];
    let hash = 0;
    for (let i = 0; i < t.length; i++) hash = t.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
};

const TagPill: React.FC<{ tag: string; isSelected?: boolean; onClick?: (tag: string) => void; className?: string }> = ({ tag, isSelected, onClick, className = '' }) => {
    return (
        <button
            onClick={(e) => { e.stopPropagation(); onClick?.(tag); }}
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all duration-200 shadow-sm ${isSelected ? 'bg-[var(--accent-color)] text-black border-[var(--accent-color)] ring-2 ring-[var(--accent-color)]/20' : `${getTagColor(tag)} hover:scale-105 active:scale-95`} ${className}`}
        >
            {tag}
        </button>
    );
};

const SponsorCard: React.FC = () => (
    <div className="relative group flex flex-col rounded-lg overflow-hidden bg-gradient-to-br from-yellow-900/20 to-gray-900 border border-yellow-500/30 shadow-lg animate-fade-in" style={{ aspectRatio: '1 / 1' }}>
         <div className="absolute top-2 left-2 bg-yellow-500/90 text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase z-10">Sponsored</div>
         <img src="https://picsum.photos/seed/audio_gear/300" alt="Sponsor" className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105 grayscale group-hover:grayscale-0" />
         <div className="absolute inset-0 bg-black/30 p-4 flex flex-col justify-center items-center text-center">
             <h3 className="font-bold text-xl text-white mb-2">High Grade Audio</h3>
             <p className="text-xs text-gray-200 mb-4">Upgrade your listening gear.</p>
             <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded-full text-xs transition-colors">
                 Learn More
             </button>
         </div>
    </div>
);

type SortMode = 'name' | 'rating';

export const StationList: React.FC<StationListProps> = ({ stations, allStations, currentStation, onSelectStation, searchQuery, onSearchChange, onOpenSubmitModal, onToggleFavorite, songVotes, onOpenGenreSpotlight, onShowDetails, onPlayFromCommunity, currentUser }) => {
  const [viewMode, setViewMode] = useState<LayoutMode>('grid');
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'community'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>('rating');
  
  const [pinnedUrls, setPinnedUrls] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pinned_stations_urls');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleTogglePin = (e: React.MouseEvent, streamUrl: string) => {
    e.stopPropagation();
    setPinnedUrls(prev => {
      const next = prev.includes(streamUrl)
        ? prev.filter(url => url !== streamUrl)
        : [...prev, streamUrl];
      try {
        localStorage.setItem('pinned_stations_urls', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  };

  const [copiedStationUrl, setCopiedStationUrl] = useState<string | null>(null);

  const handleShareStation = (e: React.MouseEvent, station: Station) => {
    e.stopPropagation();
    const origin = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    params.set('station', station.streamUrl);
    const shareUrl = `${origin}?${params.toString()}`;

    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedStationUrl(station.streamUrl);
      setTimeout(() => setCopiedStationUrl(null), 2000);
    }).catch((err) => {
        console.error('Failed to copy link: ', err);
    });
  };
  
  const [aiSearchResults, setAiSearchResults] = useState<{ urls: string[], prompt: string } | null>(null);
  const [globalSearchResults, setGlobalSearchResults] = useState<Station[] | null>(null);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [isGlobalSearching, setIsGlobalSearching] = useState(false);
  const [aiError, setAiError] = useState('');

  // AI Suggestion and Explanation States
  const [aiExplainingUrl, setAiExplainingUrl] = useState<string | null>(null);
  const [aiExplanationText, setAiExplanationText] = useState<string>('');
  const [isAiExplainingLoading, setIsAiExplainingLoading] = useState(false);

  // Dynamic heuristic-based platform suggestions
  const platformSuggestions = useMemo(() => {
    // 1. Get user's favorite genres
    const favoriteStations = allStations.filter(s => s.isFavorite);
    const favoriteGenres = new Set<string>();
    favoriteStations.forEach(s => {
      s.genre.split(/[\/,]/).forEach(g => favoriteGenres.add(g.trim().toLowerCase()));
    });

    const suggestions: { station: Station; matchReason: string; matchScore: number }[] = [];
    const addedUrls = new Set<string>(favoriteStations.map(s => s.streamUrl));

    // Calculate score & matching reason for all candidates
    allStations.forEach(s => {
      if (s.streamUrl === currentStation?.streamUrl) return; // skip current station

      let score = 0;
      let reason = "Highly Recommended Vibe";

      // 1. Genre match with user favorites
      if (favoriteGenres.size > 0) {
        const stationGenres = s.genre.split(/[\/,]/).map(g => g.trim().toLowerCase());
        const matches = stationGenres.filter(g => favoriteGenres.has(g));
        if (matches.length > 0) {
          score += 40 + matches.length * 10;
          reason = `Because you love ${s.genre.split(/[\/,]/)[0]}`;
        }
      }

      // 2. High rating bonus
      if (s.rating && s.rating >= 4.5) {
        score += 25;
        if (score < 40) {
          reason = `Top pick (${s.rating} ★ vibe score)`;
        }
      }

      // 3. Featured station bonus (e.g., High Grade Radio)
      if (s.name.includes("High Grade")) {
        score += 35;
        reason = "Featured Premium Broadcast";
      }

      // 4. Regional trends (e.g. Namibia/Windhoek hub)
      if (s.countryCode === 'na') {
        score += 20;
        if (score < 30) {
          reason = "Trending in Namibian Grids";
        }
      }

      if (score > 10 && !addedUrls.has(s.streamUrl)) {
        suggestions.push({
          station: s,
          matchReason: reason,
          matchScore: Math.min(score, 99)
        });
      }
    });

    // If we have fewer than 3 suggestions, fill with any other stations (excluding current)
    if (suggestions.length < 3) {
      allStations.forEach(s => {
        if (s.streamUrl !== currentStation?.streamUrl && !addedUrls.has(s.streamUrl) && suggestions.length < 3) {
          suggestions.push({
            station: s,
            matchReason: s.rating && s.rating >= 4.3 ? "Excellent soundwaves" : "Curated playlist",
            matchScore: s.rating ? Math.round(s.rating * 18) : 80
          });
          addedUrls.add(s.streamUrl);
        }
      });
    }

    return suggestions.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
  }, [allStations, currentStation]);

  const handleFetchAiExplanation = async (targetStation: Station) => {
    if (aiExplainingUrl === targetStation.streamUrl) {
      // Toggle close
      setAiExplainingUrl(null);
      return;
    }
    setAiExplainingUrl(targetStation.streamUrl);
    setIsAiExplainingLoading(true);
    setAiExplanationText('');
    try {
      const referenceStation = currentStation || allStations.find(s => s.isFavorite) || allStations[0];
      const explanation = await getAIVibeExplanation(referenceStation, targetStation);
      setAiExplanationText(explanation);
    } catch (err) {
      console.error(err);
      setAiExplanationText(`This station's rich audio spectrum transitions beautifully from your current session's signature groove.`);
    } finally {
      setIsAiExplainingLoading(false);
    }
  };

  const trendingTags = useMemo(() => {
    const counts: Record<string, number> = {};
    allStations.forEach(s => {
      const tags = s.genre.split(',').map(t => t.trim());
      tags.forEach(t => {
          if (t && t !== 'Various') counts[t] = (counts[t] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 18)
      .map(([name]) => name);
  }, [allStations]);

  const handleTagToggle = (tag: string) => {
    setSelectedTag(prev => prev === tag ? null : tag);
    setAiSearchResults(null);
    setGlobalSearchResults(null);
  };
  
  const handleVibeSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsAiSearching(true);
    setAiError('');
    setAiSearchResults(null);
    setGlobalSearchResults(null);
    try {
      const resultUrls = await findStationsByVibe(searchQuery, allStations);
      setAiSearchResults({ urls: resultUrls, prompt: searchQuery });
    } catch (error) {
      console.error(error);
      setAiError('Vibe search failed. Try describing the mood.');
    } finally {
      setIsAiSearching(false);
    }
  };

  const handleGlobalSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsGlobalSearching(true);
    setGlobalSearchResults(null);
    setAiSearchResults(null);
    try {
        const results = await searchRadioBrowser(searchQuery);
        setGlobalSearchResults(results);
    } catch (e) {
        console.error("Global search failed:", e);
    } finally {
        setIsGlobalSearching(false);
    }
  };

  const communityHits = useMemo(() => {
    return (Object.values(songVotes) as SongVote[])
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 25);
  }, [songVotes]);

  const displayedStations = useMemo(() => {
    if (globalSearchResults) {
        return globalSearchResults;
    }
    if (aiSearchResults) {
        const urlMap = new Map(allStations.map(s => [s.streamUrl, s]));
        const aiList = aiSearchResults.urls.map(url => urlMap.get(url)).filter((s): s is Station => !!s);
        
        if (activeTab === 'favorites') return aiList.filter(s => s.isFavorite);
        return aiList;
    } else {
        let list = activeTab === 'favorites' ? stations.filter(s => s.isFavorite) : stations;
        if (selectedTag) {
          list = list.filter(s => s.genre.toLowerCase().includes(selectedTag.toLowerCase()));
        }
        
        return [...list].sort((a, b) => {
          if (sortMode === 'rating') return (b.rating || 0) - (a.rating || 0);
          if (sortMode === 'name') return a.name.localeCompare(b.name);
          return 0;
        });
    }
  }, [activeTab, stations, allStations, selectedTag, sortMode, aiSearchResults, globalSearchResults]);

  const pinnedStations = useMemo(() => {
    return displayedStations.filter(s => pinnedUrls.includes(s.streamUrl));
  }, [displayedStations, pinnedUrls]);

  const unpinnedStations = useMemo(() => {
    return displayedStations.filter(s => !pinnedUrls.includes(s.streamUrl));
  }, [displayedStations, pinnedUrls]);


  return (
    <div className="bg-transparent rounded-lg p-4 md:p-6">
      <h2 className="text-3xl font-bold font-orbitron mb-6 text-center accent-color-text">Global Soundwave</h2>
      
      <div className="mb-8 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-grow w-full">
            <input 
                type="text" 
                placeholder="Genre, mood, or station name..." 
                value={searchQuery} 
                onChange={(e) => onSearchChange(e.target.value)} 
                className="w-full bg-gray-800/40 border border-gray-700/50 rounded-full py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-all duration-300" 
                aria-label="Search station" 
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"><SearchIcon /></div>
        </div>
        <div className="flex-shrink-0 w-full sm:w-auto flex items-center justify-center gap-2">
            <button onClick={handleGlobalSearch} disabled={isGlobalSearching || !searchQuery.trim()} className="w-full sm:w-auto flex items-center justify-center bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-200 border border-cyan-500/50 rounded-full py-3 px-6 transition-colors duration-300 font-bold disabled:opacity-50">
                {isGlobalSearching ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-cyan-200"></div> : <GlobeIcon className="h-5 w-5" />}
                <span className="ml-2 whitespace-nowrap">Global</span>
            </button>
            <button onClick={handleVibeSearch} disabled={isAiSearching || !searchQuery.trim()} className="w-full sm:w-auto flex items-center justify-center bg-purple-500/20 hover:bg-purple-500/40 text-purple-200 border border-purple-500/50 rounded-full py-3 px-6 transition-colors duration-300 font-bold disabled:opacity-50">
                {isAiSearching ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-purple-200"></div> : <SparklesIcon className="h-5 w-5" />}
                <span className="ml-2 whitespace-nowrap">Vibe</span>
            </button>
        </div>
      </div>

      {aiError && <div className="text-center text-red-400 mb-4 bg-red-900/20 p-2 rounded-lg border border-red-500/30">{aiError}</div>}
      
      {(aiSearchResults || globalSearchResults) && (
        <div className="mb-6 p-4 bg-purple-900/10 rounded-xl border border-purple-500/30 flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-3">
                {aiSearchResults ? <SparklesIcon className="h-6 w-6 text-purple-400" /> : <GlobeIcon className="h-6 w-6 text-cyan-400"/>}
                <div>
                    <p className="text-sm font-bold text-gray-200">{aiSearchResults ? `AI Vibe Match for: "${aiSearchResults.prompt}"` : `Global Results for: "${searchQuery}"`}</p>
                    <p className="text-xs text-gray-400">{displayedStations.length} matches found.</p>
                </div>
            </div>
            <button onClick={() => { setAiSearchResults(null); setGlobalSearchResults(null); }} className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 border border-gray-700 rounded-full py-1.5 px-4 transition-colors text-xs font-bold">
                <XIcon className="h-4 w-4" /> Reset
            </button>
        </div>
      )}

      {!aiSearchResults && !globalSearchResults && activeTab === 'all' && (
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)]"></div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Trending Categories</h3>
              <div className="flex-grow h-px bg-gray-800/50"></div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {trendingTags.map(tag => (
                <TagPill 
                    key={tag} 
                    tag={tag} 
                    isSelected={selectedTag === tag} 
                    onClick={handleTagToggle} 
                    className="px-5 py-1.5 text-xs"
                />
            ))}
          </div>
        </div>
      )}

      {!aiSearchResults && !globalSearchResults && activeTab === 'all' && platformSuggestions.length > 0 && (
        <div className="mb-10 animate-fade-in">
           <div className="flex items-center gap-3 mb-4">
               <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)]"></div>
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">AI Platform Suggestions</h3>
               <span className="text-[10px] font-mono text-cyan-400 font-black tracking-widest uppercase bg-cyan-500/10 px-2.5 py-0.5 rounded-full">Personalized Soundscapes</span>
               <div className="flex-grow h-px bg-gray-800/50"></div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
               {platformSuggestions.map(({ station: s, matchReason, matchScore }) => (
                   <div key={s.streamUrl} className="relative group bg-gray-900/40 border border-white/5 hover:border-cyan-500/20 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300">
                       <div className="absolute top-3 right-3 bg-cyan-500/15 text-cyan-300 text-[10px] font-black px-2 py-0.5 rounded-full font-mono border border-cyan-500/20">
                           {matchScore}% Match
                       </div>
                       
                       <div className="flex gap-4 items-start">
                           <img src={s.coverArt} alt={s.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-white/10 shadow-md group-hover:scale-105 transition-all" />
                           <div className="min-w-0">
                               <p className="text-sm font-bold text-gray-100 group-hover:text-cyan-300 transition-all truncate">{s.name}</p>
                               <p className="text-xs text-cyan-400 font-semibold tracking-wide mt-0.5">{matchReason}</p>
                               <p className="text-[11px] text-gray-400 truncate mt-1">{s.genre}</p>
                           </div>
                       </div>
                       
                       <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2.5">
                           <button 
                               onClick={() => handleFetchAiExplanation(s)}
                               className="flex-1 bg-gray-800/60 hover:bg-gray-800 text-[11px] text-cyan-300 font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all border border-cyan-500/10"
                           >
                               <span>✨ Why this pick?</span>
                           </button>
                           
                           <button 
                               onClick={() => onSelectStation(s)}
                               className="bg-[var(--accent-color)] hover:brightness-110 text-black text-xs font-bold p-2 rounded-lg flex items-center justify-center transition-all"
                               title="Tune In Now"
                           >
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                               </svg>
                           </button>
                       </div>
                       
                       {aiExplainingUrl === s.streamUrl && (
                           <div className="mt-3.5 bg-cyan-950/25 border border-cyan-500/15 p-3 rounded-xl text-left animate-slide-up">
                               <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-cyan-400 mb-1.5">
                                   <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                                   <span>AI Matchmaker Analysis</span>
                               </div>
                               {isAiExplainingLoading ? (
                                   <div className="flex items-center gap-2 py-1">
                                       <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"></div>
                                       <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></div>
                                       <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></div>
                                   </div>
                               ) : (
                                   <p className="text-xs text-cyan-100 font-medium leading-relaxed italic">
                                       "{aiExplanationText}"
                                   </p>
                               )}
                           </div>
                       )}
                   </div>
               ))}
           </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6 border-b border-gray-800/50 pb-2">
        <div className="flex gap-2 overflow-x-auto custom-scrollbar-hide">
            <TabButton label="Broadcasting" isActive={activeTab === 'all'} onClick={() => setActiveTab('all')} />
            <TabButton label="Your Favorites" isActive={activeTab === 'favorites'} onClick={() => setActiveTab('favorites')} />
            <TabButton label="Global Hits" isActive={activeTab === 'community'} onClick={() => setActiveTab('community')} />
        </div>
        <div className="flex items-center gap-3">
            {!aiSearchResults && !globalSearchResults && activeTab === 'all' && (
                <div className="relative hidden lg:block">
                    <select value={sortMode} onChange={e => setSortMode(e.target.value as SortMode)} className="bg-gray-800/60 border border-gray-700/50 rounded-full py-2 pl-9 pr-4 text-xs font-bold text-gray-300 appearance-none focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]">
                        <option value="rating">Top Rated</option>
                        <option value="name">Alphabetical</option>
                    </select>
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"><SortIcon/></div>
                </div>
            )}
            {activeTab !== 'community' && (
                <div className="flex items-center gap-1 p-1 bg-gray-800/60 rounded-full border border-gray-700/50">
                    <button onClick={() => setViewMode('grid')} className={`p-2 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-[var(--accent-color)] text-black' : 'text-gray-500 hover:text-white'}`}><GridIcon /></button>
                    <button onClick={() => setViewMode('list')} className={`p-2 rounded-full transition-colors ${viewMode === 'list' ? 'bg-[var(--accent-color)] text-black' : 'text-gray-500 hover:text-white'}`}><ListIcon /></button>
                </div>
            )}
        </div>
      </div>
      
      {activeTab === 'community' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {communityHits.map((song) => (
            <div key={song.id} className="relative group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-xl" style={{ aspectRatio: '1 / 1' }}>
                <img src={song.albumArt} alt={song.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-5 flex flex-col justify-end">
                    <h3 className="font-bold text-lg text-white truncate drop-shadow-md" title={song.title}>{song.title}</h3>
                    <p className="text-xs text-cyan-300 truncate font-semibold" title={song.artist}>{song.artist}</p>
                </div>
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                    <button onClick={() => onPlayFromCommunity(song.id)} className="flex items-center gap-2 bg-[var(--accent-color)] text-black font-bold py-3 px-6 rounded-full transition-all transform hover:scale-110 shadow-lg shadow-[var(--accent-color)]/20">
                        <RadioIcon/> Tune In
                    </button>
                </div>
            </div>
          ))}
        </div>
      ) : displayedStations.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="flex flex-col gap-8">
            {/* PINNED SECTION (GRID) */}
            {pinnedStations.length > 0 && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center p-1.5 bg-cyan-500/15 rounded-lg border border-cyan-500/30">
                    <PinIcon isPinned={true} className="h-4 w-4 text-cyan-400 rotate-45" />
                  </div>
                  <h3 className="text-sm font-black text-cyan-400 uppercase tracking-widest font-orbitron">Pinned Stations</h3>
                  <div className="flex-grow h-px bg-cyan-500/10"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                  {pinnedStations.map((station, index) => {
                    const isHighGrade = station.name === "High Grade Radio";
                    const tags = station.genre.split(',').map(t => t.trim()).slice(0, 3);
                    return (
                      <div key={`pinned-${station.streamUrl}`} className="relative group flex flex-col station-card-animate" style={{ animationDelay: `${index * 30}ms`}}>
                        <div className="relative">
                            <button onClick={() => onSelectStation(station)} className={`w-full text-left rounded-xl overflow-hidden transition-all duration-300 focus:outline-none shadow-xl hover:scale-[1.03] ${ currentStation?.streamUrl === station.streamUrl ? 'ring-4 ring-[var(--accent-color)] shadow-[var(--accent-color)]/30' : isHighGrade ? 'ring-2 ring-yellow-500/60 shadow-yellow-500/10' : 'ring-1 ring-gray-800 hover:ring-[var(--accent-color)]/50' }`} style={{ aspectRatio: '1 / 1' }} >
                                <img src={station.coverArt} alt={station.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 flex flex-col justify-end">
                                    <h3 className="font-bold text-lg text-white truncate mb-2">{station.name}</h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        {tags.map(t => <TagPill key={t} tag={t} onClick={handleTagToggle} isSelected={selectedTag === t} />)}
                                    </div>
                                </div>
                                {isHighGrade && <div className="absolute top-3 left-3 bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded shadow-lg uppercase">Featured</div>}
                            </button>
                            <button onClick={(e) => handleTogglePin(e, station.streamUrl)} className="absolute top-3 right-14 p-2 bg-black/50 backdrop-blur-md rounded-full transition-all hover:scale-110 hover:bg-black/75 shadow-lg text-cyan-400 border border-cyan-500/30" title="Unpin Station"><PinIcon isPinned={true} className="h-5 w-5" /></button>
                            <button 
                                onClick={(e) => handleShareStation(e, station)} 
                                className={`absolute top-3 right-25 p-2 bg-black/45 backdrop-blur-md rounded-full transition-all hover:scale-110 hover:bg-black/60 shadow-lg border border-white/5 flex items-center justify-center ${copiedStationUrl === station.streamUrl ? 'opacity-100 text-green-400' : 'opacity-0 group-hover:opacity-100 text-white/70 hover:text-cyan-400'}`} 
                                title={copiedStationUrl === station.streamUrl ? "Copied Share Link!" : "Share Station"}
                            >
                                {copiedStationUrl === station.streamUrl ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <ShareIcon className="h-5 w-5" />
                                )}
                            </button>
                            <button onClick={() => onToggleFavorite(station)} className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-md rounded-full transition-all opacity-0 group-hover:opacity-100 hover:scale-110 hover:bg-black/60 shadow-lg"><HeartIcon isFavorite={!!station.isFavorite} className="h-5 w-5" /></button>
                        </div>
                        <div className="flex items-center justify-between mt-3 px-1">
                            <button onClick={() => onShowDetails(station)} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-white transition-colors" title="View details"><InfoIcon className="h-4 w-4" /> More Info</button>
                            <StarRating rating={station.rating || 0} readOnly={true} starClassName="h-3.5 w-3.5" />
                        </div>
                        {currentStation?.streamUrl === station.streamUrl && <PlayIndicator />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MAIN / UNPINNED SECTION (GRID) */}
            {pinnedStations.length > 0 && unpinnedStations.length > 0 && (
              <div className="flex items-center gap-3 mt-4">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest font-orbitron">All Stations</h3>
                <div className="flex-grow h-px bg-gray-800/50"></div>
              </div>
            )}

            {unpinnedStations.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {unpinnedStations.map((station, index) => {
                   const isHighGrade = station.name === "High Grade Radio";
                   const tags = station.genre.split(',').map(t => t.trim()).slice(0, 3);
                   const isPinned = pinnedUrls.includes(station.streamUrl);
                   
                   const cardContent = (
                     <div key={station.streamUrl} className="relative group flex flex-col station-card-animate" style={{ animationDelay: `${index * 30}ms`}}>
                       <div className="relative">
                           <button onClick={() => onSelectStation(station)} className={`w-full text-left rounded-xl overflow-hidden transition-all duration-300 focus:outline-none shadow-xl hover:scale-[1.03] ${ currentStation?.streamUrl === station.streamUrl ? 'ring-4 ring-[var(--accent-color)] shadow-[var(--accent-color)]/30' : isHighGrade ? 'ring-2 ring-yellow-500/60 shadow-yellow-500/10' : 'ring-1 ring-gray-800 hover:ring-[var(--accent-color)]/50' }`} style={{ aspectRatio: '1 / 1' }} >
                               <img src={station.coverArt} alt={station.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 flex flex-col justify-end">
                                   <h3 className="font-bold text-lg text-white truncate mb-2">{station.name}</h3>
                                   <div className="flex flex-wrap gap-1.5">
                                       {tags.map(t => <TagPill key={t} tag={t} onClick={handleTagToggle} isSelected={selectedTag === t} />)}
                                   </div>
                               </div>
                               {isHighGrade && <div className="absolute top-3 left-3 bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded shadow-lg uppercase">Featured</div>}
                           </button>
                           <button onClick={(e) => handleTogglePin(e, station.streamUrl)} className={`absolute top-3 right-14 p-2 bg-black/45 backdrop-blur-md rounded-full transition-all hover:scale-110 hover:bg-black/60 shadow-lg border border-white/5 ${isPinned ? 'opacity-100 text-cyan-400' : 'opacity-0 group-hover:opacity-100 text-white/70'}`} title="Pin Station"><PinIcon isPinned={isPinned} className="h-5 w-5" /></button>
                           <button 
                               onClick={(e) => handleShareStation(e, station)} 
                               className={`absolute top-3 right-25 p-2 bg-black/45 backdrop-blur-md rounded-full transition-all hover:scale-110 hover:bg-black/60 shadow-lg border border-white/5 flex items-center justify-center ${copiedStationUrl === station.streamUrl ? 'opacity-100 text-green-400' : 'opacity-0 group-hover:opacity-100 text-white/70 hover:text-cyan-400'}`} 
                               title={copiedStationUrl === station.streamUrl ? "Copied Share Link!" : "Share Station"}
                           >
                               {copiedStationUrl === station.streamUrl ? (
                                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                       <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                   </svg>
                               ) : (
                                   <ShareIcon className="h-5 w-5" />
                               )}
                           </button>
                           <button onClick={() => onToggleFavorite(station)} className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-md rounded-full transition-all opacity-0 group-hover:opacity-100 hover:scale-110 hover:bg-black/60 shadow-lg"><HeartIcon isFavorite={!!station.isFavorite} className="h-5 w-5" /></button>
                       </div>
                       <div className="flex items-center justify-between mt-3 px-1">
                           <button onClick={() => onShowDetails(station)} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-white transition-colors" title="View details"><InfoIcon className="h-4 w-4" /> More Info</button>
                           <StarRating rating={station.rating || 0} readOnly={true} starClassName="h-3.5 w-3.5" />
                       </div>
                       {currentStation?.streamUrl === station.streamUrl && <PlayIndicator />}
                     </div>
                   );

                   if (index === 3 && activeTab === 'all' && !aiSearchResults && !globalSearchResults && !selectedTag) {
                        return (
                            <React.Fragment key="sponsor-fragment">
                                 <SponsorCard />
                                 {cardContent}
                            </React.Fragment>
                        )
                   }

                   return cardContent;
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto flex flex-col gap-4">
            {/* PINNED LIST SECTION */}
            {pinnedStations.length > 0 && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center p-1.5 bg-cyan-500/15 rounded-lg border border-cyan-500/30">
                    <PinIcon isPinned={true} className="h-4 w-4 text-cyan-400 rotate-45" />
                  </div>
                  <h3 className="text-sm font-black text-cyan-400 uppercase tracking-widest font-orbitron">Pinned Stations</h3>
                  <div className="flex-grow h-px bg-cyan-500/10"></div>
                </div>
                <div className="space-y-4">
                  {pinnedStations.map((station, index) => (
                    <div key={`pinned-${station.streamUrl}`} className={`flex items-center p-4 rounded-xl border transition-all duration-300 station-card-animate ${currentStation?.streamUrl === station.streamUrl ? 'bg-[var(--accent-color)]/10 border-[var(--accent-color)] shadow-lg shadow-[var(--accent-color)]/10' : 'bg-gray-800/20 border-gray-800/50 hover:bg-gray-800/40 hover:border-gray-700'}`} style={{ animationDelay: `${index * 30}ms`}}>
                      <img src={station.coverArt} alt={station.name} className="w-16 h-16 rounded-lg object-cover mr-6 shadow-md" />
                      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onSelectStation(station)}>
                          <h3 className="font-bold text-white text-lg truncate flex items-center gap-3">
                              {station.name} 
                              {station.name === "High Grade Radio" && <span className="text-[9px] font-black text-yellow-400 border border-yellow-500/40 px-1.5 py-0.5 rounded tracking-tighter uppercase">Featured</span>}
                          </h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                              {station.genre.split(',').map(t => t.trim()).slice(0, 5).map(t => <TagPill key={t} tag={t} onClick={handleTagToggle} isSelected={selectedTag === t} />)}
                          </div>
                      </div>
                       <div className="flex items-center gap-3 ml-4">
                          <StarRating rating={station.rating || 0} readOnly={true} starClassName="h-4 w-4 hidden sm:flex" />
                          <div className="w-px h-8 bg-gray-700/50 hidden sm:block mx-1"></div>
                          <button onClick={() => onShowDetails(station)} className="p-2.5 text-gray-500 hover:text-white rounded-full hover:bg-gray-700/50 transition-colors" title="View details"><InfoIcon className="h-6 w-6"/></button>
                          <button onClick={(e) => handleTogglePin(e, station.streamUrl)} className="p-2.5 text-cyan-400 hover:text-cyan-300 rounded-full hover:bg-gray-700/50 transition-colors" title="Unpin Station"><PinIcon isPinned={true} className="h-6 w-6" /></button>
                           <button 
                               onClick={(e) => handleShareStation(e, station)} 
                               className={`p-2.5 rounded-full hover:bg-gray-700/50 transition-colors ${copiedStationUrl === station.streamUrl ? 'text-green-400' : 'text-gray-500 hover:text-cyan-400'}`} 
                               title={copiedStationUrl === station.streamUrl ? "Copied Share Link!" : "Share Station"}
                           >
                               {copiedStationUrl === station.streamUrl ? (
                                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400 animate-bounce" viewBox="0 0 20 20" fill="currentColor">
                                       <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                   </svg>
                               ) : (
                                   <ShareIcon className="h-6 w-6" />
                               )}
                           </button>
                          <button onClick={() => onToggleFavorite(station)} className="p-2.5 text-gray-500 hover:text-pink-500 rounded-full hover:bg-gray-700/50 transition-colors"><HeartIcon isFavorite={!!station.isFavorite} className="h-6 w-6" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* UNPINNED LIST SECTION */}
            {pinnedStations.length > 0 && unpinnedStations.length > 0 && (
              <div className="flex items-center gap-3 mt-4">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest font-orbitron">All Stations</h3>
                <div className="flex-grow h-px bg-gray-800/50"></div>
              </div>
            )}

            {unpinnedStations.length > 0 && (
              <div className="space-y-4">
                {unpinnedStations.map((station, index) => {
                  const isPinned = pinnedUrls.includes(station.streamUrl);
                  return (
                    <div key={station.streamUrl} className={`flex items-center p-4 rounded-xl border transition-all duration-300 station-card-animate ${currentStation?.streamUrl === station.streamUrl ? 'bg-[var(--accent-color)]/10 border-[var(--accent-color)] shadow-lg shadow-[var(--accent-color)]/10' : 'bg-gray-800/20 border-gray-800/50 hover:bg-gray-800/40 hover:border-gray-700'}`} style={{ animationDelay: `${index * 30}ms`}}>
                      <img src={station.coverArt} alt={station.name} className="w-16 h-16 rounded-lg object-cover mr-6 shadow-md" />
                      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onSelectStation(station)}>
                          <h3 className="font-bold text-white text-lg truncate flex items-center gap-3">
                              {station.name} 
                              {station.name === "High Grade Radio" && <span className="text-[9px] font-black text-yellow-400 border border-yellow-500/40 px-1.5 py-0.5 rounded tracking-tighter uppercase">Featured</span>}
                          </h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                              {station.genre.split(',').map(t => t.trim()).slice(0, 5).map(t => <TagPill key={t} tag={t} onClick={handleTagToggle} isSelected={selectedTag === t} />)}
                          </div>
                      </div>
                       <div className="flex items-center gap-3 ml-4">
                          <StarRating rating={station.rating || 0} readOnly={true} starClassName="h-4 w-4 hidden sm:flex" />
                          <div className="w-px h-8 bg-gray-700/50 hidden sm:block mx-1"></div>
                          <button onClick={() => onShowDetails(station)} className="p-2.5 text-gray-500 hover:text-white rounded-full hover:bg-gray-700/50 transition-colors" title="View details"><InfoIcon className="h-6 w-6"/></button>
                          <button onClick={(e) => handleTogglePin(e, station.streamUrl)} className={`p-2.5 rounded-full hover:bg-gray-700/50 transition-colors ${isPinned ? 'text-cyan-400' : 'text-gray-500 hover:text-white'}`} title="Pin Station"><PinIcon isPinned={isPinned} className="h-6 w-6" /></button>
                           <button 
                               onClick={(e) => handleShareStation(e, station)} 
                               className={`p-2.5 rounded-full hover:bg-gray-700/50 transition-colors ${copiedStationUrl === station.streamUrl ? 'text-green-400' : 'text-gray-500 hover:text-cyan-400'}`} 
                               title={copiedStationUrl === station.streamUrl ? "Copied Share Link!" : "Share Station"}
                           >
                               {copiedStationUrl === station.streamUrl ? (
                                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400 animate-bounce" viewBox="0 0 20 20" fill="currentColor">
                                       <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                   </svg>
                               ) : (
                                   <ShareIcon className="h-6 w-6" />
                               )}
                           </button>
                          <button onClick={() => onToggleFavorite(station)} className="p-2.5 text-gray-500 hover:text-pink-500 rounded-full hover:bg-gray-700/50 transition-colors"><HeartIcon isFavorite={!!station.isFavorite} className="h-6 w-6" /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )
      ) : (
        <div className="text-center py-20 bg-gray-900/20 rounded-3xl border border-gray-800/50">
          <div className="mb-6"><SearchIcon className="h-16 w-16 text-gray-700 mx-auto opacity-20" /></div>
          <p className="text-xl font-bold text-gray-400">No matching vibes found</p>
          <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto px-4">
            {aiSearchResults 
                ? "The AI couldn't find a direct match. Try broad terms like 'Chilled', 'Upbeat', or 'World Music'." 
                : activeTab === 'favorites'
                ? 'Save your favorite stations to see them here for quick access.'
                : `We couldn't find anything matching your filters. Try a different category or clear search.`
            }
          </p>
          {(selectedTag || searchQuery || aiSearchResults || globalSearchResults) && (
              <button onClick={() => { setSelectedTag(null); onSearchChange(''); setAiSearchResults(null); setGlobalSearchResults(null); }} className="mt-8 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-3 rounded-full font-bold text-sm transition-all shadow-xl">Clear All Filters</button>
          )}
          {searchQuery && !globalSearchResults && !isGlobalSearching && (
              <button onClick={handleGlobalSearch} className="mt-4 text-[var(--accent-color)] hover:underline font-bold text-sm block mx-auto">Try searching the entire Radio Browser database</button>
          )}
        </div>
      )}
    </div>
  );
};
