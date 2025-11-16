import type { ListeningStats, Alarm, SongVote, UnlockedAchievement, Station, ThemeName } from '../types';

const getUserKey = (username: string | null, key: string) => {
    if (!username) return null; // Don't access storage without a user
    return `userData_${username}_${key}`;
};

// New functions
export const getInitialUserStations = (username: string | null): Station[] => {
    const key = getUserKey(username, 'userStations');
    if (!key) return [];
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error("Failed to load user stations:", error);
        return [];
    }
};

export const getInitialFavorites = (username: string | null): string[] => {
    const key = getUserKey(username, 'favoriteStations');
    if (!key) return [];
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error("Failed to load favorites:", error);
        return [];
    }
}

export const getInitialTheme = (username: string | null): ThemeName | null => {
    const key = getUserKey(username, 'activeTheme');
    if (!key) return null;
    try {
        const stored = localStorage.getItem(key);
        return stored as ThemeName | null;
    } catch (error) {
        console.error("Failed to load theme:", error);
        return null;
    }
}

export const getUnlockedThemes = (username: string | null): ThemeName[] => {
    const key = getUserKey(username, 'unlockedThemes');
    if (!key) return [];
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error("Failed to load unlocked themes:", error);
        return [];
    }
}

export const saveUnlockedThemes = (username: string, themes: ThemeName[]) => {
    const key = getUserKey(username, 'unlockedThemes');
    if (!key) return;
    try {
        localStorage.setItem(key, JSON.stringify(themes));
    } catch (error) {
        console.error("Failed to save unlocked themes:", error);
    }
}


// Updated functions
export const getInitialStats = (username: string | null): ListeningStats => {
    const defaultStats: ListeningStats = { totalTime: 0, stationPlays: {}, genresPlayed: [], points: 0, stationRatings: {}, songHistory: [], songUserVotes: {} };
    const key = getUserKey(username, 'listeningStats');
    if (!key) return defaultStats;
    try {
        const storedStats = localStorage.getItem(key);
        if (storedStats) {
            const parsed = JSON.parse(storedStats);
            // Ensure new fields exist
            return {
                ...defaultStats,
                ...parsed
            };
        }
    } catch (error) {
        console.error("Failed to load listening stats:", error);
    }
    return defaultStats;
};

export const getInitialAlarm = (username: string | null): Alarm | null => {
    const key = getUserKey(username, 'alarm');
    if (!key) return null;
    try {
        const storedAlarm = localStorage.getItem(key);
        if (storedAlarm) {
            return JSON.parse(storedAlarm);
        }
    } catch (error) {
        console.error("Failed to load alarm:", error);
    }
    return null;
}

export const getInitialSongVotes = (username: string | null): Record<string, SongVote> => {
    const key = getUserKey(username, 'songVotes');
    if (!key) return {};
    try {
        const storedVotes = localStorage.getItem(key);
        if (storedVotes) {
            return JSON.parse(storedVotes);
        }
    } catch (error) {
        console.error("Failed to load song votes:", error);
    }
    return {};
};

export const getInitialUnlockedAchievements = (username: string | null): Record<string, UnlockedAchievement> => {
    const key = getUserKey(username, 'unlockedAchievements');
    if (!key) return {};
    try {
        const storedAchievements = localStorage.getItem(key);
        if (storedAchievements) {
            return JSON.parse(storedAchievements);
        }
    } catch (error) {
        console.error("Failed to load achievements:", error);
    }
    return {};
};