// ============================================================
// Unseen March — Service Worker v3
// Features:
//   • Offline caching (cache-first for shell, network-first for API)
//   • Push notifications
//   • Periodic Background Sync (daily check-in reminder, quote refresh)
//   • Widget updates (Badging API + widget data refresh)
//   • Multi-tab support via BroadcastChannel
// ============================================================

const CACHE_VERSION = 'unseen-march-v3';
const SHELL_ASSETS = [
  '/unseen-march-pwa/',
  '/unseen-march-pwa/index.html',
  '/unseen-march-pwa/manifest.json',
  '/unseen-march-pwa/icons/icon-192.png',
  '/unseen-march-pwa/icons/icon-512.png',
  '/unseen-march-pwa/widgets/checkin-data.json',
  '/unseen-march-pwa/widgets/grounding-data.json',
  '/unseen-march-pwa/widgets/crisis-data.json',
];

// BroadcastChannel for multi-tab coordination
const channel = new BroadcastChannel('unseen-march-sync');

// Daily recovery quotes — rotated on periodic sync
const QUOTES = [
  { text: "Seeking help is not weakness. It is tactical intelligence.", source: "The Unseen March, Ch. 3" },
  { text: "Your march is not over, and you do not have to walk it alone.", source: "Wayne Ince, SMS (Ret.)" },
  { text: "The goal is not to erase your past. It is to manage the weight of your rucksack.", source: "The Unseen March" },
  { text: "Injuries can be treated. You are injured, not broken.", source: "The Unseen March" },
  { text: "You are not broken. You are adapting. Let's adapt together.", source: "The Unseen March" },
  { text: "Saying 'I need help' breaks isolation. That is the bravest mission.", source: "The Unseen March, Ch. 3" },
  { text: "The march continues, but it doesn't have to be a forced march through hell.", source: "The Unseen March, Ch. 14" },
];

// ── Install ────────────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  console.log('[SW] Installing v3...');
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate ───────────────────────────────────────────────────────────────
self.addEventListener('activate', event => {
  console.log('[SW] Activating v3...');
  event.waitUntil(
    Promise.all([
      // Clean old caches
      caches.keys().then(keys =>
        Promise.all(
          keys.filter(k => k !== CACHE_VERSION).map(k => {
            console.log('[SW] Deleting old cache:', k);
            return caches.delete(k);
          })
        )
      ),
      // Register periodic sync tags
      self.registration.periodicSync?.register('daily-checkin-reminder', {
        minInterval: 24 * 60 * 60 * 1000, // once per day
      }).catch(() => {}),
      self.registration.periodicSync?.register('quote-refresh', {
        minInterval: 12 * 60 * 60 * 1000, // twice per day
      }).catch(() => {}),
      self.registration.periodicSync?.register('widget-update', {
        minInterval: 60 * 60 * 1000, // once per hour
      }).catch(() => {}),
    ]).then(() => self.clients.claim())
  );
});

// ── Fetch ──────────────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Widget data endpoints — network first, cache fallback
  if (url.pathname.includes('/widgets/')) {
    event.respondWith(
      fetch(request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_VERSION).then(c => c.put(request, clone));
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Shell assets — cache first, network fallback
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_VERSION).then(c => c.put(request, clone));
        }
        return res;
      }).catch(() => caches.match('/unseen-march-pwa/index.html'));
    })
  );
});

// ── Periodic Background Sync ───────────────────────────────────────────────
self.addEventListener('periodicsync', event => {
  console.log('[SW] Periodic sync fired:', event.tag);

  if (event.tag === 'daily-checkin-reminder') {
    event.waitUntil(sendDailyCheckInReminder());
  }

  if (event.tag === 'quote-refresh') {
    event.waitUntil(refreshQuote());
  }

  if (event.tag === 'widget-update') {
    event.waitUntil(updateWidgets());
  }
});

async function sendDailyCheckInReminder() {
  // Only notify if user hasn't checked in today
  // In production this would check IndexedDB; here we use time heuristic
  const now = new Date();
  const hour = now.getHours();

  // Send reminder in the morning (8-9am) and evening (8-9pm) windows
  if ((hour >= 8 && hour < 9) || (hour >= 20 && hour < 21)) {
    const isEvening = hour >= 20;
    await self.registration.showNotification(
      isEvening ? '🌙 Evening Check-In' : '🌅 Morning Check-In',
      {
        body: isEvening
          ? 'Take a moment to log how your day went. One entry at a time.'
          : 'Start the day strong. How are you feeling this morning?',
        icon: '/unseen-march-pwa/icons/icon-192.png',
        badge: '/unseen-march-pwa/icons/badge-96.png',
        tag: 'daily-checkin',
        renotify: true,
        requireInteraction: false,
        vibrate: [200, 100, 200],
        actions: [
          { action: 'checkin', title: '📊 Log Mood' },
          { action: 'ground',  title: '💨 Ground First' },
          { action: 'dismiss', title: 'Dismiss' },
        ],
        data: { screen: 'mood' }
      }
    );
  }
}

