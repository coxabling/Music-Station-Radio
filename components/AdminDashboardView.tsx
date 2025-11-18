import React, { useState, useEffect } from 'react';
import type { Station, User, UserData } from '../types';
import { formatTimeAgo } from '../utils/time';
import { getAllUsersData } from '../services/apiService';

const ShieldIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" /></svg>;
const UserGroupIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.969A3 3 0 006 10.729v8.54a3 3 0 001.258 2.548m-4.01-15.045A3 3 0 004.01 4.5v8.54a3 3 0 001.258 2.548M12 15a3 3 0 100-6 3 3 0 000 6z" /></svg>;


interface AdminDashboardViewProps {
    stations: Station[];
    onApproveClaim: (station: Station, claimantUsername: string) => void;
    onDenyClaim: (station: Station) => void;
    onUpdateUserRole: (username: string, role: UserData['role']) => void;
    currentUser: User | null;
}

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
        <li className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <p className="font-semibold text-white">{user.username}</p>
                <p className="text-sm text-gray-400">Current Role: <span className="font-semibold capitalize">{user.data.role}</span></p>
            </div>
            <div className="flex items-center gap-2">
                <select 
                    value={selectedRole}
                    onChange={handleRoleChange}
                    className="bg-gray-800 border border-gray-600 rounded-md py-1.5 px-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]"
                    aria-label={`Role for user ${user.username}`}
                >
                    {roles.map(role => (
                        <option key={role} value={role} className="capitalize">{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                    ))}
                </select>
                <button 
                    onClick={handleSave} 
                    disabled={selectedRole === user.data.role}
                    className="bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-200 text-sm font-semibold py-1.5 px-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Save
                </button>
            </div>
        </li>
    );
};


export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ stations, onApproveClaim, onDenyClaim, onUpdateUserRole, currentUser }) => {
    const pendingClaims = stations.filter(s => s.claimRequest);
    const [allUsers, setAllUsers] = useState<{ username: string, data: UserData }[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);

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

    return (
        <div className="p-4 md:p-8 animate-fade-in">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-3xl font-bold font-orbitron accent-color-text">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-400 mt-2">Manage claims and user roles.</p>
                </header>

                <div className="bg-gray-900/50 rounded-lg border border-gray-700/50 mb-8">
                    <div className="p-4 border-b border-gray-700/50 flex items-center gap-3">
                        <ShieldIcon className="w-5 h-5 text-cyan-400" />
                        <h2 className="font-bold text-lg text-white">
                            Pending Claims ({pendingClaims.length})
                        </h2>
                    </div>
                    {pendingClaims.length > 0 ? (
                        <ul className="divide-y divide-gray-700/50">
                            {pendingClaims.map(station => (
                                <li key={station.streamUrl} className="p-4 space-y-3">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <p className="font-semibold text-cyan-300">{station.name}</p>
                                            <p className="text-sm text-gray-400">Claim by: <span className="font-medium text-white">{station.claimRequest?.username}</span></p>
                                            <p className="text-xs text-gray-500">{formatTimeAgo(station.claimRequest!.submittedAt)}</p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <button onClick={() => onDenyClaim(station)} className="bg-red-500/20 hover:bg-red-500/40 text-red-300 text-sm font-semibold py-1.5 px-3 rounded-md transition-colors">Deny</button>
                                            <button onClick={() => onApproveClaim(station, station.claimRequest!.username)} className="bg-green-500/20 hover:bg-green-500/40 text-green-300 text-sm font-semibold py-1.5 px-3 rounded-md transition-colors">Approve</button>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-gray-800/50 rounded-md border border-gray-700">
                                        <p className="text-sm text-gray-300 whitespace-pre-wrap">{station.claimRequest?.reason}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                         <div className="p-8 text-center text-gray-500">
                            <p>No pending claims.</p>
                        </div>
                    )}
                </div>

                <div className="bg-gray-900/50 rounded-lg border border-gray-700/50">
                    <div className="p-4 border-b border-gray-700/50 flex items-center gap-3">
                         <UserGroupIcon className="w-5 h-5 text-cyan-400" />
                        <h2 className="font-bold text-lg text-white">User Management ({allUsers.length})</h2>
                    </div>
                     {isLoadingUsers ? (
                         <div className="p-8 text-center text-gray-500">
                            <p>Loading users...</p>
                        </div>
                     ) : allUsers.length > 0 ? (
                        <ul className="divide-y divide-gray-700/50">
                           {allUsers.map(user => (
                                <UserRow 
                                    key={user.username} 
                                    user={user} 
                                    onUpdateUserRole={onUpdateUserRole} 
                                />
                            ))}
                        </ul>
                    ) : (
                         <div className="p-8 text-center text-gray-500">
                            <p>No other users found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};