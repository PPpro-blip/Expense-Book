/* Expense Tracker Pro — offline app shell */
const CACHE_NAME = 'expense-tracker-pro-v3';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './assets/icon.svg',
  './assets/icon-192.png',
  './assets/icon-512.png'
];

// The app currently uses these small browser-side UI libraries. They are warmed
// opportunistically: a CDN outage must never stop the service worker installing.
const OPTIONAL_REMOTE_ASSETS = [
  'https://cdn.tailwindcss.com/',
  'https://unpkg.com/lucide@latest'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL);

    await Promise.all(OPTIONAL_REMOTE_ASSETS.map(async (url) => {
      try {
        const response = await fetch(url, { mode: 'no-cors' });
        if (response) await cache.put(url, response);
      } catch (error) {
        // Runtime caching will retry on the next connected visit.
      }
    }));

    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter((key) => key.startsWith('expense-tracker-pro-') && key !== CACHE_NAME)
      .map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  // Keep navigations resilient even if the device is entirely offline.
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const freshResponse = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put('./index.html', freshResponse.clone());
        return freshResponse;
      } catch (error) {
        return (await caches.match('./index.html')) || (await caches.match('./'));
      }
    })());
    return;
  }

  // Cache-first for app resources, followed by runtime caching for future offline visits.
  event.respondWith((async () => {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;

    try {
      const response = await fetch(request);
      const isSameOrigin = new URL(request.url).origin === self.location.origin;
      if (response && (response.ok || response.type === 'opaque') && (isSameOrigin || OPTIONAL_REMOTE_ASSETS.includes(request.url))) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      if (request.destination === 'image') return caches.match('./assets/icon-192.png');
      return new Response('You are offline. Reconnect to refresh this resource.', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
  })());
});
