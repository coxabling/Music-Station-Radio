
import React, { useState } from 'react';
import type { User, UserProfile } from '../types';
import { RoleBadge } from './RoleBadge';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  profile?: UserProfile;
  currentUser: User | null;
  onUpdateProfile: (profile: UserProfile) => void;
  onMessage: (username: string) => void;
  onFollow: (username: string) => void;
  isFollowing: boolean;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, username, profile, currentUser, onUpdateProfile, onMessage, onFollow, isFollowing }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(profile?.bio || '');
  const [location, setLocation] = useState(profile?.location || '');

  if (!isOpen) return null;

  const isMe = currentUser?.username === username;

  const handleSave = () => {
      onUpdateProfile({
          ...profile,
          bio,
          location,
          topArtists: profile?.topArtists || [],
          favoriteGenres: profile?.favoriteGenres || [],
          following: profile?.following || [],
          followers: profile?.followers || []
      });
      setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="h-32 bg-gradient-to-r from-cyan-600 to-purple-600 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white">&times;</button>
            </div>
            <div className="px-6 pb-6 relative">
                <div className="w-24 h-24 rounded-full bg-gray-800 border-4 border-gray-900 absolute -top-12 flex items-center justify-center text-4xl font-bold text-gray-400">
                    {username[0].toUpperCase()}
                </div>
                <div className="mt-14 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">{username} <RoleBadge role="user" /></h2>
                        {isEditing ? (
                             <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="bg-gray-800 text-gray-300 text-sm p-1 rounded mt-1 border border-gray-600" placeholder="Location" />
                        ) : (
                             <p className="text-sm text-gray-400">{location || 'Somewhere on Earth'}</p>
                        )}
                        {/* "On Air" status check mock */}
                        {['artist', 'owner'].includes('user') && (
                             <span className="inline-block mt-2 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold uppercase rounded animate-pulse">On Air</span>
                        )}
                    </div>
                    <div className="flex gap-2">
                         {!isMe && (
                             <>
                                <button onClick={() => onMessage(username)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-bold">Message</button>
                                <button onClick={() => onFollow(username)} className={`px-4 py-2 rounded-lg text-white text-sm font-bold ${isFollowing ? 'bg-gray-600' : 'bg-[var(--accent-color)] text-black'}`}>
                                    {isFollowing ? 'Following' : 'Follow'}
                                </button>
                             </>
                         )}
                         {isMe && !isEditing && (
                             <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-gray-700 rounded-lg text-white text-sm font-bold">Edit Profile</button>
                         )}
                         {isMe && isEditing && (
                             <button onClick={handleSave} className="px-4 py-2 bg-green-600 rounded-lg text-white text-sm font-bold">Save</button>
                         )}
                    </div>
                </div>

                <div className="mt-6 space-y-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                        <h3 className="text-sm font-bold text-gray-300 mb-2">Bio</h3>
                         {isEditing ? (
                             <textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full bg-gray-800 text-white p-2 rounded border border-gray-600" rows={3} />
                        ) : (
                             <p className="text-gray-400 text-sm leading-relaxed">{bio || 'No bio yet.'}</p>
                        )}
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                         <div className="bg-gray-800/30 p-2 rounded">
                             <div className="text-xl font-bold text-white">{profile?.followers.length || 0}</div>
                             <div className="text-xs text-gray-500">Followers</div>
                         </div>
                         <div className="bg-gray-800/30 p-2 rounded">
                             <div className="text-xl font-bold text-white">{profile?.following.length || 0}</div>
                             <div className="text-xs text-gray-500">Following</div>
                         </div>
                         <div className="bg-gray-800/30 p-2 rounded">
                             <div className="text-xl font-bold text-white">0</div>
                             <div className="text-xs text-gray-500">Broadcasts</div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
