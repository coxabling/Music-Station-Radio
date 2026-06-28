import React, { useState, useEffect, useCallback } from 'react';
import type { NowPlaying, Station } from '../types';
import { generateSongCard } from '../utils/cardGenerator';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  nowPlaying: NowPlaying | null;
  station: Station | null;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col justify-center items-center h-full text-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent-color)] mb-4"></div>
    <p className="text-gray-300 font-semibold">Generating your song card...</p>
    <p className="text-xs text-gray-500">This may take a moment.</p>
  </div>
);

const DownloadIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;


export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, nowPlaying, station }) => {
  const [cardImageUrl, setCardImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && nowPlaying && station) {
      setIsLoading(true);
      setError('');
      setCardImageUrl(null);
      
      // Generate card
      generateSongCard(nowPlaying, station)
        .then(url => {
          setCardImageUrl(url);
        })
        .catch(err => {
          console.error("Card generation failed:", err);
          setError('Could not generate the song card. Please try again.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, nowPlaying, station]);
  
  const handleDownload = useCallback(() => {
    if (!cardImageUrl || !nowPlaying) return;
    
    const link = document.createElement('a');
    link.href = cardImageUrl;
    const artist = nowPlaying.artist.replace(/[^a-zA-Z0-9]/g, '_');
    const title = nowPlaying.title.replace(/[^a-zA-Z0-9]/g, '_');
    link.download = `music-station-radio-${artist}-${title}.png`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  }, [cardImageUrl, nowPlaying]);

  const getShareUrl = () => {
    const origin = window.location.origin + window.location.pathname;
    if (station) {
      const params = new URLSearchParams();
      params.set('station', station.streamUrl);
      if (nowPlaying) {
        params.set('track', nowPlaying.title);
        params.set('artist', nowPlaying.artist);
      }
      return `${origin}?${params.toString()}`;
    }
    return origin;
  };

  const shareToX = () => {
    const text = nowPlaying 
      ? `Listening to "${nowPlaying.title}" by ${nowPlaying.artist} on ${station?.name || 'Music Station Radio'}! 🎶📻 Tune in: ` 
      : `Tuning in to ${station?.name || 'Music Station Radio'}! 🎶📻 Tune in: `;
    const shareUrl = getShareUrl();
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(xUrl, '_blank', 'noopener,noreferrer');
  };

  const shareToFacebook = () => {
    const shareUrl = getShareUrl();
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer');
  };

  const shareToWhatsApp = () => {
    const text = nowPlaying 
      ? `Listening to "${nowPlaying.title}" by ${nowPlaying.artist} on ${station?.name || 'Music Station Radio'}! 🎶📻 ` 
      : `Tuning in to ${station?.name || 'Music Station Radio'}! 🎶📻 `;
    const shareUrl = getShareUrl();
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + shareUrl)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    const shareUrl = getShareUrl();
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error("Failed to copy link:", err);
      });
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div 
        className="bg-gray-800/80 backdrop-blur-lg border accent-color-border/30 rounded-xl shadow-2xl shadow-black/50 w-full max-w-lg flex flex-col animate-slide-up-fast overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-700/50 flex justify-between items-center">
          <h2 id="share-modal-title" className="text-lg font-bold accent-color-text font-orbitron">
            Share Track & Station
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>
        
        <div className="p-4 h-[260px] flex items-center justify-center bg-gray-950/40 border border-white/5 rounded-xl mx-6 mt-4">
          {isLoading && <LoadingSpinner />}
          {error && <p className="text-center text-red-400">{error}</p>}
          {cardImageUrl && <img src={cardImageUrl} alt="Generated song card" className="max-w-full max-h-full object-contain rounded-lg shadow-lg" />}
        </div>

        {/* Quick Social Media Sharing Section */}
        <div className="px-6 py-4 flex flex-col gap-3">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider text-center">
            Quick Share to Social Networks
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button 
              onClick={shareToX}
              className="flex items-center justify-center gap-2 bg-black/40 hover:bg-black border border-white/10 hover:border-white/20 text-white transition-all py-2 rounded-xl text-xs font-semibold"
              title="Share on X"
            >
              <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>X (Twitter)</span>
            </button>

            <button 
              onClick={shareToFacebook}
              className="flex items-center justify-center gap-2 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/20 text-[#1877F2] transition-all py-2 rounded-xl text-xs font-semibold"
              title="Share on Facebook"
            >
              <svg className="w-4 h-4 fill-current text-[#1877F2]" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Facebook</span>
            </button>

            <button 
              onClick={shareToWhatsApp}
              className="flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 text-[#25D366] transition-all py-2 rounded-xl text-xs font-semibold"
              title="Share on WhatsApp"
            >
              <svg className="w-4 h-4 fill-current text-[#25D366]" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.975 14.069 1.5 11.999 1.5c-5.439 0-9.865 4.371-9.87 9.8-.002 1.73.454 3.42 1.32 4.922L2.422 21.6l5.421-1.42.002-.003-.198-.103z"/>
              </svg>
              <span>WhatsApp</span>
            </button>

            <button 
              onClick={handleCopyLink}
              className={`flex items-center justify-center gap-2 border transition-all py-2 rounded-xl text-xs font-semibold ${copied ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-gray-700/40 hover:bg-gray-700/60 border-white/10 text-gray-300'}`}
              title="Copy link to clipboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>
        
        <footer className="p-4 border-t border-gray-700/50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-950/20">
            <button
                onClick={handleDownload}
                disabled={isLoading || !cardImageUrl}
                className="w-full sm:w-auto flex items-center justify-center bg-[var(--accent-color)] hover:opacity-80 text-black font-bold py-2 px-4 rounded-xl text-xs transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <DownloadIcon />
                Download Lyric Card
            </button>
            <p className="text-[10px] text-gray-500 text-center sm:text-right leading-snug">
              Card includes artwork, currently playing song credentials, and dynamic audio signatures.
            </p>
        </footer>
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