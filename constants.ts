import React from 'react';
import type { Station, EQBand, EQPreset, Theme, Achievement, AchievementID, LeaderboardEntry, TranslationLanguage, ListeningEvent, StationReview, CommunityEvent } from './types';
import { getLocationForGenre } from './utils/genreToLocation';

// --- Achievement Icons (using React.createElement to avoid JSX in .ts file) ---
const PlayIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8.006v3.988a1 1 0 001.555.832l3.197-2.005a1 1 0 000-1.664L9.555 7.168z", clipRule: "evenodd" }));
const ClockIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z", clipRule: "evenodd"}));
const HeartIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {fillRule: "evenodd", d: "M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z", clipRule: "evenodd"}));
const CompassIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.527-1.912 6.01 6.01 0 012.436 5.332A6.01 6.01 0 0115.668 12a6.012 6.012 0 01-1.912 2.706C13.488 14.27 13.026 14 12.5 14a1.5 1.5 0 01-1.5-1.5V12a2 2 0 00-4 0 2 2 0 01-1.527 1.912 6.01 6.01 0 01-2.436-5.332z", clipRule: "evenodd"}));
const FireIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {fillRule: "evenodd", d: "M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010-1.414l3-3a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0zm8.586 8.586a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414l3 3a1 1 0 010 1.414z", clipRule: "evenodd"}));
const PlusCircleIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z", clipRule: "evenodd"}));
const MoonIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {d: "M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"}));
const SunIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {fillRule: "evenodd", d: "M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 14.464A1 1 0 106.465 13.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm-1.414-2.12a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z", clipRule: "evenodd"}));
const SparklesIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {fillRule: "evenodd", d: "M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z", clipRule: "evenodd"}));
export const UserIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2}, React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"}));
export const StarIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"}));
export const TrophyIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {fillRule:"evenodd", d: "M11.68 1.33a1 1 0 011.64 0l1.35 2.22a1 1 0 00.82.55l2.45.36a1 1 0 01.56 1.7l-1.78 1.73a1 1 0 00-.29.89l.42 2.44a1 1 0 01-1.45 1.05L12 11.45a1 1 0 00-.94 0l-2.19 1.15a1 1 0 01-1.45-1.05l.42-2.44a1 1 0 00-.29-.89L5.78 6.16a1 1 0 01.56-1.7l2.45-.36a1 1 0 00.82-.55L11.68 1.33zM10 14a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1zM6 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM14 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z", clipRule: "evenodd"}));
export const LockIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {fillRule:"evenodd", d: "M10 2a3 3 0 00-3 3v1H6a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002 2V8a2 2 0 00-2-2h-1V5a3 3 0 00-3-3zm-1 5v1h2V7a1 1 0 00-2 0z", clipRule: "evenodd"}));

// --- Sidebar Icons ---
export const ExploreIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor"}, React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", d: "M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5"}));
export const HomeIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor"}, React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", d: "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"}));
export const CommunityIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor"}, React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", d: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962c.51.056 1.02.083 1.531.083c1.244 0 2.433-.203 3.528-.57M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 2.282a2.25 2.25 0 01.945 2.283l-2.093 6.279a2.25 2.25 0 01-4.22 0l-2.093-6.279a2.25 2.25 0 01.945-2.283M3 18.72a9.094 9.094 0 013.741-.479 3 3 0 01-4.682-2.72m-7.5-2.962c-.51.056-1.02.083-1.531.083c-1.244 0-2.433-.203-3.528-.57M3 12a3 3 0 116 0 3 3 0 01-6 0zm-3.945 5.282a2.25 2.25 0 01-.945-2.283l2.093-6.279a2.25 2.25 0 014.22 0l2.093 6.279a2.25 2.25 0 01-.945 2.283"}));
export const StoreIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor"}, React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", d: "M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.25a.75.75 0 01-.75-.75V10.5a.75.75 0 01.75-.75h19.5a.75.75 0 01.75.75v9.75a.75.75 0 01-.75.75h-4.5m-4.5 0H9m-3.75 0H5.625m5.625 0v-7.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21m12.75 0v-7.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21"}));
export const LeaderboardIconSidebar: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor"}, React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", d: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"}));
export const MapIconSidebar: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor"}, React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", d: "M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.159.69.159 1.006 0z"}));


