
import React, { useState, useEffect, useCallback } from 'react';
import type { Stock, StockTransaction, StockSentiment, StockNewsEvent } from '../types';
import { StarIcon } from '../constants';
import { getMarketSentiment } from '../services/geminiService';
import { SparklineChart } from './SparklineChart'; // New component
import { StockNewsFeed } from './StockNewsFeed'; // New component
import { formatTimeAgo } from '../utils/time';

interface StockMarketModalProps {
    isOpen: boolean;
    onClose: () => void;
    stocks: Stock[];
    portfolio: Record<string, number>;
    userPoints: number;
    onTransaction: (symbol: string, amount: number, type: 'buy' | 'sell') => void;
    stockTransactions: StockTransaction[]; // New
    stockMarketNews: StockNewsEvent[]; // New
}

const TrendingUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const TrendingDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>;
const GraphIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25V9m-4.5 9H1.5M7.5 14.25H3m0 0L3 18m12 0L12 9.75m0 0V3m-4.5 9h9m-9 0V3m-4.5 9h9m-9 0V3m12 9V3m0 0H7.5m12 0h-9m-4.5 9L1.5 18M7.5 14.25L12 9.75m-4.5 4.5h9m-9 0V3m0 0H7.5m4.5 9L1.5 18" /></svg>;
const NewsIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5l-.75-.75m0 0l-.75.75m.75-.75V11m-.75 3.75h.008v.008H11.25v-.008zm-2.031.008a9.75 9.75 0 012.41-.581c.556-.091 1.112-.132 1.67-.132h.004C14.075 14.535 15 15.602 15 17c0 1.472-.924 2.53-2.222 2.946l-.32.09c-.56.162-1.13.238-1.7.238h-.006c-.569 0-1.13-.076-1.7-.238l-.32-.09C8.924 19.53 8 18.472 8 17c0-1.398.925-2.465 2.222-2.882Zm.494-6.836l.24.24a.75.75 0 001.06 0l.24-.24H14.25V6H9.75v1.912zM12 21a9 9 0 100-18 9 9 0 000 18z" /></svg>;
const HistoryIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


