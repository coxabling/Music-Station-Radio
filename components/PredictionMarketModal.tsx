import React, { useState, useEffect, useMemo } from 'react';
import type { Bet, SongVote } from '../types';
import { StarIcon, MOCK_MARKET_TRENDS, MOCK_PROSPECTS, FireIcon, ClockIcon } from '../constants';

interface PredictionMarketModalProps {
  isOpen: boolean;
  onClose: () => void;
  userPoints: number;
  activeBets: Bet[];
  onPlaceBet: (songTitle: string, artist: string, amount: number, odds: number) => void;
  trendingSongs: SongVote[];
}

const TrendingUpIcon = ({className = ""}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const HistoryIcon = ({className = ""}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

export const PredictionMarketModal: React.FC<PredictionMarketModalProps> = ({ isOpen, onClose, userPoints, activeBets, onPlaceBet, trendingSongs }) => {
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const [betAmount, setBetAmount] = useState(100);
  const [activeTab, setActiveTab] = useState<'market' | 'my-bets' | 'history'>('market');
  
  // Combine real trending songs with mock high-energy prospects
  const marketList = useMemo(() => {
      const realSongs = trendingSongs.map(s => ({
          ...s,
          odds: Math.max(1.5, (50 / (s.likes + 1))),
          isHot: s.likes > 10
      }));
      
      const combined = [...realSongs, ...MOCK_PROSPECTS.map(p => ({ ...p, isHot: p.odds < 3 }))];
      return combined.sort((a, b) => (a.odds || 99) - (b.odds || 99));
  }, [trendingSongs]);

  const handleBet = () => {
    if (!selectedSong) return;
    onPlaceBet(selectedSong.title, selectedSong.artist, betAmount, selectedSong.odds);
    setSelectedSong(null);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-[#030712] border border-gray-800 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-5xl max-h-[90vh] flex flex-col animate-slide-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Market Ticker */}
        <div className="bg-cyan-500/10 border-b border-cyan-500/20 py-2 overflow-hidden">
            <div className="animate-scroll whitespace-nowrap flex gap-12 px-4">
                {[...MOCK_MARKET_TRENDS, ...MOCK_MARKET_TRENDS].map((trend, i) => (
                    <div key={i} className="inline-flex items-center gap-2 text-[10px] font-black tracking-widest uppercase">
                        <span className="text-gray-400">{trend.artist} - {trend.title}</span>
                        <span className={trend.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {trend.change >= 0 ? '▲' : '▼'} {Math.abs(trend.change)}%
                        </span>
                        <span className="text-gray-600 font-mono">VOL: {trend.volume.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        </div>

        <header className="p-6 border-b border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-[var(--accent-color)] text-black rounded-2xl shadow-lg shadow-[var(--accent-color)]/20">
                    <TrendingUpIcon className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white font-orbitron tracking-tight leading-none">
                        HIT MARKET
                    </h2>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mt-1">Predictions close in <span className="text-orange-500 font-mono">14:02:15</span></p>
                </div>
            </div>

            <div className="flex bg-gray-900 rounded-2xl p-1 border border-gray-800">
                <button onClick={() => setActiveTab('market')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'market' ? 'bg-gray-800 text-white shadow-inner' : 'text-gray-500 hover:text-gray-300'}`}>Market</button>
                <button onClick={() => setActiveTab('my-bets')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'my-bets' ? 'bg-gray-800 text-white shadow-inner' : 'text-gray-500 hover:text-gray-300'}`}>Wagers ({activeBets.length})</button>
                <button onClick={() => setActiveTab('history')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-gray-800 text-white shadow-inner' : 'text-gray-500 hover:text-gray-300'}`}>Results</button>
            </div>

            <div className="hidden lg:flex items-center gap-3 px-5 py-2.5 bg-gray-900 border border-yellow-500/20 rounded-2xl text-yellow-500">
                <StarIcon className="w-5 h-5"/>
                <span className="font-mono font-black text-lg">{userPoints.toLocaleString()}</span>
            </div>
        </header>

        <div className="flex-grow overflow-hidden flex flex-col lg:flex-row">
            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {activeTab === 'market' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {marketList.map((song: any) => (
                            <button 
                                key={song.id}
                                onClick={() => setSelectedSong(song)}
                                className={`group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 text-left ${selectedSong?.id === song.id ? 'bg-[var(--accent-color)]/10 border-[var(--accent-color)] ring-1 ring-[var(--accent-color)]/30' : 'bg-gray-900/40 border-gray-800 hover:border-gray-600 hover:bg-gray-900/60'}`}
                            >
                                <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                                    <img src={song.albumArt} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                                    {song.isHot && <div className="absolute top-1 right-1"><FireIcon className="w-3 h-3 text-orange-500 drop-shadow-md"/></div>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-black text-white text-base truncate leading-none mb-1">{song.title}</h3>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wide truncate">{song.artist}</p>
                                    <div className="w-full bg-gray-800 h-1 rounded-full mt-3 overflow-hidden">
                                        <div className="bg-cyan-500 h-full transition-all" style={{width: `${Math.min(100, (song.likes || 1) * 10)}%`}}></div>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0 flex flex-col gap-1">
                                    <span className="text-xs text-gray-600 font-black uppercase tracking-tighter">Multiplier</span>
                                    <span className={`text-xl font-mono font-black ${song.odds < 3 ? 'text-green-400' : song.odds > 10 ? 'text-purple-400' : 'text-cyan-400'}`}>
                                        {song.odds.toFixed(1)}x
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {activeTab === 'my-bets' && (
                    <div className="space-y-4">
                        {activeBets.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-600 opacity-40">
                                <ClockIcon className="w-16 h-16 mb-4" />
                                <p className="font-black uppercase tracking-widest">No Active Wagers</p>
                            </div>
                        ) : (
                            activeBets.map(bet => (
                                <div key={bet.id} className="bg-gray-900/60 border border-gray-800 p-5 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div className="flex items-center gap-5 flex-1 w-full">
                                        <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center text-cyan-400 border border-gray-700">
                                            <TrendingUpIcon className="w-6 h-6" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-black text-white text-lg leading-none mb-1 truncate">{bet.songTitle}</h4>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{bet.artist}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8 md:px-8 border-x border-gray-800">
                                        <div className="text-center">
                                            <p className="text-[10px] text-gray-600 font-black uppercase mb-1">Staked</p>
                                            <p className="text-yellow-500 font-black text-lg">{bet.amount}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] text-gray-600 font-black uppercase mb-1">Odds</p>
                                            <p className="text-cyan-400 font-black text-lg">{bet.odds}x</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-gray-600 font-black uppercase mb-1">Potential Payout</p>
                                        <p className="text-green-400 font-black text-xl">{bet.potentialPayout.toLocaleString()} pts</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="space-y-4">
                        <div className="bg-gradient-to-br from-purple-900/20 to-gray-900 p-6 rounded-3xl border border-purple-500/20 text-center mb-8">
                            <h3 className="text-purple-400 font-black font-orbitron text-xl mb-1 uppercase">Previous Cycle Winner</h3>
                            <p className="text-white text-4xl font-black tracking-tighter mb-2">LAST LAST</p>
                            <p className="text-gray-400 font-bold text-sm uppercase">Burner Boy - Payout: 12.4x</p>
                            <div className="flex justify-center gap-1 mt-4">
                                {[...Array(3)].map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_purple]"></div>)}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-2 px-2">Cycle Archives</p>
                            {[
                                { date: 'Yesterday', title: 'Essence', artist: 'Wizkid', payout: '3.2x', winners: 45 },
                                { date: 'May 14', title: 'Calm Down', artist: 'Rema', payout: '1.8x', winners: 112 },
                                { date: 'May 12', title: 'Buga', artist: 'Kizz Daniel', payout: '25.0x', winners: 4 },
                            ].map((h, i) => (
                                <div key={i} className="flex justify-between items-center p-4 bg-gray-900/40 rounded-2xl border border-gray-800/50 text-sm">
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-mono text-gray-600">{h.date}</span>
                                        <span className="font-bold text-gray-300">{h.title}</span>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="text-gray-500 text-xs font-bold">{h.winners} Winners</span>
                                        <span className="text-green-500 font-black font-mono">{h.payout}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Betting Sidebar */}
            <aside className="w-full lg:w-80 bg-gray-900/30 p-6 border-l border-gray-800 flex flex-col gap-6">
                <div className="bg-[#030712] rounded-3xl p-6 border border-gray-800 shadow-xl">
                    <h3 className="text-xs font-black text-gray-600 uppercase tracking-[0.2em] mb-4">Betting Slip</h3>
                    {selectedSong ? (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <h4 className="text-lg font-black text-white leading-none truncate">{selectedSong.title}</h4>
                                <p className="text-xs text-[var(--accent-color)] font-bold uppercase tracking-widest mt-1">{selectedSong.artist}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 py-4 border-y border-gray-800">
                                <div>
                                    <p className="text-[10px] text-gray-600 font-black uppercase mb-1">Odds</p>
                                    <p className="text-xl font-black text-white font-mono">{selectedSong.odds.toFixed(1)}x</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-600 font-black uppercase mb-1">Market Vol</p>
                                    <p className="text-xl font-black text-white font-mono">{(selectedSong.volume || 1000).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Wager Points</label>
                                    <button onClick={() => setBetAmount(userPoints)} className="text-[9px] text-cyan-400 font-black uppercase hover:underline">Max</button>
                                </div>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        min="10" 
                                        max={userPoints}
                                        value={betAmount} 
                                        onChange={(e) => setBetAmount(Math.max(0, parseInt(e.target.value) || 0))}
                                        className="w-full bg-black/50 border border-gray-700 rounded-2xl py-4 px-5 text-xl font-black text-white focus:outline-none focus:border-[var(--accent-color)] transition-all pr-12"
                                    />
                                    <StarIcon className="w-5 h-5 text-yellow-500 absolute right-4 top-1/2 -translate-y-1/2" />
                                </div>
                                <div className="bg-green-500/10 rounded-2xl p-4 flex justify-between items-center border border-green-500/20">
                                    <span className="text-[10px] text-green-500 font-black uppercase">Est. Return</span>
                                    <span className="text-green-400 font-black text-xl font-mono">{(betAmount * selectedSong.odds).toFixed(0)}</span>
                                </div>
                            </div>

                            <button 
                                onClick={handleBet}
                                disabled={betAmount > userPoints || betAmount < 10}
                                className="w-full bg-[var(--accent-color)] hover:brightness-110 disabled:opacity-50 disabled:grayscale text-black font-black py-5 rounded-2xl transition-all shadow-[0_0_30px_rgba(250,204,21,0.2)] uppercase tracking-widest text-sm"
                            >
                                Place Wager
                            </button>
                            <button onClick={() => setSelectedSong(null)} className="w-full text-gray-600 font-black text-[10px] uppercase hover:text-white transition-colors">Discard Slip</button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 bg-gray-900 rounded-full border border-dashed border-gray-700 mb-4 flex items-center justify-center text-gray-700">?</div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest px-4">Select a prospect from the market to start your slip.</p>
                        </div>
                    )}
                </div>

                <div className="flex-1 rounded-3xl bg-black border border-gray-800 p-6 flex flex-col justify-center items-center text-center">
                     <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.3em] mb-2">Market Liquidity</p>
                     <p className="text-2xl font-black text-white mb-2">1,245,502 <StarIcon className="inline w-5 h-5 text-yellow-500 mb-1"/></p>
                     <p className="text-xs text-gray-500">Across 14 active prediction cycles.</p>
                </div>
            </aside>
        </div>
      </div>
      <style>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-scroll {
            animation: scroll 60s linear infinite;
        }
        @keyframes slide-up {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};