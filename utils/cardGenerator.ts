import type { NowPlaying, Station } from '../types';
import { slugify } from './slugify';

// Helper to load an image and handle CORS
const loadImage = (src: string): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
});

// Helper to wrap text on the canvas
const wrapText = (context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(' ');
    let line = '';
    for(let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      }
      else {
        line = testLine;
      }
    }
    context.fillText(line, x, y);
}

export const generateSongCard = async (nowPlaying: NowPlaying, station: Station): Promise<string> => {
    const width = 500;
    const height = 600;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Could not get canvas context');
    }

    // Ensure fonts are loaded before drawing
    await document.fonts.load('700 36px Orbitron');
    await document.fonts.load('400 24px Poppins');

    // --- Image Loading ---
    const albumArtUrl = `https://corsproxy.io/?${encodeURIComponent(nowPlaying.albumArt || station.coverArt)}`;
    const stationUrl = `${window.location.origin}?station=${slugify(station.name)}`;
    const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(stationUrl)}&qzone=1&bgcolor=232323&color=ffffff`;
    
    let albumArtImg, qrCodeImg;
    try {
        [albumArtImg, qrCodeImg] = await Promise.all([loadImage(albumArtUrl), loadImage(qrCodeApiUrl)]);
    } catch(error) {
        console.error("Failed to load images for card generation:", error);
        // Fallback to a simple card if images fail
        albumArtImg = await loadImage(station.coverArt);
        qrCodeImg = await loadImage(qrCodeApiUrl);
    }
    

    // --- Drawing ---
    // 1. Background (Blurred Album Art)
    ctx.drawImage(albumArtImg, 0, 0, width, height);
    ctx.filter = 'blur(10px) brightness(0.4)';
    ctx.drawImage(canvas, 0, 0);
    ctx.filter = 'none';
    
    // 2. Main Album Art (Centered)
    const artSize = 300;
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 10;
    ctx.drawImage(albumArtImg, (width - artSize) / 2, 50, artSize, artSize);
    ctx.restore();

    // 3. Text Content
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    
    // Title
    ctx.font = '700 36px Orbitron';
    wrapText(ctx, nowPlaying.title || station.name, width / 2, 410, width - 60, 40);

    // Artist
    ctx.fillStyle = '#cccccc';
    ctx.font = '400 24px Poppins';
    wrapText(ctx, nowPlaying.artist || 'Live Stream', width / 2, 460, width - 60, 30);
    
    // Station Name
    ctx.fillStyle = '#888888';
    ctx.font = '600 16px Poppins';
    ctx.fillText(`on ${station.name}`, width / 2, 500);

    // 4. QR Code & Watermark
    ctx.drawImage(qrCodeImg, (width - 120) / 2, 520, 80, 80);
    ctx.font = 'bold 12px Orbitron';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText('SCAN TO TUNE IN', 100, 585);
    ctx.fillText('MUSIC STATION RADIO', width - 100, 585);
    
    return canvas.toDataURL('image/png');
};