export const StockMarketModal: React.FC<StockMarketModalProps> = ({ isOpen, onClose, stocks, portfolio, userPoints, onTransaction, stockTransactions, stockMarketNews }) => {
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
    const [amount, setAmount] = useState(1);
    const [marketSentiment, setMarketSentiment] = useState<Record<string, StockSentiment>>({});
    const [isLoadingSentiment, setIsLoadingSentiment] = useState(false);
    const [transactionStatus, setTransactionStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');

    // Fetch sentiment for all stocks when modal opens
    useEffect(() => {
        if (isOpen && stocks.length > 0) {
            setIsLoadingSentiment(true);
            const fetchSentiments = async () => {
                const newSentiments: Record<string, StockSentiment> = {};
                for (const stock of stocks) {
                    try {
                        const sentiment = await getMarketSentiment(stock);
                        newSentiments[stock.symbol] = sentiment;
                    } catch (error) {
                        console.error(`Failed to get sentiment for ${stock.symbol}:`, error);
                        newSentiments[stock.symbol] = { symbol: stock.symbol, sentiment: 'neutral', reason: 'Failed to fetch sentiment.' };
                    }
                }
                setMarketSentiment(newSentiments);
                setIsLoadingSentiment(false);
            };
            fetchSentiments();
        } else if (!isOpen) {
            setMarketSentiment({}); // Clear sentiment when closing
        }
    }, [isOpen, stocks]);

    if (!isOpen) return null;

    const handleTransaction = async (type: 'buy' | 'sell') => {
        if (!selectedStock || amount <= 0) return;

        setTransactionStatus('pending');
        try {
            await onTransaction(selectedStock.symbol, amount, type);
            setTransactionStatus('success');
            // Re-fetch sentiment for the updated stock
            const updatedSentiment = await getMarketSentiment(selectedStock);
            setMarketSentiment(prev => ({ ...prev, [selectedStock.symbol]: updatedSentiment }));
            setTimeout(() => setTransactionStatus('idle'), 2000);
        } catch (error) {
            setTransactionStatus('error');
            console.error("Transaction failed:", error);
            setTimeout(() => setTransactionStatus('idle'), 2000);
        }
    };
    
    const getTransactionButtonText = (type: 'buy' | 'sell') => {
        if (transactionStatus === 'pending') return 'Processing...';
        if (transactionStatus === 'success') return type === 'buy' ? 'Bought!' : 'Sold!';
        if (transactionStatus === 'error') return 'Failed!';
        return type === 'buy' ? 'Buy' : 'Sell';
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
                    <div className="flex-1 overflow-y-auto p-4 border-r border-gray-700 custom-scrollbar-sm">
                        <h3 className="text-sm font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                            <GraphIcon className="w-4 h-4 text-cyan-400"/> Market Overview
                        </h3>
                        {isLoadingSentiment ? (
                            <div className="text-center py-4"><div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-cyan-400 mx-auto"></div></div>
                        ) : (
                            <div className="space-y-2">
                                {stocks.map(stock => (
                                    <div 
                                        key={stock.symbol} 
                                        onClick={() => { setSelectedStock(stock); setAmount(1); }}
                                        className={`p-3 rounded-lg cursor-pointer flex justify-between items-center border transition-colors ${selectedStock?.symbol === stock.symbol ? 'bg-gray-800 border-[var(--accent-color)]' : 'bg-gray-800/50 border-transparent hover:bg-gray-800'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0 w-16 h-8">
                                                <SparklineChart data={stock.priceHistory} color={stock.change >= 0 ? 'green' : 'red'} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">{stock.symbol}</p>
                                                <p className="text-xs text-gray-400">{stock.stationName}</p>
                                            </div>
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
                        )}
                    </div>

                    {/* Trading Panel */}
                    <div className="flex-1 p-6 bg-gray-800/30 flex flex-col custom-scrollbar-sm">
                        {selectedStock ? (
                            <>
                                <div className="mb-4">
                                    <h3 className="text-2xl font-bold text-white mb-1">{selectedStock.stationName} ({selectedStock.symbol})</h3>
                                    <p className="text-3xl font-mono text-[var(--accent-color)]">{selectedStock.price.toFixed(2)} <span className="text-sm text-gray-400">pts</span></p>
                                </div>

                                {/* Sentiment Analysis */}
                                {isLoadingSentiment ? (
                                     <div className="text-center text-gray-500 py-2"><div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-500 inline-block"></div> Fetching sentiment...</div>
                                ) : marketSentiment[selectedStock.symbol] && (
                                    <div className={`p-3 rounded-lg border mb-4 text-sm ${
                                        marketSentiment[selectedStock.symbol].sentiment === 'positive' ? 'bg-green-900/20 border-green-500/50 text-green-300' :
                                        marketSentiment[selectedStock.symbol].sentiment === 'negative' ? 'bg-red-900/20 border-red-500/50 text-red-300' :
                                        'bg-gray-700/30 border-gray-600/50 text-gray-300'
                                    }`}>
                                        <p className="font-semibold">Sentiment: {marketSentiment[selectedStock.symbol].sentiment.toUpperCase()}</p>
                                        <p className="text-xs mt-1">{marketSentiment[selectedStock.symbol].reason}</p>
                                    </div>
                                )}

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
                                        onClick={() => handleTransaction('buy')}
                                        disabled={userPoints < amount * selectedStock.price || transactionStatus === 'pending'}
                                        className={`bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors ${transactionStatus === 'success' && 'bg-green-400'} ${transactionStatus === 'error' && 'bg-red-500'}`}
                                    >
                                        {getTransactionButtonText('buy')}
                                    </button>
                                    <button 
                                        onClick={() => handleTransaction('sell')}
                                        disabled={(portfolio[selectedStock.symbol] || 0) < amount || transactionStatus === 'pending'}
                                        className={`bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors ${transactionStatus === 'success' && 'bg-green-400'} ${transactionStatus === 'error' && 'bg-red-500'}`}
                                    >
                                        {getTransactionButtonText('sell')}
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

                {/* News Feed and Transaction History */}
                <div className="flex-shrink-0 p-6 border-t border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                            <NewsIcon className="w-4 h-4 text-yellow-400"/> Market News
                        </h3>
                        <StockNewsFeed news={stockMarketNews} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                            <HistoryIcon className="w-4 h-4 text-purple-400"/> Transaction History
                        </h3>
                        <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar-sm">
                            {stockTransactions.length > 0 ? (
                                stockTransactions.map(tx => (
                                    <div key={tx.id} className={`p-2 rounded-lg text-xs flex justify-between items-center ${tx.type === 'buy' ? 'bg-green-900/10 text-green-200' : 'bg-red-900/10 text-red-200'}`}>
                                        <div>
                                            <span className="font-bold uppercase">{tx.type}</span> {tx.amount} {tx.symbol} @ {tx.price.toFixed(2)}
                                        </div>
                                        <div className="text-right">
                                            <span className="font-mono">{tx.totalValue.toFixed(2)} pts</span>
                                            <p className="text-gray-500">{formatTimeAgo(tx.timestamp)}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 text-xs">No transactions yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};