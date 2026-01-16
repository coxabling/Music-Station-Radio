import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage, Station, NowPlaying, AchievementID } from '../types';
import { AVATAR_FRAMES, ACHIEVEMENTS, StarIcon } from '../constants';

interface ListeningPartyChatProps {
    station: Station;
    isOpen: boolean;
    onClose: () => void;
    nowPlaying: NowPlaying | null;
    userPoints: number; 
    onSuperChat: (amount: number, message: string) => void;
    activeFrame?: string;
    onUserClick?: (username: string) => void; 
    currentUserAvatarUrl?: string;
}

const botMessages = [
    "This track is 🔥!",
    "Just tuned in, what a vibe.",
    "Anyone know who sings this?",
    "Turn it up! 🔊",
    "Loving this station choice.",
    "This reminds me of summer '09.",
];

const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

const USER_COLORS = ['#34d399', '#fbbf24', '#f87171', '#60a5fa', '#a78bfa', '#f472b6'];
const getAvatarInfo = (author: string): {initials: string, color: string} => {
    if (author === 'You') return { initials: 'You', color: 'var(--accent-color)' };
    if (author === 'RadioBot' || author === 'RoomBot') return { initials: 'Bot', color: '#9ca3af' };
    if (author === 'DJ') return { initials: 'DJ', color: '#a855f7' }; 
    const initials = author.replace('Guest', 'G');
    const colorIndex = parseInt(author.replace('Guest', ''), 10) % USER_COLORS.length;
    return { initials, color: USER_COLORS[colorIndex] };
}

const BadgeIcon: React.FC<{id: AchievementID}> = ({id}) => {
    const Achievement = ACHIEVEMENTS[id];
    if(!Achievement) return null;
    return (
        <div className="w-3 h-3 text-yellow-400" title={Achievement.name}>
            <Achievement.icon />
        </div>
    )
}

