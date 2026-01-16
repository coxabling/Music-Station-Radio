import React, { useState } from 'react';
import type { CollectorCard } from '../types';

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: CollectorCard[];
  onListCard: (cardId: string, price: number) => void;
}

export const CollectionModal: React.FC<CollectionModalProps> = ({ isOpen, onClose, collection, onListCard }) => {
  const [listingId, setListingId] = useState<string | null>(null);
  const [listingPrice, setListingPrice] = useState(500);

  if (!isOpen) return null;

  const getRarityColor = (rarity: string) => {
      switch(rarity) {
          case 'legendary': return 'border-yellow-500 shadow-yellow-500/50 bg-gradient-to-br from-yellow-900/50 to-black';
          case 'epic': return 'border-purple-500 shadow-purple-500/50 bg-gradient-to-br from-purple-900/50 to-black';
          case 'rare': return 'border-blue-500 shadow-blue-500/50 bg-gradient-to-br from-blue-900/50 to-black';
          default: return 'border-gray-500 shadow-gray-500/20 bg-gray-800';
      }
  };

  const handleListSubmit = () => {
    if (listingId && listingPrice > 0) {
        onListCard(listingId, listingPrice);
        setListingId(null);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in-fast"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-slide-up-fast"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold font-orbitron text-white tracking-wider">My Collection</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>
        
        <div className="p-6 overflow-y-auto flex-grow">
            {collection.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-lg">Your collection is empty.</p>
                    <p className="text-gray-600 text-sm mt-2">Tune in to special broadcasts to find cards!</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {collection.map(card => (
                        <div key={card.id} className={`relative aspect-[2/3] rounded-xl border-2 overflow-hidden group transition-transform hover:scale-105 ${getRarityColor(card.rarity)}`}>
                            <div className="absolute inset-0 p-3 flex flex-col">
                                <div className="flex justify-between items-start">
                                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-black/50 text-white border border-white/20`}>{card.rarity}</span>
                                </div>
                                <div className="flex-grow flex items-center justify-center my-2">
                                    <img src={card.image} alt={card.name} className="w-20 h-20 object-contain drop-shadow-lg" />
                                </div>
                                <div className="mt-auto bg-black/60 backdrop-blur-sm p-2 rounded-lg text-center">
                                    <p className="font-bold text-white text-sm leading-tight">{card.name}</p>
                                    <p className="text-[10px] text-gray-300 mt-1 leading-tight line-clamp-1">{card.description}</p>
                                    
                                    <button 
                                        onClick={() => setListingId(card.id)}
                                        className="mt-2 w-full py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold uppercase rounded transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        Sell Card
                                    </button>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{backgroundSize: '200% 200%'}}></div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Listing Modal Overlay */}
        {listingId && (
            <div className="absolute inset-0 bg-black/90 z-20 flex items-center justify-center p-6 animate-fade-in">
                <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 max-w-sm w-full">
                    <h3 className="text-xl font-bold text-white mb-4">List Card for Sale</h3>
                    <div className="mb-6">
                        <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Asking Price (Points)</label>
                        <input 
                            type="number" 
                            value={listingPrice}
                            onChange={(e) => setListingPrice(Math.max(1, parseInt(e.target.value) || 0))}
                            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                        />
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => setListingId(null)} className="flex-1 py-3 text-gray-400 font-bold">Cancel</button>
                        <button onClick={handleListSubmit} className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all">List Card</button>
                    </div>
                </div>
            </div>
        )}
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