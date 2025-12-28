
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

const TagPill: React.FC<{ tag: string }> = ({ tag }) => (
    <span className="px-2 py-0.5 rounded bg-gray-800 border border-gray-700 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
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
        <form onSubmit={handleSubmit} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
            <h4 className="font-semibold mb-2 text-white">Leave a Review</h4>
            <div className="mb-2">
                <StarRating rating={rating} onRate={setRating} starClassName="h-6 w-6" />
            </div>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share your thoughts..."
                rows={3}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] transition-all"
            />
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
            <button type="submit" className="mt-2 w-full bg-[var(--accent-color)] hover:opacity-80 text-black font-bold py-2 px-4 rounded-md transition-opacity">
                Submit Review
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
      <div className="p-4 h-full flex flex-col items-center justify-center text-center text-gray-500">
        <RadioIcon className="w-12 h-12 mb-4 opacity-20" />
        <p>Select a station from the list to view its information, reviews, and guestbook.</p>
      </div>
    );
  }

  const TabButton: React.FC<{label: string; tab: ActiveTab}> = ({ label, tab }) => (
    <button 
        onClick={() => setActiveTab(tab)} 
        className={`flex-1 py-2 text-sm font-semibold transition-colors focus:outline-none ${activeTab === tab ? 'text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]' : 'text-gray-400 hover:text-white border-b-2 border-transparent'}`}
    >
        {label}
    </button>
  );

  const claimPendingForCurrentUser = !!(station.claimRequest && currentUser && station.claimRequest.username === currentUser.username);

  const tags = station.genre.split(',').map(t => t.trim()).filter(t => t !== '');

  return (
    <div className="h-full flex flex-col p-4 animate-fade-in">
      <div className="flex-shrink-0 flex items-start gap-4 mb-4">
        <div className="relative group">
            <img src={station.coverArt} alt={station.name} className="w-24 h-24 rounded-lg object-cover shadow-lg border border-white/5 transition-transform duration-300 group-hover:scale-105" />
            <button 
                onClick={() => onToggleFavorite(station)} 
                className="absolute -top-2 -right-2 p-1.5 bg-black/70 rounded-full transition-all hover:scale-110 hover:bg-black/90 shadow-lg"
                aria-label={station.isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
                <HeartIcon isFavorite={!!station.isFavorite} className="h-5 w-5"/>
            </button>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-white font-orbitron truncate">{station.name}</h2>
          <div className="flex flex-wrap gap-1 mt-1 mb-2">
            {tags.map(t => <TagPill key={t} tag={t} />)}
          </div>
          <div className="flex items-center">
            <StarRating rating={station.rating || 0} readOnly starClassName="h-4 w-4" />
            <span className="text-xs text-gray-500 ml-2">({(station.ratingsCount || 0).toLocaleString()} votes)</span>
          </div>
        </div>
      </div>
      
      {relevantBounties.length > 0 && (
          <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-300 text-sm flex items-center gap-2 animate-fade-in shadow-[0_0_15px_rgba(234,179,8,0.1)]">
              <FireIcon className="h-5 w-5 animate-pulse"/>
              <div>
                  <p className="font-semibold text-xs">ACTIVE BOUNTY</p>
                  <p className="text-[10px] text-yellow-200/70">Earn {relevantBounties[0].reward} pts for listening.</p>
              </div>
          </div>
      )}

      <div className="flex-shrink-0 flex flex-wrap gap-2 mb-4">
        <button onClick={() => onSelectStation(station)} className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-[var(--accent-color)] hover:brightness-110 text-black font-bold py-2 px-4 rounded-md transition-all text-sm shadow-lg shadow-[var(--accent-color)]/20">
            <PlayIcon className="h-5 w-5"/>
            Tune In
        </button>
        {isOwner && onEdit && (
            <button onClick={() => onEdit(station)} className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors text-sm">
                <EditIcon className="h-5 w-5"/>
                Edit
            </button>
        )}
        {currentUser?.role === 'artist' && station.acceptsSubmissions && (
            <button onClick={() => onOpenMusicSubmissionModal(station)} className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-md transition-colors text-sm shadow-lg shadow-purple-500/10">
                <UploadIcon className="h-5 w-5"/>
                Submit
            </button>
        )}
        {isOwner && (
            <button onClick={onOpenJingleModal} className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors text-sm">
                <JingleIcon className="h-5 w-5"/>
                Jingle
            </button>
        )}
        {!station.owner && !claimPendingForCurrentUser && currentUser && (
            <button onClick={() => onOpenClaimModal(station)} className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 font-bold py-2 px-4 rounded-md transition-colors text-sm border border-yellow-500/20">
                <ShieldCheckIcon className="h-5 w-5"/>
                Claim
            </button>
        )}
      </div>

      <div className="flex-shrink-0 border-b border-gray-700/50 mb-4">
        <nav className="flex items-center" role="tablist">
          <TabButton label="Info" tab="info" />
          <TabButton label={`Reviews (${allReviewsForStation.length})`} tab="reviews" />
          <TabButton label="Guestbook" tab="guestbook" />
        </nav>
      </div>

      <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
        {activeTab === 'info' && (
            <div className="space-y-4 animate-fade-in">
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
                    <p className="text-sm text-gray-300 leading-relaxed italic">"{station.description}"</p>
                </div>
                {station.owner && (
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center font-bold text-xs text-white border border-white/10">
                            {station.owner.charAt(0).toUpperCase()}
                        </div>
                        <p className="text-sm text-gray-400">Station managed by <span className="font-bold text-white flex items-center gap-1">{station.owner} <RoleBadge role="owner" /></span></p>
                    </div>
                )}
                
                <div className="flex flex-col gap-2 mt-4">
                     <button onClick={() => setIsRequestSongModalOpen(true)} className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition-colors text-sm border border-white/5">
                        <RequestIcon className="h-5 w-5 text-cyan-400"/>
                        Request a Track
                    </button>
                    {station.tippingUrl && (
                        <a href={station.tippingUrl} target="_blank" rel="noopener noreferrer" className="block text-center text-sm font-bold text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 py-2 rounded-md transition-all border border-cyan-500/20">
                            💰 Support Station
                        </a>
                    )}
                </div>
            </div>
        )}

        {activeTab === 'reviews' && (
            <div className="space-y-4 animate-fade-in">
                <ReviewForm onSubmit={(rating, text) => onAddReview(station.streamUrl, { rating, text, author: currentUser?.username || 'Guest', authorRole: currentUser?.role })} />
                <div className="space-y-3">
                    {allReviewsForStation.length === 0 && <p className="text-gray-500 text-center text-sm py-8">No reviews yet. Be the first to share your vibes!</p>}
                    {allReviewsForStation.map((review, index) => (
                        <div key={index} className="p-3 bg-gray-700/30 rounded-lg border border-white/5">
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-semibold text-sm text-white flex items-center gap-1.5">
                                    {review.author}
                                    {review.authorRole && <RoleBadge role={review.authorRole} />}
                                </span>
                                <StarRating rating={review.rating} readOnly starClassName="h-3 w-3" />
                            </div>
                            <p className="text-sm text-gray-400 leading-relaxed">{review.text}</p>
                            <p className="text-[10px] text-gray-600 text-right mt-1">{formatTimeAgo(review.createdAt)}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'guestbook' && (
            <div className="animate-fade-in">
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
