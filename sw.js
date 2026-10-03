/* Expense Tracker Pro — static app shell only. User data is never requested or cached here. */
const CACHE_NAME = 'expense-tracker-pro-v4';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/icon.svg',
  './assets/icon-192.png',
  './assets/icon-512.png'
];
const CDN_ASSETS = [
  'https://cdn.tailwindcss.com/',
  'https://unpkg.com/lucide@latest'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(STATIC_ASSETS);
    await Promise.all(CDN_ASSETS.map(async (url) => {
      try {
        const response = await fetch(url, { mode: 'no-cors' });
        await cache.put(url, response);
      } catch (error) {
        // CDN assets are optional during installation.
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

  const url = new URL(request.url);
  const staticPath = url.origin === self.location.origin
    && STATIC_ASSETS.some((asset) => new URL(asset, self.location.href).href === url.href);
  const cdnAsset = CDN_ASSETS.includes(request.url);

  // Ignore every non-shell request. In particular, API/dynamic data can never
  // enter Cache Storage through this service worker.
  if (!staticPath && !cdnAsset && request.mode !== 'navigate') return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('./index.html')));
    return;
  }

  event.respondWith(caches.match(request).then((cached) => cached || fetch(request)));
});
