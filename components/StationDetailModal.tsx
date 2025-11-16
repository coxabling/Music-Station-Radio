import React, { useState, useMemo } from 'react';
import type { Station, StationReview } from '../types';
import { StarRating } from './StarRating';
import { formatTimeAgo } from '../utils/time';

interface StationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  station: Station | null;
  allStations: Station[];
  mockReviews: Record<string, StationReview[]>;
  userReviews: StationReview[];
  onAddReview: (stationUrl: string, review: Omit<StationReview, 'createdAt' | 'author'>) => void;
  onSelectStation: (station: Station) => void;
  onRateStation: (stationUrl: string, rating: number) => void;
  userRating: number;
}

type ActiveTab = 'reviews' | 'similar';

const PlayIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M10 3.546l-6.38 8.195A2 2 0 005.46 15H14.54a2 2 0 001.84-3.259L10 3.546z" transform="rotate(90 10 10)" /></svg>;


const TabButton: React.FC<{label: string; isActive: boolean; onClick: () => void}> = ({ label, isActive, onClick }) => (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors focus:outline-none ${ isActive ? 'bg-gray-700/50 text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]' : 'text-gray-400 hover:text-white' }`}>{label}</button>
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

export const StationDetailModal: React.FC<StationDetailModalProps> = (props) => {
  const { isOpen, onClose, station, allStations, mockReviews, userReviews, onAddReview, onSelectStation, onRateStation, userRating } = props;
  const [activeTab, setActiveTab] = useState<ActiveTab>('reviews');

  const similarStations = useMemo(() => {
    if (!station) return [];
    const currentGenre = station.genre.split('/')[0].trim().toLowerCase();
    return allStations.filter(s => 
      s.streamUrl !== station.streamUrl && 
      s.genre.toLowerCase().includes(currentGenre)
    ).slice(0, 5);
  }, [station, allStations]);

  const allReviewsForStation = useMemo(() => {
    if (!station) return [];
    const combined = [
        ...(mockReviews[station.streamUrl] || []),
        ...userReviews
    ];
    return combined.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [station, mockReviews, userReviews]);

  if (!isOpen || !station) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
    >
      <div 
        className="bg-gray-800/80 backdrop-blur-lg border accent-color-border/30 rounded-xl shadow-2xl shadow-black/50 w-full max-w-lg max-h-[80vh] flex flex-col animate-slide-up-fast"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-700/50 flex justify-between items-start gap-4">
          <div className="flex items-start gap-4">
            <img src={station.coverArt} alt={station.name} className="w-20 h-20 rounded-lg object-cover shadow-lg" />
            <div>
                <h2 id="detail-modal-title" className="text-xl font-bold accent-color-text font-orbitron">{station.name}</h2>
                <p className="text-sm text-gray-300">{station.genre}</p>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">{station.description}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors flex-shrink-0" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>

        <div className="px-4 pt-4 flex items-center justify-between gap-4">
            <div>
                <p className="text-xs text-gray-400 mb-1">Your Rating</p>
                <StarRating rating={userRating} onRate={(r) => onRateStation(station.streamUrl, r)} starClassName="h-6 w-6"/>
            </div>
            <button onClick={() => onSelectStation(station)} className="flex items-center gap-2 bg-[var(--accent-color)] hover:opacity-80 text-black font-bold py-2.5 px-6 rounded-md transition-opacity">
                <PlayIcon className="h-5 w-5"/>
                Tune In
            </button>
        </div>
        
        <div className="border-b border-gray-700/50 px-4 mt-4">
            <nav className="flex space-x-2" role="tablist">
                <TabButton label={`Reviews (${allReviewsForStation.length})`} isActive={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} />
                <TabButton label="Listeners Also Like" isActive={activeTab === 'similar'} onClick={() => setActiveTab('similar')} />
            </nav>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          {activeTab === 'reviews' && (
            <div className="space-y-4">
                <ReviewForm onSubmit={(rating, text) => onAddReview(station.streamUrl, { rating, text })} />
                <div className="space-y-3">
                    {allReviewsForStation.map((review, index) => (
                        <div key={index} className="p-3 bg-gray-700/30 rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-sm text-white">{review.author}</span>
                                <StarRating rating={review.rating} readOnly starClassName="h-4 w-4" />
                            </div>
                            <p className="text-sm text-gray-300">{review.text}</p>
                            <p className="text-xs text-gray-500 text-right mt-1">{formatTimeAgo(review.createdAt)}</p>
                        </div>
                    ))}
                </div>
            </div>
          )}

          {activeTab === 'similar' && (
             <ul className="space-y-3">
              {similarStations.map(s => (
                <li key={s.streamUrl}>
                  <button onClick={() => onSelectStation(s)} className="w-full text-left flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <img src={s.coverArt} alt={s.name} className="w-12 h-12 rounded-md object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">{s.name}</p>
                        <p className="text-sm text-gray-400 truncate">{s.genre}</p>
                    </div>
                    <StarRating rating={s.rating || 0} readOnly starClassName="h-4 w-4 flex-shrink-0" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fade-in-fast { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in-fast { animation: fade-in-fast 0.3s ease-out; }
        @keyframes slide-up-fast { from { transform: translateY(20px) scale(0.98); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        .animate-slide-up-fast { animation: slide-up-fast 0.3s ease-out; }
      `}</style>
    </div>
  );
};