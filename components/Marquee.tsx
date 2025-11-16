
import React, { useRef, useState, useEffect } from 'react';

interface MarqueeProps {
  text: string;
  className?: string;
}

export const Marquee: React.FC<MarqueeProps> = ({ text, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        setIsOverflowing(textRef.current.scrollWidth > containerRef.current.clientWidth);
      }
    };

    // Check on mount and on window resize
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    
    // Check again after a short delay to account for font loading, etc.
    const timeoutId = setTimeout(checkOverflow, 150);

    return () => {
      window.removeEventListener('resize', checkOverflow);
      clearTimeout(timeoutId);
    };
  }, [text]);

  if (!isOverflowing) {
    return (
      <div ref={containerRef} className={`w-full overflow-hidden whitespace-nowrap truncate ${className}`}>
        <span ref={textRef}>{text}</span>
      </div>
    );
  }

  // Set animation duration based on text length for a consistent speed
  const duration = text.length * 0.2;

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden whitespace-nowrap group ${className}`}
      style={{
        maskImage: 'linear-gradient(to right, transparent 0, black 5%, black 95%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0, black 5%, black 95%, transparent 100%)',
      }}
    >
      <div
        className="marquee-content inline-block whitespace-nowrap"
        style={{ animation: `marquee ${duration}s linear infinite` }}
      >
        <span className="pr-12">{text}</span>
        <span className="pr-12">{text}</span>
      </div>
    </div>
  );
};
