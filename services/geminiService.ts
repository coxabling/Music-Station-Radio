import { GoogleGenAI } from "@google/genai";
import type { NowPlaying, Station } from '../types';
import { slugify } from "../utils/slugify";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

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
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error getting song info from Gemini:", error);
    return "Could not retrieve information at this time. Please try again later.";
  }
};

const fetchLyrics = async (artist: string, title: string): Promise<string> => {
  try {
    const prompt = `Find the full lyrics for the song "${title}" by "${artist}". Output only the lyrics. If you cannot find the lyrics, respond with the exact text 'LYRICS_NOT_FOUND'.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error getting lyrics from Gemini:", error);
    return "Could not retrieve lyrics at this time. Please try again later.";
  }
};

const getGenreInfo = async (genre: string): Promise<string> => {
  try {
    const prompt = `Give me a fun, short summary of the "${genre}" music genre. Highlight its key characteristics, origins, and some notable artists. Keep it engaging and concise (2-3 paragraphs) for a radio listener discovering new music.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error getting genre info from Gemini:", error);
    return "Could not retrieve information about this genre at this time. Please try again later.";
  }
};


export { fetchNowPlaying, getSongInfo, fetchLyrics, getGenreInfo };