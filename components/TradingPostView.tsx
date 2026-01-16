import React from 'react';
import type { MarketListing, User } from '../types';
import { StarIcon, CollectionIcon } from '../constants';

interface TradingPostViewProps {
  onBack: () => void;
  listings: MarketListing[];
  onBuy: (listingId: string) => void;
  userPoints: number;
  currentUser: User | null;
}

const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>;

export const TradingPostView: React.FC<TradingPostViewProps> = ({ onBack, listings, onBuy, userPoints, currentUser }) => {
  const getRarityColor = (rarity: string) => {
      switch(rarity) {
          case 'legendary': return 'border-yellow-500 shadow-yellow-500/20 bg-yellow-900/10';
          case 'epic': return 'border-purple-500 shadow-purple-500/20 bg-purple-900/10';
          case 'rare': return 'border-blue-500 shadow-blue-500/20 bg-blue-900/10';
          default: return 'border-gray-700 bg-gray-800/40';
      }
  };

  const getRarityBadge = (rarity: string) => {
      switch(rarity) {
          case 'legendary': return 'bg-yellow-500 text-black';
          case 'epic': return 'bg-purple-600 text-white';
          case 'rare': return 'bg-blue-600 text-white';
          default: return 'bg-gray-600 text-white';
      }
  };

  return (
    <div className="p-4 md:p-8 animate-fade-in">
        <div className="max-w-6xl mx-auto">
            <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[var(--accent-color)] transition-colors mb-6 group">
                <BackIcon />
                <span className="uppercase tracking-widest group-hover:pl-1 transition-all">Back to Explore</span>
            </button>

            <header className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-bold font-orbitron text-white flex items-center gap-3">
                        <CollectionIcon className="w-10 h-10 text-cyan-500"/>
                        The Trading Post
                    </h1>
                    <p className="text-gray-400 mt-2">Community marketplace for rare collector cards.</p>
                </div>
                
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-900/80 rounded-2xl border border-yellow-500/30 text-yellow-400 shadow-xl">
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Your Balance</p>
                        <p className="font-bold text-2xl flex items-center gap-2 justify-end">
                            {userPoints.toLocaleString()} <StarIcon className="w-6 h-6"/>
                        </p>
                    </div>
                </div>
            </header>

            {listings.length === 0 ? (
                <div className="text-center py-20 bg-gray-900/50 rounded-3xl border border-gray-800">
                    <CollectionIcon className="w-16 h-16 text-gray-700 mx-auto mb-4 opacity-20" />
                    <p className="text-xl font-bold text-gray-500">No active listings</p>
                    <p className="text-sm text-gray-600 mt-1">Check back later or list your own cards from your collection.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {listings.map(listing => {
                        const canAfford = userPoints >= listing.price;
                        const isYours = currentUser && listing.seller === currentUser.username;
                        
                        return (
                            <div key={listing.id} className={`flex flex-col rounded-2xl border overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl ${getRarityColor(listing.card.rarity)}`}>
                                <div className="p-4 flex-grow">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${getRarityBadge(listing.card.rarity)}`}>
                                            {listing.card.rarity}
                                        </span>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase">{listing.seller}</span>
                                    </div>
                                    
                                    <div className="aspect-square bg-black/40 rounded-xl mb-4 flex items-center justify-center">
                                        <img src={listing.card.image} alt={listing.card.name} className="w-24 h-24 object-contain drop-shadow-2xl" />
                                    </div>
                                    
                                    <h3 className="text-lg font-bold text-white mb-1">{listing.card.name}</h3>
                                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{listing.card.description}</p>
                                </div>
                                
                                <div className="p-4 bg-black/40 border-t border-white/5 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-1.5 text-yellow-400 font-bold text-lg">
                                        <span>{listing.price.toLocaleString()}</span>
                                        <StarIcon className="w-4 h-4"/>
                                    </div>
                                    
                                    {isYours ? (
                                        <button disabled className="px-4 py-2 bg-gray-800 text-gray-500 text-xs font-bold uppercase rounded-lg border border-gray-700 cursor-not-allowed">
                                            Your Listing
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => onBuy(listing.id)}
                                            disabled={!canAfford}
                                            className={`px-6 py-2 rounded-lg font-black text-xs uppercase tracking-widest transition-all ${canAfford ? 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-lg shadow-cyan-900/20 active:scale-95' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
                                        >
                                            Purchase
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    </div>
  );
};