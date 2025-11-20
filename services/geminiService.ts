import { GoogleGenAI, Type, Schema } from "@google/genai";
import type { NowPlaying, Station, SongVote, Stock, StockSentiment, StockNewsEvent } from '../types';
import { slugify } from "../utils/slugify";

let ai: GoogleGenAI;

const getAi = () => {
    if (!ai) {
        // Always use a named parameter `apiKey` from `process.env.API_KEY`
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

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message.includes("RESOURCE_EXHAUSTED")) {
      return "Our AI service is a bit overwhelmed! Please wait a moment and try again.";
  }
  return "An unexpected error occurred. Please try again later.";
}


const getSongInfo = async (artist: string, title: string): Promise<string> => {
  try {
    // Correct way to use GoogleGenAI: pass model and contents to generateContent directly.
    const response = await getAi().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ text: `Provide a short, interesting fact or brief bio about the song "${title}" by the artist "${artist}". Focus on the creation of the song, its impact, or a unique detail about the artist related to this track. Keep it concise and engaging for a radio listener.` }],
    });

    return response.text;
  } catch (error) {
    console.error("Error getting song info from Gemini:", error);
    throw error;
  }
};

const fetchLyrics = async (artist: string, title: string): Promise<string> => {
  try {
    // Correct way to use GoogleGenAI: pass model and contents to generateContent directly.
    const response = await getAi().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ text: `Find the full lyrics for the song "${title}" by "${artist}". Output only the lyrics. If you cannot find the lyrics, respond with the exact text 'LYRICS_NOT_FOUND'.` }],
    });

    return response.text;
  } catch (error) {
    console.error("Error getting lyrics from Gemini:", error);
    throw error;
  }
};

const getGenreInfo = async (genre: string): Promise<string> => {
  try {
    // Correct way to use GoogleGenAI: pass model and contents to generateContent directly.
    const response = await getAi().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ text: `Give me a fun, short summary of the "${genre}" music genre. Highlight its key characteristics, origins, and some notable artists. Keep it engaging and concise (2-3 paragraphs) for a radio listener discovering new music.` }],
    });

    return response.text;
  } catch (error) {
    console.error("Error getting genre info from Gemini:", error);
    throw error;
  }
};

const translateLyrics = async (lyrics: string, language: string): Promise<string> => {
  try {
    // Correct way to use GoogleGenAI: pass model and contents to generateContent directly.
    const response = await getAi().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ text: `Translate the following song lyrics into ${language}. Preserve the line breaks and poetic structure. Output only the translated lyrics. If you cannot perform the translation, respond with the exact text 'TRANSLATION_FAILED'.\n\nLyrics:\n${lyrics}` }],
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

    // Correct way to use GoogleGenAI: pass model and contents to generateContent directly.
    const response = await getAi().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ text: `You are a charismatic radio DJ. Look at this list of top songs voted on by our community. Write a short, engaging summary (2-3 sentences) about the vibe of the chart. Mention a couple of key genres or the general mood. Don't just list the songs. Here is the list of songs (Artist - Title): \n\n${songList}` }],
    });

    return response.text;
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

    // Correct way to use GoogleGenAI: pass model and contents to generateContent directly.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ text: fullPrompt }],
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

    const jsonString = response.text.trim();
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

