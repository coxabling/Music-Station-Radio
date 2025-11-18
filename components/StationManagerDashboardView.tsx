
import React, { useState, useMemo } from 'react';
import type { User, Station, MusicSubmission, ListeningEvent, StationScheduleItem } from '../types';
import { formatTimeAgo } from '../utils/time';
import { CheckCircleIcon, XCircleIcon, BriefcaseIcon, StarIcon, UploadIcon, ClockIcon, TicketIcon, CalendarDaysIcon } from '../constants';
import { StationSchedule } from './StationSchedule';

const HeartIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {fillRule: "evenodd", d: "M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z", clipRule: "evenodd"}));
const EditIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>;

interface StationManagerDashboardViewProps {
    user: User | null;
    allStations: Station[];
    onReviewSubmission: (stationStreamUrl: string, submissionId: string, status: 'approved' | 'rejected', comment?: string) => void;
    onEditStation: (station: Station) => void;
    onCreateEvent: (event: Omit<ListeningEvent, 'id' | 'createdBy'>) => void;
    onUpdateStation?: (station: Station) => void;
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

export const StationManagerDashboardView: React.FC<StationManagerDashboardViewProps> = ({ user, allStations, onReviewSubmission, onEditStation, onCreateEvent, onUpdateStation }) => {
    const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
    const [openScheduleId, setOpenScheduleId] = useState<string | null>(null);
    
    // Event Creation State
    const [eventTitle, setEventTitle] = useState('');
    const [eventDesc, setEventDesc] = useState('');
    const [eventStart, setEventStart] = useState('');
    const [eventEnd, setEventEnd] = useState('');
    const [selectedStationUrl, setSelectedStationUrl] = useState('');
    const [isPremium, setIsPremium] = useState(false);
    const [ticketCost, setTicketCost] = useState(50);

    const managedStations = useMemo(() => {
        return allStations.filter(s => s.owner === user?.username);
    }, [allStations, user]);
    
    // Pre-select first station
    if (!selectedStationUrl && managedStations.length > 0) {
        setSelectedStationUrl(managedStations[0].streamUrl);
    }

    const submissions = useMemo(() => {
        return managedStations.flatMap(station => 
            (station.submissions || []).map(sub => ({ ...sub, stationName: station.name }))
        );
    }, [managedStations]);

    const pending = useMemo(() => submissions.filter(s => s.status === 'pending').sort((a,b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()), [submissions]);
    const approved = useMemo(() => submissions.filter(s => s.status === 'approved').sort((a,b) => new Date(b.reviewedAt!).getTime() - new Date(a.reviewedAt!).getTime()), [submissions]);
    const rejected = useMemo(() => submissions.filter(s => s.status === 'rejected').sort((a,b) => new Date(b.reviewedAt!).getTime() - new Date(a.reviewedAt!).getTime()), [submissions]);

    const handleCreateEvent = (e: React.FormEvent) => {
        e.preventDefault();
        const station = managedStations.find(s => s.streamUrl === selectedStationUrl);
        if (!station) return;

        onCreateEvent({
            title: eventTitle,
            description: eventDesc,
            startTime: new Date(eventStart).toISOString(),
            endTime: new Date(eventEnd).toISOString(),
            stationName: station.name,
            stationStreamUrl: station.streamUrl,
            genre: station.genre,
            isPremium,
            ticketCost: isPremium ? ticketCost : undefined
        });
        
        // Reset form
        setEventTitle('');
        setEventDesc('');
        setEventStart('');
        setEventEnd('');
        setIsPremium(false);
        setTicketCost(50);
    };

    const handleUpdateSchedule = (station: Station, newSchedule: StationScheduleItem[]) => {
        if (onUpdateStation) {
            onUpdateStation({ ...station, schedule: newSchedule });
        }
    };

    const renderList = () => {
        let list: (MusicSubmission & {stationName: string})[] = [];
        switch(activeTab) {
            case 'pending': list = pending; break;
            case 'approved': list = approved; break;
            case 'rejected': list = rejected; break;
        }

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
    
    return (
        <div className="p-4 md:p-8 animate-fade-in">
             <header className="text-center mb-8">
                <h1 className="text-3xl font-bold font-orbitron accent-color-text flex items-center justify-center gap-3">
                    <BriefcaseIcon className="w-8 h-8"/>
                    Manager Dashboard
                </h1>
                <p className="text-gray-400 mt-2">Review and manage music submissions for your stations.</p>
            </header>
            
            <div className="max-w-4xl mx-auto space-y-8">
                {managedStations.length > 0 ? (
                    <>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-200 mb-4 font-orbitron">My Stations</h2>
                            <div className="grid grid-cols-1 gap-6">
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
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => setOpenScheduleId(openScheduleId === station.streamUrl ? null : station.streamUrl)}
                                                    className="p-2 text-cyan-400 hover:text-cyan-300 rounded-full hover:bg-gray-700/50 transition-colors flex items-center gap-1" 
                                                    title="Manage Schedule"
                                                >
                                                    <CalendarDaysIcon className="w-5 h-5"/>
                                                    <span className="text-xs font-bold hidden sm:inline">Schedule</span>
                                                </button>
                                                <button onClick={() => onEditStation(station)} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700/50 transition-colors" title="Edit Station">
                                                    <EditIcon className="w-5 h-5"/>
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {openScheduleId === station.streamUrl && (
                                            <div className="border-t border-gray-700/50 pt-4">
                                                <StationSchedule 
                                                    station={station} 
                                                    isEditable={true} 
                                                    onUpdateSchedule={(newSchedule) => handleUpdateSchedule(station, newSchedule)} 
                                                />
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-gray-700/50">
                                            <Stat icon={<StarIcon className="w-4 h-4 text-yellow-400"/>} value={station.rating || 0} label="Rating" />
                                            <Stat icon={<HeartIcon className="w-4 h-4 text-pink-400"/>} value={((station.ratingsCount || 0) * 5 + Math.floor(Math.random()*10))} label="Favorites" />
                                            <Stat icon={<ClockIcon className="w-4 h-4 text-cyan-400"/>} value={`${Math.floor((station.ratingsCount || 1) * 2.3)}h`} label="Listened (wk)" />
                                            <Stat icon={<UploadIcon className="w-4 h-4 text-purple-400"/>} value={(station.submissions || []).filter(s => s.status === 'pending').length} label="Pending" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                        
                        <section className="bg-gray-900/50 p-6 rounded-lg border border-gray-700/50">
                            <h2 className="text-2xl font-bold text-gray-200 mb-4 font-orbitron">Schedule Broadcast</h2>
                            <form onSubmit={handleCreateEvent} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Event Title</label>
                                        <input type="text" value={eventTitle} onChange={e => setEventTitle(e.target.value)} required className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white" placeholder="e.g., Weekend Jam" />
                                    </div>
                                     <div>
                                        <label className="block text-sm text-gray-400 mb-1">Station</label>
                                        <select value={selectedStationUrl} onChange={e => setSelectedStationUrl(e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white">
                                            {managedStations.map(s => <option key={s.streamUrl} value={s.streamUrl}>{s.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Description</label>
                                    <textarea value={eventDesc} onChange={e => setEventDesc(e.target.value)} required className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white" rows={2} placeholder="What's happening?" />
                                </div>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Start Time</label>
                                        <input type="datetime-local" value={eventStart} onChange={e => setEventStart(e.target.value)} required className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">End Time</label>
                                        <input type="datetime-local" value={eventEnd} onChange={e => setEventEnd(e.target.value)} required className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 pt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={isPremium} onChange={e => setIsPremium(e.target.checked)} className="form-checkbox bg-gray-800 border-gray-600 text-[var(--accent-color)] rounded" />
                                        <span className="text-sm font-bold text-yellow-400 flex items-center gap-1"><TicketIcon className="w-4 h-4"/> Premium Event</span>
                                    </label>
                                    
                                    {isPremium && (
                                         <div className="flex items-center gap-2">
                                            <label className="text-sm text-gray-400">Ticket Cost:</label>
                                            <input type="number" value={ticketCost} onChange={e => setTicketCost(Number(e.target.value))} className="w-20 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white" min="0" />
                                            <StarIcon className="w-4 h-4 text-yellow-400"/>
                                        </div>
                                    )}
                                </div>
                                <button type="submit" className="bg-[var(--accent-color)] hover:opacity-80 text-black font-bold py-2 px-6 rounded transition-colors">
                                    Create Event
                                </button>
                            </form>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-200 mb-4 font-orbitron">Music Submissions</h2>
                            <div className="border-b border-gray-700/50 mb-6">
                                <TabButton label="Pending" count={pending.length} isActive={activeTab === 'pending'} onClick={() => setActiveTab('pending')} />
                                <TabButton label="Approved" count={approved.length} isActive={activeTab === 'approved'} onClick={() => setActiveTab('approved')} />
                                <TabButton label="Rejected" count={rejected.length} isActive={activeTab === 'rejected'} onClick={() => setActiveTab('rejected')} />
                            </div>
                            {renderList()}
                        </section>
                    </>
                ) : (
                    <div className="text-center py-16 bg-gray-900/50 rounded-lg border border-gray-700/50">
                        <p className="text-gray-400">You do not own any stations.</p>
                        <p className="text-sm text-gray-500 mt-2">You can claim an existing station or submit a new one from the Explore page.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
