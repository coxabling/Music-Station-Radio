import React, { useState } from 'react';
import type { Station, StationReview, User, Bounty } from '../types';
import { StarRating } from './StarRating';
import { formatTimeAgo } from '../utils/time';
import { UploadIcon, ShieldCheckIcon, HeartIcon, FireIcon, CheckCircleIcon } from '../constants';
import { RoleBadge } from './RoleBadge';
import { StationGuestbook } from './StationGuestbook';
import { RequestSongModal } from './RequestSongModal';

interface StationInfoPanelProps {
  station: Station | null;
  allStations: Station[];
  mockReviews: Record<string, StationReview[]>;
  userReviews: StationReview[];
  onAddReview: (stationUrl: string, review: Omit<StationReview, 'createdAt' | 'author' | 'authorRole'>) => void;
  onSelectStation: (station: Station) => void;
  onRateStation: (stationUrl: string, rating: number) => void;
  onToggleFavorite: (station: Station) => void;
  userRating: number;
  isOwner?: boolean;
  onEdit?: (station: Station) => void;
  currentUser: User | null;
  onOpenMusicSubmissionModal: (station: Station) => void;
  onOpenClaimModal: (station: Station) => void;
  bounties?: Bounty[];
  onOpenJingleModal: () => void;
  onAddGuestbookEntry: (stationStreamUrl: string, message: string) => void; 
}

const PlayIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M10 3.546l-6.38 8.195A2 2 0 005.46 15H14.54a2 2 0 001.84-3.259L10 3.546z" transform="rotate(90 10 10)" /></svg>;
const EditIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>;
const RequestIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25L12 12m0 0l-5.25 3.75M12 12V21" /></svg>;
const JingleIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /></svg>;

const getTagColor = (t: string) => {
    const colors = [
        'bg-blue-500/20 text-blue-300 border-blue-500/30',
        'bg-purple-500/20 text-purple-300 border-purple-500/30',
        'bg-pink-500/20 text-pink-300 border-pink-500/30',
        'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        'bg-orange-500/20 text-orange-300 border-orange-500/30',
        'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        'bg-rose-500/20 text-rose-300 border-rose-500/30',
    ];
    let hash = 0;
    for (let i = 0; i < t.length; i++) hash = t.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
};