const getMarketSentiment = async (stock: Stock): Promise<StockSentiment> => {
  const simulatedListenerCount = Math.floor(stock.price * 10 + Math.random() * 500); // Simulate based on price
  const simulatedLikes = Math.floor(stock.price * 5 + Math.random() * 200);
  const simulatedDislikes = Math.floor(stock.price * 1 + Math.random() * 50);

  const prompt = `Analyze the potential market sentiment for the station stock "${stock.stationName}" (symbol: ${stock.symbol}) which currently has a price of ${stock.price}.
  Consider its genre: "${stock.stationName}" and description: "${stock.stationName}".
  Recent (simulated) activity: ${simulatedListenerCount} listeners, ${simulatedLikes} likes, ${simulatedDislikes} dislikes.
  Based on this, is the sentiment for this stock positive, negative, or neutral? Provide a brief reason.
  Return a JSON object with 'symbol', 'sentiment' (positive, negative, neutral), and 'reason'.`;

  try {
    // Correct way to use GoogleGenAI: pass model and contents to generateContent directly.
    const response = await getAi().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ text: prompt }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            symbol: { type: Type.STRING },
            // Fix: Explicitly set the type as a union for clarity, though Gemini returns string.
            // This is handled by casting the parsed result below.
            sentiment: { type: Type.STRING } as Schema,
            reason: { type: Type.STRING }
          }
        }
      }
    });
    // Fix: Cast the sentiment property to the specific union type
    const parsedSentiment = JSON.parse(response.text) as StockSentiment;
    // Ensure sentiment matches expected enum, default if not
    if (!['positive', 'negative', 'neutral'].includes(parsedSentiment.sentiment)) {
        parsedSentiment.sentiment = 'neutral';
    }
    return parsedSentiment;
  } catch (error) {
    console.error("Error getting market sentiment from Gemini:", error);
    return { symbol: stock.symbol, sentiment: 'neutral', reason: getErrorMessage(error) };
  }
};

const generateStockNews = async (stock: Stock): Promise<StockNewsEvent | null> => {
  const currentPrice = stock.price.toFixed(2);
  const changeDirection = stock.change > 0 ? 'risen' : (stock.change < 0 ? 'fallen' : 'remained stable');
  const changePercentage = Math.abs(stock.change).toFixed(1);

  const newsPrompts = [
    { sentiment: 'positive', text: `Breaking: ${stock.stationName} surges! AI predicts strong gains. Current price: ${currentPrice}. (+${changePercentage}%)` },
    { sentiment: 'positive', text: `Analyst says: ${stock.stationName} (symbol: ${stock.symbol}) poised for growth. Listenership up. Current price: ${currentPrice}. (+${changePercentage}%)` },
    { sentiment: 'positive', text: `Community buzz around ${stock.stationName} leads to price rally. Current price: ${currentPrice}. (+${changePercentage}%)` },
    { sentiment: 'negative', text: `Alert: ${stock.stationName} stock falters amid concerns over streaming stability. Current price: ${currentPrice}. (-${changePercentage}%)` },
    { sentiment: 'negative', text: `Report: ${stock.stationName} (symbol: ${stock.symbol}) drops as competition heats up. Current price: ${currentPrice}. (-${changePercentage}%)` },
    { sentiment: 'neutral', text: `Market watch: ${stock.stationName} stock holds steady despite minor fluctuations. Current price: ${currentPrice}.` },
    { sentiment: 'neutral', text: `Industry expert comments on ${stock.stationName}'s recent performance, calling it 'consistent'. Current price: ${currentPrice}.` },
  ];

  const randomPrompt = newsPrompts[Math.floor(Math.random() * newsPrompts.length)];

  // Use Gemini to rephrase or add flair to the news for more dynamic content
  try {
    // Correct way to use GoogleGenAI: pass model and contents to generateContent directly.
    const response = await getAi().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ text: `Rephrase this news headline to sound more like a concise, engaging financial news byte for a radio station stock market, and confirm its sentiment (positive, negative, or neutral).
      Headline: "${randomPrompt.text}"
      Return as JSON: {'text': 'Rephrased news', 'sentiment': 'positive/negative/neutral'}` }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            sentiment: { type: Type.STRING }
          }
        }
      }
    });

    const parsedResponse = JSON.parse(response.text) as { text: string, sentiment: 'positive' | 'negative' | 'neutral' };

    return {
      id: `news_${Date.now()}_${stock.symbol}`,
      symbol: stock.symbol,
      text: parsedResponse.text,
      sentiment: parsedResponse.sentiment,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error generating stock news with Gemini:", error);
    // Fallback to simpler news if AI generation fails
    return {
      id: `news_fallback_${Date.now()}_${stock.symbol}`,
      symbol: stock.symbol,
      text: randomPrompt.text,
      sentiment: randomPrompt.sentiment,
      timestamp: new Date().toISOString()
    };
  }
};


export { fetchNowPlaying, getSongInfo, fetchLyrics, getGenreInfo, translateLyrics, getCommunityHitsSummary, findStationsByVibe, getMarketSentiment, generateStockNews };