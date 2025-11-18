
import React, { useState, useMemo } from 'react';
import type { Station, StationScheduleItem } from '../types';
import { CalendarDaysIcon, TrashIcon, ClockIcon } from '../constants';

interface StationScheduleProps {
    station: Station;
    isEditable?: boolean;
    onUpdateSchedule?: (schedule: StationScheduleItem[]) => void;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export const StationSchedule: React.FC<StationScheduleProps> = ({ station, isEditable, onUpdateSchedule }) => {
    const [selectedDay, setSelectedDay] = useState<typeof DAYS[number]>('Mon');
    
    // Edit Form State
    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const schedule = station.schedule || [];

    const filteredSchedule = useMemo(() => {
        return schedule
            .filter(item => item.day === selectedDay)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
    }, [schedule, selectedDay]);

    const handleAddShow = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !startTime || !endTime) return;

        const newItem: StationScheduleItem = {
            id: `sched_${Date.now()}`,
            day: selectedDay,
            title,
            startTime,
            endTime
        };

        const updatedSchedule = [...schedule, newItem];
        if (onUpdateSchedule) onUpdateSchedule(updatedSchedule);

        // Reset form
        setTitle('');
        setStartTime('');
        setEndTime('');
    };

    const handleDeleteShow = (id: string) => {
        const updatedSchedule = schedule.filter(item => item.id !== id);
        if (onUpdateSchedule) onUpdateSchedule(updatedSchedule);
    };

    return (
        <div className="animate-fade-in bg-gray-900/30 rounded-lg p-4 border border-gray-700/50">
            <div className="flex items-center gap-2 mb-4 text-gray-200">
                <CalendarDaysIcon className="w-5 h-5 text-[var(--accent-color)]"/>
                <h3 className="text-lg font-bold font-orbitron">Program Guide</h3>
            </div>

            <div className="flex gap-1 overflow-x-auto pb-2 mb-4 scrollbar-hide">
                {DAYS.map(day => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                            selectedDay === day
                                ? 'bg-[var(--accent-color)] text-black'
                                : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
                    >
                        {day}
                    </button>
                ))}
            </div>

            <div className="space-y-3 min-h-[200px]">
                {filteredSchedule.length > 0 ? (
                    filteredSchedule.map(item => (
                        <div key={item.id} className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
                            <div className="flex items-center gap-3">
                                <div className="flex flex-col items-center bg-gray-700/50 px-2 py-1 rounded text-xs font-mono text-gray-300">
                                    <span>{item.startTime}</span>
                                    <span className="w-px h-2 bg-gray-600 my-0.5"></span>
                                    <span>{item.endTime}</span>
                                </div>
                                <span className="font-semibold text-white">{item.title}</span>
                            </div>
                            {isEditable && (
                                <button 
                                    onClick={() => handleDeleteShow(item.id)}
                                    className="text-gray-500 hover:text-red-400 transition-colors p-1"
                                    aria-label="Delete show"
                                >
                                    <TrashIcon className="w-4 h-4"/>
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 py-8 flex flex-col items-center">
                        <ClockIcon className="w-8 h-8 mb-2 opacity-50"/>
                        <p>No shows scheduled for {selectedDay}.</p>
                    </div>
                )}
            </div>

            {isEditable && (
                <div className="mt-6 pt-4 border-t border-gray-700/50">
                    <h4 className="text-sm font-bold text-gray-300 mb-3">Add Show to {selectedDay}</h4>
                    <form onSubmit={handleAddShow} className="space-y-3">
                        <div>
                            <input 
                                type="text" 
                                placeholder="Show Title" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <input 
                                type="time" 
                                value={startTime} 
                                onChange={(e) => setStartTime(e.target.value)} 
                                className="bg-gray-800 border border-gray-600 rounded px-2 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]"
                                required
                            />
                            <input 
                                type="time" 
                                value={endTime} 
                                onChange={(e) => setEndTime(e.target.value)} 
                                className="bg-gray-800 border border-gray-600 rounded px-2 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]"
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 rounded-md text-sm transition-colors"
                        >
                            Add Show
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};
