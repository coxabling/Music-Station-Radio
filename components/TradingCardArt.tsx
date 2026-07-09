import React from 'react';
import { CollectorCard } from '../types';

interface TradingCardArtProps {
  card: CollectorCard;
  className?: string;
  isDetailed?: boolean;
}

export const TradingCardArt: React.FC<TradingCardArtProps> = ({
  card,
  className = '',
  isDetailed = false,
}) => {
  const { name = '', description = '', rarity = 'common' } = card;

  // Extract keywords to determine themes and symbols
  const nameLower = name.toLowerCase();
  const descLower = description.toLowerCase();

  const isMusic =
    nameLower.includes('vinyl') ||
    nameLower.includes('synth') ||
    nameLower.includes('head') ||
    nameLower.includes('speaker') ||
    nameLower.includes('sound') ||
    descLower.includes('audio') ||
    descLower.includes('music') ||
    descLower.includes('rhythm') ||
    descLower.includes('playback');

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

  // Assign a visual category for specific layout / backdrops
  let category: 'music' | 'radio' | 'achievement' | 'cultural' = 'music';
  if (isRadio) category = 'radio';
  else if (isAchievement) category = 'achievement';
  else if (isCultural) category = 'cultural';

  // Rarity styling maps
  const getRarityConfig = () => {
    switch (rarity) {
      case 'legendary':
        return {
          primaryColor: '#F59E0B', // Gold
          secondaryColor: '#EF4444', // Red-Orange
          accentColor: '#10B981', // Emerald highlights
          glowId: 'legendary-glow',
          gradientId: 'legendary-grad',
          particles: 12,
        };
      case 'epic':
        return {
          primaryColor: '#A855F7', // Purple
          secondaryColor: '#EC4899', // Pink
          accentColor: '#6366F1', // Indigo highlights
          glowId: 'epic-glow',
          gradientId: 'epic-grad',
          particles: 8,
        };
      case 'rare':
        return {
          primaryColor: '#00A8FF', // Electric Blue
          secondaryColor: '#005BFF', // Deep Blue
          accentColor: '#38BDF8', // Cyan highlights
          glowId: 'rare-glow',
          gradientId: 'rare-grad',
          particles: 4,
        };
      default:
        return {
          primaryColor: '#9CA3AF', // Gray
          secondaryColor: '#4B5563', // Dark Gray
          accentColor: '#D1D5DB', // Silver highlights
          glowId: 'common-glow',
          gradientId: 'common-grad',
          particles: 0,
        };
    }
  };

  const rarityConfig = getRarityConfig();

  // Create customized detailed vector motifs for rendering
  const renderCoreMotif = () => {
    // 1. Specific Card Matches
    if (nameLower.includes('vinyl')) {
      return (
        <g>
          {/* Vinyl Disc Body */}
          <circle cx="100" cy="100" r="55" fill="#111827" stroke="#374151" strokeWidth="1" />
          <circle cx="100" cy="100" r="50" fill="#030712" />
          {/* Grooves */}
          <circle cx="100" cy="100" r="45" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.75" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="35" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" strokeDasharray="10 4" />
          <circle cx="100" cy="100" r="30" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />
          {/* Label */}
          <circle cx="100" cy="100" r="18" fill="url(#motif-accent-grad)" />
          <circle cx="100" cy="100" r="5" fill="#030712" />
          {/* High gloss reflections */}
          <path d="M 64,64 L 136,136" stroke="rgba(255,255,255,0.12)" strokeWidth="8" strokeLinecap="round" opacity="0.6" />
          <path d="M 136,64 L 64,136" stroke="rgba(255,255,255,0.08)" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
          {/* Small Stylus Arm */}
          <path d="M 145,50 L 125,75 L 115,85" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="112" y="82" width="6" height="4" rx="1" fill="#D1D5DB" transform="rotate(45 115 84)" />
        </g>
      );
    }

    if (nameLower.includes('synth') || nameLower.includes('keyboard')) {
      return (
        <g transform="translate(10, 15) scale(0.9)">
          {/* Synthesizer Chassis */}
          <rect x="25" y="60" width="130" height="70" rx="6" fill="#1F2937" stroke="#4B5563" strokeWidth="2" />
          <rect x="30" y="65" width="120" height="30" rx="3" fill="#0B0F19" border="1px solid #374151" />
          
          {/* Synth Controls / Grid Screen */}
          <g opacity="0.8">
            <line x1="38" y1="72" x2="38" y2="88" stroke={rarityConfig.primaryColor} strokeWidth="1.5" />
            <line x1="46" y1="76" x2="46" y2="84" stroke={rarityConfig.primaryColor} strokeWidth="1.5" />
            <line x1="54" y1="70" x2="54" y2="90" stroke={rarityConfig.accentColor} strokeWidth="1.5" />
            
            <circle cx="75" cy="73" r="3" fill="#374151" stroke={rarityConfig.primaryColor} strokeWidth="0.75" />
            <circle cx="85" cy="73" r="3" fill="#374151" stroke={rarityConfig.primaryColor} strokeWidth="0.75" />
            
            {/* Holographic Sound Wave Screen */}
            <path d="M 100,80 Q 108,68 116,80 T 132,80 T 144,72" fill="none" stroke="#10B981" strokeWidth="1.5" />
          </g>

          {/* Synth Piano Keys */}
          <g transform="translate(30, 100)">
            {/* White Keys */}
            {Array.from({ length: 11 }).map((_, i) => (
              <rect key={`w-${i}`} x={i * 11} y="0" width="10" height="25" rx="1" fill="#F9FAFB" stroke="#9CA3AF" strokeWidth="0.5" />
            ))}
            {/* Black Keys */}
            {[2, 13, 24, 46, 57, 79, 90].map((x, i) => (
              <rect key={`b-${i}`} x={x} y="0" width="6" height="15" rx="0.5" fill="#111827" />
            ))}
          </g>
        </g>
      );
    }

    if (nameLower.includes('headset') || nameLower.includes('headphones')) {
      return (
        <g transform="scale(1.05) translate(-5, -5)">
          {/* Headband Arch */}
          <path d="M 55,100 A 45,45 0 0,1 145,100" fill="none" stroke="url(#motif-accent-grad)" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M 62,95 A 38,38 0 0,1 138,95" fill="none" stroke="#1F2937" strokeWidth="1.5" />
          
          {/* Metallic band extenders */}
          <line x1="55" y1="100" x2="55" y2="108" stroke="#9CA3AF" strokeWidth="3" />
          <line x1="145" y1="100" x2="145" y2="108" stroke="#9CA3AF" strokeWidth="3" />

          {/* Ear Cups */}
          <g>
            {/* Left Ear Cup */}
            <rect x="42" y="104" width="22" height="34" rx="8" fill="#111827" stroke="url(#motif-accent-grad)" strokeWidth="1.5" />
            <rect x="47" y="108" width="12" height="26" rx="4" fill="#1F2937" />
            
            {/* Right Ear Cup */}
            <rect x="136" y="104" width="22" height="34" rx="8" fill="#111827" stroke="url(#motif-accent-grad)" strokeWidth="1.5" />
            <rect x="141" y="108" width="12" height="26" rx="4" fill="#1F2937" />
          </g>

          {/* Sound waves leaking out */}
          <path d="M 28,115 A 15,15 0 0,1 28,127" fill="none" stroke={rarityConfig.primaryColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <path d="M 23,110 A 22,22 0 0,1 23,132" fill="none" stroke={rarityConfig.primaryColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
          
          <path d="M 172,115 A 15,15 0 0,0 172,127" fill="none" stroke={rarityConfig.primaryColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <path d="M 177,110 A 22,22 0 0,0 177,132" fill="none" stroke={rarityConfig.primaryColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
        </g>
      );
    }

    if (nameLower.includes('speaker') || nameLower.includes('boombox')) {
      return (
        <g transform="translate(5, 5) scale(0.95)">
          {/* Cabinet outline */}
          <rect x="35" y="55" width="120" height="90" rx="10" fill="#1F2937" stroke="#374151" strokeWidth="3" />
          {/* Subwoofer circle */}
          <circle cx="95" cy="110" r="30" fill="#111827" stroke="url(#motif-accent-grad)" strokeWidth="2.5" />
          <circle cx="95" cy="110" r="22" fill="#030712" />
          <circle cx="95" cy="110" r="10" fill="url(#motif-accent-grad)" />
          
          {/* Tweeter circle */}
          <circle cx="60" cy="78" r="12" fill="#111827" stroke="#4B5563" strokeWidth="1.5" />
          <circle cx="60" cy="78" r="6" fill="#030712" />
          
          <circle cx="130" cy="78" r="12" fill="#111827" stroke="#4B5563" strokeWidth="1.5" />
          <circle cx="130" cy="78" r="6" fill="#030712" />

          {/* Speaker grill mesh detail */}
          <line x1="35" y1="92" x2="155" y2="92" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" />
          
          {/* Sound waves blast */}
          <g opacity="0.45">
            <path d="M 95,65 A 45,45 0 0,0 50,110" fill="none" stroke={rarityConfig.primaryColor} strokeWidth="1" strokeDasharray="3 3" />
            <path d="M 140,110 A 45,45 0 0,0 95,65" fill="none" stroke={rarityConfig.primaryColor} strokeWidth="1" strokeDasharray="3 3" />
          </g>
        </g>
      );
    }

    if (nameLower.includes('mic') || nameLower.includes('microphone')) {
      return (
        <g transform="translate(10, 0) scale(0.9)">
          {/* Stand Pole */}
          <line x1="90" y1="130" x2="90" y2="180" stroke="#4B5563" strokeWidth="5" strokeLinecap="round" />
          
          {/* Shockmount / U-Shape Neck */}
          <path d="M 65,95 A 25,25 0 0,0 115,95" fill="none" stroke="#9CA3AF" strokeWidth="4" strokeLinecap="round" />
          <line x1="90" y1="120" x2="90" y2="135" stroke="#9CA3AF" strokeWidth="4.5" />
          
          {/* Microphone Body */}
          <rect x="74" y="60" width="32" height="50" rx="16" fill="url(#motif-accent-grad)" stroke="#111827" strokeWidth="2.5" />
          
          {/* Metal Mesh Grille */}
          <rect x="74" y="40" width="32" height="34" rx="12" fill="#374151" stroke="#9CA3AF" strokeWidth="1.5" />
          <path d="M 74,52 L 106,52 M 74,62 L 106,62 M 84,40 L 84,74 M 96,40 L 96,74" fill="none" stroke="#4B5563" strokeWidth="1" />
          
          {/* Studio Pop Filter ring */}
          <circle cx="90" cy="58" r="26" fill="none" stroke={rarityConfig.accentColor} strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
          
          {/* Recording active indicator */}
          <circle cx="90" cy="85" r="3" fill="#EF4444" />
        </g>
      );
    }

    if (nameLower.includes('tower')) {
      return (
        <g transform="scale(0.9) translate(10, 10)">
          {/* Sunset backing behind tower */}
          <circle cx="100" cy="120" r="35" fill="url(#cultural-sun-grad)" opacity="0.3" />

          {/* Tower steel beams */}
          <g stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round">
            {/* Left Pillar */}
            <line x1="75" y1="175" x2="95" y2="50" />
            {/* Right Pillar */}
            <line x1="125" y1="175" x2="105" y2="50" />
            {/* Horizontal struts */}
            <line x1="82" y1="140" x2="118" y2="140" />
            <line x1="88" y1="105" x2="112" y2="105" />
            <line x1="94" y1="70" x2="106" y2="70" />
            {/* Diagonal trusses */}
            <line x1="75" y1="175" x2="118" y2="140" />
            <line x1="125" y1="175" x2="82" y2="140" />
            <line x1="82" y1="140" x2="112" y2="105" />
            <line x1="118" y1="140" x2="88" y2="105" />
            <line x1="88" y1="105" x2="106" y2="70" />
            <line x1="112" y1="105" x2="94" y2="70" />
          </g>

          {/* Broadcaster node cap */}
          <circle cx="100" cy="45" r="7" fill="url(#motif-accent-grad)" />
          <circle cx="100" cy="45" r="2" fill="#FFFFFF" />

          {/* Radiating audio transmission waves */}
          <path d="M 90,35 A 15,15 0 0,1 110,35" fill="none" stroke={rarityConfig.primaryColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          <path d="M 82,27 A 26,26 0 0,1 118,27" fill="none" stroke={rarityConfig.primaryColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <path d="M 74,19 A 38,38 0 0,1 126,19" fill="none" stroke={rarityConfig.primaryColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
        </g>
      );
    }

    if (nameLower.includes('on-air') || nameLower.includes('sign')) {
      return (
        <g transform="translate(0, 15)">
          {/* Sign board casing */}
          <rect x="25" y="55" width="150" height="55" rx="5" fill="#111827" stroke="#374151" strokeWidth="2.5" />
          <rect x="30" y="60" width="140" height="45" rx="3" fill="#0B0F19" />
          
          {/* Outer glowing border */}
          <rect x="30" y="60" width="140" height="45" rx="3" fill="none" stroke="#EF4444" strokeWidth="1.5" opacity="0.4" />

          {/* Lettering */}
          <g fill="#EF4444" fontWeight="900" fontFamily="sans-serif" letterSpacing="6" transform="translate(42, 91)" fontSize="20" style={{ filter: 'drop-shadow(0px 0px 4px #EF4444)' }}>
            <text>ON AIR</text>
          </g>
          
          {/* Audio signals at sides */}
          <circle cx="15" cy="82" r="3" fill="#EF4444" />
          <circle cx="185" cy="82" r="3" fill="#EF4444" />
        </g>
      );
    }

    if (nameLower.includes('crown')) {
      return (
        <g transform="translate(15, 10) scale(0.85)">
          {/* Glowing back aura */}
          <circle cx="100" cy="110" r="45" fill="url(#motif-accent-grad)" opacity="0.15" filter="blur(10px)" />
          
          {/* Crown Base */}
          <path d="M 40,135 L 160,135 L 152,118 L 48,118 Z" fill="url(#motif-accent-grad)" stroke="#92400E" strokeWidth="1" />
          <rect x="52" y="122" width="96" height="8" rx="2" fill="#B45309" />
          
          {/* Jewels in base */}
          <circle cx="65" cy="126" r="2.5" fill="#EF4444" />
          <circle cx="82" cy="126" r="2.5" fill="#3B82F6" />
          <circle cx="100" cy="126" r="2.5" fill="#10B981" />
          <circle cx="118" cy="126" r="2.5" fill="#EC4899" />
          <circle cx="135" cy="126" r="2.5" fill="#EF4444" />

          {/* Crown Spikes */}
          <path d="M 48,118 L 40,70 L 72,100 L 100,50 L 128,100 L 160,70 L 152,118 Z" fill="url(#motif-accent-grad)" stroke="#92400E" strokeWidth="1.5" strokeLinejoin="round" />
          
          {/* Spikes Orbs */}
          <circle cx="40" cy="68" r="4" fill="#FFFFFF" stroke="#92400E" strokeWidth="1" />
          <circle cx="100" cy="48" r="5" fill="#FFFFFF" stroke="#92400E" strokeWidth="1" />
          <circle cx="160" cy="68" r="4" fill="#FFFFFF" stroke="#92400E" strokeWidth="1" />
          
          {/* Central emblem */}
          <polygon points="100,85 108,98 92,98" fill="#3B82F6" />
        </g>
      );
    }

    if (nameLower.includes('trophy')) {
      return (
        <g transform="translate(15, 10) scale(0.85)">
          {/* Pedestal base */}
          <rect x="70" y="145" width="60" height="20" rx="3" fill="#1F2937" stroke="#374151" strokeWidth="1.5" />
          <polygon points="80,145 120,145 110,132 90,132" fill="#4B5563" />
          
          {/* Stem */}
          <line x1="100" y1="132" x2="100" y2="105" stroke="url(#motif-accent-grad)" strokeWidth="8" />
          
          {/* Cup Bowl */}
          <path d="M 60,60 L 140,60 L 132,105 A 32,32 0 0,1 68,105 Z" fill="url(#motif-accent-grad)" stroke="#B45309" strokeWidth="1.5" />
          
          {/* Handles */}
          <path d="M 62,68 A 18,18 0 0,0 42,90 A 18,18 0 0,0 66,98" fill="none" stroke="url(#motif-accent-grad)" strokeWidth="3.5" />
          <path d="M 138,68 A 18,18 0 0,1 158,90 A 18,18 0 0,1 134,98" fill="none" stroke="url(#motif-accent-grad)" strokeWidth="3.5" />
          
          {/* Star engravings */}
          <path d="M 100,72 L 103,78 L 110,79 L 105,84 L 106,90 L 100,87 L 94,90 L 95,84 L 90,79 L 97,78 Z" fill="#FFFFFF" />
        </g>
      );
    }

    if (nameLower.includes('medal')) {
      return (
        <g transform="translate(20, 10) scale(0.8)">
          {/* Ribbons */}
          <polygon points="100,100 82,30 96,30" fill="#EF4444" />
          <polygon points="100,100 118,30 104,30" fill="#EF4444" />
          <polygon points="100,100 90,30 110,30" fill="#3B82F6" />
          
          {/* Medal Rim */}
          <circle cx="100" cy="115" r="32" fill="url(#motif-accent-grad)" stroke="#B45309" strokeWidth="2.5" />
          <circle cx="100" cy="115" r="26" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="4 2" opacity="0.7" />
          
          {/* Star Icon in Center */}
          <path d="M 100,102 L 104,111 L 114,112 L 106,119 L 108,128 L 100,123 L 92,128 L 94,119 L 86,112 L 96,111 Z" fill="#FFFFFF" />
        </g>
      );
    }

    if (nameLower.includes('sunset') || nameLower.includes('savannah')) {
      return (
        <g>
          {/* Sun disc back layer */}
          <circle cx="100" cy="110" r="44" fill="url(#cultural-sun-grad)" />
          
          {/* Landscape horizon / Ground dunes */}
          <path d="M 25,145 Q 65,130 110,140 T 175,145 L 175,175 L 25,175 Z" fill="#111827" />
          <path d="M 25,145 Q 65,130 110,140 T 175,145" fill="none" stroke="url(#motif-accent-grad)" strokeWidth="1" opacity="0.3" />

          {/* Acacia Tree silhouette */}
          <g fill="#030712">
            {/* Trunk */}
            <path d="M 125,142 L 123,115 Q 120,108 112,104 L 114,102 Q 124,106 128,114 Q 132,104 142,100 L 144,102 Q 134,106 130,116 L 129,142 Z" />
            {/* Left canopy nodes */}
            <ellipse cx="106" cy="101" rx="16" ry="4" />
            <ellipse cx="100" cy="98" rx="12" ry="3" />
            {/* Right canopy nodes */}
            <ellipse cx="145" cy="97" rx="18" ry="4" />
            <ellipse cx="150" cy="94" rx="12" ry="3.5" />
            {/* Center canopy */}
            <ellipse cx="126" cy="110" rx="12" ry="3" />
          </g>

          {/* Distant birds */}
          <path d="M 54,75 Q 58,71 62,75 Q 66,71 70,75" fill="none" stroke="#030712" strokeWidth="1.25" strokeLinecap="round" />
          <path d="M 76,66 Q 79,63 82,66 Q 85,63 88,66" fill="none" stroke="#030712" strokeWidth="1.05" strokeLinecap="round" />
        </g>
      );
    }

    if (nameLower.includes('drum')) {
      return (
        <g transform="translate(15, 0) scale(0.85)">
          {/* Left Drum */}
          <g transform="translate(45, 60)">
            {/* Body */}
            <path d="M 5,20 L 10,80 Q 25,100 40,80 L 45,20 Z" fill="#8B5A2B" stroke="#5C3A21" strokeWidth="2.5" />
            <path d="M 5,20 Q 25,32 45,20 L 45,25 Q 25,37 5,25 Z" fill="#D4A017" />
            
            {/* Drum head */}
            <ellipse cx="25" cy="20" rx="20" ry="6" fill="#F5E6C4" stroke="#5C3A21" strokeWidth="1.5" />
            
            {/* Traditional strings */}
            <line x1="6" y1="25" x2="12" y2="70" stroke="#E5E7EB" strokeWidth="1" />
            <line x1="44" y1="25" x2="38" y2="70" stroke="#E5E7EB" strokeWidth="1" />
            <line x1="25" y1="26" x2="25" y2="84" stroke="#E5E7EB" strokeWidth="1" />
          </g>

          {/* Right Drum */}
          <g transform="translate(95, 80) scale(0.85)">
            {/* Body */}
            <path d="M 5,20 L 10,80 Q 25,100 40,80 L 45,20 Z" fill="#A0522D" stroke="#5C3A21" strokeWidth="2.5" />
            <path d="M 5,20 Q 25,32 45,20 L 45,25 Q 25,37 5,25 Z" fill="#CD853F" />
            {/* Drum head */}
            <ellipse cx="25" cy="20" rx="20" ry="6" fill="#F5E6C4" stroke="#5C3A21" strokeWidth="1.5" />
          </g>
        </g>
      );
    }

    if (nameLower.includes('shell')) {
      return (
        <g transform="translate(20, 10) scale(0.8)">
          {/* Shell spiral body */}
          <path d="M 100,50 C 60,30 30,60 30,100 C 30,140 70,160 110,150 C 140,142 162,110 150,70 C 140,40 110,40 100,50 Z" fill="url(#cultural-sun-grad)" stroke="#B45309" strokeWidth="2" />
          <path d="M 100,50 C 80,45 60,60 60,90 C 60,115 85,130 110,120 Q 130,110 125,85" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
          <circle cx="100" cy="88" r="8" fill="#B45309" />
          
          {/* Sacred marks */}
          <line x1="45" y1="80" x2="52" y2="85" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <line x1="50" y1="110" x2="58" y2="112" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <line x1="72" y1="135" x2="78" y2="128" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        </g>
      );
    }

    // Default Fallbacks by category
    if (category === 'music') {
      return (
        <g transform="translate(5, 5) scale(0.95)">
          <circle cx="100" cy="100" r="42" fill="#111827" stroke="url(#motif-accent-grad)" strokeWidth="3" />
          {/* Sound wave path */}
          <path d="M 70,100 Q 80,75 90,100 T 110,100 T 130,100" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <circle cx="100" cy="100" r="10" fill="#030712" />
        </g>
      );
    } else if (category === 'radio') {
      return (
        <g transform="translate(10, 10) scale(0.9)">
          <rect x="65" y="55" width="50" height="70" rx="25" fill="#374151" stroke="url(#motif-accent-grad)" strokeWidth="3" />
          <line x1="90" y1="125" x2="90" y2="155" stroke="url(#motif-accent-grad)" strokeWidth="4.5" />
          <circle cx="90" cy="90" r="8" fill="#10B981" />
        </g>
      );
    } else if (category === 'achievement') {
      return (
        <g transform="translate(10, 10) scale(0.9)">
          <polygon points="100,45 120,85 165,85 130,115 145,155 100,130 55,155 70,115 35,85 80,85" fill="url(#motif-accent-grad)" stroke="#B45309" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="15" fill="rgba(255,255,255,0.25)" filter="blur(2px)" />
        </g>
      );
    } else {
      // cultural
      return (
        <g>
          <circle cx="100" cy="100" r="45" fill="url(#cultural-sun-grad)" />
          <path d="M 50,135 Q 100,110 150,135" fill="none" stroke="#030712" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="100" y1="55" x2="100" y2="145" stroke="#030712" strokeWidth="1.5" opacity="0.2" />
        </g>
      );
    }
  };

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full shrink-0 overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* 1. Master Glow Filters */}
          <filter id="legendary-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="epic-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="rare-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="common-glow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* 2. Rarity Ambient Background Gradients */}
          <radialGradient id="bg-aura" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor={rarityConfig.primaryColor} stopOpacity="0.22" />
            <stop offset="60%" stopColor={rarityConfig.secondaryColor} stopOpacity="0.04" />
            <stop offset="100%" stopColor="#030712" stopOpacity="0" />
          </radialGradient>

          {/* 3. Core Motif Accent Gradients */}
          <linearGradient id="motif-accent-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={rarityConfig.primaryColor} />
            <stop offset="50%" stopColor={rarityConfig.accentColor} />
            <stop offset="100%" stopColor={rarityConfig.secondaryColor} />
          </linearGradient>

          {/* 4. Special Cultural Savannah Sun Gradient */}
          <linearGradient id="cultural-sun-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F97316" /> {/* Warm Orange */}
            <stop offset="60%" stopColor="#EF4444" /> {/* Deep Red */}
            <stop offset="100%" stopColor="#FACC15" stopOpacity="0.1" /> {/* Gold bottom */}
          </linearGradient>

          {/* 5. Cyber Mesh Pattern for Backgrounds */}
          <pattern id="cyber-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="0.75" />
          </pattern>

          {/* 6. Traditional Tribal Chevron Pattern */}
          <pattern id="tribal-chevron" width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M 0 10 L 10 0 L 20 10 L 30 0 L 40 10" fill="none" stroke="rgba(245,158,11,0.025)" strokeWidth="1.25" />
            <path d="M 0 20 L 10 10 L 20 20 L 30 10 L 40 20" fill="none" stroke="rgba(245,158,11,0.015)" strokeWidth="1.25" />
          </pattern>
        </defs>

        {/* --- LAYER 1: BACKGROUND GRID / PATTERNS --- */}
        {/* Ambient background glow circle */}
        <circle cx="100" cy="100" r="90" fill="url(#bg-aura)" />

        {/* Pattern overlays */}
        {category === 'cultural' ? (
          <rect x="15" y="15" width="170" height="170" fill="url(#tribal-chevron)" rx="15" />
        ) : (
          <rect x="15" y="15" width="170" height="170" fill="url(#cyber-grid)" rx="15" />
        )}

        {/* Decorative Corner Alignment Vectors */}
        <g stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none" opacity="0.6">
          <path d="M 22,35 L 22,22 L 35,22" />
          <path d="M 178,35 L 178,22 L 165,22" />
          <path d="M 22,165 L 22,178 L 35,178" />
          <path d="M 178,165 L 178,178 L 165,178" />
        </g>

        {/* --- LAYER 2: INTERACTIVE/BACKGROUND WAVEFORMS & RADIALS --- */}
        {/* Live equalizers inside background */}
        {category === 'radio' && (
          <g opacity="0.08" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round">
            <line x1="30" y1="100" x2="30" y2="80" />
            <line x1="40" y1="100" x2="40" y2="70" />
            <line x1="50" y1="100" x2="50" y2="90" />
            <line x1="150" y1="100" x2="150" y2="85" />
            <line x1="160" y1="100" x2="160" y2="65" />
            <line x1="170" y1="100" x2="170" y2="75" />
          </g>
        )}

        {/* Music Soundwave background loops */}
        {category === 'music' && (
          <path
            d="M 25,100 C 45,90 65,110 85,100 C 105,90 125,110 145,100 C 165,90 185,100 185,100"
            fill="none"
            stroke={rarityConfig.primaryColor}
            strokeWidth="0.75"
            opacity="0.12"
          />
        )}

        {/* Achievement starburst radial lines */}
        {category === 'achievement' && (
          <g stroke="rgba(255,255,255,0.03)" strokeWidth="1" opacity="0.7">
            <line x1="100" y1="20" x2="100" y2="180" />
            <line x1="20" y1="100" x2="180" y2="100" />
            <line x1="43" y1="43" x2="157" y2="157" />
            <line x1="157" y1="43" x2="43" y2="157" />
          </g>
        )}

        {/* --- LAYER 3: CORE ILLUSTRATION GRAPHIC --- */}
        <g style={{ filter: `url(#${rarityConfig.glowId})` }}>
          {renderCoreMotif()}
        </g>

        {/* --- LAYER 4: PREMIUM EMBOSSED DETAILS & FLOATING ENERGY PARTICLES --- */}
        {/* Cinematic light beams (slow rotation/pulse via CSS, particularly for legendary) */}
        {rarity === 'legendary' && (
          <g opacity="0.12">
            <polygon points="100,100 40,0 80,0" fill="#FFFFFF" />
            <polygon points="100,100 120,0 160,0" fill="#FFFFFF" />
            <polygon points="100,100 0,60 0,100" fill="#FFFFFF" />
            <polygon points="100,100 200,120 200,160" fill="#FFFFFF" />
          </g>
        )}

        {/* Floating particles (Epic and Legendary) */}
        {rarityConfig.particles > 0 && (
          <g opacity="0.75">
            {Array.from({ length: rarityConfig.particles }).map((_, i) => {
              const seedX = (Math.sin(i * 1234.5) + 1) / 2; // pseudo-random
              const seedY = (Math.cos(i * 5678.9) + 1) / 2;
              const size = (Math.sin(i * 999) + 1.5) * 1.5;
              const posX = 30 + seedX * 140;
              const posY = 30 + seedY * 140;
              const animDur = 2 + (i % 3) * 1.5;
              const delay = -(i * 0.4);

              return (
                <circle
                  key={i}
                  cx={posX}
                  cy={posY}
                  r={size}
                  fill={i % 2 === 0 ? rarityConfig.accentColor : '#FFFFFF'}
                  style={{
                    animation: `cardHoloFloat ${animDur}s ease-in-out infinite alternate`,
                    animationDelay: `${delay}s`,
                    opacity: 0.4 + (i % 4) * 0.15,
                  }}
                />
              );
            })}
          </g>
        )}
      </svg>

      {/* Styled Embed Styles for custom float keyframes */}
      <style>{`
        @keyframes cardHoloFloat {
          0% { transform: translateY(0px) scale(0.9); opacity: 0.4; }
          100% { transform: translateY(-8px) scale(1.1); opacity: 0.9; }
        }
      `}</style>
    </div>
  );
};
