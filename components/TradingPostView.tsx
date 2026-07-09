import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import type { MarketListing, User } from '../types';
import { StarIcon, CollectionIcon } from '../constants';
import { Sparkles, Eye, ShieldCheck, ShoppingCart } from 'lucide-react';
import { playCardSound } from '../utils/audioSynth';
import { TradingCardArt } from './TradingCardArt';
import { CardCaption } from './CardCaption';

interface TradingPostViewProps {
  onBack: () => void;
  listings: MarketListing[];
  onBuy: (listingId: string) => void;
  userPoints: number;
  currentUser: User | null;
}

const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>;

export const TradingPostView: React.FC<TradingPostViewProps> = ({ onBack, listings, onBuy, userPoints, currentUser }) => {
  const [activeGuideTab, setActiveGuideTab] = useState<'overview' | 'drops' | 'multiplier' | 'trade'>('overview');
  const [isGuideOpen, setIsGuideOpen] = useState(true);

  return (
    <div className="p-4 md:p-8 animate-fade-in bg-radial-dots min-h-[85vh]">
        <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-cyan-400 transition-colors mb-6 group">
                <BackIcon />
                <span className="uppercase tracking-widest group-hover:pl-1 transition-all">Back to Explore</span>
            </button>

            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-bold font-orbitron bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                        <CollectionIcon className="w-10 h-10 text-cyan-400 animate-pulse"/>
                        The Trading Post
                    </h1>
                    <p className="text-gray-400 mt-2">Community marketplace. Acquire rare holographic collector cards from other listeners.</p>
                </div>
                
                {/* Balance Banner */}
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-950/80 rounded-2xl border border-yellow-500/30 text-yellow-400 shadow-xl backdrop-blur-md">
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Your Balance</p>
                        <p className="font-bold text-2xl flex items-center gap-2 justify-end">
                            {userPoints.toLocaleString()} <StarIcon className="w-6 h-6 text-yellow-500 animate-pulse"/>
                        </p>
                    </div>
                </div>
            </header>

            {/* Immersive Terminal operations manual */}
            <div className="bg-gray-950/80 border border-cyan-500/20 rounded-3xl p-5 mb-10 backdrop-blur-md shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/[0.02] rounded-bl-full pointer-events-none"></div>
              
              <div className="flex justify-between items-center mb-4 border-b border-gray-900 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
                  <p className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase flex items-center gap-2">
                    Trading Post Operations Terminal v2.4 <span className="text-[10px] text-gray-600 hidden sm:inline">| Standard Secure Node</span>
                  </p>
                </div>
                <button 
                  onClick={() => setIsGuideOpen(!isGuideOpen)}
                  className="px-3 py-1 bg-gray-900 border border-gray-800 hover:border-gray-700 text-cyan-400 text-[10px] font-mono rounded-lg transition-all font-bold uppercase tracking-widest"
                >
                  {isGuideOpen ? "Minimize [X]" : "Expand Guide [-]"}
                </button>
              </div>

              {isGuideOpen && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in-fast">
                  {/* Left navigation sidebar */}
                  <div className="flex flex-col gap-2 border-r border-gray-900/80 pr-4">
                    <button 
                      onClick={() => { setActiveGuideTab('overview'); playCardSound('common'); }}
                      className={`px-3 py-2 text-left font-mono text-[11px] font-bold uppercase tracking-wider rounded-xl border transition-all ${
                        activeGuideTab === 'overview' 
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/35 shadow-[0_0_12px_rgba(6,182,212,0.15)]' 
                          : 'bg-black/30 text-gray-500 border-transparent hover:text-gray-300'
                      }`}
                    >
                      &gt; 01. Market Overview
                    </button>
                    <button 
                      onClick={() => { setActiveGuideTab('drops'); playCardSound('rare'); }}
                      className={`px-3 py-2 text-left font-mono text-[11px] font-bold uppercase tracking-wider rounded-xl border transition-all ${
                        activeGuideTab === 'drops' 
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/35 shadow-[0_0_12px_rgba(6,182,212,0.15)]' 
                          : 'bg-black/30 text-gray-500 border-transparent hover:text-gray-300'
                      }`}
                    >
                      &gt; 02. Collector Drops
                    </button>
                    <button 
                      onClick={() => { setActiveGuideTab('multiplier'); playCardSound('epic'); }}
                      className={`px-3 py-2 text-left font-mono text-[11px] font-bold uppercase tracking-wider rounded-xl border transition-all ${
                        activeGuideTab === 'multiplier' 
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/35 shadow-[0_0_12px_rgba(6,182,212,0.15)]' 
                          : 'bg-black/30 text-gray-500 border-transparent hover:text-gray-300'
                      }`}
                    >
                      &gt; 03. Synergy Matrix
                    </button>
                    <button 
                      onClick={() => { setActiveGuideTab('trade'); playCardSound('legendary'); }}
                      className={`px-3 py-2 text-left font-mono text-[11px] font-bold uppercase tracking-wider rounded-xl border transition-all ${
                        activeGuideTab === 'trade' 
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/35 shadow-[0_0_12px_rgba(6,182,212,0.15)]' 
                          : 'bg-black/30 text-gray-500 border-transparent hover:text-gray-300'
                      }`}
                    >
                      &gt; 04. Escrow Clearing
                    </button>
                  </div>

                  {/* Main display panel */}
                  <div className="md:col-span-3 bg-black/40 border border-gray-900 rounded-2xl p-4 md:p-5 flex flex-col justify-between font-mono relative min-h-[160px]">
                    <div className="absolute top-2 right-4 text-[9px] text-gray-700 select-none hidden sm:inline">NODE_SYS_PRIME</div>
                    
                    <div className="space-y-3 text-left">
                      {activeGuideTab === 'overview' && (
                        <>
                          <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                            SYSTEM DIRECTIVE: PREMIUM CARD VIRTUAL ASSETS
                          </h4>
                          <p className="text-gray-400 text-[11px] leading-relaxed">
                            Welcome to the decentralized Music Station Collectibles Ecosystem. Holographic cards represent milestones, legendary audio equipment, and historic innovations of independent radio. possess them to establish your reputation within the community and unlock active passive rewards.
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[10px] text-gray-500">
                            <div className="p-2.5 bg-gray-900/40 rounded-xl border border-gray-900">
                              <span className="text-cyan-400 block font-bold mb-1">UNIFIED INTEGRITY</span>
                              Cards are bound directly to your Music Station profile index.
                            </div>
                            <div className="p-2.5 bg-gray-900/40 rounded-xl border border-gray-900">
                              <span className="text-cyan-400 block font-bold mb-1">PROFILER ACCENT</span>
                              Acquiring full decks flags your username with glowing custom neon borders.
                            </div>
                          </div>
                        </>
                      )}

                      {activeGuideTab === 'drops' && (
                        <>
                          <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                            DROP PROTOCOLS // LIVE STREAM MINTING
                          </h4>
                          <p className="text-gray-400 text-[11px] leading-relaxed">
                            Card drops occur procedurally as you tune in to active broadcaster streams. Each standard 5-minute interval computed on the server increases the drop manifest probability.
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[10px] text-gray-500">
                            <div className="p-2.5 bg-gray-900/40 rounded-xl border border-gray-900">
                              <span className="text-yellow-400 block font-bold mb-1">CHAT STREAK MULTIPLIER</span>
                              Posting active station messages increases legendary drop probability by +15%.
                            </div>
                            <div className="p-2.5 bg-gray-900/40 rounded-xl border border-gray-900">
                              <span className="text-purple-400 block font-bold mb-1">BROADCAST SUPPORT</span>
                              Sending direct point tips triggers instant, high-fidelity card sweepstakes!
                            </div>
                          </div>
                        </>
                      )}

                      {activeGuideTab === 'multiplier' && (
                        <>
                          <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                            SYNERGY MATRIX // REWARD INDEX
                          </h4>
                          <p className="text-gray-400 text-[11px] leading-relaxed">
                            Each rare card stacked in your collection emits passive signal boosts to your active profile stats:
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-center text-[10px]">
                            <div className="p-2 bg-gray-900/40 rounded-xl border border-gray-900">
                              <span className="text-gray-400 block font-black">COMMON</span>
                              <span className="text-white font-bold">+5% Hype</span>
                            </div>
                            <div className="p-2 bg-blue-900/10 rounded-xl border border-blue-900/20">
                              <span className="text-blue-400 block font-black">RARE</span>
                              <span className="text-white font-bold">+10% Hype</span>
                            </div>
                            <div className="p-2 bg-purple-900/10 rounded-xl border border-purple-900/20">
                              <span className="text-purple-400 block font-black">EPIC</span>
                              <span className="text-white font-bold">+20% Hype</span>
                            </div>
                            <div className="p-2 bg-amber-900/10 rounded-xl border border-amber-900/20">
                              <span className="text-amber-400 block font-black">LEGENDARY</span>
                              <span className="text-white font-bold">+35% Hype</span>
                            </div>
                          </div>
                        </>
                      )}

                      {activeGuideTab === 'trade' && (
                        <>
                          <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                            ESCROW MECHANICS // P2P ZERO-FEE MARKET
                          </h4>
                          <p className="text-gray-400 text-[11px] leading-relaxed">
                            List your acquired cards for sale instantly at any self-determined price. The Trading Post operations charge exactly <span className="text-cyan-400">0% trading commission fee</span>. 
                          </p>
                          <div className="p-3 bg-cyan-950/20 border border-cyan-800/20 rounded-xl text-[10px] text-cyan-400/80 leading-relaxed">
                            <span className="font-bold text-white block mb-1">PRO-TIP: REINVESTING POINTS</span>
                            Convert duplicate cards into points on the open market, and reinvest them to purchase high-multiplier Legendary or Epic cards to optimize your leaderboard multiplier!
                          </div>
                        </>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-900/80 flex justify-between items-center text-[10px] text-gray-600">
                      <span>STATUS: SECURITY_INTEGRITY_ONLINE</span>
                      <span className="animate-pulse">Awaiting terminal input..._</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Listings Grid */}
            {listings.length === 0 ? (
                <div className="text-center py-24 bg-gray-950/50 rounded-3xl border border-gray-900 shadow-inner flex flex-col items-center justify-center">
                    <CollectionIcon className="w-16 h-16 text-gray-800 mb-4 opacity-40" />
                    <p className="text-xl font-bold text-gray-400">No active card listings</p>
                    <p className="text-sm text-gray-600 mt-1 max-w-sm">Check back soon! Active listeners will list their cards here when they discover them in premium streams.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {listings.map((listing, index) => (
                        <TradingPostListingCard 
                          key={listing.id}
                          listing={listing}
                          index={index}
                          userPoints={userPoints}
                          currentUser={currentUser}
                          onBuy={onBuy}
                        />
                    ))}
                </div>
            )}
        </div>
        <style>{`
          .bg-radial-dots {
            background-image: radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px);
            background-size: 24px 24px;
          }
        `}</style>
    </div>
  );
};

/* Individual Trading Post Card with high-end tilt & shimmer */
interface TradingPostListingCardProps {
  listing: MarketListing;
  index: number;
  userPoints: number;
  currentUser: User | null;
  onBuy: (listingId: string) => void;
}

const TradingPostListingCard: React.FC<TradingPostListingCardProps> = ({ listing, index, userPoints, currentUser, onBuy }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

  const canAfford = userPoints >= listing.price;
  const isYours = currentUser && listing.seller === currentUser.username;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setCoords({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0.5, y: 0.5 });
  };

  const getRarityGradients = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return {
          glow: 'shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_35px_rgba(245,158,11,0.5)]',
          border: 'border-amber-500/80 bg-gradient-to-b from-amber-500/10 via-amber-950/20 to-black',
          badge: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black',
          overlayColor: 'from-amber-500/10 to-transparent'
        };
      case 'epic':
        return {
          glow: 'shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:shadow-[0_0_35px_rgba(168,85,247,0.5)]',
          border: 'border-purple-500/80 bg-gradient-to-b from-purple-500/10 via-purple-950/20 to-black',
          badge: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black',
          overlayColor: 'from-purple-500/10 to-transparent'
        };
      case 'rare':
        return {
          glow: 'shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_35px_rgba(59,130,246,0.5)]',
          border: 'border-blue-500/80 bg-gradient-to-b from-blue-500/10 via-slate-900/20 to-black',
          badge: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-black',
          overlayColor: 'from-blue-500/10 to-transparent'
        };
      default:
        return {
          glow: 'shadow-[0_0_10px_rgba(156,163,175,0.05)] hover:shadow-[0_0_20px_rgba(156,163,175,0.2)]',
          border: 'border-gray-700 bg-gradient-to-b from-gray-700/10 via-gray-900/20 to-black',
          badge: 'bg-gray-600 text-gray-200 font-bold',
          overlayColor: 'from-gray-500/5 to-transparent'
        };
    }
  };

  const style = getRarityGradients(listing.card.rarity);

  // Calculates 3D skew
  const rotateX = isHovered ? (coords.y - 0.5) * -14 : 0;
  const rotateY = isHovered ? (coords.x - 0.5) * 14 : 0;

  // Calculates holographic light sweep reflection
  const shineLeft = coords.x * 100;
  const shineTop = coords.y * 100;

  const playHoverSound = () => {
    setIsHovered(true);
    playCardSound(listing.card.rarity);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={playHoverSound}
      onMouseLeave={handleMouseLeave}
      className={`flex flex-col rounded-3xl border-2 overflow-hidden cursor-default ${style.border} ${style.glow}`}
      style={{
        transform: `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.03 : 1})`,
        transition: isHovered ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), shadow 0.3s'
      }}
    >
      {/* Glossy Holographic reflection overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        style={{
          background: `radial-gradient(circle at ${shineLeft}% ${shineTop}%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.03) 50%, transparent 80%), 
                      linear-gradient(${120 + (coords.x - 0.5) * 45}deg, transparent 35%, rgba(255, 255, 255, 0.1) 48%, rgba(255, 255, 255, 0.18) 50%, rgba(255, 255, 255, 0.1) 52%, transparent 65%)`,
          mixBlendMode: 'color-dodge'
        }}
      />

      {/* Card Content body */}
      <div className="p-5 flex-grow flex flex-col relative">
        <div className="flex justify-between items-center mb-4">
            <span className={`text-[9px] tracking-wider font-black uppercase px-2.5 py-0.5 rounded-full shadow ${style.badge}`}>
                {listing.card.rarity}
            </span>
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest bg-gray-900/60 px-2 py-0.5 rounded border border-gray-800">
              Seller: {listing.seller}
            </span>
        </div>
        
        {/* Holographic central image area */}
        <div className="aspect-square bg-black/50 rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden group border border-gray-900">
            <div className="absolute inset-0 bg-radial-lens opacity-20 pointer-events-none"></div>
            <div className="w-28 h-28 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500 z-10">
                <TradingCardArt card={listing.card} />
            </div>
        </div>
        
        <CardCaption card={listing.card} />
      </div>
      
      {/* Card Footer controls */}
      <div className="p-4 bg-black/60 border-t border-gray-900 flex items-center justify-between gap-4 z-10 backdrop-blur-sm">
          <div className="flex flex-col">
              <span className="text-[8px] text-gray-500 font-black uppercase tracking-wider">Market Price</span>
              <div className="flex items-center gap-1.5 text-yellow-400 font-bold text-lg leading-tight">
                  <span>{listing.price.toLocaleString()}</span>
                  <StarIcon className="w-4 h-4 text-yellow-500 animate-pulse"/>
              </div>
          </div>
          
          {isYours ? (
              <span className="px-4 py-2 bg-gray-950 text-gray-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-gray-900">
                  Your Listing
              </span>
          ) : (
              <button 
                  onClick={() => onBuy(listing.id)}
                  disabled={!canAfford}
                  className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${
                    canAfford 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black shadow-lg shadow-cyan-500/10 active:scale-95' 
                      : 'bg-gray-900 text-gray-600 border border-gray-800 cursor-not-allowed'
                  }`}
              >
                  <ShoppingCart className="w-3.5 h-3.5" /> Buy
              </button>
          )}
      </div>
    </motion.div>
  );
};
