import type { UserData, ListeningStats, Alarm, SongVote, UnlockedAchievement, Station, ThemeName } from '../types';

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

// Defines the default data structure for a newly created user
const createNewUserData = (): UserData => ({
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
 * Fetches all data for a given user. If the user doesn't exist in our mock DB,
 * it creates and saves a new default entry for them before returning it.
 * @param username The username to fetch data for.
 * @returns A promise that resolves with the user's complete data.
 */
export const getUserData = async (username: string): Promise<UserData> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            let userData = getDb(username);
            if (!userData) {
                console.log(`No data for ${username}, creating new entry.`);
                userData = createNewUserData();
                setDb(username, userData);
            }
            resolve(userData);
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
                    const newData = { ...currentData, ...partialData };
                    setDb(username, newData);
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