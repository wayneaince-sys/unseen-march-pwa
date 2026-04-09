// Unseen March PWA — Service Worker
const CACHE = "unseen-march-pwa-v1";

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(["/", "/index.html", "/manifest.json"])));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return res;
    }).catch(() => caches.match("/index.html")))
  );
});

self.addEventListener("push", e => {
  const data = e.data ? e.data.json() : { title: "Unseen March", body: "Time to check in." };
  e.waitUntil(self.registration.showNotification(data.title, {
    body: data.body,
    icon: "icons/icon-192.png",
    badge: "icons/badge-96.png",
    tag: "unseen-march",
    vibrate: [200, 100, 200]
  }));
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(clients.openWindow("https://www.perplexity.ai/computer/a/unseen-march-ptsd-recovery-com-SMkYney4QvqDb7UBtnLmbw"));
});
