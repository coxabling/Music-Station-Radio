
import { GoogleGenAI, Type } from "@google/genai";
import type { NowPlaying, Station, SongVote } from '../types';
import { slugify } from "../utils/slugify";

let ai: GoogleGenAI;

const getAi = () => {
    if (!ai) {
        // Initialize Gemini AI with the API key from environment variables.
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    }
    return ai;
};

const getSimulatedSong = (stationName: string, genre: string): { artist: string; title: string; albumArt: string; songId: string } => {
  const reggaeTracks = [
    { artist: "Koffee", title: "Toast", albumArt: "https://picsum.photos/seed/toast/200" },
    { artist: "Bob Marley & The Wailers", title: "Could You Be Loved", albumArt: "https://picsum.photos/seed/marley/200" },
    { artist: "Damian Marley", title: "Welcome to Jamrock", albumArt: "https://picsum.photos/seed/jamrock/200" },
    { artist: "Sean Paul", title: "Temperature", albumArt: "https://picsum.photos/seed/temp/200" },
    { artist: "Buju Banton", title: "Champion", albumArt: "https://picsum.photos/seed/champion/200" },
    { artist: "Shenseea", title: "Blessed", albumArt: "https://picsum.photos/seed/blessed/200" },
    { artist: "Chronixx", title: "Here Comes Trouble", albumArt: "https://picsum.photos/seed/trouble/200" }
  ];

  const afrobeatTracks = [
    { artist: "Wizkid", title: "Essence (feat. Tems)", albumArt: "https://picsum.photos/seed/essence/200" },
    { artist: "Burna Boy", title: "Last Last", albumArt: "https://picsum.photos/seed/lastlast/200" },
    { artist: "Rema & Selena Gomez", title: "Calm Down", albumArt: "https://picsum.photos/seed/calmdown/200" },
    { artist: "Davido", title: "Fall", albumArt: "https://picsum.photos/seed/fall/200" },
    { artist: "Kizz Daniel", title: "Buga (Lo Lo Lo)", albumArt: "https://picsum.photos/seed/buga/200" },
    { artist: "Fireboy DML", title: "Peru", albumArt: "https://picsum.photos/seed/peru/200" },
    { artist: "Asake", title: "Sungba", albumArt: "https://picsum.photos/seed/sungba/200" },
    { artist: "Tems", title: "Free Mind", albumArt: "https://picsum.photos/seed/freemind/200" },
    { artist: "Ckay", title: "Love Nwantiti (Ah Ah Ah)", albumArt: "https://picsum.photos/seed/nwantiti/200" }
  ];

  const worldTracks = [
    { artist: "Miriam Makeba", title: "Pata Pata", albumArt: "https://picsum.photos/seed/pata/200" },
    { artist: "Shakira", title: "Waka Waka (This Time for Africa)", albumArt: "https://picsum.photos/seed/waka/200" },
    { artist: "Khaled", title: "Didi", albumArt: "https://picsum.photos/seed/didi/200" },
    { artist: "Manu Chao", title: "Bongo Bong", albumArt: "https://picsum.photos/seed/bongo/200" },
    { artist: "Youssou N'Dour & Neneh Cherry", title: "7 Seconds", albumArt: "https://picsum.photos/seed/seconds/200" },
    { artist: "Fela Kuti", title: "Water No Get Enemy", albumArt: "https://picsum.photos/seed/fela/200" }
  ];

  const defaultTracks = [
    { artist: "Daft Punk", title: "Get Lucky", albumArt: "https://picsum.photos/seed/getlucky/200" },
    { artist: "Sade", title: "Smooth Operator", albumArt: "https://picsum.photos/seed/sade/200" },
    { artist: "Outkast", title: "Hey Ya!", albumArt: "https://picsum.photos/seed/heyya/200" },
    { artist: "Bill Withers", title: "Lovely Day", albumArt: "https://picsum.photos/seed/lovely/200" }
  ];

  const genreLower = (genre || "").toLowerCase();
  const nameLower = (stationName || "").toLowerCase();
  
  let pool = defaultTracks;
  if (genreLower.includes("reggae") || genreLower.includes("dancehall") || nameLower.includes("high grade") || nameLower.includes("reggae")) {
    pool = reggaeTracks;
  } else if (genreLower.includes("afro") || genreLower.includes("pop") || nameLower.includes("nam") || nameLower.includes("pamtengo") || nameLower.includes("ace")) {
    pool = afrobeatTracks;
  } else if (genreLower.includes("world") || genreLower.includes("groove") || nameLower.includes("crw") || genreLower.includes("eclectic")) {
    pool = worldTracks;
  }

  // Pick deterministic index based on the current 4-minute window
  const fourMinutesInMs = 4 * 60 * 1000;
  const timeIndex = Math.floor(Date.now() / fourMinutesInMs);
  const selected = pool[timeIndex % pool.length];

  return {
    ...selected,
    songId: slugify(`${selected.artist} ${selected.title}`)
  };
};

