/* ==========================================================================
   Expense Tracker Pro — Service Worker
   100% offline-capable PWA shell:
   - Pre-caches the app shell + icons on install
   - Pre-caches CDN dependencies (Tailwind, Lucide, Chart.js, Google Fonts, Firebase Auth SDK)
   - Navigations: network-first with offline fallback to cached index.html
   - Same-origin assets: cache-first
   - CDN assets: stale-while-revalidate (instant load, silent refresh online)
   ========================================================================== */
const CACHE_NAME = 'expense-tracker-pro-v9';

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/master-asset.svg',
  './assets/master-asset.png',
  './assets/master-asset-maskable.svg',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/icon-maskable-192.png',
  './assets/icon-maskable-512.png',
  './assets/apple-touch-icon.png'
];

const CDN_ASSETS = [
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@latest',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
  // Firebase compat SDKs — cached so the app boots offline and restores the
  // signed-in Google session from local persistence without a network round-trip.
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js'
];

const CDN_ORIGINS = [
  'https://cdn.tailwindcss.com',
  'https://unpkg.com',
  'https://cdn.jsdelivr.net',
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'https://www.gstatic.com/firebasejs/'
];

// Live auth traffic (Google sign-in popup/iframe helpers, identity APIs, profile photos)
// is intentionally NOT cached — it is cross-origin and falls through to the network.

/* ---------------------------------------------------------------- install */
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);

    // App shell is mandatory — cache each file individually so one
    // missing asset can never abort the whole installation.
    await Promise.all(STATIC_ASSETS.map(async (asset) => {
      try {
        await cache.add(new Request(asset, { cache: 'reload' }));
      } catch (error) {
        /* non-fatal */
      }
    }));

    // CDN dependencies — cached so the app boots with zero network.
    await Promise.all(CDN_ASSETS.map(async (url) => {
      try {
        const response = await fetch(url, { mode: 'no-cors' });
        if (response) await cache.put(url, response.clone());
      } catch (error) {
        /* optional during install, filled in later by runtime caching */
      }
    }));

    await self.skipWaiting();
  })());
});

/* --------------------------------------------------------------- activate */
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter((key) => key.startsWith('expense-tracker-pro-') && key !== CACHE_NAME)
      .map((key) => caches.delete(key)));

    if (self.registration.navigationPreload) {
      try { await self.registration.navigationPreload.enable(); } catch (e) {}
    }

    await self.clients.claim();
  })());
});

/* ------------------------------------------------------------ messaging */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

/* ------------------------------------------------------------- strategies */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && (response.ok || response.type === 'opaque')) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return cached || Response.error();
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  const network = fetch(request)
    .then((response) => {
      if (response && (response.ok || response.type === 'opaque')) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  return cached || (await network) || Response.error();
}

async function networkFirstNavigation(event) {
  try {
    const preload = await event.preloadResponse;
    if (preload) return preload;
    const response = await fetch(event.request);
    const cache = await caches.open(CACHE_NAME);
    cache.put('./index.html', response.clone());
    return response;
  } catch (error) {
    const cached = await caches.match('./index.html');
    return cached || (await caches.match('./')) || Response.error();
  }
}

/* ------------------------------------------------------------------ fetch */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  let url;
  try {
    url = new URL(request.url);
  } catch (e) {
    return;
  }

  if (!['http:', 'https:'].includes(url.protocol)) return;

  // App navigations → always serve the shell, even fully offline.
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(event));
    return;
  }

  // Same-origin app assets → cache first.
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // CDN dependencies (Tailwind / Lucide / Chart.js / Fonts / Firebase SDK) → SWR.
  if (CDN_ORIGINS.some((origin) => request.url.startsWith(origin))) {
    event.respondWith(staleWhileRevalidate(request));
  }
});
