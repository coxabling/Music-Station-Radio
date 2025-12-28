
import type { UserData, Station } from '../types';

const SIMULATED_LATENCY = 50; // ms

// Helper to get a user's data from localStorage, which acts as our mock database
const getDb = (username: string): UserData | null => {
    try {
        const data = localStorage.getItem(`user_db_${username}`);
        return data ? JSON.parse(data) as UserData : null;
    } catch (e) {
        console.error("Failed to read from mock DB", e);
        return null;
    }
};

// Helper to set a user's data in the mock database
const setDb = (username: string, data: UserData) => {
    try {
        localStorage.setItem(`user_db_${username}`, JSON.stringify(data));
    } catch (e) {
        console.error("Failed to write to mock DB", e);
    }
};

// Defines the default data structure for a newly created user (without role)
const createDefaultUserData = (): Omit<UserData, 'role'> => ({
    stats: { totalTime: 0, stationPlays: {}, genresPlayed: [], points: 0, stationRatings: {}, songHistory: [], songUserVotes: {}, stationReviews: {} },
    alarm: null,
    songVotes: {},
    unlockedAchievements: {},
    userStations: [],
    favoriteStationUrls: [],
    activeTheme: 'dynamic',
    unlockedThemes: ['dynamic'],
    activeView: 'dashboard',
    unlockedFrames: [],
    quests: [],
    bets: [],
    collection: [],
    profile: { bio: '', topArtists: [], favoriteGenres: [], following: [], followers: [], customAvatarUrl: '' },
    activeSkin: 'modern',
    unlockedSkins: ['modern'],
    portfolio: {},
    completedBounties: []
});

export const getUserData = async (username: string): Promise<UserData | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(getDb(username));
        }, SIMULATED_LATENCY);
    });
};

export const createUserData = async (username: string, role: UserData['role']): Promise<UserData> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newUserData: UserData = {
                ...createDefaultUserData(),
                role: role,
            };
            setDb(username, newUserData);
            resolve(newUserData);
        }, SIMULATED_LATENCY);
    });
};

let updateQueue: (() => Promise<void>)[] = [];
let isProcessingQueue = false;

const processUpdateQueue = async () => {
    if (isProcessingQueue || updateQueue.length === 0) return;
    isProcessingQueue = true;
    const task = updateQueue.shift();
    if (task) {
        await task();
    }
    isProcessingQueue = false;
    processUpdateQueue();
};

export const updateUserData = (username: string, partialData: Partial<UserData>): Promise<void> => {
    return new Promise((resolve) => {
        const task = () => new Promise<void>((taskResolve) => {
            setTimeout(() => {
                const currentData = getDb(username);
                if (currentData) {
                    const mergedData = { ...currentData, ...partialData };
                    if (partialData.stats) {
                        mergedData.stats = { ...currentData.stats, ...partialData.stats };
                    }
                    if (partialData.profile) {
                         mergedData.profile = { ...currentData.profile, ...partialData.profile };
                    }
                    if (partialData.portfolio) {
                         mergedData.portfolio = { ...currentData.portfolio, ...partialData.portfolio };
                    }
                    setDb(username, mergedData);
                }
                taskResolve();
            }, SIMULATED_LATENCY);
        });

        updateQueue.push(async () => {
            await task();
            resolve();
        });

        processUpdateQueue();
    });
}

export const followUser = async (followerUsername: string, targetUsername: string): Promise<void> => {
    return new Promise((resolve) => {
        const task = () => new Promise<void>((taskResolve) => {
            setTimeout(() => {
                const follower = getDb(followerUsername);
                const target = getDb(targetUsername);

                if (follower && target) {
                    if (!follower.profile) follower.profile = { bio: '', topArtists: [], favoriteGenres: [], following: [], followers: [], customAvatarUrl: '' };
                    if (!target.profile) target.profile = { bio: '', topArtists: [], favoriteGenres: [], following: [], followers: [], customAvatarUrl: '' };

                    if (!follower.profile.following.includes(targetUsername)) {
                        follower.profile.following.push(targetUsername);
                    }
                    if (!target.profile.followers.includes(followerUsername)) {
                        target.profile.followers.push(followerUsername);
                    }
                    setDb(followerUsername, follower);
                    setDb(targetUsername, target);
                }
                taskResolve();
            }, SIMULATED_LATENCY);
        });
        updateQueue.push(async () => { await task(); resolve(); });
        processUpdateQueue();
    });
};

export const unfollowUser = async (followerUsername: string, targetUsername: string): Promise<void> => {
     return new Promise((resolve) => {
        const task = () => new Promise<void>((taskResolve) => {
            setTimeout(() => {
                const follower = getDb(followerUsername);
                const target = getDb(targetUsername);

                if (follower && target && follower.profile && target.profile) {
                    follower.profile.following = follower.profile.following.filter(u => u !== targetUsername);
                    target.profile.followers = target.profile.followers.filter(u => u !== followerUsername);
                    setDb(followerUsername, follower);
                    setDb(targetUsername, target);
                }
                taskResolve();
            }, SIMULATED_LATENCY);
        });
        updateQueue.push(async () => { await task(); resolve(); });
        processUpdateQueue();
    });
};

