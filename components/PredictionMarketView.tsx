
import React, { useState, useMemo, useEffect } from 'react';
import type { Bet, SongVote } from '../types';
import { StarIcon, MOCK_MARKET_TRENDS, MOCK_PROSPECTS, MOCK_MARKET_NEWS, FireIcon, ClockIcon } from '../constants';
// Fix: Import formatTimeAgo to fix the 'Cannot find name formatTimeAgo' error.
import { formatTimeAgo } from '../utils/time';

interface PredictionMarketViewProps {
  onBack: () => void;
  userPoints: number;
  activeBets: Bet[];
  onPlaceBet: (songTitle: string, artist: string, amount: number, odds: number) => void;
  trendingSongs: SongVote[];
}

const TrendingUpIcon = ({className = ""}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>;
const ChartIcon = ({className = ""}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const NewspaperIcon = ({className = ""}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>;

const Sparkline: React.FC<{ data: number[], color: string }> = ({ data, color }) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - ((d - min) / range) * 100}`).join(' ');
    
    return (
        <svg viewBox="0 0 100 100" className="w-16 h-8 overflow-visible" preserveAspectRatio="none">
            <polyline fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" points={points} />
        </svg>
    );
};

export const PredictionMarketView: React.FC<PredictionMarketViewProps> = ({ onBack, userPoints, activeBets, onPlaceBet, trendingSongs }) => {
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const [betAmount, setBetAmount] = useState(100);
  const [activeTab, setActiveTab] = useState<'market' | 'my-bets' | 'history'>('market');
  const [marketCycleTime, setMarketCycleTime] = useState(14 * 60 + 2); // 14m 2s countdown
  
  useEffect(() => {
    const timer = setInterval(() => setMarketCycleTime(prev => Math.max(0, prev - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const marketList = useMemo(() => {
      const realSongs = trendingSongs.map(s => ({
          ...s,
          odds: Math.max(1.5, (50 / (s.likes + 1))),
          isHot: s.likes > 10,
          sparkline: [5, 12, 8, 15, 14, 20, 18, 25, 22] 
      }));
      
      const combined = [...realSongs, ...MOCK_PROSPECTS.map(p => ({ ...p, isHot: p.odds < 3 }))];
      return combined.sort((a, b) => (a.odds || 99) - (b.odds || 99));
  }, [trendingSongs]);

  const handleBet = () => {
    if (!selectedSong) return;
    onPlaceBet(selectedSong.title, selectedSong.artist, betAmount, selectedSong.odds);
    setSelectedSong(null);
  };

  return (
    <div className="relative min-h-screen flex flex-col p-4 lg:p-8 animate-fade-in overflow-hidden">
        {/* Background Scanline/Grid Effect */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col h-full">
            {/* Breadcrumb & Navigation */}
            <nav className="flex items-center gap-4 mb-8">
                <button onClick={onBack} className="flex items-center gap-2 text-xs font-black text-gray-500 hover:text-cyan-400 transition-colors uppercase tracking-[0.2em] group">
                    <BackIcon />
                    Explore
                </button>
                <span className="text-gray-700">/</span>
                <span className="text-xs font-black text-white uppercase tracking-[0.2em]">Market Terminal</span>
                <div className="ml-auto flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Live Market Feed</span>
                </div>
            </nav>

            {/* Main Content Area: Three Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
                
                {/* Column 1: Market Intelligence & Categories (LG: 2 cols) */}
                <aside className="lg:col-span-3 space-y-6">
                    <div className="bg-gray-950/80 border border-white/5 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
                        <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                            <NewspaperIcon className="w-4 h-4" /> Market Intel
                        </h3>
                        <div className="space-y-6">
                            {MOCK_MARKET_NEWS.map(news => (
                                <div key={news.id} className="group cursor-pointer">
                                    <p className="text-xs font-bold text-white leading-relaxed group-hover:text-cyan-400 transition-colors">{news.title}</p>
                                    <p className="text-[9px] text-gray-600 mt-1 uppercase font-mono">{formatTimeAgo(news.timestamp)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-950/80 border border-white/5 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
                        <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-4">Capitalization</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[9px] font-black text-gray-500 uppercase">Available</p>
                                    <p className="text-xl font-mono font-black text-yellow-500">{userPoints.toLocaleString()}</p>
                                </div>
                                <StarIcon className="w-6 h-6 text-yellow-500/20 mb-1" />
                            </div>
                            <div className="h-px bg-white/5"></div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[9px] font-black text-gray-500 uppercase">Invested</p>
                                    <p className="text-xl font-mono font-black text-cyan-400">
                                        {activeBets.reduce((acc, b) => acc + b.amount, 0).toLocaleString()}
                                    </p>
                                </div>
                                <TrendingUpIcon className="w-6 h-6 text-cyan-500/20 mb-1" />
                            </div>
                        </div>
                    </div>

                    <button onClick={() => setActiveTab('market')} className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${activeTab === 'market' ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400' : 'bg-gray-900/40 border-white/5 text-gray-500 hover:text-white'}`}>
                        <span className="text-xs font-black uppercase tracking-widest">Global Board</span>
                        <ChartIcon className="w-4 h-4"/>
                    </button>
                    <button onClick={() => setActiveTab('my-bets')} className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${activeTab === 'my-bets' ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400' : 'bg-gray-900/40 border-white/5 text-gray-500 hover:text-white'}`}>
                        <span className="text-xs font-black uppercase tracking-widest">My Positions</span>
                        <ClockIcon className="w-4 h-4"/>
                    </button>
                </aside>

                {/* Column 2: The Trading Floor (LG: 6 cols) */}
                <main className="lg:col-span-6 space-y-6">
                    {/* Header Summary */}
                    <div className="bg-gray-950/40 border border-white/5 p-6 rounded-3xl flex flex-wrap justify-between items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-black text-white font-orbitron tracking-tighter uppercase leading-none">Hit Cycle #145</h2>
                            <p className="text-[10px] text-gray-500 font-bold uppercase mt-1 tracking-widest">Global Sentiment: <span className="text-green-500">Very Bullish</span></p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-[9px] text-gray-600 font-black uppercase mb-1">Time to Settlement</p>
                                <p className="text-xl font-mono font-black text-orange-500 animate-pulse">{formatCountdown(marketCycleTime)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="overflow-y-auto custom-scrollbar-hide pr-2" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                        {activeTab === 'market' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-12">
                                {marketList.map((song: any) => (
                                    <button 
                                        key={song.id}
                                        onClick={() => setSelectedSong(song)}
                                        className={`group relative flex flex-col p-5 rounded-[2rem] border transition-all duration-300 text-left ${selectedSong?.id === song.id ? 'bg-cyan-500/5 border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.1)]' : 'bg-gray-950/60 border-white/5 hover:border-white/10 hover:bg-gray-900/40'}`}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-1 ring-white/10 flex-shrink-0">
                                                <img src={song.albumArt} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                                                {song.isHot && <div className="absolute top-1 right-1 bg-orange-500 p-0.5 rounded shadow-xl animate-bounce"><FireIcon className="w-3 h-3 text-white"/></div>}
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-xl font-black font-mono leading-none ${song.odds < 3 ? 'text-green-400' : 'text-cyan-400'}`}>
                                                    {song.odds.toFixed(1)}x
                                                </p>
                                                <p className="text-[8px] text-gray-600 font-black uppercase mt-1">Multiplier</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1 min-w-0 mb-4">
                                            <h3 className="font-bold text-white text-base truncate mb-0.5">{song.title}</h3>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider truncate">{song.artist}</p>
                                        </div>

                                        <div className="flex justify-between items-center pt-3 border-t border-white/5">
                                            <Sparkline data={song.sparkline || [10, 5, 20]} color={song.isHot ? '#f97316' : '#06b6d4'} />
                                            <div className="text-right">
                                                <p className="text-[9px] font-black text-gray-500 uppercase">Liquidity</p>
                                                <p className="text-xs font-mono font-bold text-white">{(song.volume || 1000).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {activeTab === 'my-bets' && (
                            <div className="space-y-4">
                                {activeBets.length === 0 ? (
                                    <div className="bg-gray-950/40 border border-dashed border-white/10 rounded-3xl py-24 flex flex-col items-center justify-center text-center opacity-40">
                                        <TrendingUpIcon className="w-12 h-12 mb-4" />
                                        <h3 className="text-lg font-bold">No Open Positions</h3>
                                        <p className="text-xs mt-1">Start by analyzing the board and placing a wager.</p>
                                    </div>
                                ) : (
                                    activeBets.map(bet => (
                                        <div key={bet.id} className="bg-gray-950 border border-white/5 p-6 rounded-3xl flex justify-between items-center group">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-cyan-400 ring-1 ring-white/10">
                                                    <TrendingUpIcon className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white leading-none mb-1.5">{bet.songTitle}</h4>
                                                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em]">{bet.artist}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-10">
                                                <div className="text-right">
                                                    <p className="text-[9px] text-gray-600 font-black uppercase mb-1">Potential Gain</p>
                                                    <p className="text-green-500 font-black text-lg">+{bet.potentialPayout.toLocaleString()}</p>
                                                </div>
                                                <div className="w-24 bg-cyan-500/10 text-cyan-400 text-center py-2 rounded-xl text-[9px] font-black uppercase border border-cyan-500/20">
                                                    OPEN POSITION
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </main>

                {/* Column 3: Trading Desk / Wager Slip (LG: 3 cols) */}
                <aside className="lg:col-span-3 space-y-6">
                    <div className="bg-[#020617] rounded-[2.5rem] p-8 border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col h-full min-h-[500px]">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500"></div>
                        <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] mb-8">Brokerage Terminal</h3>

                        {selectedSong ? (
                            <div className="space-y-8 animate-fade-in flex flex-col flex-1">
                                <div>
                                    <span className="text-[8px] font-black bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded uppercase tracking-widest">Active Draft</span>
                                    <h4 className="text-2xl font-black text-white leading-tight mt-3 truncate">{selectedSong.title}</h4>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">{selectedSong.artist}</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 py-6 border-y border-white/5">
                                    <div>
                                        <p className="text-[9px] text-gray-600 font-black uppercase mb-1.5">Odds</p>
                                        <p className="text-2xl font-black text-white font-mono">{selectedSong.odds.toFixed(1)}x</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] text-gray-600 font-black uppercase mb-1.5">Risk Level</p>
                                        <p className={`text-sm font-black font-mono ${selectedSong.odds < 5 ? 'text-green-500' : 'text-red-500'}`}>{selectedSong.odds < 5 ? 'LOW' : 'HIGH'}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Wager Capital</label>
                                        <div className="flex gap-2">
                                            <button onClick={() => setBetAmount(Math.floor(userPoints * 0.1))} className="text-[8px] font-black text-cyan-500 hover:text-cyan-400 transition-colors uppercase">10%</button>
                                            <button onClick={() => setBetAmount(Math.floor(userPoints * 0.5))} className="text-[8px] font-black text-cyan-500 hover:text-cyan-400 transition-colors uppercase">50%</button>
                                            <button onClick={() => setBetAmount(userPoints)} className="text-[8px] font-black text-cyan-500 hover:text-cyan-400 transition-colors uppercase">MAX</button>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            min="10" 
                                            max={userPoints}
                                            value={betAmount} 
                                            onChange={(e) => setBetAmount(Math.max(0, parseInt(e.target.value) || 0))}
                                            className="w-full bg-black/40 border border-gray-800 rounded-2xl py-4 px-5 text-2xl font-black text-white focus:outline-none focus:border-cyan-500 transition-all pr-14"
                                        />
                                        <StarIcon className="w-6 h-6 text-yellow-500 absolute right-5 top-1/2 -translate-y-1/2" />
                                    </div>
                                    <div className="bg-green-500/5 rounded-2xl p-5 flex justify-between items-center border border-green-500/10">
                                        <span className="text-[9px] text-green-600 font-black uppercase tracking-widest">Est. Return</span>
                                        <span className="text-green-400 font-black text-2xl font-mono">{(betAmount * selectedSong.odds).toFixed(0)}</span>
                                    </div>
                                </div>

                                <div className="mt-auto space-y-4 pt-4">
                                    <button 
                                        onClick={handleBet}
                                        disabled={betAmount > userPoints || betAmount < 10}
                                        className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:grayscale text-black font-black py-5 rounded-2xl transition-all shadow-[0_20px_40px_rgba(6,182,212,0.2)] uppercase tracking-[0.2em] text-xs active:scale-[0.98]"
                                    >
                                        Execute Contract
                                    </button>
                                    <button onClick={() => setSelectedSong(null)} className="w-full text-gray-700 font-black text-[10px] uppercase hover:text-white transition-colors tracking-widest">Discard Draft</button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 text-center opacity-20 grayscale flex-1">
                                <div className="w-20 h-20 bg-gray-950 rounded-[2rem] border-2 border-dashed border-gray-800 mb-8 flex items-center justify-center text-gray-700">
                                     <TrendingUpIcon className="w-8 h-8" />
                                </div>
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] px-6">Select a trending track from the floor to open a position.</p>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>

        {/* Global Market Ticker (Bottom) */}
        <div className="fixed bottom-0 left-0 right-0 h-10 bg-black/80 backdrop-blur-3xl border-t border-white/5 flex items-center overflow-hidden z-50">
            <div className="animate-scroll whitespace-nowrap flex gap-12 px-4">
                {[...MOCK_MARKET_TRENDS, ...MOCK_MARKET_TRENDS].map((trend, i) => (
                    <div key={i} className="inline-flex items-center gap-3 text-[9px] font-black tracking-widest uppercase">
                        <span className="text-gray-600">{trend.artist} - {trend.title}</span>
                        <span className={trend.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                            {trend.change >= 0 ? '▲' : '▼'} {Math.abs(trend.change)}%
                        </span>
                    </div>
                ))}
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
            .custom-scrollbar-hide::-webkit-scrollbar {
                display: none;
            }
            .custom-scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
        `}</style>
    </div>
  );
};
