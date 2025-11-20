import React, { useState, useEffect, useMemo } from 'react';
import type { Station, User, UserData } from '../types';
import { formatTimeAgo } from '../utils/time';
import { getAllUsersData } from '../services/apiService';
import { ShieldCheckIcon, UserIcon, BriefcaseIcon, MusicNoteIcon } from '../constants';

// Icons local to this component or imported if available
const ShieldIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" /></svg>;
const UserGroupIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.969A3 3 0 006 10.729v8.54a3 3 0 001.258 2.548m-4.01-15.045A3 3 0 004.01 4.5v8.54a3 3 0 001.258 2.548M12 15a3 3 0 100-6 3 3 0 000 6z" /></svg>;
const RadioIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" /><path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 4a1 1 0 10-2 0v1a1 1 0 102 0v-1zm5-1a1 1 0 00-1 1v1a1 1 0 102 0v-1a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
const EditIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>;
const DeleteIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const SearchIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;


interface AdminDashboardViewProps {
    stations: Station[];
    onApproveClaim: (station: Station, claimantUsername: string) => void;
    onDenyClaim: (station: Station) => void;
    onUpdateUserRole: (username: string, role: UserData['role']) => void;
    onEditStation: (station: Station) => void;
    onDeleteStation: (station: Station) => void;
    currentUser: User | null;
}

type Tab = 'overview' | 'users' | 'stations' | 'claims';

const StatCard: React.FC<{ icon: React.ReactNode; value: string | number; label: string; color: string }> = ({ icon, value, label, color }) => (
    <div className={`bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 flex items-center gap-4 transition-all hover:border-${color}-500/50 hover:bg-gray-800`}>
        <div className={`p-3 bg-${color}-500/20 rounded-full text-${color}-400`}>
            {icon}
        </div>
        <div>
            <p className="text-2xl font-bold font-orbitron text-white">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{label}</p>
        </div>
    </div>
);