export const ACHIEVEMENTS: Record<AchievementID, Achievement> = {
  'first_listen': { id: 'first_listen', name: 'Welcome to the Club', description: 'Tune in for the first time.', icon: PlayIcon },
  'one_hour': { id: 'one_hour', name: 'Hour of Power', description: 'Listen for a total of 1 hour.', icon: ClockIcon },
  'ten_hours': { id: 'ten_hours', name: 'Dedicated Listener', description: 'Listen for a total of 10 hours.', icon: ClockIcon },
  'curator': { id: 'curator', name: 'Curator', description: 'Favorite your first station.', icon: HeartIcon },
  'explorer_3': { id: 'explorer_3', name: 'Genre Explorer', description: 'Listen to 3 different genres.', icon: CompassIcon },
  'explorer_5': { id: 'explorer_5', name: 'Genre Master', description: 'Listen to 5 different genres.', icon: CompassIcon },
  'streak_3': { id: 'streak_3', name: 'Vibe Streak', description: 'Listen for 3 consecutive days.', icon: FireIcon },
  'streak_7': { id: 'streak_7', name: 'Week-Long Vibe', description: 'Listen for 7 consecutive days.', icon: FireIcon },
  'station_submit': { id: 'station_submit', name: 'Contributor', description: 'Suggest a new station.', icon: PlusCircleIcon },
  'night_owl': { id: 'night_owl', name: 'Night Owl', description: 'Listen between midnight and 4 AM.', icon: MoonIcon },
  'early_bird': { id: 'early_bird', name: 'Early Bird', description: 'Listen between 5 AM and 8 AM.', icon: SunIcon },
  'party_starter': { id: 'party_starter', name: 'Party Starter', description: 'Engage with the Listening Party.', icon: SparklesIcon },
};

// Helper to add some random jitter to coordinates
const addJitter = (coord: number, amount: number = 0.5) => coord + (Math.random() - 0.5) * amount;

const initialStations: Omit<Station, 'location'>[] = [
  {
    name: "CRW Radio",
    genre: "World music",
    description: "Your global sound connection, playing hits from every corner of the earth.",
    streamUrl: "https://music-station.live/listen/crw_radio/radio.mp3",
    coverArt: "https://picsum.photos/seed/crw/200",
    tippingUrl: "https://ko-fi.com/example_crw_radio",
    rating: 4.5,
    ratingsCount: 128,
  },
  {
    name: "High Grade Radio",
    genre: "Premium Reggae & Dancehall",
    description: "The finest selection of reggae and dancehall rhythms, 24/7.",
    streamUrl: "https://music-station.live/listen/high_grade_radio/radio.mp3",
    coverArt: "https://picsum.photos/seed/highgrade/200",
    tippingUrl: "https://ko-fi.com/example_hg_radio",
    rating: 4.8,
    ratingsCount: 256,
  },
  {
    name: "Nam Radio",
    genre: "Afropop",
    description: "The pulse of Africa, bringing you the best in Afropop and contemporary hits.",
    streamUrl: "https://music-station.live/listen/namradio/radio.mp3",
    coverArt: "https://picsum.photos/seed/namradio/200",
    rating: 4.2,
    ratingsCount: 94,
  },
  {
    name: "Pamtengo Radio",
    genre: "Afrobeat & African Hits",
    description: "Non-stop Afrobeat and the biggest tracks from across the continent.",
    streamUrl: "https://music-station.live/listen/pamtengo_radio/radio.mp3",
    coverArt: "https://picsum.photos/seed/pamtengo/200",
    rating: 4.6,
    ratingsCount: 182,
  },
  {
    name: "Nam Radio Local",
    genre: "Afropop",
    description: "Celebrating local talent with a curated mix of Namibian and Afropop stars.",
    streamUrl: "https://music-station.live/listen/nam_radio_local/radio.mp3",
    coverArt: "https://picsum.photos/seed/namradiolocal/200",
    rating: 4.0,
    ratingsCount: 55,
  },
  {
    name: "Power Ace Radio",
    genre: "Indie & Afrobeat",
    description: "A unique blend of independent artists and infectious Afrobeat grooves.",
    streamUrl: "https://music-station.live/listen/poweraceradio/radio.mp3",
    coverArt: "https://picsum.photos/seed/poweraceradio/200",
    rating: 4.3,
    ratingsCount: 78,
  },
  {
    name: "Namibian Radio",
    genre: "Namibian & African Hits",
    description: "The sound of Namibia, featuring top local charts and African anthems.",
    streamUrl: "https://64575.airadiostream.com/namibianradio",
    coverArt: "https://picsum.photos/seed/namibianradio/200",
    rating: 3.9,
    ratingsCount: 43,
  },
  {
    name: "Global Groove Radio",
    genre: "Eclectic Mix / World Music",
    description: "An eclectic journey through sound, from hidden gems to global grooves.",
    streamUrl: "https://s2.stationplaylist.com:7094/listen.aac",
    coverArt: "https://picsum.photos/seed/globalgroove/200",
    rating: 4.7,
    ratingsCount: 201,
  }
];

// Process stations to add locations
export const stations: Station[] = initialStations.map(station => {
    const baseLocation = getLocationForGenre(station.genre);
    return {
        ...station,
        location: {
            lat: addJitter(baseLocation.lat, 2.5),
            lng: addJitter(baseLocation.lng, 2.5),
        }
    }
});


