
import React, { useState, useMemo, useRef } from 'react';
import type { User, Station, MusicSubmission, Jingle, GuestbookEntry } from '../types';
import { formatTimeAgo } from '../utils/time';
import { CheckCircleIcon, XCircleIcon, BriefcaseIcon, StarIcon, UploadIcon, ClockIcon, RocketIcon } from '../constants';
// Fix: Import JingleCard and GuestbookEntryCard from AdminDashboardView after they are exported.
import { JingleCard, GuestbookEntryCard } from './AdminDashboardView'; 

// ... (Existing icons)
const HeartIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {fillRule: "evenodd", d: "M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z", clipRule: "evenodd"}));
const EditIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>;
const MicrophoneIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>;
const BookOpenIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.079 0-2.157.242-3.207.72A1.5 1.5 0 003 6.042v12.319c0 .574.057 1.138.192 1.685A3 3 0 005.124 21a1.5 1.5 0 001.275-.684H12m0 0v-1.588a2.375 2.375 0 01-1.124-2.027 1.5 1.5 0 00-.381-.992H7.5c-.968 0-1.95.255-2.91.722L3 18.75V6.042M12 6.042a8.967 8.967 0 016-2.292c1.079 0 2.157.242 3.207.72A1.5 1.5 0 0121 6.042v12.319c0 .574-.057 1.138-.192 1.685a3 3 0 00-2.396 1.185A1.5 1.5 0 0018.75 21H12" /></svg>;


interface StationManagerDashboardViewProps {
    user: User | null;
    allStations: Station[];
    onReviewSubmission: (stationStreamUrl: string, submissionId: string, status: 'approved' | 'rejected', comment?: string) => void;
    onEditStation: (station: Station) => void;
    jingles: Jingle[]; // Global jingles array
    onReviewJingle: (jingleId: string, status: 'approved' | 'rejected') => void; // New prop for jingles
    onDeleteGuestbookEntry: (stationStreamUrl: string, entryId: string) => void; // New prop for guestbook
}

const Stat: React.FC<{ icon: React.ReactNode, value: string | number, label: string }> = ({ icon, value, label }) => (
    <div className="flex items-center gap-2 text-sm">
        <div className="text-gray-400">{icon}</div>
        <div>
            <span className="font-bold text-white">{value}</span>
            <span className="text-gray-400 ml-1">{label}</span>
        </div>
    </div>
);

type ManagerTab = 'submissions' | 'jingles' | 'guestbook';

