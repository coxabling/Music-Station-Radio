
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import type { PaletteName, ColorPalette } from '../types';

interface VisualizerProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

type VisualizationMode = 'bars' | 'waveform' | 'orbs' | 'tunnel' | 'landscape';

const colorPalettes: Record<PaletteName, ColorPalette> = {
    neonSunset: ['#67e8f9', '#a855f7', '#ec4899'], 
    coolOcean: ['#00F260', '#0575E6', '#00F260'], 
    monochrome: ['#FFFFFF', '#AAAAAA', '#666666'], 
};

const PaletteIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm12 2H4v12h12V4zM6 6a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4zm10-6a2 2 0 10-4 0 2 2 0 004 0zM9 9a1 1 0 100 2 1 1 0 000-2zm4 0a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" /></svg>
);

const PiPIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
);

export const Visualizer: React.FC<VisualizerProps> = ({ analyser, isPlaying }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>(0);
  const [mode, setMode] = useState<VisualizationMode>('tunnel'); 
  const [palette, setPalette] = useState<PaletteName>('neonSunset');
  const [isHovered, setIsHovered] = useState(false);
  
  // Three.js refs
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Mesh | THREE.LineSegments | null>(null);
  
  // PiP Video Element
  const pipVideoRef = useRef<HTMLVideoElement>(document.createElement('video'));

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
  };

  const togglePiP = async (e: React.MouseEvent) => {
      e.stopPropagation();
      const canvas = rendererRef.current?.domElement || canvasRef.current;
      if (!canvas) return;

      try {
          if (document.pictureInPictureElement) {
              await document.exitPictureInPicture();
          } else {
              const stream = canvas.captureStream();
              pipVideoRef.current.srcObject = stream;
              pipVideoRef.current.play();
              await pipVideoRef.current.requestPictureInPicture();
          }
      } catch(err) {
          console.error("PiP failed", err);
      }
  }

  // Handle resizing
  useEffect(() => {
    const handleResize = () => {
        if (containerRef.current && rendererRef.current && cameraRef.current) {
            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;
            rendererRef.current.setSize(width, height);
            cameraRef.current.aspect = width / height;
            cameraRef.current.updateProjectionMatrix();
        }
        if (containerRef.current && canvasRef.current) {
            canvasRef.current.width = containerRef.current.clientWidth;
            canvasRef.current.height = containerRef.current.clientHeight;
        }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [mode]);

  // Three.js Setup & Loop
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || !analyser) return;

    const isThreeMode = mode === 'tunnel' || mode === 'landscape';

    if (isThreeMode) {
        if (!rendererRef.current) {
            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true }); // preserveDrawingBuffer for stream capture
            renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(renderer.domElement);
            rendererRef.current = renderer;
        } else {
             rendererRef.current.domElement.style.display = 'block';
        }
        
        if (!sceneRef.current) {
            sceneRef.current = new THREE.Scene();
        }
        const scene = sceneRef.current;
        while(scene.children.length > 0){ 
             const obj = scene.children[0];
             // @ts-ignore
             if (obj.geometry) obj.geometry.dispose();
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
            const geometry = new THREE.PlaneGeometry(80, 80, 32, 32);
            const material = new THREE.MeshBasicMaterial({ color: colorPalettes[palette][0], wireframe: true, side: THREE.DoubleSide });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.rotation.x = -Math.PI / 2;
            scene.add(mesh);
            meshRef.current = mesh;
        }
        if (canvas) canvas.style.display = 'none';
    } else {
        if (rendererRef.current) rendererRef.current.domElement.style.display = 'none';
        if (canvas) {
            canvas.style.display = 'block';
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        }
    }

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const timeDomainArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameId.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      analyser.getByteTimeDomainData(timeDomainArray);

      if (isThreeMode && rendererRef.current && sceneRef.current && cameraRef.current && meshRef.current) {
           const bass = dataArray[10]; // simplified
           if (mode === 'tunnel') {
               meshRef.current.scale.set(1 + bass/400, 1, 1 + bass/400); // reduced scale factor for subtle expansion
               meshRef.current.rotation.y += 0.003 + bass/10000;
           } else if (mode === 'landscape' && meshRef.current instanceof THREE.Mesh) {
               // Soft rotation or movement
               meshRef.current.rotation.z += 0.001;
           }
           rendererRef.current.render(sceneRef.current, cameraRef.current);
      } else if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              
              const primaryColor = colorPalettes[palette][0];
              const secondaryColor = colorPalettes[palette][1] || colorPalettes[palette][0];

              if (mode === 'bars') {
                  // Beautiful, modern, symmetric rounded-cap visualizer
                  const numBars = 28;
                  const padding = 3;
                  const totalPadding = padding * (numBars - 1);
                  const barWidth = (canvas.width - totalPadding) / numBars;
                  const step = Math.floor(bufferLength / numBars);
                  
                  const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
                  gradient.addColorStop(0, primaryColor + '22'); // highly subtle glow tail
                  gradient.addColorStop(0.5, secondaryColor + '88');
                  gradient.addColorStop(1, primaryColor + 'dd'); // elegant solid peaks

                  ctx.fillStyle = gradient;
                  
                  for (let i = 0; i < numBars; i++) {
                      const dataIndex = Math.min(i * step, bufferLength - 1);
                      // Apply logarithmic scaling or simple dampening for subtle motion
                      const val = dataArray[dataIndex];
                      const barHeight = Math.max(2, (val / 255) * canvas.height * 0.8);
                      const x = i * (barWidth + padding);
                      const y = canvas.height - barHeight;

                      ctx.beginPath();
                      if (ctx.roundRect) {
                          ctx.roundRect(x, y, barWidth, barHeight, [barWidth / 2, barWidth / 2, 0, 0]);
                      } else {
                          ctx.rect(x, y, barWidth, barHeight);
                      }
                      ctx.fill();
                  }
              } else if (mode === 'waveform') {
                  // Elegant, ultra-subtle glowing neon string oscilloscope
                  ctx.beginPath();
                  ctx.lineWidth = 1.75;
                  
                  const waveGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
                  waveGradient.addColorStop(0, primaryColor + '44');
                  waveGradient.addColorStop(0.5, secondaryColor + 'dd');
                  waveGradient.addColorStop(1, primaryColor + '44');
                  
                  ctx.strokeStyle = waveGradient;
                  ctx.shadowBlur = 4;
                  ctx.shadowColor = secondaryColor;
                  
                  const sliceWidth = canvas.width / bufferLength;
                  let x = 0;
                  
                  for (let i = 0; i < bufferLength; i++) {
                      const v = timeDomainArray[i] / 128.0;
                      const y = (v * canvas.height) / 2;
                      
                      if (i === 0) {
                          ctx.moveTo(x, y);
                      } else {
                          ctx.lineTo(x, y);
                      }
                      x += sliceWidth;
                  }
                  
                  ctx.stroke();
                  ctx.shadowBlur = 0; // Reset canvas shadows
              } else if (mode === 'orbs') {
                  // Soft, glowing breathing aura
                  let sum = 0;
                  const sampleCount = Math.min(64, bufferLength);
                  for (let i = 0; i < sampleCount; i++) {
                      sum += dataArray[i];
                  }
                  const average = sum / sampleCount;
                  
                  // Breathe radius based on audio intensity
                  const maxRadius = Math.min(canvas.width, canvas.height) * 0.45;
                  const baseRadius = maxRadius * 0.35;
                  const radius = baseRadius + (average / 255) * (maxRadius - baseRadius);
                  
                  const centerX = canvas.width / 2;
                  const centerY = canvas.height / 2;
                  
                  // Subtly diffuse radial gradient background
                  const glowGrad = ctx.createRadialGradient(centerX, centerY, radius * 0.2, centerX, centerY, radius * 1.8);
                  glowGrad.addColorStop(0, primaryColor + '66');
                  glowGrad.addColorStop(0.4, secondaryColor + '22');
                  glowGrad.addColorStop(1, 'transparent');
                  
                  ctx.fillStyle = glowGrad;
                  ctx.beginPath();
                  ctx.arc(centerX, centerY, radius * 2, 0, Math.PI * 2);
                  ctx.fill();
                  
                  // Central neon orb core
                  const coreGrad = ctx.createRadialGradient(centerX, centerY, 1, centerX, centerY, radius);
                  coreGrad.addColorStop(0, '#ffffff');
                  coreGrad.addColorStop(0.3, primaryColor + 'ee');
                  coreGrad.addColorStop(1, secondaryColor + '00');
                  
                  ctx.fillStyle = coreGrad;
                  ctx.beginPath();
                  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                  ctx.fill();
              }
          }
      }
    };
    
    if (isPlaying) draw();
    else cancelAnimationFrame(animationFrameId.current);
    return () => cancelAnimationFrame(animationFrameId.current);
  }, [analyser, isPlaying, mode, palette]);

  return (
    <div ref={containerRef} className="relative cursor-pointer w-full h-full rounded-xl overflow-hidden group bg-black/15 border border-white/5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] backdrop-blur-md" onClick={cycleMode} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <canvas ref={canvasRef} className="w-full h-full block" />
        <div className={`absolute inset-0 flex items-center justify-center bg-black/70 rounded-xl transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className='text-center'>
                <p className="text-[10px] font-bold capitalize tracking-widest text-white/90">{mode} view</p>
                <div className="flex items-center justify-center gap-3 mt-1.5">
                    <button onClick={cyclePalette} className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors" title="Change Palette"><PaletteIcon/></button>
                    <button onClick={togglePiP} className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors" title="Picture-in-Picture"><PiPIcon/></button>
                </div>
            </div>
        </div>
    </div>
  );
};