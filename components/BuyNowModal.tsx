
import React from 'react';
import type { NowPlaying } from '../types';

// --- Icon Components ---
const AmazonIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.94,15.72a.49.49,0,0,0-.73,0L14.44,17a1.52,1.52,0,0,1-2.12,0l-1.77-1.28a.49.49,0,0,0-.73,0l-1.31,1a.51.51,0,0,0,0,.73l1.1,1.1a.52.52,0,0,0,.74,0l.47-.36a3.52,3.52,0,0,0,4.88,0l.47.36a.52.52,0,0,0,.74,0l1.1-1.1a.51.51,0,0,0,0-.73ZM12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm3.48,8.23a1,1,0,0,1-1,1H13.26V15.5a1,1,0,0,1-2,0V11.23H10.15a1,1,0,0,1,0-2h5.33A1,1,0,0,1,15.48,10.23Z"/>
    </svg>
);
const AppleMusicIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.88,8.27v8.01c0,2.15-1.74,3.89-3.89,3.89s-3.89-1.74-3.89-3.89V9.8c0-2.15-1.74-3.89-3.89-3.89S7.21,7.65,7.21,9.8v6.78c0,0.28-0.22,0.5-0.5,0.5s-0.5-0.22-0.5-0.5V9.8c0-2.7,2.19-4.89,4.89-4.89s4.89,2.19,4.89,4.89v8.01c0,2.7,2.19,4.89,4.89,4.89s4.89-2.19,4.89-4.89V8.27c0-0.28-0.22-0.5-0.5-0.5S18.88,7.99,18.88,8.27z"/>
        <path d="M12.75,8.81c0.41-0.29,0.92-0.45,1.48-0.45c0.55,0,1.06,0.16,1.48,0.45c0.82,0.59,1.33,1.55,1.33,2.63s-0.51,2.04-1.33,2.63c-0.41,0.29-0.92,0.45-1.48,0.45c-0.55,0-1.06-0.16-1.48-0.45c-0.82-0.59-1.33-1.55-1.33-2.63S11.93,9.4,12.75,8.81z"/>
    </svg>
);
const SpotifyIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 496 496" fill="currentColor">
        <path d="M248,0C111,0,0,111,0,248S111,496,248,496s248-111,248-248S385,0,248,0z M367.6,361.3c-4.4,7.3-13.6,9.8-20.9,5.4
	c-59-36.2-133.2-44.4-222.5-24.3c-8.5,1.9-17-3.2-18.8-11.7c-1.9-8.5,3.2-17,11.7-18.8c96.6-21.6,178.1-12.6,244.1,28
	c7.3,4.4,9.8,13.6,5.4,20.9V361.3z M400.3,293.1c-5.5,8.8-17,11.7-25.8,6.2c-67.4-40.9-169.9-52.9-249.2-29.2
	c-10,3-20.4-3.1-23.4-13.1c-3-10,3.1-20.4,13.1-23.4c87.3-26.1,196.7-12.8,272,32.7c8.8,5.5,11.7,17,6.2,25.8L400.3,293.1z
	 M403.9,221.7c-6.8,10.7-20.2,14.5-30.9,7.7c-77.5-47-203.3-50.2-282.5-27.9c-11.5,3.2-23.4-3.9-26.6-15.4
	c-3.2-11.5,3.9-23.4,15.4-26.6C261.2,137,395.7,140.4,482,192.2c10.7,6.8,14.5,20.2,7.7,30.9L403.9,221.7z"/>
    </svg>
);
const ExternalLinkIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>;

interface BuyNowModalProps {
  isOpen: boolean;
  onClose: () => void;
  nowPlaying: NowPlaying | null;
}

export const BuyNowModal: React.FC<BuyNowModalProps> = ({ isOpen, onClose, nowPlaying }) => {
    if (!isOpen || !nowPlaying) return null;

    const handleLinkClick = (platform: 'amazon' | 'apple' | 'spotify') => {
        const searchQuery = encodeURIComponent(`${nowPlaying.artist} ${nowPlaying.title}`);
        let url = '';

        switch (platform) {
            case 'amazon':
                url = `https://music.amazon.com/search/${searchQuery}`;
                break;
            case 'apple':
                url = `https://music.apple.com/us/search?term=${searchQuery}`;
                break;
            case 'spotify':
                url = `https://open.spotify.com/search/${searchQuery}`;
                break;
        }
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    return (
        <div 
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="buy-now-modal-title"
        >
            <div 
                className="bg-gray-800/80 backdrop-blur-lg border accent-color-border/30 rounded-xl shadow-2xl shadow-black/50 w-full max-w-sm flex flex-col animate-slide-up-fast text-center"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-4 border-b border-gray-700/50 flex justify-between items-center">
                    <div className="flex-1"></div>
                    <h2 id="buy-now-modal-title" className="text-lg font-bold accent-color-text font-orbitron text-center">
                        Purchase Song
                    </h2>
                    <div className="flex-1 flex justify-end">
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </header>
                
                <div className="p-6 flex flex-col items-center">
                    <img src={nowPlaying.albumArt} alt={nowPlaying.title} className="w-32 h-32 rounded-lg shadow-lg mb-4 object-cover" />
                    <h3 className="text-xl font-bold text-white truncate w-full" title={nowPlaying.title}>{nowPlaying.title}</h3>
                    <p className="text-md text-gray-300 truncate w-full" title={nowPlaying.artist}>{nowPlaying.artist}</p>
                    
                    <button
                        onClick={() => handleLinkClick('amazon')}
                        className="mt-6 w-full flex items-center justify-center gap-2 bg-[#00A8E1] hover:opacity-90 text-white font-bold py-3 px-4 rounded-md transition-opacity duration-300"
                    >
                        <AmazonIcon className="w-6 h-6"/>
                        Buy on Amazon Music
                        <ExternalLinkIcon className="w-4 h-4" />
                    </button>
                    
                    <div className="mt-6 w-full">
                        <p className="text-center text-sm text-gray-400 mb-3">Or check other stores</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => handleLinkClick('apple')} title="Search on Apple Music" className="p-3 bg-gray-700/50 rounded-full text-white hover:bg-gray-700 transition-colors"><AppleMusicIcon className="w-6 h-6"/></button>
                            <button onClick={() => handleLinkClick('spotify')} title="Search on Spotify" className="p-3 bg-gray-700/50 rounded-full text-white hover:bg-gray-700 transition-colors"><SpotifyIcon className="w-6 h-6"/></button>
                        </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-6">
                        You will be redirected to an external site. Prices and availability may vary.
                    </p>
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
