import React from 'react';
import { COMMUNITY_EVENTS } from '../constants';
import { formatTimeAgo } from '../utils/time';

export const CommunityFeed: React.FC = () => {
    return (
        <div className="p-4 md:p-8 animate-fade-in">
            <div className="max-w-2xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-3xl font-bold font-orbitron accent-color-text">
                        Community Buzz
                    </h1>
                    <p className="text-gray-400 mt-2">See what's happening across the platform (simulated feed).</p>
                </header>

                <ul className="space-y-4">
                    {COMMUNITY_EVENTS.map((event, index) => (
                        <li 
                          key={event.id} 
                          className="flex items-start gap-4 p-4 bg-gray-900/50 rounded-lg animate-fade-in"
                          style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
                        >
                            <div className="mt-1 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-700/50 text-cyan-400">
                                <event.icon className="w-5 h-5"/>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-300">
                                    <span className="font-bold text-white">{event.username}</span> {event.action} {event.details && <span className="font-semibold text-cyan-300">"{event.details}"</span>}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(event.timestamp)}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
