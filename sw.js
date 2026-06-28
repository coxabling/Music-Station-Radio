const CACHE_NAME = 'music-station-radio-shell-v1';
const ASSETS_CACHE_NAME = 'music-station-radio-assets-v1';
const STREAMS_CACHE_NAME = 'music-station-radio-streams-v1';

const STATIC_URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Poppins:wght@300;400;500;600&display=swap'
];

const DEFAULT_STREAMS = [
  'https://music-station.live/listen/high_grade_radio/radio.mp3',
  'https://music-station.live/listen/crw_radio/radio.mp3',
  'https://music-station.live/listen/namradio/radio.mp3',
  'https://music-station.live/listen/pamtengo_radio/radio.mp3',
  'https://music-station.live/listen/poweraceradio/radio.mp3'
];

// Self-contained tiny 1-second silent WAV as absolute offline backup
const OFFLINE_AUDIO_DATA_URI = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

function dataURIToResponse(dataURI, contentType = 'audio/wav') {
  try {
    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: contentType });
    return new Response(blob, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': blob.size.toString(),
        'Accept-Ranges': 'bytes'
      }
    });
  } catch (err) {
    return new Response('', { status: 404 });
  }
}

// Background utility to cache first 1MB of a radio stream without infinite blocking
function cacheStreamPreview(url) {
  fetch(new Request(url, { method: 'GET', mode: 'cors', credentials: 'omit' }))
    .then(response => {
      if (!response.ok && response.type !== 'opaque') {
        throw new Error(`HTTP status ${response.status}`);
      }
      
      // If CORS blocks reading body, store opaque response as a whole
      if (response.type === 'opaque') {
        caches.open(STREAMS_CACHE_NAME).then(cache => {
          cache.put(url, response);
          console.log(`[Service Worker] Cached opaque stream preview for: ${url}`);
        });
        return;
      }

      const reader = response.body.getReader();
      const chunks = [];
      let receivedLength = 0;
      const MAX_PREVIEW_BYTES = 1024 * 1024; // 1MB (roughly 30-45 seconds of audio buffer)

      function read() {
        return reader.read().then(({ done, value }) => {
          if (done) {
            return saveChunks(chunks, response.headers);
          }
          chunks.push(value);
          receivedLength += value.length;

          if (receivedLength >= MAX_PREVIEW_BYTES) {
            reader.cancel(); // Abort active endless download of the live radio stream
            return saveChunks(chunks, response.headers);
          }
          return read();
        });
      }

      function saveChunks(chunks, headers) {
        const blob = new Blob(chunks, { type: headers.get('Content-Type') || 'audio/mp3' });
        const cacheResponse = new Response(blob, {
          status: 200,
          headers: new Headers({
            'Content-Type': blob.type,
            'Content-Length': blob.size.toString(),
            'Accept-Ranges': 'bytes'
          })
        });
        caches.open(STREAMS_CACHE_NAME).then(cache => {
          cache.put(url, cacheResponse);
          console.log(`[Service Worker] Cached ${Math.round(blob.size / 1024)} KB offline stream preview for: ${url}`);
        });
      }

      return read();
    })
    .catch(err => {
      console.warn(`[Service Worker] Could not cache stream preview for ${url}:`, err);
    });
}

// Parse Range header parameters
function parseRange(rangeHeader, totalSize) {
  if (!rangeHeader) return null;
  const matches = rangeHeader.match(/bytes=(\d+)-(\d+)?/);
  if (!matches) return null;
  const start = parseInt(matches[1], 10);
  const end = matches[2] ? parseInt(matches[2], 10) : totalSize - 1;
  return { start, end };
}

// Handle HTML5 audio range/slice responses from cache
function handleRangeRequest(request, cachedResponse) {
  const rangeHeader = request.headers.get('Range');
  if (!rangeHeader) {
    return Promise.resolve(cachedResponse);
  }

  return cachedResponse.blob().then(blob => {
    const totalSize = blob.size;
    const range = parseRange(rangeHeader, totalSize);
    
    if (!range || range.start >= totalSize) {
      return new Response('', {
        status: 416,
        statusText: 'Range Not Satisfiable',
        headers: {
          'Content-Range': `bytes */${totalSize}`
        }
      });
    }

    const { start, end } = range;
    const chunk = blob.slice(start, end + 1);

    return new Response(chunk, {
      status: 206,
      statusText: 'Partial Content',
      headers: {
        'Content-Range': `bytes ${start}-${end}/${totalSize}`,
        'Content-Type': cachedResponse.headers.get('Content-Type') || 'audio/mp3',
        'Content-Length': chunk.size.toString(),
        'Accept-Ranges': 'bytes'
      }
    });
  });
}

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[Service Worker] Pre-caching Core App Shell');
      return cache.addAll(STATIC_URLS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (![CACHE_NAME, ASSETS_CACHE_NAME, STREAMS_CACHE_NAME].includes(cacheName)) {
              console.log('[Service Worker] Removing old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ]).then(() => {
      // Background trigger stream preview caching once active
      console.log('[Service Worker] Buffering radio stream offline previews in the background');
      DEFAULT_STREAMS.forEach(streamUrl => {
        cacheStreamPreview(streamUrl);
      });
    })
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 1. Radio Streams interceptor
  if (DEFAULT_STREAMS.includes(event.request.url) || url.pathname.endsWith('.mp3')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // If online, return real-time stream and update preview in the background
          if (response.ok) {
            // Trigger stream caching update in background
            cacheStreamPreview(event.request.url);
            return response;
          }
          throw new Error('Network error on stream fetch');
        })
        .catch(() => {
          console.log(`[Service Worker] Connection offline. Accessing cached backup for stream: ${event.request.url}`);
          return caches.match(event.request.url)
            .then(cachedResponse => {
              if (cachedResponse) {
                return handleRangeRequest(event.request, cachedResponse);
              }
              // If fully offline with no cached stream preview, play silent backup wave loop
              console.log('[Service Worker] No cached stream found. Serving offline silence buffer.');
              return handleRangeRequest(event.request, dataURIToResponse(OFFLINE_AUDIO_DATA_URI));
            });
        })
    );
    return;
  }

  // 2. Navigation request fallback (SPA index.html routing)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('/index.html') || caches.match('/');
        })
    );
    return;
  }

  // 3. Static Code and Local Application Files (Network First with Cache Fallback)
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  // 4. External assets: Images, fonts, stylesheets (Cache First with Network Fallback)
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then(response => {
            if (response && (response.status === 200 || response.type === 'opaque')) {
              const responseToCache = response.clone();
              caches.open(ASSETS_CACHE_NAME).then(cache => {
                cache.put(event.request, responseToCache);
              });
            }
            return response;
          })
          .catch(() => {
            // Return placeholder for failed external images
            if (event.request.destination === 'image') {
              return new Response(
                `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
                  <rect width="100%" height="100%" fill="#1f2937"/>
                  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-family="sans-serif" font-size="14">Offline Art</text>
                 </svg>`,
                { headers: { 'Content-Type': 'image/svg+xml' } }
              );
            }
          });
      })
  );
});
