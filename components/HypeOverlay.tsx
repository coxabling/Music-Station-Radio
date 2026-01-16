import React, { useEffect, useRef } from 'react';

interface HypeOverlayProps {
  isActive: boolean;
  isStorm?: boolean;
  onComplete: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  size: number;
  glow?: boolean;
}

export const HypeOverlay: React.FC<HypeOverlayProps> = ({ isActive, isStorm, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationIdRef = useRef<number>(0);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = isStorm 
        ? ['#facc15', '#fb923c', '#f87171', '#c084fc', '#67e8f9', '#ffffff', '#eab308']
        : ['#facc15', '#fb923c', '#f87171', '#c084fc', '#67e8f9'];
    
    const spawnParticles = () => {
        const particleCount = isStorm ? 10 : 200; // Small continuous drip if storm, or one big burst
        for (let i = 0; i < particleCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = isStorm ? Math.random() * 20 + 10 : Math.random() * 15 + 5;
          particlesRef.current.push({
            x: isStorm ? Math.random() * canvas.width : canvas.width / 2,
            y: isStorm ? -50 : canvas.height / 2,
            vx: isStorm ? (Math.random() - 0.5) * 5 : Math.cos(angle) * speed,
            vy: isStorm ? Math.random() * 15 + 5 : Math.sin(angle) * speed,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 1.0,
            size: Math.random() * (isStorm ? 12 : 8) + 2,
            glow: isStorm && Math.random() > 0.8
          });
        }
    };

    if (!isStorm) spawnParticles();

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // If storming, keep adding particles
      if (isStorm && Math.random() > 0.3) {
          spawnParticles();
      }

      particlesRef.current.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (!isStorm) {
            p.vy += 0.2; // Gravity for burst
            p.vx *= 0.98; // Friction for burst
        } else {
            p.vx += (Math.random() - 0.5) * 2; // Wind effect for storm
        }
        
        p.life -= isStorm ? 0.008 : 0.015; // Slower decay in storm
        
        if (p.life > 0) {
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          if (p.glow) {
              ctx.shadowBlur = 20;
              ctx.shadowColor = p.color;
          } else {
              ctx.shadowBlur = 0;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          particlesRef.current.splice(index, 1);
        }
      });

      if (isStorm || particlesRef.current.length > 0) {
        animationIdRef.current = requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationIdRef.current);
      particlesRef.current = [];
    };
  }, [isActive, isStorm, onComplete]);

  if (!isActive) return null;

  return (
    <canvas 
      ref={canvasRef} 
      className={`fixed inset-0 pointer-events-none ${isStorm ? 'z-[50] opacity-60' : 'z-[1000]'}`}
    />
  );
};
