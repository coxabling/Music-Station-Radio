
import React, { useState } from 'react';
import type { Stock } from '../types';
import { StarIcon } from '../constants';

interface StockMarketModalProps {
    isOpen: boolean;
    onClose: () => void;
    stocks: Stock[];
    portfolio: Record<string, number>;
    userPoints: number;
    onTransaction: (symbol: string, amount: number, type: 'buy' | 'sell') => void;
}

const TrendingUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const TrendingDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>;

export const StockMarketModal: React.FC<StockMarketModalProps> = ({ isOpen, onClose, stocks, portfolio, userPoints, onTransaction }) => {
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
    const [amount, setAmount] = useState(1);

    if (!isOpen) return null;

    const handleBuy = () => {
        if (selectedStock) onTransaction(selectedStock.symbol, amount, 'buy');
    };

    const handleSell = () => {
        if (selectedStock) onTransaction(selectedStock.symbol, amount, 'sell');
    };

    return (
        <div 
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={onClose}
        >
            <div 
              className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
                <header className="p-6 border-b border-gray-700 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold font-orbitron text-white">Station Stock Market</h2>
                        <p className="text-gray-400 text-sm">Invest in stations. Prices fluctuate based on listener count.</p>
                    </div>
                    <div className="text-right">
                         <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full border border-yellow-500/30 text-yellow-400">
                            <StarIcon className="w-5 h-5"/>
                            <span className="font-bold">{userPoints.toLocaleString()}</span>
                        </div>
                    </div>
                </header>

                <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
                    {/* Market List */}
                    <div className="flex-1 overflow-y-auto p-4 border-r border-gray-700">
                        <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">Market</h3>
                        <div className="space-y-2">
                            {stocks.map(stock => (
                                <div 
                                    key={stock.symbol} 
                                    onClick={() => { setSelectedStock(stock); setAmount(1); }}
                                    className={`p-3 rounded-lg cursor-pointer flex justify-between items-center border transition-colors ${selectedStock?.symbol === stock.symbol ? 'bg-gray-800 border-[var(--accent-color)]' : 'bg-gray-800/50 border-transparent hover:bg-gray-800'}`}
                                >
                                    <div>
                                        <p className="font-bold text-white">{stock.symbol}</p>
                                        <p className="text-xs text-gray-400">{stock.stationName}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono text-white">{stock.price.toFixed(2)}</p>
                                        <div className="flex items-center justify-end gap-1 text-xs">
                                            {stock.change >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                                            <span className={stock.change >= 0 ? 'text-green-400' : 'text-red-400'}>{stock.change}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Trading Panel */}
                    <div className="flex-1 p-6 bg-gray-800/30 flex flex-col">
                        {selectedStock ? (
                            <>
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold text-white mb-1">{selectedStock.stationName} ({selectedStock.symbol})</h3>
                                    <p className="text-3xl font-mono text-[var(--accent-color)]">{selectedStock.price.toFixed(2)} <span className="text-sm text-gray-400">pts</span></p>
                                </div>

                                <div className="bg-gray-900 p-4 rounded-lg mb-6">
                                    <p className="text-sm text-gray-400 mb-2">Your Portfolio</p>
                                    <p className="text-xl font-bold text-white">{portfolio[selectedStock.symbol] || 0} shares</p>
                                    <p className="text-xs text-gray-500">Value: {((portfolio[selectedStock.symbol] || 0) * selectedStock.price).toFixed(2)} pts</p>
                                </div>

                                <div className="flex-grow">
                                    <label className="block text-sm text-gray-400 mb-2">Amount to Trade</label>
                                    <input 
                                        type="number" 
                                        min="1" 
                                        value={amount} 
                                        onChange={e => setAmount(Math.max(1, parseInt(e.target.value)))}
                                        className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-white text-lg focus:border-[var(--accent-color)] outline-none mb-2"
                                    />
                                    <p className="text-right text-xs text-gray-400">Total: {(amount * selectedStock.price).toFixed(2)} pts</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <button 
                                        onClick={handleBuy}
                                        disabled={userPoints < amount * selectedStock.price}
                                        className="bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors"
                                    >
                                        Buy
                                    </button>
                                    <button 
                                        onClick={handleSell}
                                        disabled={(portfolio[selectedStock.symbol] || 0) < amount}
                                        className="bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors"
                                    >
                                        Sell
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">
                                Select a stock to start trading.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
