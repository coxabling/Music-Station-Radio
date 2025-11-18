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
  type?: 'achievement' | 'points' | 'milestone' | 'theme_unlocked' | 'login' | 'error' | 'raid';
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
    genre: string;
    startTime: string; // ISO date string
    endTime: string; // ISO date string
}

// AzuraCast API Schedule Entry
export interface AzuraCastScheduleEntry {
  id: number;
  start: string; // ISO 8601
  end: string; // ISO 8601
  name: string;
  is_now: boolean;
  description?: string;
}

// For unified sidebar navigation
export type ActiveView = 'explore' | 'dashboard' | 'community' | 'store' | 'leaderboard' | 'genre_chat' | 'admin' | 'station_manager_dashboard' | 'artist_dashboard';

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