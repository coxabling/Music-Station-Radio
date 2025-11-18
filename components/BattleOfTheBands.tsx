
import React, { useState, useRef } from 'react';
import type { BattleContestant } from '../types';
import { BATTLE_CONTESTANTS, StarIcon, BattleIcon } from '../constants';

interface BattleOfTheBandsProps {
    userPoints: number;
    onVote: (contestantId: string) => void;
    votes: { [id: string]: number }; // Simulated vote counts
    userVotedFor?: string; // ID of contestant user voted for
}

const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" viewBox="0 0 20 20" fill="currentColor"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8.006v3.988a1 1 0 001.555.832l3.197-2.005a1 1 0 000-1.664L9.555 7.168z" /></svg>;
const PauseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;

const ContestantCard: React.FC<{
    contestant: BattleContestant;
    isActive: boolean;
    isPlaying: boolean;
    onPlay: () => void;
    onVote: () => void;
    votes: number;
    hasVoted: boolean;
    totalVotes: number;
    canAfford: boolean;
}> = ({ contestant, isActive, isPlaying, onPlay, onVote, votes, hasVoted, totalVotes, canAfford }) => {
    const percent = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;

    return (
        <div className={`relative rounded-xl overflow-hidden border-2 transition-all duration-300 ${isActive ? 'border-[var(--accent-color)] shadow-[0_0_20px_rgba(103,232,249,0.2)] scale-105 z-10' : 'border-gray-700 grayscale hover:grayscale-0'}`}>
            <div className="aspect-square relative">
                <img src={contestant.coverArt} alt={contestant.artist} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <button onClick={onPlay} className="text-white hover:scale-110 transition-transform focus:outline-none">
                        {isPlaying && isActive ? <PauseIcon /> : <PlayIcon />}
                    </button>
                </div>
            </div>
            
            <div className="p-4 bg-gray-900/90 absolute bottom-0 w-full">
                <h3 className="font-bold text-lg text-white truncate">{contestant.artist}</h3>
                <p className="text-sm text-gray-300 truncate">"{contestant.song}"</p>
                
                <div className="mt-4">
                     {hasVoted ? (
                        <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden relative">
                            <div className="bg-[var(--accent-color)] h-full transition-all duration-1000 ease-out" style={{ width: `${percent}%` }}></div>
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md">{Math.round(percent)}%</span>
                        </div>
                     ) : (
                        <button 
                            onClick={onVote}
                            disabled={!canAfford}
                            className={`w-full py-2 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-colors ${canAfford ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
                        >
                            Vote (10 <StarIcon className="w-3 h-3" />)
                        </button>
                     )}
                </div>
            </div>
        </div>
    );
};

export const BattleOfTheBands: React.FC<BattleOfTheBandsProps> = ({ userPoints, onVote, votes, userVotedFor }) => {
    const [playingId, setPlayingId] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    
    const handlePlay = (id: string) => {
        if (playingId === id) {
            audioRef.current?.pause();
            setPlayingId(null);
        } else {
            setPlayingId(id);
            if (audioRef.current) {
                const contestant = BATTLE_CONTESTANTS.find(c => c.id === id);
                if(contestant) {
                    audioRef.current.src = contestant.previewUrl;
                    audioRef.current.play().catch(e => console.error("Audio play error", e));
                }
            }
        }
    };

    const totalVotes = Object.values(votes).reduce((a: number, b: number) => a + b, 0);

    return (
        <div className="p-4 md:p-8 animate-fade-in h-full flex flex-col">
             <audio ref={audioRef} onEnded={() => setPlayingId(null)} />
             <div className="max-w-4xl mx-auto w-full flex-grow flex flex-col justify-center">
                <header className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-purple-900/30 rounded-full mb-4 border border-purple-500/30">
                        <BattleIcon className="w-8 h-8 text-purple-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                        Battle of the Bands
                    </h1>
                    <p className="text-gray-300 mt-2 text-lg">Who rules the airwaves this week? You decide.</p>
                    <p className="text-sm text-gray-500 mt-1">Voting costs 10 points.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center relative">
                    {/* VS Badge */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-16 h-16 bg-black rounded-full border-4 border-white shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                        <span className="font-black text-xl italic text-white">VS</span>
                    </div>

                    {BATTLE_CONTESTANTS.map(contestant => (
                        <ContestantCard 
                            key={contestant.id}
                            contestant={contestant}
                            isActive={playingId === contestant.id}
                            isPlaying={playingId === contestant.id}
                            onPlay={() => handlePlay(contestant.id)}
                            onVote={() => onVote(contestant.id)}
                            votes={votes[contestant.id] || 0}
                            totalVotes={totalVotes}
                            hasVoted={!!userVotedFor}
                            canAfford={userPoints >= 10}
                        />
                    ))}
                </div>
                
                {userVotedFor && (
                    <div className="text-center mt-12 animate-fade-in">
                        <p className="text-green-400 font-bold text-lg">Thanks for voting!</p>
                        <p className="text-gray-500 text-sm">Tune in next week for a new battle.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
