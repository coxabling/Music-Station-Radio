import React from 'react';

interface BrandLogoProps {
  variant?: 'horizontal' | 'iconOnly' | 'square' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  customWidth?: string;
  customHeight?: string;
  animated?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  customWidth,
  customHeight,
  animated = false,
  className = '',
}) => {
  // Size mappings
  const sizeClasses = {
    sm: { container: 'h-6', icon: 'w-6 h-6', text: 'text-xs tracking-wider' },
    md: { container: 'h-10', icon: 'w-10 h-10', text: 'text-sm md:text-base font-semibold tracking-widest' },
    lg: { container: 'h-16', icon: 'w-16 h-16', text: 'text-lg md:text-xl font-bold tracking-widest' },
    xl: { container: 'h-32', icon: 'w-32 h-32', text: 'text-2xl md:text-3xl font-black tracking-widest' },
    custom: { container: '', icon: '', text: '' },
  };

  const currentSize = sizeClasses[size];

  // Colors
  const electricBlue = '#00A8FF';
  const deepBlue = '#005BFF';
  const isLight = variant === 'light';

  const iconWidth = customWidth || (size === 'custom' ? '100%' : undefined);
  const iconHeight = customHeight || (size === 'custom' ? '100%' : undefined);

  // SVG Logo Icon Component
  const LogoIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      style={{
        width: iconWidth || (size === 'sm' ? '24px' : size === 'md' ? '40px' : size === 'lg' ? '64px' : size === 'xl' ? '128px' : '100%'),
        height: iconHeight || (size === 'sm' ? '24px' : size === 'md' ? '40px' : size === 'lg' ? '64px' : size === 'xl' ? '128px' : '100%'),
      }}
      className={`shrink-0 overflow-visible ${className}`}
    >
      <defs>
        {/* Glow Filters */}
        <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="glow-white" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        
        {/* Gradients */}
        <linearGradient id="brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={electricBlue} />
          <stop offset="100%" stopColor={deepBlue} />
        </linearGradient>
        <linearGradient id="wave-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={electricBlue} stopOpacity="0.8" />
          <stop offset="100%" stopColor={deepBlue} stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Background Sphere/Card for Square Variant */}
      {variant === 'square' && (
        <rect
          x="4"
          y="4"
          width="92"
          height="92"
          rx="24"
          fill="#030712"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1.5"
        />
      )}

      {/* Headphone Arch (Waveform integrated) */}
      <path
        d="M 20,50 A 30,30 0 0,1 80,50"
        fill="none"
        stroke="url(#brand-grad)"
        strokeWidth="6"
        strokeLinecap="round"
        style={{
          filter: 'url(#glow-blue)',
          transformOrigin: 'center',
          animation: animated ? 'msrPulse 3s ease-in-out infinite' : 'none'
        }}
      />

      {/* Left Headphone Cup */}
      <rect
        x="12"
        y="42"
        width="10"
        height="22"
        rx="5"
        fill="url(#brand-grad)"
        style={{
          filter: 'url(#glow-blue)',
          transformOrigin: '17px 53px',
          animation: animated ? 'msrBounce 1.5s ease-in-out infinite alternate' : 'none'
        }}
      />

      {/* Right Headphone Cup */}
      <rect
        x="78"
        y="42"
        width="10"
        height="22"
        rx="5"
        fill="url(#brand-grad)"
        style={{
          filter: 'url(#glow-blue)',
          transformOrigin: '83px 53px',
          animation: animated ? 'msrBounce 1.5s ease-in-out infinite alternate 0.4s' : 'none'
        }}
      />

      {/* Central Interactive Play Button Icon */}
      <polygon
        points="46,40 60,50 46,60"
        fill="#FFFFFF"
        style={{
          filter: 'url(#glow-white)',
          transformOrigin: '50px 50px',
          animation: animated ? 'msrSpinPlay 4s linear infinite' : 'none'
        }}
      />

      {/* Subtle Integrated Music Waveforms at the base */}
      <g opacity="0.85">
        <line
          x1="32"
          y1="75"
          x2="32"
          y2="65"
          stroke={electricBlue}
          strokeWidth="3.5"
          strokeLinecap="round"
        >
          {animated && (
            <animate
              attributeName="y2"
              values="65;55;70;65"
              dur="1.2s"
              repeatCount="indefinite"
            />
          )}
        </line>
        <line
          x1="41"
          y1="78"
          x2="41"
          y2="62"
          stroke={electricBlue}
          strokeWidth="3.5"
          strokeLinecap="round"
        >
          {animated && (
            <animate
              attributeName="y2"
              values="62;48;74;62"
              dur="0.8s"
              repeatCount="indefinite"
            />
          )}
        </line>
        <line
          x1="50"
          y1="80"
          x2="50"
          y2="58"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          style={{ filter: 'url(#glow-white)' }}
        >
          {animated && (
            <animate
              attributeName="y2"
              values="58;42;70;58"
              dur="1.5s"
              repeatCount="indefinite"
            />
          )}
        </line>
        <line
          x1="59"
          y1="78"
          x2="59"
          y2="62"
          stroke={deepBlue}
          strokeWidth="3.5"
          strokeLinecap="round"
        >
          {animated && (
            <animate
              attributeName="y2"
              values="62;50;72;62"
              dur="1s"
              repeatCount="indefinite"
            />
          )}
        </line>
        <line
          x1="68"
          y1="75"
          x2="68"
          y2="65"
          stroke={deepBlue}
          strokeWidth="3.5"
          strokeLinecap="round"
        >
          {animated && (
            <animate
              attributeName="y2"
              values="65;58;72;65"
              dur="1.4s"
              repeatCount="indefinite"
            />
          )}
        </line>
      </g>

      {/* Styled Embed Styles for custom keyframes animations */}
      <style>{`
        @keyframes msrPulse {
          0%, 100% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(1.03); opacity: 1; }
        }
        @keyframes msrBounce {
          0% { transform: scaleY(0.9) translateY(1px); }
          100% { transform: scaleY(1.1) translateY(-1px); }
        }
        @keyframes msrSpinPlay {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
      `}</style>
    </svg>
  );

  // Icon only or square doesn't render brand text
  if (variant === 'iconOnly' || variant === 'square') {
    return <LogoIcon />;
  }

  // Horizontal layout with logo icon + premium text branding
  return (
    <div className={`flex items-center gap-3 ${className} ${currentSize.container}`}>
      <LogoIcon />
      <div className="flex flex-col justify-center min-w-0">
        <h1
          className={`font-orbitron font-bold uppercase tracking-[0.18em] leading-none shrink-0 ${
            isLight ? 'text-black' : 'text-white'
          } ${
            size === 'sm'
              ? 'text-xs'
              : size === 'md'
              ? 'text-sm sm:text-base md:text-lg'
              : size === 'lg'
              ? 'text-xl sm:text-2xl md:text-3xl'
              : 'text-3xl sm:text-4xl md:text-5xl'
          }`}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A8FF] to-[#005BFF]">
            Music Station
          </span>
        </h1>
        <span
          className={`font-sans uppercase font-black tracking-[0.45em] text-[#00A8FF]/80 mt-1 leading-none shrink-0 ${
            size === 'sm'
              ? 'text-[6px]'
              : size === 'md'
              ? 'text-[8px] sm:text-[9px]'
              : size === 'lg'
              ? 'text-xs'
              : 'text-sm'
          }`}
        >
          Global Radio Network
        </span>
      </div>
    </div>
  );
};
