
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import type { PaletteName, ColorPalette } from '../types';

interface VisualizerProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

type VisualizationMode = 'bars' | 'waveform' | 'orbs' | 'tunnel' | 'landscape';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>(0);
  const [mode, setMode] = useState<VisualizationMode>('tunnel'); // Default to 3D Tunnel
  const [palette, setPalette] = useState<PaletteName>('neonSunset');
  const [isHovered, setIsHovered] = useState(false);
  
  // Three.js refs
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Mesh | THREE.LineSegments | null>(null);


  const cycleMode = () => {
    setMode(prevMode => {
      const modes: VisualizationMode[] = ['tunnel', 'landscape', 'bars', 'waveform', 'orbs'];
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

  // Cleanup Three.js on unmount
  useEffect(() => {
      return () => {
          if (rendererRef.current) {
              rendererRef.current.dispose();
              rendererRef.current = null;
          }
          if (sceneRef.current) {
              sceneRef.current.clear();
              sceneRef.current = null;
          }
      }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || !analyser) return;

    const isThreeMode = mode === 'tunnel' || mode === 'landscape';

    if (isThreeMode) {
        // Init Renderer if needed
        if (!rendererRef.current) {
            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(renderer.domElement);
            rendererRef.current = renderer;
        } else {
             rendererRef.current.domElement.style.display = 'block';
        }
        
        // Init Scene if needed
        if (!sceneRef.current) {
            sceneRef.current = new THREE.Scene();
        }

        // Reset scene content for new mode
        const scene = sceneRef.current;
        
        // Simple cleanup of previous meshes
        while(scene.children.length > 0){ 
             const obj = scene.children[0];
             if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
                 obj.geometry.dispose();
                 // Material might be shared, but disposing geometry is key
             }
             scene.remove(obj); 
        }
        meshRef.current = null;

        if (mode === 'tunnel') {
            const camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.1, 1000);
            camera.position.z = 40;
            cameraRef.current = camera;

            const geometry = new THREE.CylinderGeometry(5, 5, 50, 32, 16, true);
            const material = new THREE.MeshBasicMaterial({ 
                color: colorPalettes[palette][0], 
                wireframe: true,
                side: THREE.DoubleSide
            });
            const mesh = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), material);
            mesh.rotation.x = Math.PI / 2;
            scene.add(mesh);
            meshRef.current = mesh;

        } else if (mode === 'landscape') {
            const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
            camera.position.set(0, 15, 35);
            camera.lookAt(0, 0, 0);
            cameraRef.current = camera;

            // 32x32 segments = 33x33 vertices
            const geometry = new THREE.PlaneGeometry(80, 80, 32, 32);
            const material = new THREE.MeshBasicMaterial({
                color: colorPalettes[palette][0],
                wireframe: true,
                side: THREE.DoubleSide
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.rotation.x = -Math.PI / 2;
            scene.add(mesh);
            meshRef.current = mesh;
        }
        
        if (canvas) canvas.style.display = 'none';

    } else {
        // 2D Mode Setup
        if (rendererRef.current) {
            rendererRef.current.domElement.style.display = 'none';
        }
        if (canvas) {
            canvas.style.display = 'block';
        }
    }

    const bufferLength = analyser.frequencyBinCount;
    const frequencyDataArray = new Uint8Array(bufferLength);
    const timeDomainDataArray = new Uint8Array(analyser.fftSize);
    const currentColors = colorPalettes[palette];

    const draw = () => {
      animationFrameId.current = requestAnimationFrame(draw);
      
      if (mode === 'tunnel' && rendererRef.current && sceneRef.current && cameraRef.current && meshRef.current) {
          analyser.getByteFrequencyData(frequencyDataArray);
          const bass = frequencyDataArray.slice(0, 20).reduce((a,b)=>a+b,0) / 20;
          const scale = 1 + (bass / 255);
          
          meshRef.current.scale.set(scale, 1, scale);
          meshRef.current.rotation.y += 0.005 + (bass / 10000);
          // @ts-ignore
          if (meshRef.current.material && meshRef.current.material.color) {
               // @ts-ignore
               meshRef.current.material.color.setHSL((Date.now() % 5000) / 5000, 0.8, 0.5); 
          }
          
          rendererRef.current.render(sceneRef.current, cameraRef.current);
      
      } else if (mode === 'landscape' && rendererRef.current && sceneRef.current && cameraRef.current && meshRef.current) {
           analyser.getByteFrequencyData(frequencyDataArray);
           
           const mesh = meshRef.current as THREE.Mesh;
           const geometry = mesh.geometry;
           const positionAttribute = geometry.attributes.position;
           
           // Grid is 32x32 segments -> 33x33 vertices
           const segmentsW = 32;
           const segmentsH = 32;
           const widthVertices = segmentsW + 1;
           const heightVertices = segmentsH + 1;
           
           // Shift rows "down" (towards camera, or away depending on orientation)
           // Moving values from row i+1 to i effectively scrolls the terrain
           for (let y = 0; y < heightVertices - 1; y++) {
               for (let x = 0; x < widthVertices; x++) {
                   const currentIdx = (y * widthVertices + x) * 3;
                   const nextRowIdx = ((y + 1) * widthVertices + x) * 3;
                   // Copy Z value (height)
                   positionAttribute.array[currentIdx + 2] = positionAttribute.array[nextRowIdx + 2];
               }
           }
           
           // Set new data at the last row
           const lastRowY = heightVertices - 1;
           for (let x = 0; x < widthVertices; x++) {
               const index = (lastRowY * widthVertices + x) * 3;
               // Map X position to frequency bin
               const binIndex = Math.floor((x / widthVertices) * (bufferLength / 3)); // Use lower 3rd of spectrum for terrain
               const value = frequencyDataArray[binIndex] / 255.0;
               
               positionAttribute.array[index + 2] = value * 10; // Scale height
           }
           
           positionAttribute.needsUpdate = true;
           mesh.rotation.z += 0.002; // Slow spin
           
           // @ts-ignore
           if(mesh.material.color) mesh.material.color.setHSL((Date.now() % 8000) / 8000, 0.8, 0.5);

           rendererRef.current.render(sceneRef.current, cameraRef.current);

      } else if (canvas) {
          const canvasCtx = canvas.getContext('2d');
          if (canvasCtx) {
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
                  analyser.getByteFrequencyData(frequencyDataArray);
                  drawBars(canvasCtx, frequencyDataArray, canvas.width, canvas.height, bufferLength, currentColors);
                  break;
              }
          }
      }
    };
    
    if (isPlaying) {
      draw();
    } else {
      cancelAnimationFrame(animationFrameId.current);
      if (canvas) {
          const ctx = canvas.getContext('2d');
          if(ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
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
        ref={containerRef}
        className="relative cursor-pointer w-full max-w-xs h-[60px] rounded-md overflow-hidden"
        onClick={cycleMode}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title="Click to change visualizer style"
    >
        <canvas ref={canvasRef} width="300" height="60" className="w-full h-full" />
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
