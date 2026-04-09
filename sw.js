// Unseen March — Service Worker
// Scope: /unseen-march-pwa/
const CACHE = 'unseen-march-v2';
const SHELL = [
  '/unseen-march-pwa/',
  '/unseen-march-pwa/index.html',
  '/unseen-march-pwa/manifest.json',
  '/unseen-march-pwa/icons/icon-192.png',
  '/unseen-march-pwa/icons/icon-512.png'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached =>
      cached || fetch(e.request).then(res => {
        // Cache same-origin responses only
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match('/unseen-march-pwa/index.html'))
    )
  );
});

self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {
    title: 'Unseen March',
    body: 'Time for your daily check-in.'
  };
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/unseen-march-pwa/icons/icon-192.png',
      badge: '/unseen-march-pwa/icons/badge-96.png',
      tag: 'unseen-march',
      vibrate: [200, 100, 200]
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('/unseen-march-pwa/'));
});