// Constants for the Audio Equalizer
export const EQ_BANDS: EQBand[] = [
  { freq: 60, type: 'lowshelf' },
  { freq: 310, type: 'peaking' },
  { freq: 1000, type: 'peaking' },
  { freq: 6000, type: 'peaking' },
  { freq: 16000, type: 'highshelf' },
];

export const EQ_PRESETS: EQPreset[] = [
    { name: 'Flat', values: [0, 0, 0, 0, 0] },
    { name: 'Bass Boost', values: [6, 4, 0, 0, 0] },
    { name: 'Vocal Booster', values: [0, 2, 4, 3, 0] },
    { name: 'Treble Boost', values: [0, 0, 0, 4, 6] },
    { name: 'Rock', values: [4, 2, -2, 3, 4] },
    { name: 'Pop', values: [-1, 3, 4, 2, -1] },
];

// Constants for UI Themes
export const THEMES: Theme[] = [
  { name: 'dynamic', displayName: 'Dynamic (Default)', color: '#67e8f9' },
  { name: 'kente', displayName: 'Kente Cloth', color: '#FBBF24', cost: 100 }, // amber-400
  { name: 'sahara', displayName: 'Sahara Sunset', color: '#F97316', cost: 100 }, // orange-600
  { name: 'naija', displayName: 'Naija Pop', color: '#22C55E', cost: 150 }, // green-500
  { name: 'galaxy', displayName: 'Galaxy', color: '#8b5cf6', cost: 300 }, // violet-500
];

// Simulated leaderboard data
export const LEADERBOARD_DATA: Omit<LeaderboardEntry, 'rank'>[] = [
    { username: "DJ_VibeMaster", points: 12543 },
    { username: "AudioPhile", points: 11892 },
    { username: "GrooveMachine", points: 10567 },
    { username: "Tuner_Pro", points: 9872 },
    { username: "BeatSeeker", points: 8501 },
    { username: "Radio_Head", points: 7634 },
    { username: "EchoChamber", points: 6921 },
    { username: "SoundSurfer", points: 5432 },
    { username: "MixMaestro", points: 4987 },
    { username: "RhythmRider", points: 3210 },
];

// Constants for Lyric Translation
export const SUPPORTED_TRANSLATION_LANGUAGES: TranslationLanguage[] = [
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'ja', name: 'Japanese' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'it', name: 'Italian' },
    { code: 'ko', name: 'Korean' },
];

// New mock data for scheduled events
export const LISTENING_EVENTS: ListeningEvent[] = [
    {
        id: 'evt1',
        title: 'Reggae Roots Revival',
        description: 'Join us for a two-hour deep dive into classic roots reggae and dub from the 70s and 80s.',
        stationName: 'High Grade Radio',
        genre: 'Reggae',
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
        endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),   // 4 hours from now
    },
    {
        id: 'evt2',
        title: 'Afropop Future Forward',
        description: 'Discover the future of Afropop. We\'re spinning the latest tracks from breakout artists across the continent.',
        stationName: 'Nam Radio',
        genre: 'Afropop',
        startTime: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(), // 26 hours from now
        endTime: new Date(Date.now() + 28 * 60 * 60 * 1000).toISOString(), // 28 hours from now
    },
];

// New mock data for station reviews
export const MOCK_REVIEWS: Record<string, StationReview[]> = {
    "https://music-station.live/listen/high_grade_radio/radio.mp3": [
        { author: 'ReggaeFan', rating: 5, text: 'Best reggae station on the web, hands down. The selection is always on point.', createdAt: new Date(Date.now() - 86400000).toISOString() },
        { author: 'DubWise', rating: 4, text: 'Solid grooves, but I wish they played more deep cuts from the 70s.', createdAt: new Date(Date.now() - 172800000).toISOString() }
    ],
    "https://music-station.live/listen/namradio/radio.mp3": [
        { author: 'AfroQueen', rating: 5, text: 'My daily dose of Afropop! Always keeps me dancing.', createdAt: new Date(Date.now() - 259200000).toISOString() },
    ]
};

// New mock data for community feed
export const COMMUNITY_EVENTS: CommunityEvent[] = [
    { id: 1, username: 'GrooveMachine', action: 'unlocked achievement', details: 'Hour of Power', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), icon: ClockIcon },
    { id: 2, username: 'DJ_VibeMaster', action: 'favorited a station', details: 'High Grade Radio', timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(), icon: HeartIcon },
    { id: 3, username: 'AudioPhile', action: 'discovered a new genre', details: 'Afropop', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), icon: CompassIcon },
    { id: 4, username: 'BeatSeeker', action: 'reached a 3-day streak', timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), icon: FireIcon },
    { id: 5, username: 'RhythmRider', action: 'submitted a new station', details: 'Indie Wave FM', timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), icon: PlusCircleIcon },
];