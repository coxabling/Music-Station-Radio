// A simple algorithm to find the dominant color from an image URL.
// It uses a canvas to sample pixels and find the most frequent color bucket.

export const getDominantColor = (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    // Use a CORS proxy to prevent canvas tainting from cross-origin images.
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(imageUrl)}`;
    img.src = proxyUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const colorCounts: { [key: string]: number } = {};
      let maxCount = 0;
      let dominantColor = '#67e8f9'; // Default fallback color

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Skip very dark or very light colors to avoid black/white dominance
        if ((r > 240 && g > 240 && b > 240) || (r < 15 && g < 15 && b < 15)) {
            continue;
        }

        // Create a key by rounding colors to bucket them
        const colorKey = `${Math.round(r / 20) * 20},${Math.round(g / 20) * 20},${Math.round(b / 20) * 20}`;

        colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;

        if (colorCounts[colorKey] > maxCount) {
          maxCount = colorCounts[colorKey];
          const [dr, dg, db] = colorKey.split(',').map(Number);
          dominantColor = `rgb(${dr}, ${dg}, ${db})`;
        }
      }

      resolve(dominantColor);
    };

    img.onerror = (err) => {
      reject(err);
    };
  });
};