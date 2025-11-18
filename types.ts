
import type * as React from 'react';

export interface User {
  username: string;
  role: 'user' | 'artist' | 'owner' | 'admin';
}

export interface StationScheduleItem {
    id: string;
    day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    title: string;
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
  boostExpiresAt?: string; // ISO date string if boosted
  schedule?: StationScheduleItem[];
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
  nameColor?: string; // For shop items
  frame?: string; // For shop items
}

// Types for Visualizer Customization
export type PaletteName = 'neonSunset' | 'coolOcean' | 'monochrome';
export type ColorPalette = readonly string[];

// Types for Audio Equalizer
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
    playedAt: string; // ISO date string
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
  stationRatings?: Record<string, number>; // { [stationUrl]: rating }
  songUserVotes?: Record<string, 'like' | 'dislike'>; // { [songId]: 'like' | 'dislike' }
  lastListenDate?: string; // YYYY-MM-DD
  currentStreak?: number;
  maxStreak?: number;
  genresPlayed?: string[];
  songHistory: SongHistoryItem[];
  stationReviews?: Record<string, StationReview[]>; // { [stationUrl]: reviews[] }
  dailyStationTime?: Record<string, number>; // { [stationUrl]: seconds_today } for King of the Hill
}

// Type for Alarm Clock
export interface Alarm {
  time: string; // "HH:mm"
  stationUrl: string;
  stationName: string;
  isActive: boolean;
}

// Type for UI Themes
export type ThemeName = 'dynamic' | 'kente' | 'sahara' | 'naija' | 'galaxy';

export interface Theme {
  name: ThemeName;
  displayName: string;
  color: string;
  cost?: number;
}

// Type for Song Voting
export interface SongVote {
  id: string; // songId
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
  | 'raid_leader';

export interface Achievement {
  id: AchievementID;
  name: string;
  description: string;
  icon: React.FC<{className?: string}>;
}

export interface UnlockedAchievement {
  id: AchievementID;
  unlockedAt: string; // ISO date string
}

// Type for Toast Notifications
export interface ToastData {
  id: number;
  title: string;
  message?: string;
  icon: React.FC<{className?: string}>;
  type?: 'achievement' | 'points' | 'milestone' | 'theme_unlocked' | 'login' | 'error' | 'raid' | 'quest_complete' | 'purchase' | 'boost';
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

// New interface for Station Reviews
export interface StationReview {
  author: string;
  authorRole?: User['role'];
  rating: number; // 1-5
  text: string;
  createdAt: string; // ISO date string
}

// New interface for Listening Events
export interface ListeningEvent {
    id: string;
    title: string;
    description: string;
    stationName: string;
    stationStreamUrl: string; // Needed to link to station
    genre: string;
    startTime: string; // ISO date string
    endTime: string; // ISO date string
    isPremium?: boolean;
    ticketCost?: number;
    createdBy?: string; // username of station manager
}

// --- Gamification Types ---

export type ShopItemType = 'frame' | 'name_color' | 'avatar_effect';

export interface ShopItem {
    id: string;
    name: string;
    type: ShopItemType;
    cost: number;
    value: string; // CSS color or class or URL
    description?: string;
}

export interface Quest {
    id: string;
    title: string;
    description: string;
    target: number; // e.g., 3 (stations), 60 (minutes)
    progress: number;
    reward: number; // points
    type: 'daily' | 'weekly';
    metric: 'minutes_listened' | 'stations_played' | 'genres_played' | 'votes_cast';
    completed: boolean;
    claimed: boolean;
}

export interface BattleContestant {
    id: string;
    artist: string;
    song: string;
    coverArt: string;
    previewUrl: string; // mock audio url
}

export interface KingOfTheHillEntry {
    username: string;
    timeListened: number; // seconds today
    avatar?: string; // fallback to initials/color
}

// For unified sidebar navigation
export type ActiveView = 'explore' | 'dashboard' | 'community' | 'store' | 'leaderboard' | 'genre_chat' | 'admin' | 'station_manager_dashboard' | 'artist_dashboard' | 'shop' | 'quests' | 'battle';

// Represents the complete data structure for a single user, to be stored in the database.
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
    
    // Gamification
    inventory: string[]; // Array of ShopItem IDs
    equippedItems: {
        frame?: string; // ShopItem ID
        name_color?: string; // ShopItem ID
        avatar_effect?: string; // ShopItem ID
    };
    activeQuests: Quest[];
    lastQuestRefresh?: string; // Date string
    battleVotes?: { [battleId: string]: string }; // user's vote for current battle
    
    // Monetization
    purchasedTickets: string[]; // Array of Event IDs
}

// For community feed
export interface CommunityEvent {
    id: number;
    username: string;
    action: string;
    details?: string;
    timestamp: string; // ISO Date string
    icon: React.FC<{className?: string}>;
    role?: User['role'];
}

// For music submissions by artists
export interface MusicSubmission {
    id: string;
    artistName: string;
    songTitle: string;
    trackUrl: string;
    submittedAt: string; // ISO date string
    submittedBy: string; // username of the artist
    stationStreamUrl: string;
    stationName: string;
    status: 'pending' | 'approved' | 'rejected';
    managerComment?: string;
    reviewedAt?: string; // ISO date string
}

// --- Artist Analytics ---
export interface TrackAnalytics {
    songId: string;
    title: string;
    playCount: number;
    skipRate: number; // Percentage 0-100
    listeners: number;
    geographicData: { country: string; count: number }[];
}