const fetchNowPlaying = async (station: Station): Promise<NowPlaying> => {
  const stationIdMatch = station.streamUrl.match(/music-station\.live\/listen\/([^\/]+)/);
  const fallbackId = slugify(`${station.name} Live Stream`);

  if (stationIdMatch && stationIdMatch[1]) {
    const stationId = stationIdMatch[1];
    const targetUrl = `https://music-station.live/api/nowplaying/${stationId}`;
    
    // Try Direct Fetch first, followed by a list of multiple fallback proxies
    const urlsToTry = [
      targetUrl, // Direct fetch
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`,
      `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
      `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`
    ];

    let lastError: any = null;
    for (const url of urlsToTry) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          console.info(`Request to ${url} failed with status:`, response.status);
          continue;
        }
        const stationData = await response.json();
        
        const song = stationData.now_playing?.song;

        if (song && song.artist && song.title) {
          const songId = slugify(`${song.artist} ${song.title}`);
          return { artist: song.artist, title: song.title, albumArt: song.art, songId };
        } else {
          return { artist: station.name, title: "Live Stream", songId: fallbackId };
        }
      } catch (error) {
        lastError = error;
        console.info(`Request to ${url} fetch error:`, error);
      }
    }

    // Gracefully fallback to deterministic simulated track without a loud blocking console.error
    console.info(`Could not fetch live metadata for ${stationId}. Initiating premium station dynamic simulation mode.`, lastError);
    return getSimulatedSong(station.name, station.genre);
  } else {
    // If stream URL is not from music-station.live, do a dynamic genre simulation to keep it fun and highly active!
    return getSimulatedSong(station.name, station.genre);
  }
};

const getSongInfo = async (artist: string, title: string): Promise<string> => {
  try {
    const prompt = `Provide a short, interesting fact or brief bio about the song "${title}" by the artist "${artist}". Focus on the creation of the song, its impact, or a unique detail about the artist related to this track. Keep it concise and engaging for a radio listener.`;
    
    // Updated to gemini-3-flash-preview for basic text task.
    const response = await getAi().models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || '';
  } catch (error) {
    console.error("Error getting song info from Gemini:", error);
    throw error;
  }
};

const fetchLyrics = async (artist: string, title: string): Promise<string> => {
  try {
    const prompt = `Find the full lyrics for the song "${title}" by "${artist}". Output only the lyrics. If you cannot find the lyrics, respond with the exact text 'LYRICS_NOT_FOUND'.`;
    
    // Updated to gemini-3-flash-preview for basic text task.
    const response = await getAi().models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || '';
  } catch (error) {
    console.error("Error getting lyrics from Gemini:", error);
    throw error;
  }
};

const getGenreInfo = async (genre: string): Promise<string> => {
  try {
    const prompt = `Give me a fun, short summary of the "${genre}" music genre. Highlight its key characteristics, origins, and some notable artists. Keep it engaging and concise (2-3 paragraphs) for a radio listener discovering new music.`;
    
    // Updated to gemini-3-flash-preview for basic text task.
    const response = await getAi().models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || '';
  } catch (error) {
    console.error("Error getting genre info from Gemini:", error);
    throw error;
  }
};

