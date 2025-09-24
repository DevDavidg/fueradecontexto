const CACHE_NAME = 'fueradecontexto-v1';
const STATIC_CACHE = 'fueradecontexto-static-v1';
const DYNAMIC_CACHE = 'fueradecontexto-dynamic-v1';

// Only cache essential assets that are guaranteed to exist
const STATIC_ASSETS = [
  '/',
];

// Check if we're in development mode
const isDevelopment = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';

const API_CACHE_PATTERNS = [
  /\/api\/products/,
  /\/api\/sections/,
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        // In development, be more lenient with caching
        if (isDevelopment) {
          return cache.add('/').catch(err => {
            console.warn('Failed to cache root in development:', err);
            return null;
          });
        }
        
        // In production, try to cache all static assets
        return Promise.allSettled(
          STATIC_ASSETS.map(asset => 
            cache.add(asset).catch(err => {
              console.warn(`Failed to cache ${asset}:`, err);
              return null;
            })
          )
        );
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // API requests - Network First with Cache Fallback
  if (API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached version if network fails
          return caches.match(request);
        })
    );
    return;
  }

  // Static assets - Cache First
  if (url.pathname.startsWith('/_next/static/') || 
      url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|webp|svg|ico)$/)) {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(request).then((response) => {
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(STATIC_CACHE).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return response;
          });
        })
    );
    return;
  }

  // HTML pages - Network First with Cache Fallback
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request)
            .then((response) => {
              if (response) {
                return response;
              }
              // Fallback to offline page
              return caches.match('/');
            });
        })
    );
    return;
  }

  // Default - Network First
  event.respondWith(
    fetch(request)
      .catch(() => {
        return caches.match(request);
      })
  );
});
