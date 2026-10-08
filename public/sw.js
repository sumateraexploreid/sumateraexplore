// Sujai Laketoba – Service Worker v2.0
// Strategy: cache-first for immutable assets, stale-while-revalidate for
// uploaded media, network-first for pages.

const CACHE_NAME = 'sujai-laketoba-v2';
const STATIC_ASSETS = [
    '/',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
];

// Install: pre-cache critical assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS).catch(() => {
                // Silently fail if some assets are unavailable during install
                return Promise.resolve();
            });
        })
    );
    self.skipWaiting();
});

// Activate: clean up old caches (bumping CACHE_NAME evicts stale media)
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests, admin routes and the API
    if (request.method !== 'GET') return;
    if (url.pathname.startsWith('/admin')) return;
    if (url.pathname.startsWith('/api')) return;

    // Navigation requests (HTML pages): network-first with an offline fallback.
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request).catch(async () => {
                const cached = await caches.match('/');
                return cached || new Response(
                    'Offline – Please check your internet connection.',
                    { headers: { 'Content-Type': 'text/plain' } }
                );
            })
        );
        return;
    }

    // Immutable assets (versioned build output, static icons): cache-first.
    if (url.pathname.startsWith('/icons/') || url.pathname.startsWith('/build/')) {
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) return cached;
                return fetch(request).then((response) => {
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                    }
                    return response;
                });
            })
        );
        return;
    }

    // Uploaded media (/storage): stale-while-revalidate. Serve the cached copy
    // for speed, but always refetch in the background so a replaced image
    // (same path, new content) is picked up on the next visit.
    if (url.pathname.startsWith('/storage/')) {
        event.respondWith(
            caches.match(request).then((cached) => {
                const network = fetch(request).then((response) => {
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                    }
                    return response;
                }).catch(() => cached);
                return cached || network;
            })
        );
    }
});
