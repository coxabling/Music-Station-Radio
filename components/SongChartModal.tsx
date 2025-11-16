import React, { useMemo, useState, useEffect } from 'react';
import type { SongVote } from '../types';
import { getCommunityHitsSummary } from '../services/geminiService';

interface SongChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  songVotes: Record<string, SongVote>;
}

const ChartBarIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>;
const TrophyIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M11.68 1.33a1 1 0 011.64 0l1.35 2.22a1 1 0 00.82.55l2.45.36a1 1 0 01.56 1.7l-1.78 1.73a1 1 0 00-.29.89l.42 2.44a1 1 0 01-1.45 1.05L12 11.45a1 1 0 00-.94 0l-2.19 1.15a1 1 0 01-1.45-1.05l.42-2.44a1 1 0 00-.29-.89L5.78 6.16a1 1 0 01.56-1.7l2.45-.36a1 1 0 00.82-.55L11.68 1.33zM10 14a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1zM6 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM14 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z" /></svg>;
const ThumbUpIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333V17a1 1 0 001 1h6.364a1 1 0 00.942-.671l1.757-6.327a1 1 0 00-.942-1.329H13V4.5a1.5 1.5 0 00-3 0v5.833H6z" /></svg>;
const GeminiIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.012 2.25c.345 0 .68.018 1.004.053a9.75 9.75 0 0 1 8.213 8.213c.035.324.053.66.053 1.004s-.018.68-.053 1.004a9.75 9.75 0 0 1-8.213 8.213c-.324.035-.66.053-1.004.053s-.68-.018-1.004-.053a9.75 9.75 0 0 1-8.213-8.213c-.035-.324-.053-.66-.053-1.004s.018-.68.053-1.004a9.75 9.75 0 0 1 8.213-8.213c.324-.035.66.053 1.004-.053ZM8.26 8.906a.75.75 0 0 0-.53 1.28l1.47 1.47-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 1 0 1.06-1.06l-1.47-1.47 1.47-1.47a.75.75 0 1 0-1.06-1.06l-1.47 1.47-1.47-1.47a.75.75 0 0 0-.53-.22Zm6.75 3.344a.75.75 0 0 0-1.06-1.06l-1.47 1.47-1.47-1.47a.75.75 0 1 0-1.06 1.06l1.47 1.47-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 1 0 1.06-1.06l-1.47-1.47 1.47-1.47Z" />
    </svg>
);


export const SongChartModal: React.FC<SongChartModalProps> = ({ isOpen, onClose, songVotes }) => {
  const [summary, setSummary] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  
  const rankedList = useMemo(() => {
    // FIX: Cast Object.values to SongVote[] to ensure correct type inference for filter and sort.
    return (Object.values(songVotes) as SongVote[])
      .filter(song => song.likes > 0)
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 20); // Get top 20
  }, [songVotes]);

  useEffect(() => {
    if (isOpen && rankedList.length > 0) {
      const fetchSummary = async () => {
        setIsSummaryLoading(true);
        const result = await getCommunityHitsSummary(rankedList);
        setSummary(result);
        setIsSummaryLoading(false);
      };
      fetchSummary();
    } else if (!isOpen) {
        // Reset when modal is closed
        setSummary('');
    }
  }, [isOpen, rankedList]);
  
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="chart-modal-title"
    >
      <div 
        className="bg-gray-800/80 backdrop-blur-lg border accent-color-border/30 rounded-xl shadow-2xl shadow-black/50 w-full max-w-lg max-h-[80vh] flex flex-col animate-slide-up-fast"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-700/50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ChartBarIcon className="w-6 h-6 accent-color-text"/>
            <h2 id="chart-modal-title" className="text-lg font-bold accent-color-text font-orbitron">
              Top Community Hits
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>
        
        <div className="p-6 overflow-y-auto">
          {rankedList.length > 0 && (
            <div className="mb-6 p-4 bg-gray-900/50 border border-gray-700/50 rounded-lg">
              {isSummaryLoading ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--accent-color)]"></div>
                  <p className="text-gray-400">Analyzing the community vibe...</p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-300 italic">"{summary}"</p>
                  <div className="flex justify-end items-center gap-1 text-xs text-gray-500 mt-2">
                      <GeminiIcon className="w-3 h-3"/>
                      <span>Summary by Gemini</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {rankedList.length > 0 ? (
            <ul className="space-y-3">
              {rankedList.map((song, index) => {
                const rank = index + 1;
                const rankColor = rank === 1 ? 'text-yellow-400' : rank === 2 ? 'text-gray-300' : rank === 3 ? 'text-yellow-600' : 'text-gray-400';
                return (
                  <li key={song.id} className="flex items-center gap-4 p-2 bg-gray-900/50 rounded-lg animate-fade-in" style={{animationDelay: `${index * 50}ms`}}>
                    <div className={`w-10 text-center font-bold text-lg ${rankColor} flex items-center justify-center flex-shrink-0`}>
                      {rank}
                      {rank <= 3 && <TrophyIcon className="w-4 h-4 ml-1" />}
                    </div>
                    <img src={song.albumArt} alt={song.title} className="w-12 h-12 rounded-md object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate" title={song.title}>{song.title}</p>
                      <p className="text-sm text-gray-400 truncate" title={song.artist}>{song.artist}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-green-400 font-mono text-sm flex-shrink-0">
                      <ThumbUpIcon className="w-4 h-4"/>
                      <span>{song.likes.toLocaleString()}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-center text-gray-400 py-10">
              <p className="text-lg font-semibold">The Chart is Empty</p>
              <p className="text-sm mt-1">Start liking songs to see them appear here!</p>
            </div>
          )}
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