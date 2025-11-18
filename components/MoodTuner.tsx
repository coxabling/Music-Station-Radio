
import React from 'react';
import { BrainIcon, ConfettiIcon, CoffeeIcon, DumbbellIcon, SadFaceIcon, LightningIcon } from '../constants';

interface MoodTunerProps {
    onMoodSelect: (mood: string) => void;
    activeMood: string | null;
}

const moods = [
    { id: 'Focus', icon: BrainIcon, color: 'text-blue-400', label: 'Focus' },
    { id: 'Party', icon: ConfettiIcon, color: 'text-pink-400', label: 'Party' },
    { id: 'Relax', icon: CoffeeIcon, color: 'text-orange-400', label: 'Relax' },
    { id: 'Workout', icon: DumbbellIcon, color: 'text-red-400', label: 'Workout' },
    { id: 'Melancholy', icon: SadFaceIcon, color: 'text-indigo-400', label: 'Melancholy' },
    { id: 'Energetic', icon: LightningIcon, color: 'text-yellow-400', label: 'Energetic' },
];

export const MoodTuner: React.FC<MoodTunerProps> = ({ onMoodSelect, activeMood }) => {
    return (
        <div className="mb-6 animate-fade-in">
            <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wide">Mood Tuner</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {moods.map((mood) => {
                    const isActive = activeMood === mood.id;
                    return (
                        <button
                            key={mood.id}
                            onClick={() => onMoodSelect(mood.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all whitespace-nowrap ${
                                isActive
                                    ? `bg-gray-700 border-[var(--accent-color)] shadow-[0_0_10px_rgba(103,232,249,0.3)]`
                                    : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:border-gray-500'
                            }`}
                        >
                            <mood.icon className={`w-4 h-4 ${mood.color}`} />
                            <span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-300'}`}>
                                {mood.label}
                            </span>
                        </button>
                    );
                })}
                 {activeMood && (
                    <button 
                        onClick={() => onMoodSelect('')}
                        className="px-3 py-2 text-xs text-gray-500 hover:text-white transition-colors"
                    >
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
};
