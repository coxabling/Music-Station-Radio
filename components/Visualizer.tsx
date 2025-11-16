import React, { useRef, useEffect, useState } from 'react';
import type { PaletteName, ColorPalette } from '../types';

interface VisualizerProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

type VisualizationMode = 'bars' | 'waveform' | 'orbs';

const colorPalettes: Record<PaletteName, ColorPalette> = {
    neonSunset: ['#67e8f9', '#a855f7', '#ec4899'], // cyan-300, purple-500, pink-500
    coolOcean: ['#00F260', '#0575E6', '#00F260'], // Green to blue
    monochrome: ['#FFFFFF', '#AAAAAA', '#666666'], // White to grey
};

const PaletteIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm12 2H4v12h12V4zM6 6a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4zm10-6a2 2 0 10-4 0 2 2 0 004 0zM9 9a1 1 0 100 2 1 1 0 000-2zm4 0a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
    </svg>
);


// Drawing function for Bars
const drawBars = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, width: number, height: number, bufferLength: number, colors: ColorPalette) => {
    ctx.clearRect(0, 0, width, height);
    const barWidth = (width / bufferLength) * 1.5;
    let x = 0;

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.5, colors[1]);
    gradient.addColorStop(1, colors[2]);
    ctx.fillStyle = gradient;

    for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * height * 1.2;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
    }
};

// Drawing function for Waveform
const drawWaveform = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, width: number, height: number, colors: ColorPalette) => {
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 2;
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.5, colors[1]);
    gradient.addColorStop(1, colors[2]);
    ctx.strokeStyle = gradient;
    ctx.beginPath();

    const sliceWidth = width * 1.0 / dataArray.length;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * height / 2;
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        x += sliceWidth;
    }

    ctx.lineTo(width, height / 2);
    ctx.stroke();
};

// Drawing function for Orbs/Particles
const drawOrbs = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, width: number, height: number, bufferLength: number, colors: ColorPalette) => {
    ctx.clearRect(0, 0, width, height);

    const bass = dataArray.slice(0, Math.floor(bufferLength / 8)).reduce((a, b) => a + b, 0) / (bufferLength / 8);
    const mids = dataArray.slice(Math.floor(bufferLength / 8), Math.floor(bufferLength / 2)).reduce((a, b) => a + b, 0) / (bufferLength / 2 - bufferLength / 8);
    const highs = dataArray.slice(Math.floor(bufferLength / 2)).reduce((a, b) => a + b, 0) / (bufferLength / 2);

    // Center Orb (Bass) - Color 1
    const bassRadius = (bass / 255) * (height / 2.5);
    if (bassRadius > 0) {
        const bassGradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, bassRadius);
        bassGradient.addColorStop(0, `${colors[1]}66`); // 40% opacity
        bassGradient.addColorStop(1, `${colors[1]}00`); // 0% opacity
        ctx.fillStyle = bassGradient;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, bassRadius, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    // Side Orbs (Mids) - Color 0
    const midRadius = (mids / 255) * (height / 4);
    if (midRadius > 0) {
        const midGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, midRadius);
        midGradient.addColorStop(0, `${colors[0]}66`);
        midGradient.addColorStop(1, `${colors[0]}00`);
        ctx.fillStyle = midGradient;

        for (const trans of [width / 4, width * 3/4]) {
            ctx.save();
            ctx.translate(trans, height / 2);
            ctx.beginPath();
            ctx.arc(0, 0, midRadius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.restore();
        }
    }

    // Particles (Highs) - Color 2
    const highEffect = highs / 255;
    if (highEffect > 0.1) {
        for (let i = 0; i < highEffect * 50; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const radius = Math.random() * 2;
            const opacity = (Math.random() * highEffect * 0.7).toFixed(2);
            ctx.fillStyle = `${colors[2]}${Math.round(parseFloat(opacity) * 255).toString(16).padStart(2, '0')}`;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
};

export const Visualizer: React.FC<VisualizerProps> = ({ analyser, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>(0);
  const [mode, setMode] = useState<VisualizationMode>('bars');
  const [palette, setPalette] = useState<PaletteName>('neonSunset');
  const [isHovered, setIsHovered] = useState(false);

  const cycleMode = () => {
    setMode(prevMode => {
      const modes: VisualizationMode[] = ['bars', 'waveform', 'orbs'];
      const currentIndex = modes.indexOf(prevMode);
      return modes[(currentIndex + 1) % modes.length];
    });
  };
  
  const cyclePalette = (e: React.MouseEvent) => {
      e.stopPropagation();
      setPalette(prev => {
        const names = Object.keys(colorPalettes) as PaletteName[];
        const currentIndex = names.indexOf(prev);
        return names[(currentIndex + 1) % names.length];
      })
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyser) return;

    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const bufferLength = analyser.frequencyBinCount;
    const frequencyDataArray = new Uint8Array(bufferLength);
    const timeDomainDataArray = new Uint8Array(analyser.fftSize);
    const currentColors = colorPalettes[palette];

    const draw = () => {
      animationFrameId.current = requestAnimationFrame(draw);
      
      switch(mode) {
        case 'waveform':
          analyser.getByteTimeDomainData(timeDomainDataArray);
          drawWaveform(canvasCtx, timeDomainDataArray, canvas.width, canvas.height, currentColors);
          break;
        case 'orbs':
          analyser.getByteFrequencyData(frequencyDataArray);
          drawOrbs(canvasCtx, frequencyDataArray, canvas.width, canvas.height, bufferLength, currentColors);
          break;
        case 'bars':
        default:
          analyser.getByteFrequencyData(frequencyDataArray);
          drawBars(canvasCtx, frequencyDataArray, canvas.width, canvas.height, bufferLength, currentColors);
          break;
      }
    };
    
    if (isPlaying) {
      draw();
    } else {
      cancelAnimationFrame(animationFrameId.current);
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    }

    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [analyser, isPlaying, mode, palette]);

  const paletteDisplayName = {
      neonSunset: 'Neon Sunset',
      coolOcean: 'Cool Ocean',
      monochrome: 'Monochrome',
  }

  return (
    <div 
        className="relative cursor-pointer"
        onClick={cycleMode}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title="Click to change visualizer style"
    >
        <canvas ref={canvasRef} width="300" height="60" className="w-full max-w-xs rounded-md" />
        <div className={`absolute inset-0 flex items-center justify-center bg-black/50 rounded-md transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className='text-center'>
                <p className="text-xs font-semibold capitalize tracking-wider">{mode}</p>
                <div className="flex items-center justify-center gap-2 mt-1">
                    <button onClick={cyclePalette} className="p-1 rounded-full hover:bg-white/20" title="Change color palette">
                        <PaletteIcon/>
                    </button>
                    <p className="text-[10px] text-gray-300">{paletteDisplayName[palette]}</p>
                </div>
            </div>
        </div>
    </div>
  );
};
