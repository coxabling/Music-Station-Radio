import type { UserData } from '../types';

const SIMULATED_LATENCY = 50; // ms

// Helper to get a user's data from localStorage, which acts as our mock database
const getDb = (username: string): UserData | null => {
    try {
        const data = localStorage.getItem(`user_db_${username}`);
        return data ? JSON.parse(data) : null;
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
});


/**
 * Fetches all data for a given user.
 * @param username The username to fetch data for.
 * @returns A promise that resolves with the user's complete data, or null if they don't exist.
 */
export const getUserData = async (username: string): Promise<UserData | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(getDb(username));
        }, SIMULATED_LATENCY);
    });
};

/**
 * Creates a new user entry in the mock database.
 * @param username The new user's username.
 * @param role The role to assign to the new user.
 * @returns A promise that resolves with the new user's data.
 */
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


// --- Robust Update Queue to prevent race conditions ---
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

/**
 * Updates a part of the user's data. It fetches the current data,
 * merges the update, and saves it back to the mock database.
 * This function is queued to prevent race conditions.
 * @param username The user whose data is to be updated.
 * @param partialData An object containing the fields to update.
 * @returns A promise that resolves when the update is complete.
 */
export const updateUserData = (username: string, partialData: Partial<UserData>): Promise<void> => {
    return new Promise((resolve) => {
        const task = () => new Promise<void>((taskResolve) => {
            setTimeout(() => {
                const currentData = getDb(username);
                if (currentData) {
                    // Special handling for nested objects to merge them correctly
                    const mergedData = { ...currentData, ...partialData };
                    if (partialData.stats) {
                        mergedData.stats = { ...currentData.stats, ...partialData.stats };
                    }
                    setDb(username, mergedData);
                } else {
                    console.error(`Attempted to update data for non-existent user: ${username}`);
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

/**
 * Fetches data for all users in the mock database.
 * NOTE: This is an inefficient operation for a real DB, but acceptable for localStorage.
 * @returns A promise that resolves with an array of all users and their data.
 */
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