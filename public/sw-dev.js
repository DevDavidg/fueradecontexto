// Development service worker - more lenient caching
const CACHE_NAME = 'fueradecontexto-dev-v1';

// Install event - minimal caching in development
self.addEventListener('install', (event) => {
  console.log('Development SW installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Only cache the root page in development
        return cache.add('/').catch(err => {
          console.warn('Failed to cache root in development:', err);
          return null;
        });
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Development SW activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - simple network-first strategy in development
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) {
    return;
  }

  // For development, always try network first
  event.respondWith(
    fetch(request)
      .catch(() => {
        // Only fallback to cache if network fails
        return caches.match(request);
      })
  );
});
