import React, { useEffect, useState } from 'react';
import { CollectorCard } from '../types';
import { getLegibleCaptionStyle } from '../utils/contrastDetector';

interface CardCaptionProps {
  card: CollectorCard;
  isDetailed?: boolean;
  children?: React.ReactNode;
}

export const CardCaption: React.FC<CardCaptionProps> = ({ card, isDetailed = false, children }) => {
  const { name = '', description = '', rarity = 'common' } = card;
  const [brandAccent, setBrandAccent] = useState('#00A8FF');

  // Detect dynamic brand accent color from document styles
  useEffect(() => {
    const updateAccent = () => {
      if (typeof window !== 'undefined') {
        const rootStyle = getComputedStyle(document.documentElement);
        const accent = rootStyle.getPropertyValue('--accent-color').trim();
        if (accent) {
          setBrandAccent(accent);
        }
      }
    };

    updateAccent();
    
    // Set up MutationObserver to listen to variable shifts on index.html/document
    const observer = new MutationObserver(updateAccent);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    return () => observer.disconnect();
  }, []);

  // Determine the theme category for the card's artwork/caption context
  const nameLower = name.toLowerCase();
  const descLower = description.toLowerCase();

  const isRadio =
    nameLower.includes('mic') ||
    nameLower.includes('tower') ||
    nameLower.includes('broadcast') ||
    nameLower.includes('on-air') ||
    descLower.includes('radio') ||
    descLower.includes('studio') ||
    descLower.includes('transmission') ||
    descLower.includes('live stream') ||
    descLower.includes('equalizer');

  const isAchievement =
    nameLower.includes('crown') ||
    nameLower.includes('medal') ||
    nameLower.includes('trophy') ||
    nameLower.includes('crystal') ||
    descLower.includes('pioneer') ||
    descLower.includes('award') ||
    descLower.includes('points') ||
    descLower.includes('hype');

  const isCultural =
    nameLower.includes('sunset') ||
    nameLower.includes('drums') ||
    nameLower.includes('shell') ||
    nameLower.includes('shaker') ||
    nameLower.includes('namib') ||
    nameLower.includes('savannah') ||
    descLower.includes('tribal') ||
    descLower.includes('traditional') ||
    descLower.includes('heritage') ||
    descLower.includes('kalahari') ||
    descLower.includes('okavango');

  let category: 'music' | 'radio' | 'achievement' | 'cultural' = 'music';
  if (isRadio) category = 'radio';
  else if (isAchievement) category = 'achievement';
  else if (isCultural) category = 'cultural';

  // Compute contrast optimal styling based on the artwork
  const contrastStyle = getLegibleCaptionStyle(rarity, category, brandAccent);

  if (isDetailed) {
    return (
      <div 
        style={contrastStyle.containerStyle}
        className="rounded-2xl p-4 text-center backdrop-blur-md relative z-10 border transition-all duration-300"
      >
        <h3 
          style={contrastStyle.titleStyle}
          className={`${contrastStyle.titleClassName} text-lg font-bold tracking-wide mb-1`}
        >
          {name}
        </h3>
        <p 
          style={contrastStyle.descriptionStyle}
          className={`${contrastStyle.descriptionClassName} text-xs mt-1 leading-relaxed line-clamp-2`}
        >
          {description}
        </p>
        
        {/* Shimmer hologram badge indicator matching calculated accent */}
        <div 
          style={{ 
            borderColor: `${brandAccent}33`, 
            backgroundColor: `${brandAccent}15`,
            color: brandAccent 
          }}
          className="mt-3 flex items-center justify-center gap-1.5 text-[9px] font-mono py-1 px-2.5 rounded-lg border max-w-max mx-auto font-bold uppercase tracking-wider"
        >
          <div style={{ backgroundColor: brandAccent }} className="w-1.5 h-1.5 rounded-full animate-pulse"></div>
          SECURE HOLOGRAM VERIFIED
        </div>
      </div>
    );
  }

  return (
    <div 
      style={contrastStyle.containerStyle}
      className="mt-auto backdrop-blur-md p-2.5 rounded-xl border text-center relative overflow-hidden transition-all duration-300"
    >
      <p 
        style={{ ...contrastStyle.titleStyle, fontSize: '11px' }}
        className={`${contrastStyle.titleClassName} font-bold leading-none mb-1`}
      >
        {name}
      </p>
      <p 
        style={{ ...contrastStyle.descriptionStyle, fontSize: '8px' }}
        className={`${contrastStyle.descriptionClassName} leading-tight line-clamp-1`}
      >
        {description}
      </p>
      {children}
    </div>
  );
};
