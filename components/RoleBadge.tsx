import React from 'react';
import type { User } from '../types';
import { CommunityIcon, MusicNoteIcon, BriefcaseIcon, ShieldCheckIcon } from '../constants';

interface RoleBadgeProps {
    role: User['role'];
    className?: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, className = 'h-4 w-4' }) => {
    let Icon, title, color;

    switch (role) {
        case 'artist':
            Icon = MusicNoteIcon;
            title = 'Artist';
            color = 'text-purple-400';
            break;
        case 'owner':
            Icon = BriefcaseIcon;
            title = 'Station Manager';
            color = 'text-orange-400';
            break;
        case 'admin':
            Icon = ShieldCheckIcon;
            title = 'Admin';
            color = 'text-red-400';
            break;
        case 'user':
        default:
            Icon = CommunityIcon; // Headphones/Speaker icon
            title = 'Listener';
            color = 'text-cyan-400';
            break;
    }

    return (
        <div title={title} className="flex-shrink-0">
            <Icon className={`${className} ${color}`} />
        </div>
    );
};
