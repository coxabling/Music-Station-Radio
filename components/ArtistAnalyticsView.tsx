
import React, { useMemo } from 'react';
import type { TrackAnalytics } from '../types';
import { MOCK_ARTIST_ANALYTICS, ChartPieIcon, MapPinIcon } from '../constants';
import { BarChart } from './BarChart';

interface ArtistAnalyticsViewProps {
    analytics?: TrackAnalytics[];
}

const MetricCard: React.FC<{ label: string; value: string | number; change?: string; isNegative?: boolean }> = ({ label, value, change, isNegative }) => (
    <div className="bg-gray-900/50 border border-gray-700/50 p-4 rounded-lg">
        <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
        <div className="flex items-end gap-2 mt-1">
            <span className="text-2xl font-bold text-white font-orbitron">{value}</span>
            {change && (
                <span className={`text-xs font-bold mb-1 ${isNegative ? 'text-red-400' : 'text-green-400'}`}>
                    {change}
                </span>
            )}
        </div>
    </div>
);

export const ArtistAnalyticsView: React.FC<ArtistAnalyticsViewProps> = ({ analytics = MOCK_ARTIST_ANALYTICS }) => {
    
    const totalPlays = analytics.reduce((sum, track) => sum + track.playCount, 0);
    const totalListeners = analytics.reduce((sum, track) => sum + track.listeners, 0);
    const avgSkipRate = Math.round(analytics.reduce((sum, track) => sum + track.skipRate, 0) / analytics.length);

    const playsData = useMemo(() => {
        return analytics.map(t => ({ label: t.title, value: t.playCount }));
    }, [analytics]);

    // Aggregate geographic data across all tracks
    const globalHotspots = useMemo(() => {
        const map = new Map<string, number>();
        analytics.forEach(track => {
            track.geographicData.forEach(geo => {
                map.set(geo.country, (map.get(geo.country) || 0) + geo.count);
            });
        });
        return Array.from(map.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
    }, [analytics]);

    return (
        <div className="animate-fade-in space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <MetricCard label="Total Plays" value={totalPlays.toLocaleString()} change="+12%" />
                <MetricCard label="Unique Listeners" value={totalListeners.toLocaleString()} change="+8%" />
                <MetricCard label="Avg. Skip Rate" value={`${avgSkipRate}%`} change="-2%" isNegative={false} /> {/* Lower skip rate is good, represented here as green */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <section className="bg-gray-800/30 p-6 rounded-lg border border-gray-700/50">
                    <div className="flex items-center gap-2 mb-4">
                        <ChartPieIcon className="w-5 h-5 text-purple-400" />
                        <h3 className="text-lg font-bold text-white">Top Tracks Performance</h3>
                    </div>
                    <BarChart data={playsData} title="" />
                </section>

                <section className="bg-gray-800/30 p-6 rounded-lg border border-gray-700/50">
                     <div className="flex items-center gap-2 mb-4">
                        <MapPinIcon className="w-5 h-5 text-cyan-400" />
                        <h3 className="text-lg font-bold text-white">Global Hotspots</h3>
                    </div>
                    <div className="space-y-4">
                        {globalHotspots.map(([country, count], index) => (
                            <div key={country} className="relative">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-semibold text-gray-300">{index + 1}. {country}</span>
                                    <span className="text-gray-400 font-mono">{count.toLocaleString()} plays</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                                    <div 
                                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full" 
                                        style={{ width: `${(count / globalHotspots[0][1]) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};