const TabButton: React.FC<{label: string; count: number; isActive: boolean; onClick: () => void;}> = ({ label, count, isActive, onClick }) => (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors focus:outline-none flex items-center gap-2 ${ isActive ? 'bg-gray-800/50 text-[var(--accent-color)] border-b-2 accent-color-border' : 'text-gray-400 hover:text-white' }`}>
        {label}
        <span className={`px-2 py-0.5 rounded-full text-xs ${isActive ? 'bg-[var(--accent-color)]/20 text-[var(--accent-color)]' : 'bg-gray-700 text-gray-300'}`}>{count}</span>
    </button>
);

const SubmissionCard: React.FC<{
    submission: MusicSubmission;
    stationName: string;
    onReview: (status: 'approved' | 'rejected', comment?: string) => void;
}> = ({ submission, stationName, onReview }) => {
    const [reviewAction, setReviewAction] = useState<'approved' | 'rejected' | null>(null);
    const [comment, setComment] = useState('');

    const handleReviewSubmit = () => {
        if (reviewAction) {
            onReview(reviewAction, comment);
            setReviewAction(null);
            setComment('');
        }
    };

    return (
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-white">{submission.songTitle}</p>
                    <p className="text-sm text-gray-300">by <span className="font-semibold">{submission.artistName}</span></p>
                    <a href={submission.trackUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:underline">Listen to Track</a>
                </div>
                <div className="text-right">
                    {submission.status === 'pending' ? (
                        <p className="text-xs text-gray-500">{formatTimeAgo(submission.submittedAt)}</p>
                    ) : (
                         <p className="text-xs text-gray-500">Reviewed {formatTimeAgo(submission.reviewedAt!)}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">for <span className="font-semibold">{stationName}</span></p>
                </div>
            </div>
            
            {submission.status !== 'pending' && submission.managerComment && (
                 <div className="pt-2 border-t border-gray-700/50">
                    <p className="text-xs font-semibold text-gray-400 mb-1">Your Feedback:</p>
                    <p className="text-sm text-gray-300 italic">"{submission.managerComment}"</p>
                </div>
            )}

            {submission.status === 'pending' && (
                <>
                    {reviewAction === null ? (
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-700/50">
                            <button onClick={() => setReviewAction('approved')} className="flex-1 flex items-center justify-center gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 font-semibold py-2 rounded-md transition-colors text-sm">
                                <CheckCircleIcon className="w-5 h-5"/> Approve
                            </button>
                            <button onClick={() => setReviewAction('rejected')} className="flex-1 flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-semibold py-2 rounded-md transition-colors text-sm">
                                <XCircleIcon className="w-5 h-5"/> Reject
                            </button>
                        </div>
                    ) : (
                        <div className="pt-3 border-t border-gray-700/50 space-y-2 animate-fade-in">
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Add optional feedback for the artist..."
                                rows={2}
                                className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] transition-all"
                            />
                            <div className="flex items-center gap-2">
                                <button onClick={() => setReviewAction(null)} className="text-sm text-gray-400 hover:text-white">Cancel</button>
                                <button onClick={handleReviewSubmit} className="flex-1 bg-[var(--accent-color)] hover:opacity-80 text-black font-bold py-2 px-4 rounded-md transition-opacity text-sm">
                                    Submit Feedback
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export const StationManagerDashboardView: React.FC<StationManagerDashboardViewProps> = ({ user, allStations, onReviewSubmission, onEditStation, jingles, onReviewJingle, onDeleteGuestbookEntry }) => {
    const [activeTab, setActiveTab] = useState<ManagerTab>('submissions');

    const managedStations = useMemo(() => {
        return allStations.filter(s => s.owner === user?.username);
    }, [allStations, user]);

    const allSubmissionsForManagedStations = useMemo(() => {
        return managedStations.flatMap(station => 
            (station.submissions || []).map(sub => ({ ...sub, stationName: station.name, stationStreamUrl: station.streamUrl }))
        );
    }, [managedStations]);

    const pendingSubmissions = useMemo(() => allSubmissionsForManagedStations.filter(s => s.status === 'pending').sort((a,b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()), [allSubmissionsForManagedStations]);
    const approvedSubmissions = useMemo(() => allSubmissionsForManagedStations.filter(s => s.status === 'approved').sort((a,b) => new Date(b.reviewedAt!).getTime() - new Date(a.reviewedAt!).getTime()), [allSubmissionsForManagedStations]);
    const rejectedSubmissions = useMemo(() => allSubmissionsForManagedStations.filter(s => s.status === 'rejected').sort((a,b) => new Date(b.reviewedAt!).getTime() - new Date(a.reviewedAt!).getTime()), [allSubmissionsForManagedStations]);

    const allJinglesForManagedStations = useMemo(() => {
        return jingles
            .filter(jingle => managedStations.some(s => s.streamUrl === jingle.stationUrl))
            .map(jingle => ({
                ...jingle,
                stationName: managedStations.find(s => s.streamUrl === jingle.stationUrl)?.name || 'Unknown Station'
            }));
    }, [jingles, managedStations]);

    const pendingJingles = useMemo(() => allJinglesForManagedStations.filter(j => j.status === 'pending'), [allJinglesForManagedStations]);
    const approvedJingles = useMemo(() => allJinglesForManagedStations.filter(j => j.status === 'approved'), [allJinglesForManagedStations]);
    const rejectedJingles = useMemo(() => allJinglesForManagedStations.filter(j => j.status === 'rejected'), [allJinglesForManagedStations]);

    const allGuestbookEntriesForManagedStations = useMemo(() => {
        return managedStations.flatMap(s => 
            (s.guestbook || []).map(entry => ({ ...entry, stationName: s.name, stationUrl: s.streamUrl }))
        );
    }, [managedStations]);

    const renderSubmissionList = (list: (MusicSubmission & {stationName: string; stationStreamUrl: string})[]) => {
        if (list.length === 0) {
            return <div className="text-center text-gray-500 py-12">No submissions in this category.</div>
        }
        return (
             <div className="space-y-4">
                {list.map(sub => (
                    <SubmissionCard 
                        key={sub.id}
                        submission={sub} 
                        stationName={sub.stationName}
                        onReview={(status, comment) => onReviewSubmission(sub.stationStreamUrl, sub.id, status, comment)}
                    />
                ))}
             </div>
        )
    };

    const renderJingleList = (list: (Jingle & { stationName: string })[]) => {
        if (list.length === 0) {
            return <div className="text-center text-gray-500 py-12">No jingles in this category.</div>;
        }
        return (
            <div className="space-y-4">
                {list.map(jingle => (
                    <JingleCard 
                        key={jingle.id} 
                        jingle={jingle} 
                        onReview={onReviewJingle} 
                        onDelete={() => { /* Placeholder for jingle deletion */ }} 
                    />
                ))}
            </div>
        );
    };

    const renderGuestbookList = (list: GuestbookEntry[]) => {
        if (list.length === 0) {
            return <div className="text-center text-gray-500 py-12">No guestbook entries for your stations.</div>;
        }
        return (
            <div className="space-y-4">
                {list.map(entry => (
                    <GuestbookEntryCard 
                        key={`${entry.stationUrl}-${entry.id}`} 
                        entry={entry} 
                        onDelete={onDeleteGuestbookEntry} 
                    />
                ))}
            </div>
        );
    };
    
    return (
        <div className="p-4 md:p-8 animate-fade-in">
             <header className="text-center mb-8">
                <h1 className="text-3xl font-bold font-orbitron accent-color-text flex items-center justify-center gap-3">
                    <BriefcaseIcon className="w-8 h-8"/>
                    Manager Dashboard
                </h1>
                <p className="text-gray-400 mt-2">Review and manage music submissions, jingles, and guestbook for your stations.</p>
            </header>
            
            <div className="max-w-4xl mx-auto space-y-8">
                {managedStations.length > 0 ? (
                    <>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-200 mb-4 font-orbitron">My Stations</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {managedStations.map(station => (
                                    <div key={station.streamUrl} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 space-y-4">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex items-start gap-4">
                                                <img src={station.coverArt} alt={station.name} className="w-16 h-16 rounded-md object-cover" />
                                                <div>
                                                    <h3 className="font-bold text-white text-lg">{station.name}</h3>
                                                    <p className="text-sm text-gray-400">{station.genre}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => alert('Raid scheduled! (Demo)')} className="flex-shrink-0 p-2 text-purple-400 hover:text-purple-300 rounded-full hover:bg-purple-500/10 transition-colors" title="Schedule Raid">
                                                    <RocketIcon className="w-5 h-5"/>
                                                </button>
                                                <button onClick={() => onEditStation(station)} className="flex-shrink-0 p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700/50 transition-colors" title="Edit Station">
                                                    <EditIcon className="w-5 h-5"/>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-700/50">
                                            <Stat icon={<StarIcon className="w-4 h-4 text-yellow-400"/>} value={station.rating || 0} label="Rating" />
                                            <Stat icon={<HeartIcon className="w-4 h-4 text-pink-400"/>} value={((station.ratingsCount || 0) * 5 + Math.floor(Math.random()*10))} label="Favorites" />
                                            <Stat icon={<ClockIcon className="w-4 h-4 text-cyan-400"/>} value={`${Math.floor((station.ratingsCount || 1) * 2.3)}h`} label="Listened (wk)" />
                                            <Stat icon={<UploadIcon className="w-4 h-4 text-purple-400"/>} value={(station.submissions || []).filter(s => s.status === 'pending').length} label="Pending" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-200 mb-4 font-orbitron">Station Content</h2>
                            <div className="border-b border-gray-700/50 mb-6 flex overflow-x-auto custom-tab-scrollbar">
                                <TabButton label="Submissions" count={pendingSubmissions.length} isActive={activeTab === 'submissions'} onClick={() => setActiveTab('submissions')} />
                                <TabButton label="Jingles" count={pendingJingles.length} isActive={activeTab === 'jingles'} onClick={() => setActiveTab('jingles')} />
                                <TabButton label="Guestbook" count={allGuestbookEntriesForManagedStations.length} isActive={activeTab === 'guestbook'} onClick={() => setActiveTab('guestbook')} />
                            </div>

                            {activeTab === 'submissions' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-yellow-400 mb-3">Pending ({pendingSubmissions.length})</h3>
                                        {renderSubmissionList(pendingSubmissions)}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-green-400 mb-3">Approved ({approvedSubmissions.length})</h3>
                                        {renderSubmissionList(approvedSubmissions)}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-red-400 mb-3">Rejected ({rejectedSubmissions.length})</h3>
                                        {renderSubmissionList(rejectedSubmissions)}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'jingles' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-yellow-400 mb-3">Pending ({pendingJingles.length})</h3>
                                        {renderJingleList(pendingJingles)}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-green-400 mb-3">Approved ({approvedJingles.length})</h3>
                                        {renderJingleList(approvedJingles)}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-red-400 mb-3">Rejected ({rejectedJingles.length})</h3>
                                        {renderJingleList(rejectedJingles)}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'guestbook' && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-300 mb-3">Entries ({allGuestbookEntriesForManagedStations.length})</h3>
                                    {renderGuestbookList(allGuestbookEntriesForManagedStations)}
                                </div>
                            )}
                        </section>
                    </>
                ) : (
                    <div className="text-center py-16 bg-gray-900/50 rounded-lg border border-gray-700/50">
                        <p className="text-gray-400">You do not own any stations.</p>
                        <p className="text-sm text-gray-500 mt-2">You can claim an existing station or submit a new one from the Explore page.</p>
                    </div>
                )}
            </div>
             <style>{`
                .custom-tab-scrollbar::-webkit-scrollbar {
                    height: 4px;
                }
                .custom-tab-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-tab-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-tab-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: var(--accent-color);
                }
            `}</style>
        </div>
    );
};
