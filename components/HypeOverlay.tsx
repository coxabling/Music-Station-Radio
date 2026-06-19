import React, { useEffect, useRef } from 'react';

interface HypeOverlayProps {
  isActive: boolean;
  isStorm?: boolean;
  onComplete: () => void;
  clickPositions?: { x: number; y: number; id: number }[];
  onRemoveClickPosition?: (id: number) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  size: number;
  type: 'star' | 'note' | 'circle' | 'spark' | 'halo';
  angle?: number;
  rotationSpeed?: number;
  glow?: boolean;
}

const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number, color: string) => {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
};

const drawNote = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, scale: number) => {
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5 * scale;
  
  // Draw note head
  ctx.beginPath();
  ctx.ellipse(x, y, 4 * scale, 3 * scale, -Math.PI / 6, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw stem
  ctx.beginPath();
  ctx.moveTo(x + 3 * scale, y);
  ctx.lineTo(x + 3 * scale, y - 10 * scale);
  ctx.stroke();

  // Draw flag
  ctx.beginPath();
  ctx.moveTo(x + 3 * scale, y - 10 * scale);
  ctx.bezierCurveTo(x + 7 * scale, y - 8 * scale, x + 8 * scale, y - 5 * scale, x + 8 * scale, y - 2 * scale);
  ctx.bezierCurveTo(x + 8 * scale, y - 4 * scale, x + 6 * scale, y - 7 * scale, x + 3 * scale, y - 7 * scale);
  ctx.stroke();
};

export const HypeOverlay: React.FC<HypeOverlayProps> = ({ isActive, isStorm, onComplete, clickPositions = [], onRemoveClickPosition }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationIdRef = useRef<number>(0);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = isStorm 
        ? ['#facc15', '#fb923c', '#f87171', '#c084fc', '#38bdf8', '#86efac', '#ffffff', '#eab308']
        : ['#facc15', '#fb923c', '#ef4444', '#a855f7', '#06b6d4', '#10b981'];

    const spawnParticles = (x?: number, y?: number, customCount?: number) => {
        const particleCount = customCount || (isStorm ? 12 : 120);
        const originX = x !== undefined ? x : (isStorm ? Math.random() * canvas.width : canvas.width / 2);
        const originY = y !== undefined ? y : (isStorm ? -20 : canvas.height / 2);

        for (let i = 0; i < particleCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = isStorm 
            ? Math.random() * 8 + 4 
            : (x !== undefined ? Math.random() * 12 + 3 : Math.random() * 14 + 4);

          const types: ('star' | 'note' | 'circle' | 'spark' | 'halo')[] = isStorm
            ? ['circle', 'spark', 'halo', 'star']
            : ['circle', 'star', 'note', 'spark'];
          
          const type = types[Math.floor(Math.random() * types.length)];

          particlesRef.current.push({
            x: originX,
            y: originY,
            vx: isStorm ? (Math.random() - 0.5) * 4 : Math.cos(angle) * speed,
            vy: isStorm ? Math.random() * 10 + 4 : Math.sin(angle) * speed,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: Math.random() * 0.4 + 0.6, // random starting life for staggered decay
            size: Math.random() * (isStorm ? 10 : 7) + 2,
            type,
            angle: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1,
            glow: isStorm || Math.random() > 0.75
          });
        }
    };

    // If it's not a storm and no click points yet, trigger initial center burst
    if (!isStorm && clickPositions.length === 0) {
      spawnParticles();
    }

    // Process click-sourced position bursts
    clickPositions.forEach(pos => {
      // Create a nice localized explosion of particles from the button
      spawnParticles(pos.x, pos.y, 45);
      if (onRemoveClickPosition) {
        onRemoveClickPosition(pos.id);
      }
    });

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // If storm is active, generate ongoing sky drips
      if (isStorm && Math.random() > 0.25) {
          spawnParticles(undefined, undefined, 4);
      }

      particlesRef.current.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.angle !== undefined && p.rotationSpeed !== undefined) {
          p.angle += p.rotationSpeed;
        }

        if (!isStorm) {
            p.vy += 0.18; // Natural gravity curve
            p.vx *= 0.975; // Air friction
        } else {
            p.vx += Math.sin(p.y / 40) * 0.15; // Swirly wind drift in storm
        }
        
        p.life -= isStorm ? 0.007 : 0.015;

        if (p.life > 0) {
          ctx.save();
          ctx.globalAlpha = p.life;
          
          if (p.glow) {
            ctx.shadowBlur = p.size * 1.5;
            ctx.shadowColor = p.color;
          }

          if (p.type === 'star') {
            drawStar(ctx, p.x, p.y, 5, p.size, p.size / 2, p.color);
          } else if (p.type === 'note') {
            drawNote(ctx, p.x, p.y, p.color, p.size / 4);
          } else if (p.type === 'halo') {
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 2 * (2 - p.life), 0, Math.PI * 2);
            ctx.stroke();
          } else {
            // Circle/Spark
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
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
    };
  }, [isActive, isStorm, clickPositions, onComplete]);

  if (!isActive) return null;

  return (
    <canvas 
      ref={canvasRef} 
      className={`fixed inset-0 pointer-events-none ${isStorm ? 'z-[50] opacity-80' : 'z-[1000]'}`}
    />
  );
};
