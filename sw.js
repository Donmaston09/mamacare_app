// MamaCare CAD — Service Worker
// Strategy:
//   - On install: pre-cache all shell assets.
//   - On fetch: Cache-First for assets; fall back to network.
//   - On activate: delete stale caches.
//   - Listens for SKIP_WAITING from the update banner in the UI.

const CACHE_NAME = 'mamacare-v1';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-96x96.png',
  './icons/icon-152x152.png',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
];

// ── Install ──────────────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  // Don't skip waiting automatically — let the UI update banner control this.
});

// ── Activate ─────────────────────────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
// Cache-first for local shell assets; network-only for external APIs (Google Gemini).
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Let cross-origin requests (AI API, etc.) pass through to network directly.
  if (url.origin !== self.location.origin) {
    return;
  }

  // Cache-first strategy for same-origin assets.
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) {
        // Serve from cache immediately, but also revalidate in the background.
        const networkFetch = fetch(request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
          }
          return networkResponse;
        }).catch(() => {/* Network unavailable — cached copy is fine */});

        return cached;
      }

      // Not in cache — fetch from network and cache it.
      return fetch(request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
          return networkResponse;
        }
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
        return networkResponse;
      }).catch(() => {
        // If the network fails and we have nothing in cache, return a minimal offline page.
        return caches.match('./index.html');
      });
    })
  );
});

// ── Message handler ───────────────────────────────────────────────────────────
// The update banner in index.html calls: newWorker.postMessage({ type: 'SKIP_WAITING' })
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
