


import React, { useState } from 'react';
import type { Station, User, ListeningStats, StationReview, NowPlaying, UserData } from '../types';
import { StationInfoPanel } from './StationInfoPanel';
import { CommunityFeed } from './CommunityFeed';
import { GenreChatView } from './GenreChatView';
import { MOCK_REVIEWS } from '../constants'; 

const InfoIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>;
const CommunityIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.969A3 3 0 006 10.729v8.54a3 3 0 001.258 2.548m-4.01-15.045A3 3 0 004.01 4.5v8.54a3 3 0 001.258 2.548M12 15a3 3 0 100-6 3 3 0 000 6z" /></svg>;
const ChatBubbleIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>;

interface RightPanelProps {
    station: Station | null;
    currentStation: Station | null;
    allStations: Station[];
    currentUser: User | null;
    stats: ListeningStats;
    onAddReview: (stationUrl: string, review: Omit<StationReview, 'createdAt' | 'author' | 'authorRole'>) => void;
    onSelectStation: (station: Station) => void;
    onRateStation: (stationUrl: string, rating: number) => void;
    onEdit: (station: Station) => void;
    onOpenMusicSubmissionModal: (station: Station) => void;
    onOpenClaimModal: (station: Station) => void;
    nowPlaying: NowPlaying | null;
    onBoostStation?: (station: Station) => void;
}

type ActiveTab = 'details' | 'community' | 'chat';

const TabButton: React.FC<{ icon: React.ReactNode; isActive: boolean; onClick: () => void; label: string }> = ({ icon, isActive, onClick, label }) => (
    <button 
        onClick={onClick} 
        className={`flex-1 flex items-center justify-center gap-2 p-3 text-sm font-semibold transition-colors focus:outline-none ${isActive ? 'text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]' : 'text-gray-400 hover:text-white border-b-2 border-transparent'}`}
        title={label}
        aria-selected={isActive}
        role="tab"
    >
        {icon}
    </button>
);


export const RightPanel: React.FC<RightPanelProps> = (props) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('details');

    // Calculate King of the Hill Data locally for now since it's mocked/simulated in App.tsx
    // In a real app, this would come from props.
    const getKingOfTheHillData = () => {
         if (!props.station) return { leaderboard: [], currentUserEntry: undefined };
         
          const userEntry = {
            username: props.currentUser?.username || 'You',
            timeListened: props.stats.dailyStationTime?.[props.station.streamUrl] || 0,
        };
        
        const mockEntry = {
            username: "RadioBot",
            timeListened: 3600, 
            avatar: "https://i.pravatar.cc/150?u=bot",
        };
        
        const leaderboard = [userEntry, mockEntry].sort((a, b) => b.timeListened - a.timeListened);
        return { leaderboard, currentUserEntry: userEntry };
    }

    const { leaderboard, currentUserEntry } = getKingOfTheHillData();

    const renderContent = () => {
        switch (activeTab) {
            case 'community':
                return <CommunityFeed isPanel />;
            case 'chat':
                return <GenreChatView {...props} isPanel />;
            case 'details':
            default:
                return (
                    <StationInfoPanel
                        station={props.station}
                        userRating={props.stats.stationRatings?.[props.station?.streamUrl || ''] || 0}
                        userReviews={props.stats.stationReviews?.[props.station?.streamUrl || ''] || []}
                        isOwner={!!(props.currentUser && props.station && props.station.owner === props.currentUser.username)}
                        mockReviews={MOCK_REVIEWS}
                        kingOfTheHillLeaderboard={leaderboard}
                        currentUserKingEntry={currentUserEntry}
                        onBoostStation={props.onBoostStation}
                        {...props}
                    />
                );
        }
    }

    return (
        <aside className="hidden lg:flex w-96 bg-gray-950/30 border-l border-white/10 flex-shrink-0 flex-col">
            <div className="flex-shrink-0 border-b border-gray-700/50">
                <nav className="flex items-center" role="tablist">
                    <TabButton icon={<InfoIcon className="h-5 w-5"/>} isActive={activeTab === 'details'} onClick={() => setActiveTab('details')} label="Station Details" />
                    <TabButton icon={<CommunityIcon className="h-5 w-5"/>} isActive={activeTab === 'community'} onClick={() => setActiveTab('community')} label="Community Feed" />
                    <TabButton icon={<ChatBubbleIcon className="h-5 w-5"/>} isActive={activeTab === 'chat'} onClick={() => setActiveTab('chat')} label="Genre Chat" />
                </nav>
            </div>
            <div id="right-panel-content" className="flex-grow overflow-y-auto" role="tabpanel">
                {renderContent()}
            </div>
        </aside>
    );
};