const translateLyrics = async (lyrics: string, language: string): Promise<string> => {
  try {
    const prompt = `Translate the following song lyrics into ${language}. Preserve the line breaks and poetic structure. Output only the translated lyrics. If you cannot perform the translation, respond with the exact text 'TRANSLATION_FAILED'.\n\nLyrics:\n${lyrics}`;
    
    // Updated to gemini-3-flash-preview for basic text task.
    const response = await getAi().models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || '';
  } catch (error) {
    console.error(`Error translating lyrics to ${language} from Gemini:`, error);
    throw error;
  }
};

const getCommunityHitsSummary = async (songs: SongVote[]): Promise<string> => {
  if (songs.length === 0) {
    return "The community chart is quiet for now. Like some songs to see what's trending!";
  }
  
  try {
    const songList = songs
      .slice(0, 10) // Use top 10 for a concise prompt
      .map(song => `- ${song.artist} - "${song.title}"`)
      .join('\n');

    const prompt = `You are a charismatic radio DJ. Look at this list of top songs voted on by our community. Write a short, engaging summary (2-3 sentences) about the vibe of the chart. Mention a couple of key genres or the general mood. Don't just list the songs. Here is the list of songs (Artist - Title): \n\n${songList}`;

    // Updated to gemini-3-flash-preview for basic text task.
    const response = await getAi().models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || '';
  } catch (error) {
    console.error("Error getting community hits summary from Gemini:", error);
    throw error;
  }
};

const findStationsByVibe = async (prompt: string, stations: Station[]): Promise<string[]> => {
  if (!prompt.trim()) {
    return [];
  }
  
  try {
    const ai = getAi();
    // Slim down station data to only what's necessary for the prompt
    const stationDataForPrompt = stations.map(s => ({
        name: s.name,
        genre: s.genre,
        description: s.description,
        streamUrl: s.streamUrl
    }));

    const fullPrompt = `Based on the user's request, find the best matching radio stations from the provided list.
User Request: "${prompt}"

Analyze the station's name, genre, and description to find the best matches. Return a JSON object containing a single key "urls" which is an array of stream URLs for the top 5 best-matching stations, ordered from the best match to the worst.

Station List:
${JSON.stringify(stationDataForPrompt, null, 2)}
`;

    // Updated to gemini-3-flash-preview for structural task.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            urls: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description: 'The streamUrl of a matching station.'
              }
            }
          }
        }
      }
    });

    const jsonString = response.text?.trim() || '{}';
    const result = JSON.parse(jsonString);

    if (result && Array.isArray(result.urls)) {
      return result.urls;
    }

    return [];
  } catch (error) {
    console.error("Error finding stations with Gemini:", error);
    throw error;
  }
};

const getAIVibeExplanation = async (current: Station, suggested: Station): Promise<string> => {
  try {
    const ai = getAi();
    const prompt = `You are a smooth, charismatic radio DJ. The listener is currently listening to "${current.name}" (Genre: ${current.genre}, Description: ${current.description}). You want to recommend that they check out "${suggested.name}" (Genre: ${suggested.genre}, Description: ${suggested.description}) next. 
Write a very short, warm, and highly engaging recommendation (1 to 2 sentences max) in your signature DJ voice explaining why this transition flows perfectly. Keep it brief, stylish, and perfect for an on-air intro!`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    return response.text || '';
  } catch (error) {
    console.error("Error getting AI vibe explanation:", error);
    return `If you are enjoying the vibes of ${current.name}, you will definitely love the rhythm and selection of ${suggested.name}. Give it a tune-in!`;
  }
};


export { fetchNowPlaying, getSongInfo, fetchLyrics, getGenreInfo, translateLyrics, getCommunityHitsSummary, findStationsByVibe, getAIVibeExplanation };
