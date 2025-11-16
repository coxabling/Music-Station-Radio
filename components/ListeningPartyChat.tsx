import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage } from '../types';

interface ListeningPartyChatProps {
    stationName: string;
}

const botMessages = [
    "This track is 🔥!",
    "Just tuned in, what a vibe.",
    "Anyone know who sings this?",
    "Turn it up! 🔊",
    "Loving this station choice.",
    "This reminds me of summer '09.",
];

export const ListeningPartyChat: React.FC<ListeningPartyChatProps> = ({ stationName }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    // Initial bot message
    useEffect(() => {
        setMessages([{
            id: Date.now(),
            author: 'RadioBot',
            text: `Welcome to the Listening Party for ${stationName}!`,
            isBot: true,
        }]);

        // Simulate other users chatting
        const interval = setInterval(() => {
            setMessages(prev => [...prev, {
                id: Date.now(),
                author: 'Guest' + Math.floor(Math.random() * 100),
                text: botMessages[Math.floor(Math.random() * botMessages.length)],
                isBot: true
            }]);
        }, 8000 + Math.random() * 5000); // every 8-13 seconds

        return () => clearInterval(interval);
    }, [stationName]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            setMessages(prev => [...prev, {
                id: Date.now(),
                author: 'You',
                text: input.trim(),
            }]);
            setInput('');
        }
    };

    return (
        <div className="fixed bottom-28 md:bottom-40 left-1/2 -translate-x-1/2 w-[90%] max-w-sm h-64 bg-gray-900/70 backdrop-blur-md rounded-lg shadow-2xl flex flex-col z-40 animate-fade-in">
            <header className="p-2 border-b border-gray-700/50">
                <h3 className="text-sm font-semibold text-center text-cyan-300">Listening Party Chat</h3>
                <p className="text-xs text-center text-gray-500">(Chat is a simulation and not shared)</p>
            </header>
            <div className="flex-grow p-2 overflow-y-auto">
                <ul className="space-y-2">
                    {messages.map(msg => (
                        <li key={msg.id} className={`text-sm animate-fade-in ${msg.author === 'You' ? 'text-right' : 'text-left'}`}>
                            <div className={`inline-block rounded-lg px-2 py-1 ${
                                msg.author === 'You' ? 'bg-cyan-600/50' :
                                msg.isBot ? 'bg-gray-700/50' : ''
                            }`}>
                                <span className={`block font-bold text-xs ${msg.author === 'You' ? 'text-cyan-200' : 'text-purple-300'}`}>
                                    {msg.author}
                                </span>
                                <span className="text-gray-200">{msg.text}</span>
                            </div>
                        </li>
                    ))}
                </ul>
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-2 border-t border-gray-700/50 flex">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Say something..."
                    className="flex-grow bg-gray-800/80 rounded-l-md py-1 px-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
                <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-sm px-3 rounded-r-md transition-colors">
                    Send
                </button>
            </form>
        </div>
    );
};
