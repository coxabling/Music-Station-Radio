

import type * as React from 'react';

export interface User {
  username: string;
  role: 'user' | 'artist' | 'owner' | 'admin';
}

export interface Station {
  name: string;
  genre: string;
  description: string;
  streamUrl: string;
  coverArt: string;
  tippingUrl?: string;
  isFavorite?: boolean;
  rating?: number;
  ratingsCount?: number;
  location?: { lat: number; lng: number };
  owner?: string;
  acceptsSubmissions?: boolean;
  claimRequest?: {
    username: string;
    reason: string;
    submittedAt: string;
  };
  submissions?: MusicSubmission[];
  guestbook?: GuestbookEntry[]; // New
}

export interface NowPlaying {
  artist: string;
  title: string;
  albumArt?: string;
  songId: string;
}

export interface ChatMessage {
  id: number;
  author: string;
  text: string;
  isBot?: boolean;
  isDJ?: boolean;
  avatarColor: string;
  initials: string;
  frame?: string; 
  badges?: AchievementID[]; // New
  tier?: 'bronze' | 'silver' | 'gold'; // New
}

// Types for Visualizer Customization
export type PaletteName = 'neonSunset' | 'coolOcean' | 'monochrome';
export type ColorPalette = readonly string[];

// Types for Audio Equalizer
export type BiquadFilterType = "lowpass" | "highpass" | "bandpass" | "lowshelf" | "highshelf" | "peaking" | "notch" | "allpass";

export interface EQBand {
  freq: number;
  type: BiquadFilterType;
}

export type EQPreset = {
  name: string;
  values: number[];
};

export type EQSettings = {
  on: boolean;
  values: number[];
  preamp: number;
};

// Type for Station List Layout
export type LayoutMode = 'grid' | 'list';

// Type for Song History
export interface SongHistoryItem {
    songId: string;
    title: string;
    artist: string;
    albumArt: string;
    stationName: string;
    playedAt: string; 
}

// Type for Listening Stats
export interface StationPlayData {
  name:string;
  genre: string;
  time: number;
}

export interface ListeningStats {
  totalTime: number; // in seconds
  points?: number;
  stationPlays: Record<string, StationPlayData>;
  stationRatings?: Record<string, number>; 
  songUserVotes?: Record<string, 'like' | 'dislike'>; 
  lastListenDate?: string; 
  currentStreak?: number;
  maxStreak?: number;
  genresPlayed?: string[];
  songHistory: SongHistoryItem[];
  stationReviews?: Record<string, StationReview[]>; 
}

// Type for Alarm Clock
export interface Alarm {
  time: string; 
  stationUrl: string;
  stationName: string;
  isActive: boolean;
}

// Type for UI Themes
export type ThemeName = 'dynamic' | 'kente' | 'sahara' | 'naija' | 'galaxy' | 'cyberpunk' | 'midnight' | 'forest' | 'royal' | 'retro' | string; // Added string for custom themes

export interface Theme {
  name: ThemeName;
  displayName: string;
  color: string;
  gradient?: string;
  description?: string;
  cost?: number;
  isCustom?: boolean; // New
  backgroundImage?: string; // New
}

export type SkinID = 'modern' | 'winamp' | 'boombox' | 'wooden';
export interface PlayerSkin {
    id: SkinID;
    name: string;
    description: string;
    cost: number;
    previewImage?: string;
}


// Type for Song Voting
export interface SongVote {
  id: string; 
  artist: string;
  title: string;
  albumArt: string;
  likes: number;
  dislikes: number;
}

// Types for Achievements
export type AchievementID = 
  | 'first_listen' | 'one_hour' | 'ten_hours'
  | 'curator' | 'explorer_3' | 'explorer_5'
  | 'streak_3' | 'streak_7' | 'station_submit'
  | 'night_owl' | 'early_bird' | 'party_starter'
  | 'raid_leader' | 'collector';

export interface Achievement {
  id: AchievementID;
  name: string;
  description: string;
  icon: React.FC<{className?: string}>;
}

export interface UnlockedAchievement {
  id: AchievementID;
  unlockedAt: string; 
}

// Type for Toast Notifications
export interface ToastData {
  id: number;
  title: string;
  message?: string;
  icon: React.FC<{className?: string}>;
  type?: 'achievement' | 'points' | 'milestone' | 'theme_unlocked' | 'login' | 'error' | 'raid' | 'success' | 'hype';
}

