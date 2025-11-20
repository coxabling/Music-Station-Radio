
import React, { useState, useMemo } from 'react';
import type { Station, LayoutMode, SongVote, User } from '../types';
import { StarRating } from './StarRating';
import { findStationsByVibe } from '../services/geminiService';

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
const SparklesIcon: React.FC<{className?: string}> = ({className}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {fillRule: "evenodd", d: "M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z", clipRule: "evenodd"}));
const XIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;


const TabButton: React.FC<{label: string; isActive: boolean; onClick: () => void}> = ({ label, isActive, onClick }) => (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors focus:outline-none ${ isActive ? 'bg-gray-800/50 text-[var(--accent-color)] border-b-2 accent-color-border' : 'text-gray-400 hover:text-white' }`}>{label}</button>
);

const SponsorCard: React.FC = () => (
    <div className="relative group flex flex-col rounded-lg overflow-hidden bg-gradient-to-br from-yellow-900/20 to-gray-900 border border-yellow-500/30 shadow-lg animate-fade-in" style={{ aspectRatio: '1 / 1' }}>
         <div className="absolute top-2 left-2 bg-yellow-500/90 text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase z-10">Sponsored</div>
         <img src="https://picsum.photos/seed/sponsor1/300" alt="Sponsor" className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105 grayscale group-hover:grayscale-0" />
         <div className="absolute inset-0 bg-black/30 p-4 flex flex-col justify-center items-center text-center">
             <h3 className="font-bold text-xl text-white mb-2">Premium Audio Gear</h3>
             <p className="text-xs text-gray-200 mb-4">Upgrade your listening experience today.</p>
             <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded-full text-xs transition-colors">
                 Shop Now
             </button>
         </div>
    </div>
);

type SortMode = 'name' | 'rating';

export const StationList: React.FC<StationListProps> = ({ stations, allStations, currentStation, onSelectStation, searchQuery, onSearchChange, onOpenSubmitModal, onToggleFavorite, songVotes, onOpenGenreSpotlight, onShowDetails, onPlayFromCommunity, currentUser }) => {
  const [viewMode, setViewMode] = useState<LayoutMode>('grid');
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'community'>('all');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>('rating');
  
  const [aiSearchResults, setAiSearchResults] = useState<{ urls: string[], prompt: string } | null>(null);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiError, setAiError] = useState('');

  const genres = useMemo(() => {
    const allGenres = allStations.map(s => s.genre.split('/')[0].trim());
    return ['All', ...Array.from(new Set(allGenres))];
  }, [allStations]);

  const handleGenreSelect = (genre: string) => {
    setSelectedGenre(genre === 'All' ? null : genre);
  };
  
  const handleVibeSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsAiSearching(true);
    setAiError('');
    setAiSearchResults(null);
    try {
      const resultUrls = await findStationsByVibe(searchQuery, allStations);
      setAiSearchResults({ urls: resultUrls, prompt: searchQuery });
    } catch (error) {
      console.error(error);
      setAiError('AI search failed. Please try again.');
    } finally {
      setIsAiSearching(false);
    }
  };

  const communityHits = useMemo(() => {
    return (Object.values(songVotes) as SongVote[])
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 25);
  }, [songVotes]);

  const displayedStations = useMemo(() => {
    if (aiSearchResults) {
        const urlMap = new Map(allStations.map(s => [s.streamUrl, s]));
        const aiList = aiSearchResults.urls.map(url => urlMap.get(url)).filter((s): s is Station => !!s);
        
        if (activeTab === 'favorites') {
            return aiList.filter(s => s.isFavorite);
        }
        return aiList;
    } else {
        let list = activeTab === 'favorites' ? stations.filter(s => s.isFavorite) : stations;
        if (selectedGenre) {
          list = list.filter(s => s.genre.toLowerCase().includes(selectedGenre.toLowerCase()));
        }
        
        return [...list].sort((a, b) => {
          if (sortMode === 'rating') {
            return (b.rating || 0) - (a.rating || 0);
          }
          if (sortMode === 'name') {
            return a.name.localeCompare(b.name);
          }
          return 0;
        });
    }
  }, [activeTab, stations, allStations, selectedGenre, sortMode, aiSearchResults]);


  return (
    <div className="bg-transparent rounded-lg p-4 md:p-6">
      <h2 className="text-3xl font-bold font-orbitron mb-6 text-center accent-color-text">Explore Stations</h2>
      
      <div className="mb-6 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-grow w-full">
            <input type="text" placeholder="Search by name/genre, or describe a vibe..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} className="w-full bg-gray-800/50 border border-gray-700 rounded-full py-2.5 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-all duration-300" aria-label="Search for a station or describe a vibe" />
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"><SearchIcon /></div>
        </div>
        <div className="flex-shrink-0 w-full sm:w-auto flex items-center justify-center gap-2">
            <button onClick={handleVibeSearch} disabled={isAiSearching || !searchQuery.trim()} className="w-full sm:w-auto flex items-center justify-center bg-purple-500/20 hover:bg-purple-500/40 text-purple-200 border border-purple-500/50 rounded-full py-2.5 px-5 transition-colors duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                {isAiSearching ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-purple-200"></div> : <SparklesIcon className="h-5 w-5" />}
                <span className="ml-2">Vibe Search</span>
            </button>
            {(currentUser?.role === 'owner' || currentUser?.role === 'admin') && (
            <button onClick={onOpenSubmitModal} className="flex-shrink-0 flex items-center justify-center bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-200 border border-cyan-500/50 rounded-full py-2.5 px-5 transition-colors duration-300 font-semibold" aria-label="Suggest a new station"><AddIcon />Suggest</button>
            )}
        </div>
      </div>

      {aiError && <div className="text-center text-red-400 mb-4">{aiError}</div>}
      {aiSearchResults && (
        <div className="mb-6 p-3 bg-gray-800/50 rounded-lg border border-gray-700 flex items-center justify-between animate-fade-in">
            <div>
                <p className="text-sm font-semibold text-purple-300">✨ AI Results for: "{aiSearchResults.prompt}"</p>
                <p className="text-xs text-gray-400">{aiSearchResults.urls.length} stations found.</p>
            </div>
            <button onClick={() => setAiSearchResults(null)} className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/50 rounded-full py-1.5 px-3 transition-colors text-sm font-semibold">
                <XIcon className="h-4 w-4" /> Clear
            </button>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <div className="border-b border-gray-700/50">
            <TabButton label="All Stations" isActive={activeTab === 'all'} onClick={() => setActiveTab('all')} />
            <TabButton label="Favorites" isActive={activeTab === 'favorites'} onClick={() => setActiveTab('favorites')} />
            <TabButton label="Community Hits" isActive={activeTab === 'community'} onClick={() => setActiveTab('community')} />
        </div>
        <div className="flex items-center gap-2">
            {!aiSearchResults && activeTab === 'all' && (
                <div className="relative">
                    <select value={sortMode} onChange={e => setSortMode(e.target.value as SortMode)} className="bg-gray-800/50 border border-gray-700 rounded-full py-2 pl-8 pr-4 text-sm text-white appearance-none focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]">
                        <option value="rating">Sort by Rating</option>
                        <option value="name">Sort by Name</option>
                    </select>
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><SortIcon/></div>
                </div>
            )}
            {activeTab !== 'favorites' && activeTab !== 'community' && (
                <div className="flex items-center gap-1 p-1 bg-gray-800/50 rounded-full border border-gray-700"><button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-[var(--accent-color)] text-black' : 'text-gray-400 hover:bg-gray-700'}`}><GridIcon /></button><button onClick={() => setViewMode('list')} className={`p-1.5 rounded-full transition-colors ${viewMode === 'list' ? 'bg-[var(--accent-color)] text-black' : 'text-gray-400 hover:bg-gray-700'}`}><ListIcon /></button></div>
            )}
        </div>
      </div>
      
      {!aiSearchResults && activeTab === 'all' && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {genres.map(genre => {
              const isActive = (!selectedGenre && genre === 'All') || selectedGenre === genre;
              return (
              <div key={genre} className="flex items-center">
                  <button onClick={() => handleGenreSelect(genre)} className={`px-3 py-1 text-xs font-semibold border transition-colors ${ isActive ? 'bg-[var(--accent-color)]/20 border-[var(--accent-color)] text-[var(--accent-color)] rounded-l-full' : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700 rounded-full'}`}>
                      {genre}
                  </button>
                  {isActive && genre !== 'All' && (
                      <button onClick={() => onOpenGenreSpotlight(genre)} className="px-2 py-1 bg-[var(--accent-color)]/20 border-y border-r border-[var(--accent-color)] text-[var(--accent-color)] rounded-r-full hover:bg-[var(--accent-color)]/30" title={`Learn about ${genre}`}>
                          <InfoIcon className="h-4 w-4"/>
                      </button>
                  )}
              </div>
          )})}
        </div>
      )}
      
      {activeTab === 'community' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {communityHits.map((song) => (
            <div key={song.id} className="relative group bg-gray-800/50 ring-2 ring-gray-700/50 rounded-lg overflow-hidden shadow-lg" style={{ aspectRatio: '1 / 1' }}>
                <img src={song.albumArt} alt={song.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/60 p-4 flex flex-col justify-end">
                    <h3 className="font-bold text-lg text-white truncate" title={song.title}>{song.title}</h3>
                    <p className="text-xs text-gray-300 truncate" title={song.artist}>{song.artist}</p>
                </div>
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button onClick={() => onPlayFromCommunity(song.id)} className="flex items-center gap-2 bg-cyan-500/80 hover:bg-cyan-500 text-black font-bold py-2 px-4 rounded-full transition-colors transform hover:scale-105">
                        <RadioIcon/> Find Station
                    </button>
                </div>
            </div>
          ))}
        </div>
      ) : displayedStations.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {displayedStations.map((station, index) => {
               const isHighGrade = station.name === "High Grade Radio";
               
               // Insert Sponsor Card after the 4th item (index 3)
               if (index === 3 && activeTab === 'all' && !aiSearchResults) {
                    return (
                        <React.Fragment key={station.streamUrl}>
                             <SponsorCard />
                             <div className="relative group flex flex-col station-card-animate" style={{ animationDelay: `${index * 30}ms`}}>
                                <button onClick={() => onSelectStation(station)} className={`w-full text-left rounded-lg overflow-hidden transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-color)] focus-visible:ring-opacity-75 shadow-lg hover:shadow-[var(--accent-color)]/40 hover:scale-[1.03] ${ currentStation?.name === station.name ? 'ring-4 ring-[var(--accent-color)] shadow-[var(--accent-color)]/50' : isHighGrade ? 'ring-2 ring-yellow-500/80 hover:ring-yellow-400 shadow-yellow-500/20' : 'ring-2 ring-gray-700/50 hover:ring-[var(--accent-color)]/70'}`} style={{ aspectRatio: '1 / 1' }} aria-label={`Play ${station.name}`} >
                                  <img src={station.coverArt} alt={station.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-300 p-4 flex flex-col justify-end"><h3 className="font-bold text-lg text-white truncate">{station.name}</h3><p className="text-xs text-gray-300 truncate">{station.genre}</p></div>
                                  {isHighGrade && <div className="absolute top-2 left-2 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Featured</div>}
                                </button>
                                <div className="flex items-center justify-between mt-2">
                                    <button onClick={() => onShowDetails(station)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white" title="View details"><InfoIcon className="h-4 w-4" /> Details</button>
                                    <StarRating rating={station.rating || 0} readOnly={true} starClassName="h-4 w-4" />
                                </div>
                                <button onClick={() => onToggleFavorite(station)} className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full transition-opacity opacity-0 group-hover:opacity-100 hover:!opacity-100 hover:bg-black/70"><HeartIcon isFavorite={!!station.isFavorite} /></button>
                                {currentStation?.name === station.name && <PlayIndicator />}
                              </div>
                        </React.Fragment>
                    )
               }

               return (
              <div key={station.streamUrl} className="relative group flex flex-col station-card-animate" style={{ animationDelay: `${index * 30}ms`}}>
                <button onClick={() => onSelectStation(station)} className={`w-full text-left rounded-lg overflow-hidden transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-color)] focus-visible:ring-opacity-75 shadow-lg hover:shadow-[var(--accent-color)]/40 hover:scale-[1.03] ${ currentStation?.name === station.name ? 'ring-4 ring-[var(--accent-color)] shadow-[var(--accent-color)]/50' : isHighGrade ? 'ring-2 ring-yellow-500/80 hover:ring-yellow-400 shadow-yellow-500/20' : 'ring-2 ring-gray-700/50 hover:ring-[var(--accent-color)]/70'}`} style={{ aspectRatio: '1 / 1' }} aria-label={`Play ${station.name}`} >
                  <img src={station.coverArt} alt={station.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-300 p-4 flex flex-col justify-end"><h3 className="font-bold text-lg text-white truncate">{station.name}</h3><p className="text-xs text-gray-300 truncate">{station.genre}</p></div>
                  {isHighGrade && <div className="absolute top-2 left-2 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Featured</div>}
                </button>
                <div className="flex items-center justify-between mt-2">
                    <button onClick={() => onShowDetails(station)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white" title="View details"><InfoIcon className="h-4 w-4" /> Details</button>
                    <StarRating rating={station.rating || 0} readOnly={true} starClassName="h-4 w-4" />
                </div>
                <button onClick={() => onToggleFavorite(station)} className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full transition-opacity opacity-0 group-hover:opacity-100 hover:!opacity-100 hover:bg-black/70"><HeartIcon isFavorite={!!station.isFavorite} /></button>
                {currentStation?.name === station.name && <PlayIndicator />}
              </div>
            )})}
          </div>
        ) : (
          <div className="space-y-3">
            {displayedStations.map((station, index) => (
              <div key={station.streamUrl} className={`flex items-center p-3 rounded-lg transition-colors duration-200 station-card-animate ${currentStation?.streamUrl === station.streamUrl ? 'bg-gray-700/50' : 'bg-gray-800/30 hover:bg-gray-800/60'}`} style={{ animationDelay: `${index * 30}ms`}}>
                <img src={station.coverArt} alt={station.name} className="w-12 h-12 rounded-md object-cover mr-4" />
                <div className="flex-1 cursor-pointer" onClick={() => onSelectStation(station)}>
                    <h3 className="font-semibold text-white">{station.name} {station.name === "High Grade Radio" && <span className="text-[10px] text-yellow-400 ml-2 border border-yellow-500/50 px-1 rounded">FEATURED</span>}</h3>
                    <p className="text-sm text-gray-400">{station.genre}</p>
                </div>
                 <div className="flex items-center gap-2">
                    <button onClick={() => onShowDetails(station)} className="p-2 text-gray-400 hover:text-white rounded-full" title="View details"><InfoIcon className="h-5 w-5"/></button>
                    <button onClick={() => onToggleFavorite(station)} className="p-2 text-gray-400 hover:text-pink-500 rounded-full"><HeartIcon isFavorite={!!station.isFavorite} /></button>
                    {currentStation?.streamUrl === station.streamUrl && ( <div className="w-6 h-6 rounded-full bg-[var(--accent-color)] animate-pulse"></div> )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-center text-gray-400 py-10">
          <p className="text-lg font-semibold">No Stations Found</p>
          <p className="text-sm mt-1">
            {aiSearchResults 
                ? "The AI couldn't find a match for your vibe. Try being more descriptive!" 
                : activeTab === 'favorites'
                ? 'Click the heart icon on any station to add it here.'
                : `Try adjusting your search or selecting a different genre.`
            }
          </p>
        </div>
      )}
    </div>
  );
};