const CACHE_NAME = 'sujai-admin-cache-v1';
const OFFLINE_URL = '/admin/offline';

const urlsToCache = [
    OFFLINE_URL,
    '/icon-192.png',
    '/icon-512.png',
    // We don't cache many things because the admin panel is highly dynamic
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') return;
    
    // Only handle navigation requests or assets we explicitly care about
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match(OFFLINE_URL);
            })
        );
        return;
    }

    // For other requests (like images/css/js), use Network First, fallback to cache
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // If it's a valid response, optionally cache it (commented out to avoid aggressive caching)
                // return caches.open(CACHE_NAME).then(cache => {
                //     cache.put(event.request, response.clone());
                //     return response;
                // });
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});
