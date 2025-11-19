
import React, { useState } from 'react';
import type { Station, StationReview, User } from '../types';
import { StarRating } from './StarRating';
import { formatTimeAgo } from '../utils/time';
import { UploadIcon, ShieldCheckIcon, ChatBubbleIcon } from '../constants';
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
  userRating: number;
  isOwner?: boolean;
  onEdit?: (station: Station) => void;
  currentUser: User | null;
  onOpenMusicSubmissionModal: (station: Station) => void;
  onOpenClaimModal: (station: Station) => void;
}

const PlayIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M10 3.546l-6.38 8.195A2 2 0 005.46 15H14.54a2 2 0 001.84-3.259L10 3.546z" transform="rotate(90 10 10)" /></svg>;
const EditIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>;
const MicrophoneIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>;


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

export const StationInfoPanel: React.FC<StationInfoPanelProps> = (props) => {
  const { station, mockReviews, userReviews, onAddReview, onSelectStation, onRateStation, userRating, isOwner, onEdit, currentUser, onOpenMusicSubmissionModal, onOpenClaimModal } = props;
  const [activeTab, setActiveTab] = useState<'reviews' | 'guestbook'>('reviews');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const allReviewsForStation = React.useMemo(() => {
    if (!station) return [];
    const combined = [
        ...(mockReviews[station.streamUrl] || []),
        ...userReviews
    ];
    return combined.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [station, mockReviews, userReviews]);

  if (!station) {
    return (
        <div className="p-8 text-center text-gray-500">
            <p className="font-semibold">No Station Selected</p>
            <p className="text-sm mt-1">Click a station to see its details here.</p>
        </div>
    );
  }

  const claimPendingForCurrentUser = !!(station.claimRequest && currentUser && station.claimRequest.username === currentUser.username);

  // Fake guestbook data for demo since backend is mocked
  const mockGuestbookEntries = station.guestbook || [
      { id: 'g1', username: 'Listener88', message: 'Love the vibes here!', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { id: 'g2', username: 'MusicFan', message: 'Great selection today.', timestamp: new Date(Date.now() - 7200000).toISOString() },
  ];

  return (
    <div className="animate-fade-in relative">
        <header className="p-4 flex flex-col items-center text-center">
            <img src={station.coverArt} alt={station.name} className="w-24 h-24 rounded-lg object-cover shadow-lg mb-4" />
            <div>
                <h2 id="detail-modal-title" className="text-xl font-bold accent-color-text font-orbitron">{station.name}</h2>
                <p className="text-sm text-gray-300">{station.genre}</p>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">{station.description}</p>
            </div>
        </header>

        <div className="px-4 pt-4 flex flex-col items-center gap-4">
             <div className="flex flex-col items-center gap-1">
                <p className="text-xs text-gray-400">Your Rating</p>
                <StarRating rating={userRating} onRate={(r) => onRateStation(station.streamUrl, r)} starClassName="h-6 w-6"/>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center">
                {currentUser && !station.owner && !station.claimRequest && (
                    <button onClick={() => onOpenClaimModal(station)} className="flex items-center gap-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 font-bold py-2 px-3 rounded-md transition-colors text-sm">
                        <ShieldCheckIcon className="h-4 w-4"/>
                        <span>Claim</span>
                    </button>
                )}
                 {claimPendingForCurrentUser && (
                    <button disabled className="flex items-center gap-2 bg-gray-600 text-gray-400 font-bold py-2 px-3 rounded-md cursor-not-allowed text-sm">
                        <ShieldCheckIcon className="h-4 w-4"/>
                        <span>Claim Pending</span>
                    </button>
                )}
                {station.acceptsSubmissions && currentUser?.role === 'artist' && (
                    <button onClick={() => onOpenMusicSubmissionModal(station)} className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded-md transition-colors text-sm">
                        <UploadIcon className="h-4 w-4"/>
                        <span>Submit</span>
                    </button>
                )}
                {isOwner && onEdit && (
                    <button onClick={() => onEdit(station)} className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded-md transition-colors text-sm">
                        <EditIcon className="h-4 w-4"/>
                        <span>Edit</span>
                    </button>
                )}
            </div>
            
             <div className="w-full grid grid-cols-2 gap-2">
                 <button onClick={() => setIsRequestModalOpen(true)} className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2.5 px-4 rounded-md transition-colors text-sm border border-gray-600">
                    <MicrophoneIcon className="h-4 w-4"/> Request
                </button>
                 <button onClick={() => onSelectStation(station)} className="flex items-center justify-center gap-2 bg-[var(--accent-color)] hover:opacity-80 text-black font-bold py-2.5 px-4 rounded-md transition-opacity text-sm">
                    <PlayIcon className="h-5 w-5"/> Tune In
                </button>
             </div>
        </div>
        
        <div className="border-b border-gray-700/50 mt-4 px-4 flex gap-4">
            <button onClick={() => setActiveTab('reviews')} className={`pb-2 text-sm font-bold ${activeTab === 'reviews' ? 'text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]' : 'text-gray-400'}`}>Reviews</button>
            <button onClick={() => setActiveTab('guestbook')} className={`pb-2 text-sm font-bold ${activeTab === 'guestbook' ? 'text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]' : 'text-gray-400'}`}>Guestbook</button>
        </div>

        <div className="p-4 overflow-y-auto flex-grow">
            {activeTab === 'reviews' && (
                <div className="space-y-4">
                    <ReviewForm onSubmit={(rating, text) => onAddReview(station.streamUrl, { rating, text })} />
                    <div className="space-y-3">
                        {allReviewsForStation.map((review, index) => (
                            <div key={index} className="p-3 bg-gray-700/30 rounded-lg">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-semibold text-sm text-white flex items-center gap-1.5">
                                        {review.author}
                                        {review.authorRole && <RoleBadge role={review.authorRole} />}
                                    </span>
                                    <StarRating rating={review.rating} readOnly starClassName="h-4 w-4" />
                                </div>
                                <p className="text-sm text-gray-300">{review.text}</p>
                                <p className="text-xs text-gray-500 text-right mt-1">{formatTimeAgo(review.createdAt)}</p>
                            </div>
                        ))}
                        {allReviewsForStation.length === 0 && <p className="text-center text-gray-500 text-sm">No reviews yet.</p>}
                    </div>
                </div>
            )}
            {activeTab === 'guestbook' && (
                <StationGuestbook 
                    entries={mockGuestbookEntries} 
                    onAddEntry={(msg) => console.log('Guestbook entry added:', msg)} 
                    currentUser={currentUser}
                />
            )}
        </div>
        
        <RequestSongModal 
            isOpen={isRequestModalOpen} 
            onClose={() => setIsRequestModalOpen(false)} 
            stationName={station.name} 
            onSubmit={() => console.log("Request submitted")} 
        />
    </div>
  );
};