const TagPill: React.FC<{ tag: string }> = ({ tag }) => (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border shadow-sm ${getTagColor(tag)}`}>
        {tag}
    </span>
);

const ReviewForm: React.FC<{ onSubmit: (rating: number, text: string) => void }> = ({ onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [text, setText] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a star rating.');
            return;
        }
        if (text.trim().length < 10) {
            setError('Review must be at least 10 characters long.');
            return;
        }
        setError('');
        onSubmit(rating, text);
        setRating(0);
        setText('');
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50 shadow-inner">
            <h4 className="font-bold mb-3 text-white text-sm">Leave a Review</h4>
            <div className="mb-4">
                <StarRating rating={rating} onRate={setRating} starClassName="h-7 w-7" />
            </div>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What do you think of the vibes?"
                rows={3}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] transition-all text-sm"
            />
            {error && <p className="text-xs text-red-400 mt-2 font-semibold">{error}</p>}
            <button type="submit" className="mt-4 w-full bg-[var(--accent-color)] hover:opacity-90 text-black font-bold py-2.5 px-4 rounded-lg transition-all transform active:scale-95 shadow-lg shadow-[var(--accent-color)]/20">
                Post Review
            </button>
        </form>
    );
};

type ActiveTab = 'info' | 'reviews' | 'guestbook';

export const StationInfoPanel: React.FC<StationInfoPanelProps> = (props) => {
  const { station, allStations, mockReviews, userReviews, onAddReview, onSelectStation, onRateStation, userRating, isOwner, onEdit, currentUser, onOpenMusicSubmissionModal, onOpenClaimModal, onToggleFavorite, bounties, onOpenJingleModal, onAddGuestbookEntry } = props;
  const [activeTab, setActiveTab] = useState<ActiveTab>('info');
  const [isRequestSongModalOpen, setIsRequestSongModalOpen] = useState(false);

  const allReviewsForStation = React.useMemo(() => {
    if (!station) return [];
    const combined = [
        ...(mockReviews[station.streamUrl] || []),
        ...userReviews
    ];
    return combined.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [station, mockReviews, userReviews]);

  const relevantBounties = React.useMemo(() => {
    if (!bounties || !station) return [];
    return bounties.filter(b => 
        !b.completed && b.targetType === 'station' && b.targetValue === station.name
    );
  }, [bounties, station]);
  
  if (!station) {
    return (
      <div className="p-4 h-full flex flex-col items-center justify-center text-center text-gray-500 animate-pulse">
        <RadioIcon className="w-20 h-20 mb-6 opacity-10" />
        <p className="font-bold text-lg">Pick Your Vibe</p>
        <p className="text-sm mt-1 max-w-[200px]">Select a station to explore details, reviews, and community talk.</p>
      </div>
    );
  }

  const TabButton: React.FC<{label: string; tab: ActiveTab}> = ({ label, tab }) => (
    <button 
        onClick={() => setActiveTab(tab)} 
        className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-all focus:outline-none border-b-2 ${activeTab === tab ? 'text-[var(--accent-color)] border-[var(--accent-color)] bg-[var(--accent-color)]/5' : 'text-gray-500 hover:text-gray-300 border-transparent'}`}
    >
        {label}
    </button>
  );

  const claimPendingForCurrentUser = !!(station.claimRequest && currentUser && station.claimRequest.username === currentUser.username);

  const tags = station.genre.split(',').map(t => t.trim()).filter(t => t !== '');

  return (
    <div className="h-full flex flex-col p-5 animate-fade-in bg-gray-950/20">
      <div className="flex-shrink-0 flex items-start gap-5 mb-6">
        <div className="relative group">
            <img src={station.coverArt} alt={station.name} className="w-28 h-28 rounded-xl object-cover shadow-2xl border border-white/5 transition-transform duration-500 group-hover:scale-105" />
            <button 
                onClick={() => onToggleFavorite(station)} 
                className="absolute -top-3 -right-3 p-2 bg-black/60 backdrop-blur-md rounded-full transition-all hover:scale-125 hover:bg-black/80 shadow-xl border border-white/10"
                aria-label={station.isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
                <HeartIcon isFavorite={!!station.isFavorite} className="h-6 w-6"/>
            </button>
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-center gap-2 mb-1">
             {station.countryCode && (
                 <img 
                    src={`https://flagcdn.com/w40/${station.countryCode.toLowerCase()}.png`} 
                    alt={`Flag of ${station.countryCode}`} 
                    className="h-3.5 w-auto rounded-sm shadow-sm border border-white/10"
                    title={`Broadcasting from country code: ${station.countryCode.toUpperCase()}`}
                 />
             )}
             <h2 className="text-2xl font-black text-white font-orbitron truncate leading-tight tracking-tight">{station.name}</h2>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2 mb-3">
            {tags.map(t => <TagPill key={t} tag={t} />)}
          </div>
          <div className="flex items-center gap-2">
            <StarRating rating={station.rating || 0} readOnly starClassName="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">({(station.ratingsCount || 0).toLocaleString()} global votes)</span>
          </div>
        </div>
      </div>
      
      {relevantBounties.length > 0 && (
          <div className="mb-6 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/10 border border-yellow-500/30 rounded-xl text-yellow-300 text-sm flex items-center gap-3 animate-fade-in shadow-lg shadow-yellow-900/10">
              <div className="p-2 bg-yellow-500/20 rounded-lg"><FireIcon className="h-6 w-6 animate-bounce"/></div>
              <div>
                  <p className="font-black text-xs uppercase tracking-widest">Active Station Bounty</p>
                  <p className="text-[11px] text-yellow-200/80 font-medium">Earn {relevantBounties[0].reward} pts just for listening today.</p>
              </div>
          </div>
      )}

      <div className="flex-shrink-0 flex flex-wrap gap-3 mb-6">
        <button onClick={() => onSelectStation(station)} className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-[var(--accent-color)] hover:brightness-110 text-black font-black py-3 px-4 rounded-xl transition-all text-sm shadow-xl shadow-[var(--accent-color)]/20 uppercase tracking-widest">
            <PlayIcon className="h-5 w-5"/>
            Tune In
        </button>
        {isOwner && onEdit && (
            <button onClick={() => onEdit(station)} className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-xl transition-colors text-sm uppercase tracking-widest border border-gray-700">
                <EditIcon className="h-5 w-5"/>
                Edit
            </button>
        )}
        {currentUser?.role === 'artist' && station.acceptsSubmissions && (
            <button onClick={() => onOpenMusicSubmissionModal(station)} className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded-xl transition-colors text-sm shadow-lg shadow-purple-500/10 uppercase tracking-widest">
                <UploadIcon className="h-5 w-5"/>
                Submit
            </button>
        )}
        {isOwner && (
            <button onClick={onOpenJingleModal} className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-xl transition-colors text-sm uppercase tracking-widest border border-gray-700">
                <JingleIcon className="h-5 w-5"/>
                Jingle
            </button>
        )}
        {!station.owner && !claimPendingForCurrentUser && currentUser && (
            <button onClick={() => onOpenClaimModal(station)} className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 font-bold py-3 px-4 rounded-xl transition-colors text-sm border border-yellow-500/30 uppercase tracking-widest">
                <ShieldCheckIcon className="h-5 w-5"/>
                Claim
            </button>
        )}
      </div>

      <div className="flex-shrink-0 border-b border-gray-800 mb-6">
        <nav className="flex items-center" role="tablist">
          <TabButton label="Overview" tab="info" />
          <TabButton label={`Reviews (${allReviewsForStation.length})`} tab="reviews" />
          <TabButton label="Guestbook" tab="guestbook" />
        </nav>
      </div>

      <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-6">
        {activeTab === 'info' && (
            <div className="space-y-6 animate-fade-in">
                <div className="bg-gray-900/40 p-5 rounded-2xl border border-gray-800/50 shadow-inner">
                    <p className="text-sm text-gray-300 leading-relaxed italic font-medium">"{station.description}"</p>
                </div>
                {station.owner && (
                    <div className="bg-gray-900/40 p-4 rounded-2xl border border-gray-800/50 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center font-black text-lg text-white border-2 border-white/10 shadow-lg">
                            {station.owner.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Station Managed By</p>
                            <p className="text-sm font-bold text-white flex items-center gap-2">{station.owner} <RoleBadge role="owner" /></p>
                        </div>
                    </div>
                )}
                
                <div className="flex flex-col gap-3">
                     <button onClick={() => setIsRequestSongModalOpen(true)} className="w-full flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 text-white font-black py-4 px-4 rounded-2xl transition-all text-xs uppercase tracking-widest border border-white/5 shadow-xl group">
                        <RequestIcon className="h-5 w-5 text-cyan-400 transition-transform group-hover:scale-110"/>
                        Request Track
                    </button>
                    {station.tippingUrl && (
                        <a href={station.tippingUrl} target="_blank" rel="noopener noreferrer" className="block text-center text-xs font-black text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 py-4 rounded-2xl transition-all border border-cyan-500/30 uppercase tracking-widest shadow-xl">
                            💰 Support Global Radio
                        </a>
                    )}
                </div>
            </div>
        )}

        {activeTab === 'reviews' && (
            <div className="space-y-6 animate-fade-in pb-4">
                <ReviewForm onSubmit={(rating, text) => onAddReview(station.streamUrl, { rating, text, author: currentUser?.username || 'Guest', authorRole: currentUser?.role })} />
                <div className="space-y-4">
                    {allReviewsForStation.length === 0 && (
                        <div className="py-12 text-center">
                            <p className="text-gray-600 font-bold">No vibes shared yet.</p>
                            <p className="text-xs text-gray-700 mt-1 uppercase tracking-tighter">Be the first to rate this station.</p>
                        </div>
                    )}
                    {allReviewsForStation.map((review, index) => (
                        <div key={index} className="p-4 bg-gray-900/30 rounded-2xl border border-white/5 hover:border-white/10 transition-colors shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm text-white">
                                        {review.author}
                                    </span>
                                    {review.authorRole && <RoleBadge role={review.authorRole} className="h-3 w-3" />}
                                </div>
                                <StarRating rating={review.rating} readOnly starClassName="h-3 w-3" />
                            </div>
                            <p className="text-sm text-gray-400 leading-relaxed font-medium">"{review.text}"</p>
                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter text-right mt-3 opacity-60">{formatTimeAgo(review.createdAt)}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'guestbook' && (
            <div className="animate-fade-in pb-4">
                <StationGuestbook 
                    entries={station.guestbook || []} 
                    onAddEntry={onAddGuestbookEntry} 
                    currentUser={currentUser} 
                    stationStreamUrl={station.streamUrl}
                />
            </div>
        )}
      </div>

      <RequestSongModal 
          isOpen={isRequestSongModalOpen} 
          onClose={() => setIsRequestSongModalOpen(false)} 
          stationName={station.name} 
          onSubmit={() => console.log('Song request submitted!')} 
      />
    </div>
  );
};

const RadioIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /></svg>;