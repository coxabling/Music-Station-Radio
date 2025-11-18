
import React, { useState, useEffect, useMemo } from 'react';
import type { Station, ListeningStats } from '../types';
import { getSmartRecommendations } from '../services/geminiService';
import { SunIcon, CloudIcon, MoonIcon, CloudIcon as RainyIcon, StarIcon } from '../constants'; // Reusing icons

interface ForYouFeedProps {
    stats: ListeningStats;
    stations: Station[];
    onSelectStation: (station: Station) => void;
    username: string;
}

const Greeting: React.FC<{ timeOfDay: string; weather: string; username: string }> = ({ timeOfDay, weather, username }) => {
    let WeatherIcon = SunIcon;
    if (weather === 'Rainy') WeatherIcon = RainyIcon;
    if (weather === 'Cloudy') WeatherIcon = CloudIcon;
    if (timeOfDay === 'Night') WeatherIcon = MoonIcon;

    return (
        <div className="mb-6">
            <h2 className="text-2xl font-bold font-orbitron text-white">
                Good {timeOfDay}, {username}.
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                <WeatherIcon className="w-4 h-4 text-[var(--accent-color)]" />
                <span>It's {weather.toLowerCase()} outside. Here's some music for you.</span>
            </div>
        </div>
    );
};

export const ForYouFeed: React.FC<ForYouFeedProps> = ({ stats, stations, onSelectStation, username }) => {
    const [recommendations, setRecommendations] = useState<{ station: Station; reason: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [weather, setWeather] = useState('Sunny');
    const [timeOfDay, setTimeOfDay] = useState('Morning');

    useEffect(() => {
        // Determine Time of Day
        const hour = new Date().getHours();
        let time = 'Morning';
        if (hour >= 12 && hour < 17) time = 'Afternoon';
        else if (hour >= 17 && hour < 21) time = 'Evening';
        else if (hour >= 21 || hour < 5) time = 'Night';
        setTimeOfDay(time);

        // Simulate Weather (random for demo purposes)
        const weathers = ['Sunny', 'Cloudy', 'Rainy'];
        const randomWeather = weathers[Math.floor(Math.random() * weathers.length)];
        setWeather(randomWeather);

        // Fetch Recommendations
        const fetchRecs = async () => {
            setLoading(true);
            try {
                // Use session storage cache to prevent constant re-fetching on every render/navigation
                const cacheKey = `smart_recs_${time}_${randomWeather}_${username}`;
                const cached = sessionStorage.getItem(cacheKey);
                
                if (cached) {
                    const cachedRecs = JSON.parse(cached);
                    // Rehydrate station objects from allStations using URL
                    const hydrated = cachedRecs.map((rec: any) => {
                        const station = stations.find(s => s.streamUrl === rec.streamUrl);
                        return station ? { station, reason: rec.reason } : null;
                    }).filter(Boolean);
                     setRecommendations(hydrated);
                     setLoading(false);
                     return;
                }

                const recData = await getSmartRecommendations(
                    stats.genresPlayed || [],
                    time,
                    randomWeather,
                    stations
                );
                
                const hydratedRecs = recData.map(rec => {
                    const station = stations.find(s => s.streamUrl === rec.streamUrl);
                    return station ? { station, reason: rec.reason } : null;
                }).filter((item): item is { station: Station; reason: string } => !!item);

                setRecommendations(hydratedRecs);
                sessionStorage.setItem(cacheKey, JSON.stringify(recData));
            } catch (error) {
                console.error("Failed to load smart recommendations", error);
                // Fallback: Random 3 stations
                const randomStations = stations.sort(() => 0.5 - Math.random()).slice(0, 3);
                setRecommendations(randomStations.map(s => ({ station: s, reason: "A random pick for you." })));
            } finally {
                setLoading(false);
            }
        };

        fetchRecs();
    }, [stats.genresPlayed, stations, username]);

    return (
        <div className="mb-8 animate-fade-in">
            <Greeting timeOfDay={timeOfDay} weather={weather} username={username} />
            
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 bg-gray-800/50 rounded-lg animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recommendations.map((rec, index) => (
                        <div 
                            key={rec.station.streamUrl}
                            onClick={() => onSelectStation(rec.station)}
                            className="group relative bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-[var(--accent-color)]/50 transition-all cursor-pointer hover:bg-gray-800 hover:-translate-y-1"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="flex items-start gap-3">
                                <img 
                                    src={rec.station.coverArt} 
                                    alt={rec.station.name} 
                                    className="w-16 h-16 rounded-md object-cover shadow-lg group-hover:scale-105 transition-transform" 
                                />
                                <div>
                                    <h4 className="font-bold text-white group-hover:text-[var(--accent-color)] transition-colors">{rec.station.name}</h4>
                                    <p className="text-xs text-gray-400 mt-1">{rec.station.genre}</p>
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-700/50">
                                <p className="text-xs text-cyan-200 italic flex items-start gap-1">
                                    <StarIcon className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                    {rec.reason}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
