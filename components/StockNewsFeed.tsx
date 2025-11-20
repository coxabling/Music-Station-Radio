import React, { useEffect, useRef } from 'react';
import type { StockNewsEvent } from '../types';
import { formatTimeAgo } from '../utils/time';

interface StockNewsFeedProps {
  news: StockNewsEvent[];
}

export const StockNewsFeed: React.FC<StockNewsFeedProps> = ({ news }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || news.length === 0) return;

    let scrollAmount = 0;
    let animationFrameId: number;
    let isPaused = false;

    const scrollNews = () => {
      if (isPaused) {
        animationFrameId = requestAnimationFrame(scrollNews);
        return;
      }
      scrollAmount += 0.5; // Adjust scroll speed here
      if (scrollAmount >= container.scrollHeight - container.clientHeight + 10) {
        // Reset scroll when it reaches the bottom, with a small delay for smoother loop
        scrollAmount = 0;
      }
      container.scrollTop = scrollAmount;
      animationFrameId = requestAnimationFrame(scrollNews);
    };

    animationFrameId = requestAnimationFrame(scrollNews);

    const handleMouseEnter = () => { isPaused = true; };
    const handleMouseLeave = () => { isPaused = false; };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [news]);

  if (news.length === 0) {
    return (
      <div className="bg-gray-900/50 p-4 rounded-lg text-center text-sm text-gray-500">
        No recent market news.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50 h-32 overflow-hidden relative cursor-pointer group custom-scrollbar-sm"
    >
      {news.map((item) => {
        const textColor = item.sentiment === 'positive' ? 'text-green-400' : item.sentiment === 'negative' ? 'text-red-400' : 'text-gray-300';
        return (
          <div key={item.id} className="mb-3 last:mb-0 text-sm">
            <p className={textColor}>{item.text}</p>
            <p className="text-xs text-gray-500 mt-0.5">{item.symbol} - {formatTimeAgo(item.timestamp)}</p>
          </div>
        );
      })}
    </div>
  );
};