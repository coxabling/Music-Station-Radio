
import React, { useEffect, useRef } from 'react';

interface HypeOverlayProps {
  isActive: boolean;
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
}

export const HypeOverlay: React.FC<HypeOverlayProps> = ({ isActive, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationIdRef = useRef<number>(0);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create explosion
    const colors = ['#facc15', '#fb923c', '#f87171', '#c084fc', '#67e8f9'];
    const particleCount = 200;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 15 + 5;
      particlesRef.current.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1.0,
        size: Math.random() * 8 + 2,
      });
    }

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // Gravity
        p.vx *= 0.98; // Friction
        p.life -= 0.015; // Decay
        
        if (p.life > 0) {
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          particlesRef.current.splice(index, 1);
        }
      });

      if (particlesRef.current.length > 0) {
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
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-[1000] pointer-events-none"
    />
  );
};
