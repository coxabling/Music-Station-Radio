import React, { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react';
import type { ChatMessage, Station, NowPlaying } from '../types';
import { SendIcon } from '../constants';

interface GenreChatViewProps {
    allStations: Station[];
    onSelectStation: (station: Station) => void;
    currentStation: Station | null;
    nowPlaying: NowPlaying | null;
}

const botMessages: Record<string, string[]> = {
    default: [
        "This is my favorite genre!", "What's the best track you've heard today?", 
        "Any recommendations for similar artists?", "This is such a vibe."
    ],
    Afropop: [
        "Can't get enough of these rhythms!", "Who's the current king of Afropop in your opinion?",
        "This beat is infectious!", "Afropop is taking over the world."
    ],
    'Premium Reggae & Dancehall': [
        "Pure positive vibrations.", "Nothing beats classic roots reggae.",
        "The bassline on this is heavy!", "Feeling irie listening to this."
    ],
};
const USER_COLORS = ['#34d399', '#fbbf24', '#f87171', '#60a5fa', '#a78bfa', '#f472b6'];
const getAvatarInfo = (author: string): {initials: string, color: string} => {
    if (author === 'You') return { initials: 'You', color: 'var(--accent-color)' };
    if (author === 'RoomBot' || author === 'RadioBot') return { initials: 'Bot', color: '#9ca3af' };
    if (author === 'DJ') return { initials: 'DJ', color: '#a855f7' }; // purple-500
    const initials = author.replace('Guest', 'G');
    const colorIndex = parseInt(author.replace('Guest', ''), 10) % USER_COLORS.length;
    return { initials, color: USER_COLORS[colorIndex] };
}

const GenreCard: React.FC<{ genre: string; onClick: () => void; coverArt: string }> = ({ genre, onClick, coverArt }) => (
    <button 
        onClick={onClick}
        className="relative group w-full aspect-[16/10] bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-[var(--accent-color)]/30 transition-all duration-300 transform hover:-translate-y-1"
    >
        <img src={coverArt} alt={genre} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-end">
            <h3 className="text-xl font-bold text-white font-orbitron">{genre}</h3>
        </div>
    </button>
);

const ChatMessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isYou = message.author === 'You';

    if (message.isDJ) {
        return (
            <li className="flex justify-center my-2 animate-fade-in-up">
                <div className="px-4 py-2 rounded-full bg-purple-500/20 border border-purple-400/50 text-purple-200 text-sm flex items-center gap-2 shadow-lg">
                    {message.text}
                </div>
            </li>
        );
    }

    return (
        <li className={`flex items-end gap-2 animate-fade-in-up ${isYou ? 'justify-end' : 'justify-start'}`} style={{animationDelay: '50ms'}}>
            {!isYou && (
                <div 
                    className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: message.avatarColor }}
                >
                    {message.initials}
                </div>
            )}
            <div>
                {!isYou && <span className="text-xs text-gray-400 font-semibold px-3">{message.author}</span>}
                <div 
                    className={`relative px-4 py-2 rounded-2xl max-w-xs md:max-w-sm group ${isYou ? 'bg-[var(--accent-color)] text-black rounded-br-none' : 'bg-gray-700/80 text-white rounded-bl-none'}`}
                    // Fix: Use an empty array for the locales argument in toLocaleString to ensure default locale is used, resolving potential compatibility issues.
                    title={new Date(message.id).toLocaleString([], { hour: 'numeric', minute: '2-digit' })}
                >
                    {message.text}
                </div>
            </div>
        </li>
    );
};

