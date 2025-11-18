import type { Station, AzuraCastScheduleEntry } from '../types';

/**
 * Extracts the station ID (shortcode) from a music-station.live stream URL.
 * e.g. https://music-station.live/listen/high_grade_radio/radio.mp3 -> high_grade_radio
 */
export const getStationIdFromUrl = (streamUrl: string): string | null => {
    // Ensure it's the correct domain
    if (!streamUrl.includes('music-station.live')) {
        return null;
    }
    const match = streamUrl.match(/\/listen\/([^\/]+)\//);
    return match ? match[1] : null;
}

/**
 * Fetches the schedule for a specific station from the AzuraCast API.
 * @param station The station object
 * @returns A promise resolving to an array of schedule entries
 */
export const fetchStationSchedule = async (station: Station): Promise<AzuraCastScheduleEntry[]> => {
    const stationId = getStationIdFromUrl(station.streamUrl);
    
    if (!stationId) {
        // Not an AzuraCast station or URL format not recognized
        return [];
    }

    // API Endpoint: /station/{station_id}/schedule
    const targetUrl = `https://music-station.live/api/station/${stationId}/schedule`;
    // Using CORS proxy to ensure browser compatibility
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

    try {
        const response = await fetch(proxyUrl);
        if (!response.ok) {
            console.warn(`Failed to fetch schedule for ${station.name} (${stationId})`);
            return [];
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching AzuraCast schedule:", error);
        return [];
    }
}