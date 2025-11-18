
import React, { useState, useEffect } from 'react';

type Emoji = '❤️' | '🔥' | '👍';
type Reaction = {
  id: number;
  emoji: Emoji;
};

export const LiveReactions: React.FC = () => {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [counters, setCounters] = useState<Record<Emoji, number>>({
    '❤️': Math.floor(Math.random() * 50) + 10,
    '🔥': Math.floor(Math.random() * 40) + 5,
    '👍': Math.floor(Math.random() * 60) + 15,
  });

  // Simulate other users reacting
  useEffect(() => {
    const interval = setInterval(() => {
      setCounters(prev => {
        const newCounters = { ...prev };
        const emojiKeys = Object.keys(newCounters) as Emoji[];
        const randomEmoji = emojiKeys[Math.floor(Math.random() * emojiKeys.length)];
        if (Math.random() > 0.6) { // 40% chance to increment a counter
          newCounters[randomEmoji] += 1;
        }
        return newCounters;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleReact = (emoji: Emoji) => {
    const newReaction: Reaction = { id: Date.now(), emoji };
    setReactions(prev => [...prev, newReaction]);
    setCounters(prev => ({...prev, [emoji]: prev[emoji] + 1}));

    // Remove the reaction after animation
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 2000);
  };

  return (
    <div className="relative flex items-center justify-center space-x-4 h-10">
      {Object.entries(counters).map(([emoji, count]) => (
        <button
          key={emoji}
          onClick={() => handleReact(emoji as Emoji)}
          className="flex items-center space-x-2 bg-gray-700/50 hover:bg-gray-700/80 px-3 py-1.5 rounded-full transition-all duration-200 transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          aria-label={`React with ${emoji}`}
        >
          <span className="text-lg">{emoji}</span>
          <span className="text-xs font-mono text-gray-300 w-8 text-left">{count.toLocaleString()}</span>
        </button>
      ))}
      
      {/* Floating animations container */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-24 pointer-events-none">
        {reactions.map(reaction => (
          <span
            key={reaction.id}
            className="absolute text-3xl animate-float-up"
            style={{ 
                left: reaction.emoji === '❤️' ? '25%' : reaction.emoji === '🔥' ? '50%' : '75%',
                transform: 'translateX(-50%)',
            }}
          >
            {reaction.emoji}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) scale(1) translateX(-50%);
            opacity: 1;
          }
          100% {
            transform: translateY(-80px) scale(0.5) translateX(-50%);
            opacity: 0;
          }
        }
        .animate-float-up {
          animation: float-up 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};