async function refreshQuote() {
  // Pick today's quote based on day of year
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );
  const quote = QUOTES[dayOfYear % QUOTES.length];

  // Update widget data cache with fresh quote
  const cache = await caches.open(CACHE_VERSION);
  const checkinData = {
    quote: quote.text,
    quoteSource: quote.source,
    streak: 0, // would come from real storage in production
    lastCheckin: 'Today',
    appUrl: '/unseen-march-pwa/?screen=mood',
    moods: [
      { emoji: '😔', label: 'Struggling', value: 1 },
      { emoji: '😕', label: 'Low',        value: 2 },
      { emoji: '😐', label: 'Steady',     value: 3 },
      { emoji: '🙂', label: 'Good',       value: 4 },
      { emoji: '💪', label: 'Strong',     value: 5 },
    ]
  };

  await cache.put(
    '/unseen-march-pwa/widgets/checkin-data.json',
    new Response(JSON.stringify(checkinData), {
      headers: { 'Content-Type': 'application/json' }
    })
  );

  // Notify all open tabs that the quote has been refreshed
  channel.postMessage({ type: 'QUOTE_REFRESHED', quote });
  console.log('[SW] Quote refreshed:', quote.text.slice(0, 40));
}

async function updateWidgets() {
  // Update all registered widgets via the Widgets API (Chrome/Edge)
  if (!self.widgets) return;

  const widgetList = await self.widgets.matchAll();
  for (const widget of widgetList) {
    try {
      const dataUrl = widget.definition?.data;
      if (!dataUrl) continue;

      // For the check-in widget, inject today's quote
      if (widget.definition?.tag === 'daily-checkin') {
        const dayOfYear = Math.floor(
          (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
        );
        const quote = QUOTES[dayOfYear % QUOTES.length];
        const payload = JSON.stringify({
          quote: quote.text,
          quoteSource: quote.source,
          streak: 0,
          lastCheckin: new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          appUrl: '/unseen-march-pwa/?screen=mood',
        });
        await self.widgets.updateByTag('daily-checkin', { data: payload });
        console.log('[SW] Widget updated: daily-checkin');
      }
    } catch (err) {
      console.warn('[SW] Widget update failed:', err);
    }
  }
}

// ── Widget event handlers ──────────────────────────────────────────────────
self.addEventListener('widgetinstall', event => {
  console.log('[SW] Widget installed:', event.widget?.definition?.tag);
  event.waitUntil(updateWidgets());
});

self.addEventListener('widgetuninstall', event => {
  console.log('[SW] Widget uninstalled:', event.widget?.definition?.tag);
});

self.addEventListener('widgetresume', event => {
  event.waitUntil(updateWidgets());
});

self.addEventListener('widgetclick', event => {
  // Handle widget action button clicks
  const action = event.action;
  const tag    = event.widget?.definition?.tag;
  console.log('[SW] Widget click:', tag, action);

  // Open the app to the right screen
  const screenMap = {
    'daily-checkin':  '?screen=mood',
    'grounding-launch': '?screen=grounding',
    'crisis-line':    '?screen=crisis',
  };
  const target = `/unseen-march-pwa/${screenMap[tag] || ''}`;
  event.waitUntil(clients.openWindow(target));
});

// ── Push notifications ─────────────────────────────────────────────────────
self.addEventListener('push', event => {
  const data = event.data
    ? (() => { try { return event.data.json(); } catch { return { title: 'Unseen March', body: event.data.text() }; } })()
    : { title: 'Unseen March', body: 'Time to check in.' };

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body:    data.body,
      icon:    '/unseen-march-pwa/icons/icon-192.png',
      badge:   '/unseen-march-pwa/icons/badge-96.png',
      tag:     data.tag || 'unseen-march',
      renotify: true,
      vibrate: [200, 100, 200],
      data:    { screen: data.screen || 'home' },
      actions: [
        { action: 'open',    title: 'Open App' },
        { action: 'dismiss', title: 'Dismiss'  },
      ],
    })
  );
});

// ── Notification click ─────────────────────────────────────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'dismiss') return;

  const screen = event.notification.data?.screen || '';
  const target = `/unseen-march-pwa/${screen ? '?screen=' + screen : ''}`;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // Focus existing tab if open
      for (const client of clientList) {
        if (client.url.includes('/unseen-march-pwa') && 'focus' in client) {
          client.postMessage({ type: 'NAVIGATE', screen });
          return client.focus();
        }
      }
      // Otherwise open a new tab
      return clients.openWindow(target);
    })
  );
});

// ── BroadcastChannel — multi-tab coordination ──────────────────────────────
channel.onmessage = event => {
  const { type } = event.data;
  if (type === 'SYNC_REQUEST') {
    // A new tab is asking for latest data — trigger widget + quote update
    updateWidgets();
    refreshQuote();
  }
};

// ── Badging API — show unread check-in count on app icon ──────────────────
self.addEventListener('message', event => {
  if (event.data?.type === 'SET_BADGE') {
    const count = event.data.count ?? 0;
    if (count > 0) {
      self.navigator?.setAppBadge?.(count).catch(() => {});
    } else {
      self.navigator?.clearAppBadge?.().catch(() => {});
    }
  }

  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('[SW] Unseen March Service Worker v3 loaded');
