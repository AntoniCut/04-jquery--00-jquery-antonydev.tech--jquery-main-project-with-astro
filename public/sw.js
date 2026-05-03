const STATIC_CACHE = 'jquery-antonydev-static-v2';
const RUNTIME_CACHE = 'jquery-antonydev-runtime-v2';

const PRECACHE_URLS = [
    '/',
    '/manifest.webmanifest',
    '/offline.html',
    '/assets/favicon/jquery-favicon.svg',
    '/manifest/jquery-logo-192x192.png',
    '/manifest/jquery-logo-512x512.png',
];

const putInCache = async (cacheName, request, response) => {
    if (!response || !response.ok) {
        return response;
    }

    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone());

    return response;
};

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(STATIC_CACHE)
            .then((cache) => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== STATIC_CACHE && cacheName !== RUNTIME_CACHE) {
                        return caches.delete(cacheName);
                    }

                    return undefined;
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;

    if (request.method !== 'GET') {
        return;
    }

    const requestUrl = new URL(request.url);

    if (requestUrl.origin !== self.location.origin) {
        return;
    }

    if (request.mode === 'navigate') {
        event.respondWith((async () => {
            try {
                const networkResponse = await fetch(request);
                return putInCache(RUNTIME_CACHE, request, networkResponse);
            } catch {
                const cachedResponse = await caches.match(request);

                if (cachedResponse) {
                    return cachedResponse;
                }

                return caches.match('/offline.html');
            }
        })());

        return;
    }

    const shouldRuntimeCache = [
        'style',
        'script',
        'font',
        'image',
        'manifest',
    ].includes(request.destination) || requestUrl.pathname.startsWith('/themes-jquery-ui/');

    if (!shouldRuntimeCache) {
        return;
    }

    event.respondWith((async () => {
        const cachedResponse = await caches.match(request);
        const networkPromise = fetch(request)
            .then((networkResponse) => putInCache(RUNTIME_CACHE, request, networkResponse))
            .catch(() => undefined);

        if (cachedResponse) {
            event.waitUntil(networkPromise);
            return cachedResponse;
        }

        const networkResponse = await networkPromise;

        if (networkResponse) {
            return networkResponse;
        }

        return caches.match(request);
    })());
});