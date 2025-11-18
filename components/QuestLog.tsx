
import React from 'react';
import type { Quest } from '../types';
import { StarIcon, CheckCircleIcon, QuestIcon } from '../constants';

interface QuestLogProps {
    quests: Quest[];
    onClaimReward: (questId: string) => void;
}

const ProgressBar: React.FC<{ current: number, target: number }> = ({ current, target }) => {
    const percentage = Math.min((current / target) * 100, 100);
    return (
        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2 overflow-hidden">
            <div 
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    );
}

const QuestItem: React.FC<{ quest: Quest, onClaim: () => void }> = ({ quest, onClaim }) => {
    const isComplete = quest.progress >= quest.target;
    
    return (
        <div className={`p-4 rounded-lg border transition-all ${isComplete && !quest.claimed ? 'bg-green-900/20 border-green-500/50 shadow-lg shadow-green-500/10' : 'bg-gray-800/50 border-gray-700/50'}`}>
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h4 className="font-bold text-white flex items-center gap-2">
                        {quest.title}
                        {isComplete && <CheckCircleIcon className="w-5 h-5 text-green-400"/>}
                    </h4>
                    <p className="text-sm text-gray-400">{quest.description}</p>
                </div>
                <div className="flex items-center gap-1 text-yellow-400 font-mono text-sm font-bold bg-yellow-900/20 px-2 py-1 rounded">
                    {quest.reward} <StarIcon className="w-3 h-3"/>
                </div>
            </div>
            
            <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                <span>Progress</span>
                <span>{Math.min(quest.progress, quest.target)} / {quest.target}</span>
            </div>
            <ProgressBar current={quest.progress} target={quest.target} />
            
            {isComplete && !quest.claimed && (
                <button 
                    onClick={onClaim}
                    className="mt-4 w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded-md transition-colors animate-pulse"
                >
                    Claim Reward
                </button>
            )}
             {quest.claimed && (
                <div className="mt-4 w-full text-center text-sm text-green-500 font-semibold bg-green-900/10 py-2 rounded-md">
                    Completed
                </div>
            )}
        </div>
    );
};

export const QuestLog: React.FC<QuestLogProps> = ({ quests, onClaimReward }) => {
    const dailyQuests = quests.filter(q => q.type === 'daily');
    const weeklyQuests = quests.filter(q => q.type === 'weekly');

    return (
        <div className="p-4 md:p-8 animate-fade-in">
            <div className="max-w-3xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-3xl font-bold font-orbitron accent-color-text flex items-center justify-center gap-3">
                        <QuestIcon className="w-8 h-8"/>
                        Quest Log
                    </h1>
                    <p className="text-gray-400 mt-2">Complete challenges to earn points and climb the leaderboard.</p>
                </header>

                <div className="space-y-8">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[var(--accent-color)] pl-3">Daily Quests</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {dailyQuests.map(quest => (
                                <QuestItem key={quest.id} quest={quest} onClaim={() => onClaimReward(quest.id)} />
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-purple-500 pl-3">Weekly Challenges</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {weeklyQuests.map(quest => (
                                <QuestItem key={quest.id} quest={quest} onClaim={() => onClaimReward(quest.id)} />
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
