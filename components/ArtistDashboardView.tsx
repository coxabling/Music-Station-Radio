
import React, { useState } from 'react';
import type { User, ListeningStats, MusicSubmission, ActiveView } from '../types';
import { StarIcon, ExploreIcon, CheckCircleIcon, XCircleIcon, ClockIcon, UserCircleIcon, ChartPieIcon, MusicNoteIcon } from '../constants';
import { ArtistAnalyticsView } from './ArtistAnalyticsView';

interface ArtistDashboardViewProps {
    user: User | null;
    stats: ListeningStats;
    submissions: MusicSubmission[];
    setActiveView: (view: ActiveView) => void;
}

const StatCard: React.FC<{ icon: React.ReactNode; value: string | number; label: string; }> = ({ icon, value, label }) => (
    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50 flex items-center gap-4">
        <div className="p-2 bg-gray-800/80 rounded-full border border-gray-700">{icon}</div>
        <div>
            <p className="text-2xl font-bold font-orbitron text-white">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{label}</p>
        </div>
    </div>
);

const SubmissionItem: React.FC<{ submission: MusicSubmission }> = ({ submission }) => {
    const statusIcon = {
        pending: <ClockIcon className="w-5 h-5 text-yellow-400" />,
        approved: <CheckCircleIcon className="w-5 h-5 text-green-400" />,
        rejected: <XCircleIcon className="w-5 h-5 text-red-400" />,
    };

    return (
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-white">{submission.songTitle}</p>
                    <p className="text-sm text-gray-400">to <span className="font-semibold text-gray-300">{submission.stationName}</span></p>
                    <p className="text-xs text-gray-500 mt-1">Submitted on {new Date(submission.submittedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2 capitalize text-sm font-semibold">
                    {statusIcon[submission.status]}
                    <span className={`
                        ${submission.status === 'approved' && 'text-green-400'}
                        ${submission.status === 'rejected' && 'text-red-400'}
                        ${submission.status === 'pending' && 'text-yellow-400'}
                    `}>{submission.status}</span>
                </div>
            </div>
            {submission.managerComment && (
                <div className="mt-3 pt-3 border-t border-gray-700/50">
                    <p className="text-xs font-semibold text-gray-400 mb-1">Manager Feedback:</p>
                    <p className="text-sm text-gray-300 italic">"{submission.managerComment}"</p>
                </div>
            )}
        </div>
    );
};


export const ArtistDashboardView: React.FC<ArtistDashboardViewProps> = ({ user, stats, submissions, setActiveView }) => {
    const [activeTab, setActiveTab] = useState<'submissions' | 'analytics'>('submissions');

    if (!user) return null;
    
    const pending = submissions.filter(s => s.status === 'pending');
    const approved = submissions.filter(s => s.status === 'approved');
    const rejected = submissions.filter(s => s.status === 'rejected');

    return (
        <div className="p-4 md:p-8 animate-fade-in">
            <header className="text-center mb-8">
                <h1 className="text-3xl font-bold font-orbitron accent-color-text flex items-center justify-center gap-3">
                    <UserCircleIcon className="w-8 h-8"/>
                    Artist Dashboard
                </h1>
                <p className="text-gray-400 mt-2">Manage your music submissions and track your stats.</p>
            </header>

            <div className="max-w-4xl mx-auto space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatCard 
                        icon={<StarIcon className="h-6 w-6 text-yellow-400" />}
                        value={(stats.points || 0).toLocaleString()}
                        label="Listening Points"
                    />
                     <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50 flex flex-col items-center justify-center text-center">
                        <p className="text-gray-300">Ready to get your music heard?</p>
                        <button onClick={() => setActiveView('explore')} className="mt-2 flex items-center gap-2 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-200 border border-cyan-500/50 rounded-full py-2 px-5 transition-colors duration-300 font-semibold">
                            <ExploreIcon className="w-5 h-5"/>
                            Find Stations to Submit
                        </button>
                    </div>
                </div>

                <div className="flex justify-center border-b border-gray-700/50 mb-6">
                    <button
                        onClick={() => setActiveTab('submissions')}
                        className={`px-6 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'submissions' ? 'border-[var(--accent-color)] text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
                    >
                        <MusicNoteIcon className="w-4 h-4"/> Submissions
                    </button>
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`px-6 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'analytics' ? 'border-[var(--accent-color)] text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
                    >
                        <ChartPieIcon className="w-4 h-4"/> Analytics
                    </button>
                </div>

                {activeTab === 'analytics' ? (
                    <ArtistAnalyticsView />
                ) : (
                    <section>
                        <h2 className="text-2xl font-bold text-gray-200 mb-4 font-orbitron">My Submissions</h2>
                        
                        {submissions.length === 0 ? (
                            <div className="text-center py-12 bg-gray-900/50 rounded-lg border border-gray-700/50">
                                <p className="text-gray-400">You haven't submitted any tracks yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-yellow-400 mb-3">Pending ({pending.length})</h3>
                                    <div className="space-y-3">
                                        {pending.length > 0 ? pending.map(s => <SubmissionItem key={s.id} submission={s} />) : <p className="text-sm text-gray-500">No pending submissions.</p>}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-green-400 mb-3">Approved ({approved.length})</h3>
                                    <div className="space-y-3">
                                        {approved.length > 0 ? approved.map(s => <SubmissionItem key={s.id} submission={s} />) : <p className="text-sm text-gray-500">No approved submissions yet.</p>}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-red-400 mb-3">Rejected ({rejected.length})</h3>
                                    <div className="space-y-3">
                                        {rejected.length > 0 ? rejected.map(s => <SubmissionItem key={s.id} submission={s} />) : <p className="text-sm text-gray-500">No rejected submissions.</p>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                )}
            </div>
        </div>
    );
};
