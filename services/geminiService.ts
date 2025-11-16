import { GoogleGenAI } from "@google/genai";
import type { NowPlaying, Station, SongVote } from '../types';
import { slugify } from "../utils/slugify";

let ai: GoogleGenAI;

const getAi = () => {
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    }
    return ai;
};

const fetchNowPlaying = async (station: Station): Promise<NowPlaying> => {
  const stationIdMatch = station.streamUrl.match(/music-station\.live\/listen\/([^\/]+)/);
  const fallbackId = slugify(`${station.name} Live Stream`);

  if (stationIdMatch && stationIdMatch[1]) {
    const stationId = stationIdMatch[1];
    const targetUrl = `https://music-station.live/api/nowplaying/${stationId}`;
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

    try {
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        console.error(`API error for now playing data for ${stationId}:`, response.status, await response.text());
        return { artist: station.name, title: "Station Data Unavailable", songId: slugify(`${station.name} unavailable`) };
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
      console.error(`Error fetching now playing data for ${stationId}:`, error);
      return { artist: station.name, title: "Live Stream", songId: fallbackId };
    }
  } else {
    return { artist: station.name, title: "Live Stream", songId: fallbackId };
  }
};

const getSongInfo = async (artist: string, title: string): Promise<string> => {
  try {
    const prompt = `Provide a short, interesting fact or brief bio about the song "${title}" by the artist "${artist}". Focus on the creation of the song, its impact, or a unique detail about the artist related to this track. Keep it concise and engaging for a radio listener.`;
    
    const response = await getAi().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error getting song info from Gemini:", error);
    throw error;
  }
};

const fetchLyrics = async (artist: string, title: string): Promise<string> => {
  try {
    const prompt = `Find the full lyrics for the song "${title}" by "${artist}". Output only the lyrics. If you cannot find the lyrics, respond with the exact text 'LYRICS_NOT_FOUND'.`;
    
    const response = await getAi().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error getting lyrics from Gemini:", error);
    throw error;
  }
};

const getGenreInfo = async (genre: string): Promise<string> => {
  try {
    const prompt = `Give me a fun, short summary of the "${genre}" music genre. Highlight its key characteristics, origins, and some notable artists. Keep it engaging and concise (2-3 paragraphs) for a radio listener discovering new music.`;
    
    const response = await getAi().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error getting genre info from Gemini:", error);
    throw error;
  }
};

const translateLyrics = async (lyrics: string, language: string): Promise<string> => {
  try {
    const prompt = `Translate the following song lyrics into ${language}. Preserve the line breaks and poetic structure. Output only the translated lyrics. If you cannot perform the translation, respond with the exact text 'TRANSLATION_FAILED'.\n\nLyrics:\n${lyrics}`;
    
    const response = await getAi().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
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

    const response = await getAi().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error getting community hits summary from Gemini:", error);
    throw error;
  }
};


export { fetchNowPlaying, getSongInfo, fetchLyrics, getGenreInfo, translateLyrics, getCommunityHitsSummary };