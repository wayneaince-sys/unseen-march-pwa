// ============================================================
// The Unseen March — Service Worker v2
// Defensive install, cache-first fetch, background sync, push
// ============================================================

const CACHE_NAME = 'unseen-march-v2';
const SYNC_TAG   = 'unseen-march-bg-sync';

// Only cache files we KNOW exist — no 404s allowed here
const PRECACHE_URLS = [
  '/unseen-march-pwa/',
  '/unseen-march-pwa/index.html',
  '/unseen-march-pwa/manifest.json'
];

// ── INSTALL ──────────────────────────────────────────────────
// Cache each URL individually so one 404 never aborts everything
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const url of PRECACHE_URLS) {
        try {
          await cache.add(url);
        } catch (err) {
          console.warn('[SW] Skipping precache for', url, err.message);
        }
      }
    }).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE ─────────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── FETCH — Cache-First with Network Fallback ─────────────────
self.addEventListener('fetch', event => {
  // Only handle GET requests; skip chrome-extension and non-http
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        if (cached) return cached;

        return fetch(event.request.clone())
          .then(response => {
            // Only cache valid same-origin responses
            if (
              response &&
              response.status === 200 &&
              response.type === 'basic'
            ) {
              const clone = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, clone))
                .catch(() => {}); // swallow cache write errors
            }
            return response;
          })
          .catch(() => {
            // Offline fallback for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/unseen-march-pwa/index.html')
                .then(r => r || new Response('Offline', { status: 503 }));
            }
            return new Response('', { status: 503 });
          });
      })
      .catch(() => {
        // caches.match itself failed — go to network
        return fetch(event.request).catch(() =>
          new Response('', { status: 503 })
        );
      })
  );
});

// ── BACKGROUND SYNC ──────────────────────────────────────────
self.addEventListener('sync', event => {
  if (event.tag === SYNC_TAG) {
    event.waitUntil(flushPendingRequests());
  }
});

async function flushPendingRequests() {
  try {
    const db  = await openDB();
    const all = await getAllPending(db);
    for (const item of all) {
      try {
        await fetch(item.url, {
          method:  item.method,
          headers: item.headers,
          body:    item.body
        });
        await deletePending(db, item.id);
      } catch {
        // Still offline — leave in queue
      }
    }
  } catch (err) {
    console.warn('[SW] Background sync error:', err);
  }
}

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('unseen-march-sync', 1);
    req.onupgradeneeded = e =>
      e.target.result.createObjectStore('pending', { keyPath: 'id', autoIncrement: true });
    req.onsuccess = e => resolve(e.target.result);
    req.onerror   = e => reject(e.target.error);
  });
}

function getAllPending(db) {
  return new Promise((resolve, reject) => {
    const req = db.transaction('pending', 'readonly').objectStore('pending').getAll();
    req.onsuccess = e => resolve(e.target.result);
    req.onerror   = e => reject(e.target.error);
  });
}

function deletePending(db, id) {
  return new Promise((resolve, reject) => {
    const req = db.transaction('pending', 'readwrite').objectStore('pending').delete(id);
    req.onsuccess = () => resolve();
    req.onerror   = e => reject(e.target.error);
  });
}

// ── PUSH NOTIFICATIONS ────────────────────────────────────────
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'The Unseen March', {
      body:  data.body || 'New content available.',
      icon:  '/unseen-march-pwa/icons/icon-192.png',
      badge: '/unseen-march-pwa/icons/icon-72.png'
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/unseen-march-pwa/'));
});