// Type for Leaderboard
export interface LeaderboardEntry {
    rank: number;
    username: string;
    points: number;
    role?: User['role'];
}

// Type for Lyric Translation
export interface TranslationLanguage {
    code: string;
    name: string;
}

export interface StationReview {
  author: string;
  authorRole?: User['role'];
  rating: number; 
  text: string;
  createdAt: string; 
}

export interface ListeningEvent {
    id: string;
    title: string;
    description: string;
    stationName: string;
    genre: string;
    startTime: string; 
    endTime: string; 
}

// New Social Types
export interface AvatarFrame {
    id: string;
    name: string;
    cssClass: string; 
    cost: number;
    description?: string;
}

export interface FriendActivity {
    username: string;
    stationName: string;
    stationStreamUrl: string;
    status: 'online' | 'offline';
    avatarColor: string;
    frame?: string;
}

export type ActiveView = 'explore' | 'dashboard' | 'community' | 'store' | 'leaderboard' | 'genre_chat' | 'admin' | 'station_manager_dashboard' | 'artist_dashboard';

export interface Bet {
  id: string;
  songTitle: string;
  artist: string;
  amount: number;
  odds: number;
  potentialPayout: number;
  placedAt: string;
  status: 'pending' | 'won' | 'lost';
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  progress: number;
  goal: number;
  reward: number;
  isClaimed: boolean;
}

// New Features Types
export interface Stock {
    stationUrl: string;
    stationName: string;
    symbol: string;
    price: number;
    change: number; // Percentage change
    owned: number;
}

export interface Bounty {
    id: string;
    targetType: 'artist' | 'genre' | 'station';
    targetValue: string; // e.g. "Burna Boy" or "Reggae"
    description: string;
    reward: number;
    completed: boolean;
}

export interface Jingle {
    id: string;
    url: string; // Blob URL for now
    stationUrl: string;
    creator: string;
    status: 'pending' | 'approved' | 'rejected';
    timestamp: string;
}

export interface CollectorCard {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  image: string;
  description: string;
  acquiredAt: string;
}

export interface Lounge {
  id: string;
  name: string;
  host: string;
  isPrivate: boolean;
  password?: string;
  station: Station;
  listeners: number;
}

// New Feature Types

export interface UserProfile {
    bio: string;
    topArtists: string[];
    favoriteGenres: string[];
    location?: string;
    following: string[];
    followers: string[];
}

export interface DirectMessage {
    id: string;
    from: string;
    to: string;
    text: string;
    timestamp: string;
    read: boolean;
}

export interface GuestbookEntry {
    id: string;
    username: string;
    message: string;
    timestamp: string;
    reply?: string; // Station manager reply
}

export interface UserData {
    role: 'user' | 'artist' | 'owner' | 'admin';
    stats: ListeningStats;
    alarm: Alarm | null;
    songVotes: Record<string, SongVote>;
    unlockedAchievements: Record<string, UnlockedAchievement>;
    userStations: Station[];
    favoriteStationUrls: string[];
    activeTheme: ThemeName;
    unlockedThemes: ThemeName[];
    activeView?: ActiveView;
    
    // Social
    activeFrame?: string; 
    unlockedFrames: string[]; 
    profile?: UserProfile; // New
    messages?: DirectMessage[]; // New
    customThemes?: Theme[]; // New

    // Gamification
    quests?: Quest[];
    bets?: Bet[];
    collection?: CollectorCard[];
    
    // New
    activeSkin: SkinID;
    unlockedSkins: SkinID[];
    portfolio: Record<string, number>; // Station URL -> Quantity
    completedBounties: string[];
}

// For music submissions by artists
export interface MusicSubmission {
    id: string;
    artistName: string;
    songTitle: string;
    trackUrl: string;
    submittedAt: string; 
    submittedBy: string; 
    stationStreamUrl: string;
    stationName: string;
    status: 'pending' | 'approved' | 'rejected';
    managerComment?: string;
    reviewedAt?: string; 
}

export interface CommunityEvent {
    id: number;
    username: string;
    action: string;
    details?: string;
    timestamp: string;
    icon: React.FC<{className?: string}>;
    role?: User['role'];
}