const UserRow: React.FC<{ user: { username: string, data: UserData }, onUpdateUserRole: (username: string, role: UserData['role']) => void }> = ({ user, onUpdateUserRole }) => {
    const [selectedRole, setSelectedRole] = useState(user.data.role);

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRole(e.target.value as UserData['role']);
    };

    const handleSave = () => {
        onUpdateUserRole(user.username, selectedRole);
    };

    const roles: UserData['role'][] = ['user', 'artist', 'owner', 'admin'];

    return (
        <li className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-800/30 rounded-lg border border-gray-700/30 hover:bg-gray-800/50 transition-colors">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 font-bold text-lg">
                    {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p className="font-semibold text-white">{user.username}</p>
                    <p className="text-xs text-gray-400">Last Active: {user.data.stats.lastListenDate || 'Never'}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <select 
                    value={selectedRole}
                    onChange={handleRoleChange}
                    className="bg-gray-900 border border-gray-600 rounded-md py-1.5 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] flex-grow sm:flex-grow-0"
                    aria-label={`Role for user ${user.username}`}
                >
                    {roles.map(role => (
                        <option key={role} value={role} className="capitalize">{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                    ))}
                </select>
                <button 
                    onClick={handleSave} 
                    disabled={selectedRole === user.data.role}
                    className="bg-[var(--accent-color)] hover:opacity-80 text-black text-sm font-bold py-1.5 px-4 rounded-md transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    Save
                </button>
            </div>
        </li>
    );
};

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ stations, onApproveClaim, onDenyClaim, onUpdateUserRole, onEditStation, onDeleteStation, currentUser }) => {
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [allUsers, setAllUsers] = useState<{ username: string, data: UserData }[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [userSearch, setUserSearch] = useState('');
    const [stationSearch, setStationSearch] = useState('');

    useEffect(() => {
        setIsLoadingUsers(true);
        getAllUsersData().then(users => {
            const filteredUsers = users
                .filter(u => u.username !== currentUser?.username)
                .sort((a,b) => a.username.localeCompare(b.username));
            setAllUsers(filteredUsers);
            setIsLoadingUsers(false);
        });
    }, [currentUser]);

    const pendingClaims = useMemo(() => stations.filter(s => s.claimRequest), [stations]);
    
    const filteredUsers = useMemo(() => {
        return allUsers.filter(u => u.username.toLowerCase().includes(userSearch.toLowerCase()));
    }, [allUsers, userSearch]);

    const filteredStations = useMemo(() => {
        return stations.filter(s => s.name.toLowerCase().includes(stationSearch.toLowerCase()) || s.genre.toLowerCase().includes(stationSearch.toLowerCase()));
    }, [stations, stationSearch]);

    // Stats
    const totalUsers = allUsers.length + (currentUser ? 1 : 0); // +1 for current admin if logged in
    const totalStations = stations.length;
    const totalArtists = allUsers.filter(u => u.data.role === 'artist').length + (currentUser?.role === 'artist' ? 1 : 0);
    const totalOwners = allUsers.filter(u => u.data.role === 'owner').length + (currentUser?.role === 'owner' ? 1 : 0);


    return (
        <div className="p-4 md:p-8 animate-fade-in min-h-full">
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold font-orbitron accent-color-text flex items-center gap-3">
                            <ShieldCheckIcon className="w-8 h-8"/>
                            Admin Console
                        </h1>
                        <p className="text-gray-400 mt-1">System overview and management.</p>
                    </div>
                    
                    <div className="flex bg-gray-900/50 p-1 rounded-lg border border-gray-700/50">
                        {(['overview', 'users', 'stations', 'claims'] as Tab[]).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-md text-sm font-bold transition-all capitalize ${
                                    activeTab === tab 
                                    ? 'bg-[var(--accent-color)] text-black shadow-lg' 
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }`}
                            >
                                {tab}
                                {tab === 'claims' && pendingClaims.length > 0 && (
                                    <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingClaims.length}</span>
                                )}
                            </button>
                        ))}
                    </div>
                </header>

                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard icon={<UserGroupIcon className="w-6 h-6"/>} value={totalUsers} label="Total Users" color="cyan" />
                            <StatCard icon={<RadioIcon className="w-6 h-6"/>} value={totalStations} label="Active Stations" color="purple" />
                            <StatCard icon={<MusicNoteIcon className="w-6 h-6"/>} value={totalArtists} label="Artists" color="pink" />
                            <StatCard icon={<ShieldCheckIcon className="w-6 h-6"/>} value={pendingClaims.length} label="Pending Claims" color="yellow" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-gray-900/50 rounded-xl border border-gray-700/50 p-6">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <BriefcaseIcon className="w-5 h-5 text-orange-400"/> Station Managers
                                </h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Total Managers</span>
                                    <span className="text-2xl font-mono font-bold text-white">{totalOwners}</span>
                                </div>
                                <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
                                    <div className="bg-orange-400 h-2 rounded-full" style={{ width: `${(totalOwners / (totalUsers || 1)) * 100}%` }}></div>
                                </div>
                            </div>

                             <div className="bg-gray-900/50 rounded-xl border border-gray-700/50 p-6 flex flex-col justify-center items-center text-center">
                                <p className="text-gray-400 mb-2">System Health</p>
                                <div className="text-green-400 font-bold text-xl flex items-center gap-2">
                                    <span className="relative flex h-3 w-3">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                    </span>
                                    Operational
                                </div>
                                <p className="text-xs text-gray-500 mt-2">All systems nominal.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* USERS TAB */}
                {activeTab === 'users' && (
                    <div className="animate-fade-in">
                        <div className="mb-6 relative">
                            <input 
                                type="text" 
                                placeholder="Search users..." 
                                value={userSearch}
                                onChange={(e) => setUserSearch(e.target.value)}
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[var(--accent-color)]"
                            />
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                                <SearchIcon className="w-5 h-5" />
                            </div>
                        </div>

                        {isLoadingUsers ? (
                            <div className="text-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--accent-color)] mx-auto"></div></div>
                        ) : (
                            <ul className="space-y-3">
                                {filteredUsers.length > 0 ? filteredUsers.map(user => (
                                    <UserRow key={user.username} user={user} onUpdateUserRole={onUpdateUserRole} />
                                )) : (
                                    <p className="text-center text-gray-500 py-8">No users found.</p>
                                )}
                            </ul>
                        )}
                    </div>
                )}

                {/* STATIONS TAB */}
                {activeTab === 'stations' && (
                    <div className="animate-fade-in">
                         <div className="mb-6 relative">
                            <input 
                                type="text" 
                                placeholder="Search stations..." 
                                value={stationSearch}
                                onChange={(e) => setStationSearch(e.target.value)}
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[var(--accent-color)]"
                            />
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                                <SearchIcon className="w-5 h-5" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredStations.map(station => (
                                <div key={station.streamUrl} className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/30 hover:bg-gray-800/50 transition-colors flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3 overflow-hidden">
                                        <img src={station.coverArt} alt="" className="w-16 h-16 rounded-md object-cover flex-shrink-0" />
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-white truncate">{station.name}</h3>
                                            <p className="text-xs text-gray-400 truncate">{station.genre}</p>
                                            <p className="text-xs text-gray-500 mt-1">Owner: {station.owner || 'System'}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button onClick={() => onEditStation(station)} className="p-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-md transition-colors" title="Edit">
                                            <EditIcon className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => { if(confirm(`Are you sure you want to delete ${station.name}?`)) onDeleteStation(station) }} 
                                            className="p-2 bg-red-500/10 hover:bg-red-500/30 text-red-400 rounded-md transition-colors" 
                                            title="Delete"
                                        >
                                            <DeleteIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {filteredStations.length === 0 && <p className="text-center text-gray-500 py-8">No stations found.</p>}
                    </div>
                )}

                {/* CLAIMS TAB */}
                {activeTab === 'claims' && (
                    <div className="animate-fade-in">
                         {pendingClaims.length > 0 ? (
                            <ul className="space-y-4">
                                {pendingClaims.map(station => (
                                    <li key={station.streamUrl} className="bg-gray-800/50 border border-gray-700/50 rounded-lg overflow-hidden">
                                        <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 flex justify-between items-center">
                                            <h3 className="font-bold text-white text-lg">{station.name}</h3>
                                            <span className="text-xs text-gray-400 font-mono">{formatTimeAgo(station.claimRequest!.submittedAt)}</span>
                                        </div>
                                        <div className="p-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center font-bold text-xs text-white">
                                                    {station.claimRequest?.username.charAt(0).toUpperCase()}
                                                </div>
                                                <p className="text-sm text-gray-300">
                                                    <span className="font-bold text-white">{station.claimRequest?.username}</span> wants to claim ownership.
                                                </p>
                                            </div>
                                            <div className="bg-gray-900/50 p-3 rounded-md border border-gray-700/30 mb-4">
                                                <p className="text-sm text-gray-300 italic">"{station.claimRequest?.reason}"</p>
                                            </div>
                                            <div className="flex gap-3">
                                                <button onClick={() => onApproveClaim(station, station.claimRequest!.username)} className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 font-bold py-2 rounded-md transition-colors">
                                                    Approve
                                                </button>
                                                <button onClick={() => onDenyClaim(station)} className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold py-2 rounded-md transition-colors">
                                                    Deny
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-16 bg-gray-900/50 rounded-xl border border-gray-700/50">
                                <ShieldCheckIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-400 font-semibold">No Pending Claims</p>
                                <p className="text-sm text-gray-500">All ownership requests have been handled.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};