export const getAllUsersData = async (): Promise<{ username: string, data: UserData }[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const allUsers: { username: string, data: UserData }[] = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('user_db_')) {
                    try {
                        const username = key.substring('user_db_'.length);
                        const data = localStorage.getItem(key);
                        if (data) {
                            allUsers.push({ username, data: JSON.parse(data) });
                        }
                    } catch (e) {
                        console.error(`Failed to parse user data for key ${key}`, e);
                    }
                }
            }
            resolve(allUsers);
        }, SIMULATED_LATENCY);
    });
};

/**
 * Helper to fetch with a timeout.
 */
async function fetchWithTimeout(resource: string, options: any = {}) {
    const { timeout = 5000 } = options;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(resource, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
}

/**
 * Normalizes tags from Radio Browser into a clean string.
 */
const normalizeTags = (rawTags: string): string => {
    if (!rawTags) return 'Various';
    const blacklist = new Set(['mp3', 'aac', 'ogg', '128k', '128kbps', '64k', 'shoutcast', 'icecast', 'stream', 'live']);
    const tags = rawTags.split(/[,;\s/]+/)
        .map(t => t.trim().toLowerCase())
        .filter(t => t.length > 2 && !blacklist.has(t) && !/^\d+$/.test(t))
        .filter((val, index, self) => self.indexOf(val) === index);
    const relevant = tags.slice(0, 5).map(t => t.charAt(0).toUpperCase() + t.slice(1));
    return relevant.length > 0 ? relevant.join(', ') : 'Various';
};

/**
 * Map API response item to our Station type.
 */
const mapToStation = (item: any): Station => ({
    name: item.name,
    genre: normalizeTags(item.tags),
    description: item.country ? `Broadcasting from ${item.country}. ${item.state || ''}` : 'No description available.',
    streamUrl: item.url_resolved || item.url,
    coverArt: item.favicon || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(item.name)}&backgroundColor=030712`,
    rating: Math.min(5, (item.votes / 1000) + 3),
    ratingsCount: item.votes,
    location: (item.geo_lat && item.geo_long) ? { lat: item.geo_lat, lng: item.geo_long } : undefined,
    owner: undefined,
    acceptsSubmissions: false,
    submissions: [],
    guestbook: []
});

/**
 * Discovers active Radio Browser mirrors.
 */
let discoveredMirrors: string[] = ['de1.api.radio-browser.info', 'at1.api.radio-browser.info'];
const refreshMirrors = async () => {
    try {
        const response = await fetchWithTimeout('https://all.api.radio-browser.info/json/servers', { timeout: 3000 });
        if (response.ok) {
            const servers = await response.json();
            discoveredMirrors = servers.map((s: any) => s.name);
            console.log(`Discovered ${discoveredMirrors.length} Radio Browser mirrors.`);
        }
    } catch (e) {
        console.warn("Mirror discovery failed, using defaults.");
    }
};

/**
 * Fetches radio stations from Radio Browser API.
 */
export const fetchRadioBrowserStations = async (limit: number = 100): Promise<Station[]> => {
    await refreshMirrors();
    const query = `limit=${limit}&hidebroken=true&order=clickcount&reverse=true`;
    
    for (const mirror of discoveredMirrors.slice(0, 3)) {
        try {
            const response = await fetchWithTimeout(`https://${mirror}/json/stations/search?${query}`, { timeout: 3000 });
            if (response.ok) {
                const data = await response.json();
                return data.map(mapToStation);
            }
        } catch (e) {}
    }

    // Fallback through proxy
    try {
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://de1.api.radio-browser.info/json/stations/search?${query}`)}`;
        const response = await fetchWithTimeout(proxyUrl, { timeout: 7000 });
        if (response.ok) {
            const result = await response.json();
            const rawData = typeof result.contents === 'string' ? JSON.parse(result.contents) : result.contents;
            return rawData.map(mapToStation);
        }
    } catch (e) {}

    return [];
};

/**
 * Searches the entire Radio Browser database by keyword.
 */
export const searchRadioBrowser = async (keyword: string, limit: number = 50): Promise<Station[]> => {
    if (!keyword.trim()) return [];
    const query = `name=${encodeURIComponent(keyword)}&limit=${limit}&hidebroken=true&order=clickcount&reverse=true`;
    
    for (const mirror of discoveredMirrors.slice(0, 3)) {
        try {
            const response = await fetchWithTimeout(`https://${mirror}/json/stations/search?${query}`, { timeout: 4000 });
            if (response.ok) {
                const data = await response.json();
                return data.map(mapToStation);
            }
        } catch (e) {}
    }
    return [];
};
