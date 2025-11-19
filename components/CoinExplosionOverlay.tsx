
import React, { useEffect, useRef } from 'react';

interface CoinExplosionProps {
  isActive: boolean;
  onComplete: () => void;
}

export const CoinExplosionOverlay: React.FC<CoinExplosionProps> = ({ isActive, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const coins: {x: number, y: number, vx: number, vy: number, r: number, color: string}[] = [];
    for (let i = 0; i < 100; i++) {
      coins.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 0.5) * 20 - 10,
        r: Math.random() * 10 + 5,
        color: '#FFD700'
      });
    }

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let stillMoving = false;
      coins.forEach(coin => {
        coin.x += coin.vx;
        coin.y += coin.vy;
        coin.vy += 0.5; // Gravity
        
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, coin.r, 0, Math.PI * 2);
        ctx.fillStyle = coin.color;
        ctx.fill();
        ctx.strokeStyle = '#DAA520';
        ctx.stroke();

        if (coin.y < canvas.height + 20) stillMoving = true;
      });

      frame++;
      if (stillMoving && frame < 300) {
        requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };

    animate();
  }, [isActive, onComplete]);

  if (!isActive) return null;
  return <canvas ref={canvasRef} className="fixed inset-0 z-[2000] pointer-events-none" />;
};
