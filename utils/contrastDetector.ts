/**
 * Dynamic Contrast Detection & Color Accessibility Utility
 * Helps maintain WCAG AA compliance (4.5:1 contrast ratio) for card captions.
 */

export interface ContrastStyle {
  textClassName: string;
  titleClassName: string;
  descriptionClassName: string;
  badgeClassName: string;
  containerBg: string;
  containerBorder: string;
  containerStyle?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  descriptionStyle?: React.CSSProperties;
}

export function parseColorToRgb(colorStr: string): { r: number; g: number; b: number } {
  // Check if hex format
  if (colorStr.startsWith('#')) {
    const hex = colorStr.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return { r: isNaN(r) ? 0 : r, g: isNaN(g) ? 0 : g, b: isNaN(b) ? 0 : b };
  }
  
  // Check if rgb/rgba format
  const rgbMatch = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10)
    };
  }

  // Fallback default
  return { r: 0, g: 168, b: 255 }; // Default brand color #00A8FF
}

export function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(v => {
    const normalized = v / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function calculateContrastRatio(lum1: number, lum2: number): number {
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Dynamically computes optimal legible style for card captions overlaying dynamic artwork.
 * Uses a contrast detection algorithm based on the card's theme, rarity, and current brand accent.
 */
export function getLegibleCaptionStyle(
  rarity: 'common' | 'rare' | 'epic' | 'legendary',
  category: 'music' | 'radio' | 'achievement' | 'cultural',
  currentBrandAccent: string = '#00A8FF'
): ContrastStyle {
  // 1. Resolve dominant background colors for each card variation
  let artColors: string[] = [];
  switch (rarity) {
    case 'legendary':
      artColors = ['#F59E0B', '#EF4444', '#10B981']; // Gold, red-orange, emerald
      break;
    case 'epic':
      artColors = ['#A855F7', '#EC4899', '#6366F1']; // Purple, pink, indigo
      break;
    case 'rare':
      artColors = ['#00A8FF', '#005BFF', '#38BDF8']; // Electric blue, deep blue, cyan
      break;
    default:
      artColors = ['#9CA3AF', '#4B5563', '#D1D5DB']; // Gray, dark-gray, silver
      break;
  }

  if (category === 'cultural') {
    artColors.push('#F97316', '#EF4444'); // Warm cultural sunset accents
  }

  // 2. Compute average luminance of the artwork elements
  const rgbs = artColors.map(c => parseColorToRgb(c));
  const lums = rgbs.map(rgb => getRelativeLuminance(rgb.r, rgb.g, rgb.b));
  const avgArtLuminance = lums.reduce((sum, l) => sum + l, 0) / lums.length;

  const brandRgb = parseColorToRgb(currentBrandAccent);
  const brandLuminance = getRelativeLuminance(brandRgb.r, brandRgb.g, brandRgb.b);

  // 3. Construct backdrop and text colors dynamically to satisfy >= 4.5:1 contrast
  // Since card overlays are styled with dark theme (brand guidelines),
  // we'll default to a high-contrast dark translucent glassplate background (e.g., bg-black with custom opacity).
  // If the artwork is exceptionally bright/luminous behind it, we'll dynamically increase the backdrop opacity to shield the text.
  let backdropOpacity = 0.85;
  if (avgArtLuminance > 0.4) {
    // Highly luminous background artwork: increase shielding opacity
    backdropOpacity = 0.92;
  } else if (avgArtLuminance < 0.1) {
    // Very dark artwork: we can have a lighter, more translucent glassplate
    backdropOpacity = 0.78;
  }

  // Calculate if the brand accent color has enough contrast against our dark backdrop (approx relative luminance 0.015 for black with given opacity)
  const backdropLuminance = 0.005; // extremely dark gray/black background
  const brandContrast = calculateContrastRatio(brandLuminance, backdropLuminance);

  let optimalTitleColor = currentBrandAccent;
  if (brandContrast < 4.5) {
    // If brand accent doesn't have enough contrast, we adjust it towards white or fallback to high contrast neon blue/cyan
    optimalTitleColor = '#38BDF8'; // High contrast cyan
  }

  // Generate dynamic styles
  return {
    textClassName: 'font-sans text-gray-200',
    titleClassName: 'font-orbitron font-bold tracking-wide uppercase',
    descriptionClassName: 'font-sans text-xs font-normal text-gray-300 leading-relaxed',
    badgeClassName: 'font-mono text-[9px] font-bold tracking-widest',
    containerBg: `rgba(3, 7, 18, ${backdropOpacity})`,
    containerBorder: rarity === 'legendary' 
      ? 'rgba(245, 158, 11, 0.4)' 
      : rarity === 'epic' 
      ? 'rgba(168, 85, 247, 0.4)' 
      : rarity === 'rare' 
      ? 'rgba(56, 189, 248, 0.4)' 
      : 'rgba(156, 163, 175, 0.3)',
    containerStyle: {
      backgroundColor: `rgba(3, 7, 18, ${backdropOpacity})`,
      backdropFilter: 'blur(12px)',
      borderWidth: '1px',
      borderColor: rarity === 'legendary' 
        ? 'rgba(245, 158, 11, 0.35)' 
        : rarity === 'epic' 
        ? 'rgba(168, 85, 247, 0.35)' 
        : rarity === 'rare' 
        ? 'rgba(56, 189, 248, 0.35)' 
        : 'rgba(156, 163, 175, 0.25)',
      boxShadow: rarity === 'legendary'
        ? '0 4px 20px rgba(245, 158, 11, 0.08)'
        : rarity === 'epic'
        ? '0 4px 20px rgba(168, 85, 247, 0.08)'
        : '0 4px 12px rgba(0, 0, 0, 0.5)',
    },
    titleStyle: {
      color: optimalTitleColor,
      fontFamily: "'Orbitron', sans-serif",
      letterSpacing: '0.05em',
      textShadow: `0 0 10px ${optimalTitleColor}33`,
    },
    descriptionStyle: {
      fontFamily: "'Poppins', sans-serif",
      color: '#D1D5DB', // high legibility slate-300
    }
  };
}
