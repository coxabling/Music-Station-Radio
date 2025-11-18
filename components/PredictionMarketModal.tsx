
import React, { useState } from 'react';
import type { Bet, SongVote } from '../types';
import { StarIcon } from '../constants';

interface PredictionMarketModalProps {
  isOpen: boolean;
  onClose: () => void;
  userPoints: number;
  activeBets: Bet[];
  onPlaceBet: (songTitle: string, artist: string, amount: number, odds: number) => void;
  trendingSongs: SongVote[];
}

const TrendingUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;

export const PredictionMarketModal: React.FC<PredictionMarketModalProps> = ({ isOpen, onClose, userPoints, activeBets, onPlaceBet, trendingSongs }) => {
  const [selectedSong, setSelectedSong] = useState<SongVote | null>(null);
  const [betAmount, setBetAmount] = useState(100);
  
  // Filter for top songs to bet on (e.g., those not already in top 3 but rising)
  const candidates = trendingSongs.slice(3, 10); 

  const handleBet = () => {
    if (!selectedSong) return;
    // Simple odds simulation: higher likes = lower odds
    const odds = Math.max(1.5, (50 / (selectedSong.likes + 1))).toFixed(2);
    onPlaceBet(selectedSong.title, selectedSong.artist, betAmount, parseFloat(odds));
    setSelectedSong(null);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800/90 backdrop-blur-xl border accent-color-border/30 rounded-xl shadow-2xl shadow-black/50 w-full max-w-2xl max-h-[85vh] flex flex-col animate-slide-up-fast"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-5 border-b border-gray-700/50 flex justify-between items-center">
            <div>
                <h2 className="text-xl font-bold accent-color-text font-orbitron flex items-center gap-2">
                    <TrendingUpIcon /> Hit Prediction Market
                </h2>
                <p className="text-xs text-gray-400 mt-1">Bet on which song will reach the Top 3 this week!</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </header>

        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Market Section */}
            <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Rising Stars</h3>
                <div className="space-y-2">
                    {candidates.map(song => {
                        const odds = Math.max(1.5, (50 / (song.likes + 1))).toFixed(2);
                        const isSelected = selectedSong?.id === song.id;
                        return (
                            <button 
                                key={song.id}
                                onClick={() => setSelectedSong(song)}
                                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${isSelected ? 'bg-[var(--accent-color)]/20 border-[var(--accent-color)]' : 'bg-gray-700/30 border-transparent hover:bg-gray-700/50'}`}
                            >
                                <div className="flex items-center gap-3 text-left overflow-hidden">
                                    <img src={song.albumArt} className="w-10 h-10 rounded-md object-cover" alt="" />
                                    <div className="min-w-0">
                                        <p className="font-semibold text-white truncate text-sm">{song.title}</p>
                                        <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <span className="text-cyan-300 font-mono font-bold">{odds}x</span>
                                </div>
                            </button>
                        )
                    })}
                    {candidates.length === 0 && <p className="text-gray-500 text-sm">No candidates available right now.</p>}
                </div>
            </div>

            {/* Betting Slip & Active Bets */}
            <div className="flex flex-col gap-6">
                
                {/* Slip */}
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
                    <h3 className="text-sm font-bold text-gray-300 mb-3">Betting Slip</h3>
                    {selectedSong ? (
                        <div className="space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-white font-bold">{selectedSong.title}</p>
                                    <p className="text-xs text-gray-400">Payout: <span className="text-green-400 font-mono">{Math.max(1.5, (50 / (selectedSong.likes + 1))).toFixed(2)}x</span></p>
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">Wager Amount</label>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="number" 
                                        min="10" 
                                        max={userPoints}
                                        value={betAmount} 
                                        onChange={(e) => setBetAmount(parseInt(e.target.value))}
                                        className="w-full bg-gray-800 border border-gray-600 rounded-md py-1.5 px-3 text-white focus:outline-none focus:border-cyan-500"
                                    />
                                    <span className="text-yellow-400"><StarIcon className="w-4 h-4" /></span>
                                </div>
                                <div className="flex justify-between text-xs mt-1">
                                    <span className="text-gray-500">Balance: {userPoints}</span>
                                    <span className="text-green-400">Potential Win: {Math.floor(betAmount * parseFloat(Math.max(1.5, (50 / (selectedSong.likes + 1))).toFixed(2)))}</span>
                                </div>
                            </div>

                            <button 
                                onClick={handleBet}
                                disabled={betAmount > userPoints || betAmount <= 0}
                                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Place Bet
                            </button>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-4">Select a song to place a bet.</p>
                    )}
                </div>

                {/* Active Bets */}
                <div className="flex-grow overflow-y-auto">
                     <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Your Active Bets</h3>
                     <div className="space-y-2">
                        {activeBets.map(bet => (
                            <div key={bet.id} className="bg-gray-700/30 p-3 rounded-lg flex justify-between items-center text-sm">
                                <div>
                                    <p className="text-white font-semibold">{bet.songTitle}</p>
                                    <p className="text-xs text-gray-400">{bet.artist}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-yellow-400 font-mono">{bet.amount} pts</p>
                                    <p className="text-xs text-green-400">To win: {bet.potentialPayout}</p>
                                </div>
                            </div>
                        ))}
                        {activeBets.length === 0 && <p className="text-gray-500 text-sm italic">No active bets.</p>}
                     </div>
                </div>

            </div>

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
