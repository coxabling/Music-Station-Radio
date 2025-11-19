
import React, { useEffect, useRef } from 'react';

interface WeatherOverlayProps {
    lat?: number;
    lng?: number;
}

export const WeatherOverlay: React.FC<WeatherOverlayProps> = ({ lat, lng }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    useEffect(() => {
        if (!lat || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles: {x: number, y: number, speed: number, length: number}[] = [];
        const count = 150;
        
        // Simple heuristic: Lat > 45 or < -45 might be snow, closer to 0 is rain if "raining". 
        // For demo purposes, we randomize based on station ID or lat effectively.
        // Using > 40 for snow for visual variety.
        const isSnow = Math.abs(lat) > 40;
        const type = isSnow ? 'snow' : 'rain';

        for(let i=0; i<count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                speed: Math.random() * 5 + 2,
                length: Math.random() * 20 + 10
            });
        }

        let animationId: number;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = isSnow ? 'rgba(255, 255, 255, 0.8)' : 'rgba(174, 194, 224, 0.5)';
            ctx.strokeStyle = 'rgba(174, 194, 224, 0.5)';
            ctx.lineWidth = 1;
            ctx.lineCap = 'round';

            particles.forEach(p => {
                p.y += p.speed;
                if (p.y > canvas.height) {
                    p.y = -20;
                    p.x = Math.random() * canvas.width;
                }

                if (type === 'rain') {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x, p.y + p.length);
                    ctx.stroke();
                } else {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, isSnow ? 2 : 1, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
            
            animationId = requestAnimationFrame(draw);
        };

        draw();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
        }
    }, [lat, lng]);

    if (!lat) return null;

    return (
        <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[1] opacity-30 mix-blend-screen" />
    );
};
