import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage, Station } from '../types';

interface ListeningPartyChatProps {
    station: Station;
    isOpen: boolean;
    onClose: () => void;
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


export const ListeningPartyChat: React.FC<ListeningPartyChatProps> = ({ station, isOpen, onClose }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    // Bot messages and welcome logic
    useEffect(() => {
        setMessages([{
            id: Date.now(),
            author: 'RadioBot',
            text: `Welcome to the Listening Party for ${station.name}!`,
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
    }, [station.name]);

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
        <div className={`fixed top-20 right-4 w-[90%] max-w-xs h-[calc(100vh-160px)] bg-gray-900/70 backdrop-blur-md rounded-lg shadow-2xl flex flex-col z-30 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-[calc(100%+2rem)]'}`}>
            <header className="p-2 border-b border-gray-700/50 flex items-center justify-between flex-shrink-0">
                <h3 className="text-sm font-semibold text-center text-cyan-300 pl-2">Listening Party</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition-colors" aria-label="Close chat">
                    <CloseIcon/>
                </button>
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
             <div className="p-2 flex-shrink-0">
                <p className="text-xs text-center text-gray-500 mb-1">(Chat is a simulation and not shared)</p>
                <form onSubmit={handleSendMessage} className="flex">
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
        </div>
    );
};
