// This utility maps genre keywords to their origin locations for the interactive map.

interface MapLocation {
  lat: number;
  lng: number;
  zoom: number;
}

export const GENRE_LOCATION_MAP: Record<string, MapLocation> = {
  'afrobeat': { lat: 9.0820, lng: 8.6753, zoom: 5 }, // Nigeria
  'amapiano': { lat: -30.5595, lng: 22.9375, zoom: 5 }, // South Africa
  'highlife': { lat: 7.9465, lng: -1.0232, zoom: 6 }, // Ghana
  'afropop': { lat: 5.6037, lng: 2.9, zoom: 4 }, // West/Central Africa focus
  'namibian': { lat: -22.9585, lng: 18.4904, zoom: 6 }, // Namibia
  'reggae': { lat: 18.1096, lng: -77.2975, zoom: 8 }, // Jamaica
  'world': { lat: 20, lng: 0, zoom: 2 }, // Globe view
};

/**
 * Finds the corresponding location for a given genre string.
 * @param genre The genre string from a station, e.g., "Afrobeat & African Hits".
 * @returns A MapLocation object with lat, lng, and zoom, or a default view.
 */
export const getLocationForGenre = (genre: string): MapLocation => {
  const lowerGenre = genre.toLowerCase();
  
  for (const key in GENRE_LOCATION_MAP) {
    if (lowerGenre.includes(key)) {
      return GENRE_LOCATION_MAP[key];
    }
  }
  
  // Default to a central view of Africa if no specific genre is matched
  return { lat: 5.6, lng: 23.3, zoom: 4 };
};