const ChatInterface: React.FC<{ genre: string; stations: Station[]; onSelectStation: (s: Station) => void; onBack: () => void; currentStation: Station | null, nowPlaying: NowPlaying | null }> = ({ genre, stations, onSelectStation, onBack, currentStation, nowPlaying }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const botIntervalRef = useRef<number | undefined>();
    const lastAnnouncedSongIdRef = useRef<string | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    useLayoutEffect(scrollToBottom, [messages, isTyping]);
    
    // DJ Auto Announcer
    useEffect(() => {
        if (nowPlaying && nowPlaying.songId && nowPlaying.songId !== lastAnnouncedSongIdRef.current && nowPlaying.title !== "Live Stream" && nowPlaying.title !== "Station Data Unavailable") {
            const djInfo = getAvatarInfo('DJ');
            const djMessage: ChatMessage = {
                id: Date.now(),
                author: 'DJ',
                text: `🎶 Now Playing: "${nowPlaying.title}" by ${nowPlaying.artist}`,
                isDJ: true,
                initials: djInfo.initials,
                avatarColor: djInfo.color,
            };

            setMessages(prev => [...prev, djMessage]);
            lastAnnouncedSongIdRef.current = nowPlaying.songId;
        }
    }, [nowPlaying]);

    useEffect(() => {
        const botInfo = getAvatarInfo('RoomBot');
        setMessages([{
            id: Date.now(),
            author: 'RoomBot',
            text: `Welcome to the ${genre} room! Feel free to chat and discover new music.`,
            isBot: true,
            initials: botInfo.initials,
            avatarColor: botInfo.color
        }]);
        lastAnnouncedSongIdRef.current = null; // Reset on room change

        const genreBotMessages = botMessages[genre] || botMessages.default;

        const createBotMessage = () => {
            const guestName = 'Guest' + Math.floor(Math.random() * 100);
            const guestInfo = getAvatarInfo(guestName);
            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    author: guestName,
                    text: genreBotMessages[Math.floor(Math.random() * genreBotMessages.length)],
                    isBot: true,
                    initials: guestInfo.initials,
                    avatarColor: guestInfo.color,
                }]);
            }, 1000 + Math.random() * 1500);
        };
        
        botIntervalRef.current = window.setInterval(createBotMessage, 9000 + Math.random() * 6000);

        return () => {
            if (botIntervalRef.current) {
                clearInterval(botIntervalRef.current);
            }
        };
    }, [genre]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            const userInfo = getAvatarInfo('You');
            setMessages(prev => [...prev, {
                id: Date.now(),
                author: 'You',
                text: input.trim(),
                initials: userInfo.initials,
                avatarColor: userInfo.color
            }]);
            setInput('');
        }
    };

    return (
        <div className="h-full grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6 animate-fade-in">
            <div className="flex-1 flex flex-col bg-gray-900/50 rounded-lg overflow-hidden border border-gray-700/50">
                <header className="p-3 border-b border-gray-700/50 flex items-center gap-4 flex-shrink-0">
                    <button onClick={onBack} className="text-sm bg-gray-700/50 hover:bg-gray-700 text-gray-300 font-semibold py-1 px-3 rounded-md transition-colors">&larr; Back</button>
                    <h3 className="text-lg font-semibold text-cyan-300 font-orbitron">{genre} Room</h3>
                </header>
                <div className="flex-1 p-4 overflow-y-auto">
                    <ul className="space-y-4">
                        {messages.map(msg => <ChatMessageBubble key={msg.id} message={msg} />)}
                         {isTyping && (
                            <li className="flex items-end gap-2 animate-fade-in-up">
                                <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gray-600 flex items-center justify-center text-white font-bold text-sm">G</div>
                                <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-gray-700/80 text-white">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0ms'}}></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '200ms'}}></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '400ms'}}></span>
                                    </div>
                                </div>
                            </li>
                        )}
                    </ul>
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t border-gray-700/50 flex-shrink-0">
                    <form onSubmit={handleSendMessage} className="flex gap-3">
                        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." className="flex-grow bg-gray-800/80 rounded-full py-2.5 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] border border-gray-700 transition-colors" />
                        <button type="submit" className="bg-[var(--accent-color)] hover:opacity-80 text-black font-bold w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-full transition-opacity">
                            <SendIcon className="w-5 h-5"/>
                        </button>
                    </form>
                </div>
            </div>
            <aside className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50 h-full flex flex-col">
                {currentStation && (
                    <div className="mb-4 p-2 bg-gray-800/50 rounded-lg border border-gray-700 flex-shrink-0">
                        <p className="text-xs text-[var(--accent-color)] font-semibold">NOW PLAYING</p>
                        <div className="flex items-center gap-2 mt-1">
                            <img src={currentStation.coverArt} alt={currentStation.name} className="w-8 h-8 rounded-md" />
                            <p className="text-sm font-semibold text-white truncate">{currentStation.name}</p>
                        </div>
                    </div>
                )}
                <h4 className="font-bold mb-3 text-white flex-shrink-0">Stations in this room</h4>
                <ul className="space-y-2 overflow-y-auto">
                    {stations.map(s => {
                        const isPlaying = currentStation?.streamUrl === s.streamUrl;
                        return (
                            <li key={s.streamUrl}>
                                <button onClick={() => onSelectStation(s)} className={`w-full flex items-center gap-2 p-1.5 rounded-md transition-colors ${isPlaying ? 'bg-cyan-500/20' : 'hover:bg-gray-700/50'}`}>
                                    <div className="relative flex-shrink-0">
                                        <img src={s.coverArt} alt={s.name} className="w-10 h-10 rounded-md" />
                                        {isPlaying && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div></div>}
                                    </div>
                                    <span className={`text-sm text-left truncate ${isPlaying ? 'text-cyan-300 font-semibold' : 'text-gray-300'}`}>{s.name}</span>
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </aside>
        </div>
    );
}

export const GenreChatView: React.FC<GenreChatViewProps> = ({ allStations, onSelectStation, currentStation, nowPlaying }) => {
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

    const genres = useMemo(() => {
        const genreMap = new Map<string, string>();
        allStations.forEach(s => {
            const mainGenre = s.genre.split('/')[0].trim();
            if (!genreMap.has(mainGenre)) {
                genreMap.set(mainGenre, s.coverArt);
            }
        });
        return Array.from(genreMap.entries()).map(([name, coverArt]) => ({ name, coverArt }));
    }, [allStations]);

    const stationsForGenre = useMemo(() => {
        if (!selectedGenre) return [];
        return allStations.filter(s => s.genre.toLowerCase().includes(selectedGenre.toLowerCase()));
    }, [allStations, selectedGenre]);

    if (selectedGenre) {
        return <div className="p-4 h-full"><ChatInterface genre={selectedGenre} stations={stationsForGenre} onSelectStation={onSelectStation} onBack={() => setSelectedGenre(null)} currentStation={currentStation} nowPlaying={nowPlaying} /></div>;
    }

    return (
        <div className="p-4 md:p-8 animate-fade-in">
            <header className="text-center mb-8">
                <h1 className="text-3xl font-bold font-orbitron accent-color-text">Genre Chat Rooms</h1>
                <p className="text-gray-400 mt-2">Join a room to chat with fellow fans and discover new music.</p>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {genres.map((genre, index) => (
                    <div key={genre.name} className="animate-fade-in-up" style={{animationDelay: `${index * 50}ms`}}>
                        <GenreCard genre={genre.name} coverArt={genre.coverArt} onClick={() => setSelectedGenre(genre.name)} />
                    </div>
                ))}
            </div>
        </div>
    );
};