export const ListeningPartyChat: React.FC<ListeningPartyChatProps> = ({ station, isOpen, onClose, nowPlaying, activeFrame, onUserClick, onSuperChat, userPoints }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isSuperChatActive, setIsSuperChatActive] = useState(false);
    const [superChatAmount, setSuperChatAmount] = useState(100);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const lastAnnouncedSongIdRef = useRef<string | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    
    const getFrameClass = (frameId?: string) => {
        if (!frameId) return '';
        return AVATAR_FRAMES.find(f => f.id === frameId)?.cssClass || '';
    }

    useEffect(scrollToBottom, [messages]);

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
        const botInfo = getAvatarInfo('RadioBot');
        setMessages([{
            id: Date.now(),
            author: 'RadioBot',
            text: `Welcome to the Listening Party for ${station.name}!`,
            isBot: true,
            avatarColor: botInfo.color,
            initials: botInfo.initials,
        }]);
        lastAnnouncedSongIdRef.current = null; 

        const interval = setInterval(() => {
            const guestName = 'Guest' + Math.floor(Math.random() * 100);
            const guestInfo = getAvatarInfo(guestName);
            setMessages(prev => [...prev, {
                id: Date.now(),
                author: guestName,
                text: botMessages[Math.floor(Math.random() * botMessages.length)],
                isBot: true,
                avatarColor: guestInfo.color,
                initials: guestInfo.initials
            }]);
        }, 8000 + Math.random() * 5000); 

        return () => clearInterval(interval);
    }, [station.name]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            const userInfo = getAvatarInfo('You');
            let tier: ChatMessage['tier'] = undefined;
            if (isSuperChatActive) {
                if (superChatAmount >= 500) tier = 'gold';
                else if (superChatAmount >= 250) tier = 'silver';
                else tier = 'bronze';
                onSuperChat(superChatAmount, input.trim());
            }

            setMessages(prev => [...prev, {
                id: Date.now(),
                author: 'You',
                text: input.trim(),
                avatarColor: userInfo.color,
                initials: userInfo.initials,
                frame: activeFrame,
                badges: ['first_listen'],
                isSuperChat: isSuperChatActive,
                superChatAmount: isSuperChatActive ? superChatAmount : undefined,
                tier
            }]);
            setInput('');
            setIsSuperChatActive(false);
        }
    };

    return (
        <div className={`fixed top-16 bottom-24 right-0 w-full max-w-sm h-auto bg-gray-900/70 backdrop-blur-md rounded-l-lg shadow-2xl flex flex-col z-30 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <header className="p-2 border-b border-gray-700/50 flex items-center justify-between flex-shrink-0">
                <h3 className="text-sm font-semibold text-center text-cyan-300 pl-2">Listening Party</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition-colors" aria-label="Close chat">
                    <CloseIcon/>
                </button>
            </header>
            <div className="flex-grow p-2 overflow-y-auto">
                <ul className="space-y-2">
                    {messages.map(msg => {
                        if (msg.isDJ) {
                            return (
                                <li key={msg.id} className="text-center text-xs text-purple-300 italic my-2 animate-fade-in">
                                    <span>{msg.text}</span>
                                </li>
                            );
                        }
                        const isYou = msg.author === 'You';
                        
                        if (msg.isSuperChat) {
                            const tierColor = msg.tier === 'gold' ? 'bg-yellow-500/20 border-yellow-400' : msg.tier === 'silver' ? 'bg-gray-400/20 border-gray-300' : 'bg-orange-600/20 border-orange-500';
                            return (
                                <li key={msg.id} className="animate-fade-in my-3">
                                    <div className={`rounded-xl border shadow-lg overflow-hidden ${tierColor}`}>
                                        <div className="p-2 bg-black/30 flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-[10px] font-bold text-white" style={{backgroundColor: msg.avatarColor}}>{msg.initials}</div>
                                                <span className="font-bold text-xs text-white">{msg.author}</span>
                                            </div>
                                            <span className="font-mono text-xs font-bold text-yellow-400 flex items-center gap-1">
                                                {msg.superChatAmount} <StarIcon className="w-3 h-3"/>
                                            </span>
                                        </div>
                                        <div className="p-3 text-sm text-white font-semibold">
                                            {msg.text}
                                        </div>
                                    </div>
                                </li>
                            )
                        }

                        return (
                            <li key={msg.id} className={`text-sm animate-fade-in flex items-end gap-1.5 ${isYou ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div 
                                    className={`w-8 h-8 rounded-full flex-shrink-0 bg-gray-700 cursor-pointer relative flex items-center justify-center text-xs font-bold text-white ${activeFrame && isYou ? AVATAR_FRAMES.find(f=>f.id===activeFrame)?.cssClass : ''}`}
                                    onClick={() => onUserClick && onUserClick(msg.author)}
                                    style={{backgroundColor: msg.avatarColor}}
                                >
                                     {msg.initials}
                                </div>

                                <div className={`inline-block rounded-lg px-2 py-1 max-w-[85%] ${isYou ? 'bg-cyan-600/50' : 'bg-gray-800/50'}`}>
                                    <div className="flex items-center gap-1 mb-0.5">
                                        <span className={`block font-bold text-xs ${isYou ? 'text-cyan-200' : 'text-purple-300'}`}>{msg.author}</span>
                                        {msg.badges && (
                                            <div className="flex gap-0.5">
                                                {msg.badges.map(b => <BadgeIcon key={b} id={b} />)}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-gray-200">{msg.text}</span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
                <div ref={messagesEndRef} />
            </div>
             <div className="p-2 flex-shrink-0 bg-gray-800/40 rounded-b-lg border-t border-gray-700/50">
                {isSuperChatActive && (
                    <div className="p-3 bg-gray-900/80 rounded-lg mb-2 border border-yellow-500/50 animate-fade-in">
                         <div className="flex justify-between items-center mb-2">
                             <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">Super Chat</span>
                             <button onClick={() => setIsSuperChatActive(false)} className="text-gray-500 hover:text-white">&times;</button>
                         </div>
                         <div className="flex items-center gap-2">
                             {[100, 250, 500].map(amt => (
                                 <button 
                                    key={amt} 
                                    onClick={() => setSuperChatAmount(amt)}
                                    className={`flex-1 py-1 text-xs rounded border transition-all ${superChatAmount === amt ? 'bg-yellow-500 text-black border-yellow-400' : 'bg-gray-800 text-gray-400 border-gray-700'}`}
                                 >
                                     {amt}
                                 </button>
                             ))}
                         </div>
                    </div>
                )}
                <form onSubmit={handleSendMessage} className="flex gap-1.5">
                    <button 
                        type="button" 
                        onClick={() => setIsSuperChatActive(!isSuperChatActive)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isSuperChatActive ? 'bg-yellow-500 text-black scale-110' : 'bg-gray-800 text-yellow-500 hover:bg-gray-700'}`}
                        title="Send Super Chat"
                    >
                        <StarIcon className="w-5 h-5"/>
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isSuperChatActive ? "Super Chat message..." : "Say something..."}
                        className="flex-grow bg-gray-800/80 rounded-l-md py-1 px-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                    <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-sm px-3 rounded-r-md transition-colors">
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};