
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
 * Normalizes tags from Radio Browser into a clean, comma-separated string of unique genres.
 */
const normalizeTags = (rawTags: string): string => {
    if (!rawTags) return 'Various';
    // Radio browser tags can be comma-separated, space-separated, or both.
    const tags = rawTags
        .split(/[,;\s]+/)
        .map(t => t.trim().toLowerCase())
        .filter(t => t.length > 2 && t.length < 20) // Filter out noise
        .filter((val, index, self) => self.indexOf(val) === index); // Unique
    
    // Take top 5 meaningful tags
    const relevant = tags.slice(0, 5).map(t => t.charAt(0).toUpperCase() + t.slice(1));
    return relevant.length > 0 ? relevant.join(', ') : 'Various';
};

/**
 * Fetches radio stations from Radio Browser API.
 * Uses multiple mirrors as fallbacks and multiple CORS proxies to ensure reliability.
 */
export const fetchRadioBrowserStations = async (limit: number = 100): Promise<Station[]> => {
    const query = `limit=${limit}&hidebroken=true&order=clickcount&reverse=true`;
    
    // Official mirrors - de1 and at1 are usually the most stable
    const mirrors = [
        'de1.api.radio-browser.info',
        'at1.api.radio-browser.info',
        'fr1.api.radio-browser.info',
        'nl1.api.radio-browser.info'
    ];

    const mapItem = (item: any): Station => ({
        name: item.name,
        genre: normalizeTags(item.tags),
        description: `Broadcasting from ${item.country}${item.state ? ', ' + item.state : ''}.`,
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

    // Strategy 1: Direct fetch from mirrors with 2.5s timeout per mirror
    for (const mirror of mirrors) {
        try {
            const response = await fetchWithTimeout(`https://${mirror}/json/stations/search?${query}`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
                timeout: 2500
            });
            
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    return data.map(mapItem);
                }
            }
        } catch (error) {
            // Silently continue
        }
    }

    // Strategy 2: Fetch via allorigins (Highly reliable CORS proxy)
    for (const targetMirror of mirrors.slice(0, 2)) {
        try {
            const targetUrl = `https://${targetMirror}/json/stations/search?${query}`;
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
            const response = await fetchWithTimeout(proxyUrl, { timeout: 7000 });
            
            if (response.ok) {
                const result = await response.json();
                const rawData = typeof result.contents === 'string' ? JSON.parse(result.contents) : result.contents;
                if (Array.isArray(rawData) && rawData.length > 0) {
                    return rawData.map(mapItem);
                }
            }
        } catch (error) {
            // Silently continue
        }
    }

    // Strategy 3: Fetch via corsproxy.io
    try {
        const targetUrl = `https://de1.api.radio-browser.info/json/stations/search?${query}`;
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
        const response = await fetchWithTimeout(proxyUrl, { timeout: 7000 });
        
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                return data.map(mapItem);
            }
        }
    } catch (error) {
        console.warn("All fetching strategies failed.");
    }

    return [];
};
