import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { CollectorCard } from '../types';
import { playCardSound, playFlipCardSound } from '../utils/audioSynth';
import { TradingCardArt } from './TradingCardArt';
import { CardCaption } from './CardCaption';
import { Sparkles, ShoppingBag, Eye, RefreshCw, X, Shield, Award } from 'lucide-react';

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: CollectorCard[];
  onListCard: (cardId: string, price: number) => void;
}

export const CollectionModal: React.FC<CollectionModalProps> = ({ isOpen, onClose, collection, onListCard }) => {
  const [listingId, setListingId] = useState<string | null>(null);
  const [listingPrice, setListingPrice] = useState(500);
  const [inspectingCard, setInspectingCard] = useState<CollectorCard | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!isOpen) return null;

  const handleListSubmit = () => {
    if (listingId && listingPrice > 0) {
        onListCard(listingId, listingPrice);
        setListingId(null);
    }
  };

  const handleInspectCard = (card: CollectorCard) => {
    setInspectingCard(card);
    setIsFlipped(false);
    playCardSound(card.rarity);
  };

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
    playFlipCardSound();
  };

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in-fast"
      onClick={onClose}
    >
      <div 
        className="bg-gray-950/95 border border-gray-800 rounded-3xl shadow-3xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-slide-up-fast"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/40">
          <div>
            <h2 className="text-2xl font-bold font-orbitron bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent tracking-wider flex items-center gap-3">
              <Award className="w-7 h-7 text-cyan-400 animate-pulse" />
              My Card Collection
            </h2>
            <p className="text-xs text-gray-400 mt-1">Collect, trade, and showcase interactive virtual cards. Move your mouse over them to see the shiny holographic reflection!</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-400 hover:text-white transition-all">
             <X className="h-5 w-5" />
          </button>
        </header>
        
        {/* Main Content Area */}
        <div className="p-6 overflow-y-auto flex-grow bg-radial-dots">
            {collection.length === 0 ? (
                <div className="text-center py-24 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gray-900/80 border border-gray-800 flex items-center justify-center text-gray-500 mb-4">
                        <Sparkles className="w-8 h-8 opacity-30" />
                    </div>
                    <p className="text-gray-400 font-bold text-xl">Your collection is empty</p>
                    <p className="text-gray-500 text-sm mt-2 max-w-sm">Tune in to active radio stations and support independent broadcasters to unlock real-time card drops!</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {collection.map((card, index) => (
                        <CollectibleCardItem 
                          key={card.id} 
                          card={card} 
                          index={index}
                          onInspect={() => handleInspectCard(card)}
                          onSellClick={() => setListingId(card.id)}
                        />
                    ))}
                </div>
            )}
        </div>

        {/* Dynamic Detail Inspector Overlay */}
        <AnimatePresence>
          {inspectingCard && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 z-40 flex flex-col md:flex-row items-center justify-center p-6 md:p-12 gap-8"
              onClick={() => setInspectingCard(null)}
            >
              <button 
                onClick={() => setInspectingCard(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-400 hover:text-white transition-all z-50"
              >
                <X className="h-6 w-6" />
              </button>

              {/* 3D Holographic Interactive Card container */}
              <div 
                className="w-full max-w-[280px] sm:max-w-[340px] aspect-[2/3] perspective-1000 relative flex items-center justify-center cursor-pointer"
                onClick={(e) => { e.stopPropagation(); handleFlipCard(); }}
              >
                <div className={`w-full h-full duration-700 transform-style-3d relative ${isFlipped ? 'rotate-y-180' : ''}`}>
                  {/* Front Face */}
                  <div className="absolute inset-0 backface-hidden">
                    <DetailedInspectCardItem card={inspectingCard} isFlipped={false} />
                  </div>

                  {/* Back Face */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180">
                    <DetailedInspectCardItem card={inspectingCard} isFlipped={true} />
                  </div>
                </div>
              </div>

              {/* Info panel */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="max-w-md w-full text-left bg-gray-900/60 p-6 sm:p-8 rounded-3xl border border-gray-800 backdrop-blur-xl flex flex-col gap-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div>
                  <span className={`text-[10px] tracking-widest font-black uppercase px-2.5 py-1 rounded-full ${
                    inspectingCard.rarity === 'legendary' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' :
                    inspectingCard.rarity === 'epic' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' :
                    inspectingCard.rarity === 'rare' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' :
                    'bg-gray-600 text-white'
                  }`}>
                    {inspectingCard.rarity} Collector Card
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold font-orbitron text-white mt-3">{inspectingCard.name}</h3>
                  <p className="text-gray-400 text-sm mt-2 leading-relaxed">{inspectingCard.description}</p>
                </div>

                <div className="border-t border-gray-800 pt-4 space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 font-bold uppercase tracking-wider">Holographic ID</span>
                    <span className="text-cyan-400 font-mono font-bold">#MS-{inspectingCard.id.slice(0, 8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 font-bold uppercase tracking-wider">Acquired Date</span>
                    <span className="text-gray-300">{new Date(inspectingCard.acquiredAt || Date.now()).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 font-bold uppercase tracking-wider">Collector Series</span>
                    <span className="text-yellow-400 font-bold">First Edition (1 of 100)</span>
                  </div>
                </div>

                <div className="bg-black/40 rounded-2xl p-4 border border-gray-800 mt-2 space-y-2">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-cyan-400" /> Card Synergy Bonuses
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2 bg-gray-900/40 rounded-lg text-center border border-gray-800">
                      <p className="text-[10px] text-gray-500 font-bold uppercase">Hype Rate</p>
                      <p className="text-base font-bold text-white">
                        {inspectingCard.rarity === 'legendary' ? '+35%' : inspectingCard.rarity === 'epic' ? '+20%' : inspectingCard.rarity === 'rare' ? '+10%' : '+5%'}
                      </p>
                    </div>
                    <div className="p-2 bg-gray-900/40 rounded-lg text-center border border-gray-800">
                      <p className="text-[10px] text-gray-500 font-bold uppercase">Tip Multiplier</p>
                      <p className="text-base font-bold text-white">
                        {inspectingCard.rarity === 'legendary' ? 'x2.0' : inspectingCard.rarity === 'epic' ? 'x1.5' : inspectingCard.rarity === 'rare' ? 'x1.2' : 'x1.0'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-4">
                  <button 
                    onClick={handleFlipCard}
                    className="flex-1 py-3 px-4 rounded-xl border border-gray-700 text-gray-300 hover:text-white bg-gray-900 hover:bg-gray-800 transition-all font-bold text-sm flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" /> Flip Card
                  </button>
                  <button 
                    onClick={() => { setListingId(inspectingCard.id); setInspectingCard(null); }}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-cyan-500/10 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" /> Market List
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Listing Modal Overlay */}
        <AnimatePresence>
          {listingId && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/90 z-[110] flex items-center justify-center p-6"
                onClick={() => setListingId(null)}
              >
                  <motion.div 
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.95 }}
                    className="bg-gray-900 p-8 rounded-3xl border border-gray-800 max-w-sm w-full shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                      <h3 className="text-xl font-bold text-white mb-2 font-orbitron">List Card for Sale</h3>
                      <p className="text-xs text-gray-400 mb-6 leading-relaxed">Enter your desired asking price. Once listed, your card will be visible on the public Trading Post for other collectors to buy.</p>
                      
                      <div className="mb-6">
                          <label className="block text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">Asking Price (Points)</label>
                          <div className="relative">
                            <input 
                                type="number" 
                                value={listingPrice}
                                onChange={(e) => setListingPrice(Math.max(1, parseInt(e.target.value) || 0))}
                                className="w-full bg-black border border-gray-700 rounded-xl py-3 px-4 text-white focus:border-cyan-500 outline-none font-mono text-lg"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400 font-bold text-sm">pts</span>
                          </div>
                      </div>
                      <div className="flex gap-4">
                          <button onClick={() => setListingId(null)} className="flex-1 py-3 text-gray-400 hover:text-white font-bold text-sm transition-all">Cancel</button>
                          <button onClick={handleListSubmit} className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-cyan-900/30">List Card</button>
                      </div>
                  </motion.div>
              </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes fade-in-fast { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in-fast { animation: fade-in-fast 0.25s ease-out; }
        @keyframes slide-up-fast { from { transform: translateY(20px) scale(0.98); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        .animate-slide-up-fast { animation: slide-up-fast 0.3s cubic-bezier(0.16, 1, 0.3, 1); }

        /* 3D and backface handling */
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }

        /* Dots pattern background */
        .bg-radial-dots {
          background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
};

/* Individual Collectible Card Item Component */
interface CollectibleCardItemProps {
  card: CollectorCard;
  index: number;
  onInspect: () => void;
  onSellClick: () => void;
}

const CollectibleCardItem: React.FC<CollectibleCardItemProps> = ({ card, index, onInspect, onSellClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

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
          glow: 'shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)]',
          border: 'border-amber-400 bg-gradient-to-b from-amber-500/10 via-amber-950/30 to-black',
          badge: 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-black',
          overlay: 'from-amber-500/10 via-white/25 to-transparent',
          sparkleColor: 'text-amber-400'
        };
      case 'epic':
        return {
          glow: 'shadow-[0_0_20px_rgba(168,85,247,0.25)] hover:shadow-[0_0_35px_rgba(168,85,247,0.6)]',
          border: 'border-purple-500 bg-gradient-to-b from-purple-500/10 via-purple-950/30 to-black',
          badge: 'bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-600 text-white',
          overlay: 'from-purple-500/10 via-white/25 to-transparent',
          sparkleColor: 'text-purple-400'
        };
      case 'rare':
        return {
          glow: 'shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:shadow-[0_0_35px_rgba(59,130,246,0.6)]',
          border: 'border-blue-500 bg-gradient-to-b from-blue-500/10 via-slate-900/30 to-black',
          badge: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
          overlay: 'from-blue-500/10 via-white/25 to-transparent',
          sparkleColor: 'text-blue-400'
        };
      default:
        return {
          glow: 'shadow-[0_0_10px_rgba(156,163,175,0.1)] hover:shadow-[0_0_20px_rgba(156,163,175,0.3)]',
          border: 'border-gray-700 bg-gradient-to-b from-gray-700/10 via-gray-900/30 to-black',
          badge: 'bg-gray-700 text-gray-200',
          overlay: 'from-gray-500/5 via-white/10 to-transparent',
          sparkleColor: 'text-gray-500'
        };
    }
  };

  const style = getRarityGradients(card.rarity);

  // Calculates 3D skew
  const rotateX = isHovered ? (coords.y - 0.5) * -16 : 0;
  const rotateY = isHovered ? (coords.x - 0.5) * 16 : 0;

  // Calculates holographic light sweep reflection
  const shineLeft = coords.x * 100;
  const shineTop = coords.y * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onInspect}
      className={`relative aspect-[2/3] rounded-2xl border-2 overflow-hidden cursor-pointer group transition-shadow duration-300 ${style.border} ${style.glow}`}
      style={{
        transform: `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.04 : 1})`,
        transition: isHovered ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), shadow 0.3s'
      }}
    >
      {/* Dynamic Glitter Starbursts for Epic/Legendary */}
      {isHovered && (card.rarity === 'legendary' || card.rarity === 'epic') && (
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          <Sparkles className={`absolute w-4 h-4 ${style.sparkleColor} animate-ping`} style={{ left: '20%', top: '30%', animationDuration: '1.2s' }} />
          <Sparkles className={`absolute w-3 h-3 ${style.sparkleColor} animate-ping`} style={{ right: '15%', bottom: '25%', animationDuration: '1.8s' }} />
        </div>
      )}

      {/* Glossy Interactive Holographic Sheen Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        style={{
          background: `radial-gradient(circle at ${shineLeft}% ${shineTop}%, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.05) 45%, transparent 80%), 
                      linear-gradient(${135 + (coords.x - 0.5) * 60}deg, transparent 30%, rgba(255, 255, 255, 0.12) 45%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.12) 55%, transparent 70%)`,
          mixBlendMode: 'color-dodge'
        }}
      />

      {/* Content wrapper */}
      <div className="absolute inset-0 p-4 flex flex-col z-0">
        {/* Top Header Badge */}
        <div className="flex justify-between items-center mb-1">
          <span className={`text-[9px] tracking-widest uppercase font-black px-2 py-0.5 rounded-full shadow-md ${style.badge}`}>
            {card.rarity}
          </span>
          <Eye className="w-3.5 h-3.5 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Floating Core Illustration Graphic */}
        <div className="flex-grow flex flex-col items-center justify-center my-2 relative w-full aspect-square">
          <div className="absolute w-24 h-24 rounded-full bg-white/5 filter blur-xl animate-pulse pointer-events-none"></div>
          <div className="w-28 h-28 flex items-center justify-center transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500 relative z-10">
            <TradingCardArt card={card} />
          </div>
        </div>

        {/* Metadata Banner */}
        <CardCaption card={card}>
          <button 
            onClick={(e) => { e.stopPropagation(); onSellClick(); }}
            className="mt-2 w-full py-1 bg-gradient-to-r from-cyan-600/80 to-blue-600/80 hover:from-cyan-500 hover:to-blue-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0"
          >
            Sell Card
          </button>
        </CardCaption>
      </div>
    </motion.div>
  );
};

/* Full Screen Inspection detailed Card Front/Back face */
interface DetailedInspectCardItemProps {
  card: CollectorCard;
  isFlipped: boolean;
}

const DetailedInspectCardItem: React.FC<DetailedInspectCardItemProps> = ({ card, isFlipped }) => {
  const getRarityGradients = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return {
          bg: 'from-amber-900/40 via-amber-950/60 to-black',
          border: 'border-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.5)]',
          text: 'text-amber-400',
          badge: 'from-amber-400 to-yellow-600 text-black',
          backPattern: 'radial-gradient(circle at center, rgba(245,158,11,0.15) 0%, transparent 70%)'
        };
      case 'epic':
        return {
          bg: 'from-purple-950/40 via-purple-950/60 to-black',
          border: 'border-purple-400 shadow-[0_0_40px_rgba(168,85,247,0.5)]',
          text: 'text-purple-300',
          badge: 'from-purple-500 to-indigo-600 text-white',
          backPattern: 'radial-gradient(circle at center, rgba(168,85,247,0.15) 0%, transparent 70%)'
        };
      case 'rare':
        return {
          bg: 'from-blue-950/40 via-slate-900/60 to-black',
          border: 'border-blue-400 shadow-[0_0_40px_rgba(59,130,246,0.5)]',
          text: 'text-blue-300',
          badge: 'from-blue-500 to-cyan-500 text-white',
          backPattern: 'radial-gradient(circle at center, rgba(59,130,246,0.15) 0%, transparent 70%)'
        };
      default:
        return {
          bg: 'from-gray-900/40 via-gray-950/60 to-black',
          border: 'border-gray-500 shadow-[0_0_20px_rgba(156,163,175,0.2)]',
          text: 'text-gray-300',
          badge: 'from-gray-600 to-gray-700 text-white',
          backPattern: 'radial-gradient(circle at center, rgba(156,163,175,0.05) 0%, transparent 70%)'
        };
    }
  };

  const style = getRarityGradients(card.rarity);

  if (isFlipped) {
    return (
      <div className={`w-full h-full rounded-3xl border-2 p-6 flex flex-col justify-between overflow-hidden bg-gradient-to-b relative ${style.bg} ${style.border}`}>
        {/* Back side intricate pattern */}
        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: style.backPattern }} />
        
        {/* Holographic grid scan lines */}
        <div className="absolute inset-0 bg-scan-lines opacity-10 pointer-events-none" />

        {/* Top Info Header */}
        <div className="flex justify-between items-start z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Holographic Security</p>
              <p className="text-[9px] text-gray-500 font-mono">MS-CORE-VERIFIED</p>
            </div>
          </div>
          <span className="text-xs font-mono text-gray-500">First Edition</span>
        </div>

        {/* Center Logo Icon */}
        <div className="flex-grow flex flex-col items-center justify-center text-center z-10 py-4">
          <div className="relative w-28 h-28 rounded-full bg-black/80 border border-gray-800 flex items-center justify-center shadow-inner overflow-hidden p-1.5 group">
            <div className="absolute inset-0 rounded-full border border-dashed border-cyan-500/30 animate-spin" style={{ animationDuration: '25s' }}></div>
            <div className="absolute inset-2 rounded-full border border-cyan-500/10"></div>
            <img 
              src="/src/assets/images/msr_logo_square_1783624736018.jpg" 
              alt="Music Station Radio Logo" 
              className="w-20 h-20 object-cover rounded-full z-10 relative shadow-lg contrast-[1.1] brightness-[1.05]"
              onError={(e) => {
                // If image fails to load, gracefully hide it to show standard icon
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <Award className="absolute w-10 h-10 text-gray-600 z-0 pointer-events-none" />
          </div>
          <p className="text-[11px] font-mono font-bold uppercase text-gray-300 tracking-widest mt-4">Music Station Network</p>
          <p className="text-[9px] text-cyan-400/80 font-mono mt-1 font-semibold tracking-wider">EST. 2026 DIGITAL COLLECTIBLE</p>
        </div>

        {/* Bottom Technical data */}
        <div className="border-t border-gray-800/80 pt-4 z-10">
          <div className="grid grid-cols-2 gap-4 text-left font-mono">
            <div>
              <p className="text-[9px] text-gray-500 font-bold uppercase">Device Synergy</p>
              <p className="text-xs text-white font-bold">100% Match</p>
            </div>
            <div>
              <p className="text-[9px] text-gray-500 font-bold uppercase">Holo-Class</p>
              <p className={`text-xs font-bold uppercase ${style.text}`}>{card.rarity}</p>
            </div>
          </div>
          <div className="mt-3 flex justify-between items-center bg-black/40 p-2 rounded-xl border border-gray-800/40">
            <span className="text-[9px] text-gray-500 font-mono">SERIAL NO.</span>
            <span className="text-xs text-cyan-400 font-mono font-bold">#MS-{card.id.slice(0, 8).toUpperCase()}</span>
          </div>
        </div>
      </div>
    );
  }

  // Front Side
  return (
    <div className={`w-full h-full rounded-3xl border-2 p-6 flex flex-col justify-between overflow-hidden bg-gradient-to-b relative ${style.bg} ${style.border}`}>
      {/* Dynamic diagonal shimmer lighting (constant slow rotation) */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-60 bg-[size:250%_250%] animate-shimmer-slow pointer-events-none z-10" />

      {/* Header */}
      <div className="flex justify-between items-center z-10">
        <span className={`text-[10px] tracking-widest font-black uppercase px-2.5 py-0.5 rounded-full shadow-lg bg-gradient-to-r ${style.badge}`}>
          {card.rarity}
        </span>
        <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
          <Sparkles className="w-3 h-3 text-yellow-400" />
        </div>
      </div>

      {/* Main Illustration Area with depth layer shadow */}
      <div className="flex-grow flex items-center justify-center my-4 relative w-full aspect-square">
        <div className="absolute w-44 h-44 rounded-full bg-cyan-500/5 filter blur-3xl pointer-events-none"></div>
        <div className="w-48 h-48 flex items-center justify-center relative z-10 transform hover:scale-105 duration-300">
          <TradingCardArt card={card} isDetailed={true} />
        </div>
      </div>

      {/* Identity card info block */}
      <CardCaption card={card} isDetailed={true} />

      <style>{`
        @keyframes shimmer-slow {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        .animate-shimmer-slow {
          animation: shimmer-slow 8s linear infinite;
        }
        .bg-scan-lines {
          background: linear-gradient(
            rgba(18, 16, 16, 0) 50%, 
            rgba(0, 0, 0, 0.25) 50%
          ), linear-gradient(
            90deg, 
            rgba(255, 0, 0, 0.06), 
            rgba(0, 255, 0, 0.02), 
            rgba(0, 0, 255, 0.06)
          );
          background-size: 100% 4px, 6px 100%;
        }
      `}</style>
    </div>
  );
};
