
import React from 'react';
import type { ShopItem, UserData } from '../types';
import { SHOP_ITEMS, StarIcon, CheckCircleIcon, LockIcon } from '../constants';

interface ShopViewProps {
    userPoints: number;
    inventory: string[];
    equippedItems: UserData['equippedItems'];
    onBuyItem: (item: ShopItem) => void;
    onEquipItem: (item: ShopItem) => void;
    onUnequipItem: (type: ShopItem['type']) => void;
}

const ShopCard: React.FC<{
    item: ShopItem;
    isOwned: boolean;
    isEquipped: boolean;
    canAfford: boolean;
    onBuy: () => void;
    onEquip: () => void;
    onUnequip: () => void;
}> = ({ item, isOwned, isEquipped, canAfford, onBuy, onEquip, onUnequip }) => (
    <div className={`p-4 rounded-lg border-2 transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${isOwned ? 'bg-gray-800/50 border-gray-600' : 'bg-gray-900/50 border-gray-700/50'}`}>
        {isEquipped && (
            <div className="absolute top-0 right-0 bg-green-500 text-black text-xs font-bold px-2 py-1 rounded-bl-lg">
                Equipped
            </div>
        )}
        <div>
            <h3 className="font-bold text-white text-lg">{item.name}</h3>
            <p className="text-xs text-gray-400 mt-1 min-h-[2.5em]">{item.description}</p>
            
            <div className="mt-4 flex justify-center h-16 items-center bg-gray-900/50 rounded-md border border-gray-700/30">
                {item.type === 'name_color' && <span style={{ color: item.value }} className="font-bold text-xl">Preview Name</span>}
                {item.type === 'frame' && (
                    <div className={`w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center ${item.value}`}>
                        <span className="text-[10px] text-white">Pic</span>
                    </div>
                )}
            </div>
        </div>

        <div className="mt-4">
            {isOwned ? (
                isEquipped ? (
                    <button onClick={onUnequip} className="w-full py-2 rounded-md text-sm font-bold bg-gray-600 hover:bg-gray-700 text-white transition-colors">
                        Unequip
                    </button>
                ) : (
                    <button onClick={onEquip} className="w-full py-2 rounded-md text-sm font-bold bg-cyan-600 hover:bg-cyan-700 text-white transition-colors">
                        Equip
                    </button>
                )
            ) : (
                <button 
                    onClick={onBuy} 
                    disabled={!canAfford} 
                    className={`w-full py-2 rounded-md text-sm font-bold flex items-center justify-center gap-1 transition-colors ${
                        canAfford ? 'bg-[var(--accent-color)] hover:opacity-90 text-black' : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    {!canAfford && <LockIcon className="w-3 h-3 mr-1" />}
                    Buy for {item.cost} <StarIcon className="w-3 h-3"/>
                </button>
            )}
        </div>
    </div>
);

export const ShopView: React.FC<ShopViewProps> = ({ userPoints, inventory, equippedItems, onBuyItem, onEquipItem, onUnequipItem }) => {
    return (
        <div className="p-4 md:p-8 animate-fade-in">
             <div className="max-w-5xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-3xl font-bold font-orbitron accent-color-text">Redemption Shop</h1>
                    <p className="text-gray-400 mt-2">Spend your hard-earned points on exclusive cosmetics.</p>
                    <div className="inline-flex items-center gap-2 bg-yellow-900/20 border border-yellow-500/30 px-4 py-2 rounded-full mt-4">
                        <span className="text-gray-300 text-sm">Your Balance:</span>
                        <span className="text-yellow-400 font-bold font-mono text-lg flex items-center gap-1">
                            {userPoints.toLocaleString()} <StarIcon className="w-5 h-5"/>
                        </span>
                    </div>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SHOP_ITEMS.map(item => {
                        const isOwned = inventory.includes(item.id);
                        const isEquipped = equippedItems[item.type] === item.id;
                        const canAfford = userPoints >= item.cost;

                        return (
                            <ShopCard 
                                key={item.id}
                                item={item}
                                isOwned={isOwned}
                                isEquipped={isEquipped}
                                canAfford={canAfford}
                                onBuy={() => onBuyItem(item)}
                                onEquip={() => onEquipItem(item)}
                                onUnequip={() => onUnequipItem(item.type)}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
