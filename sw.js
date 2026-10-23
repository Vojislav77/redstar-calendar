const CACHE_NAME = 'redstar-calendar-v2.0.0';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo.png',
  './favicon.ico',
  './fixtures.ics'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then((cache) => cache.addAll(ASSETS))
    .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
    Promise.all(
      keys.filter((key) => key !== CACHE_NAME)
      .map((key) => caches.delete(key))
    )
    ).then(() => self.clients.claim())
  );
});

function isFixtureRequest(url) {
  return url.includes('/fixtures.ics') ||
    url.includes('calendar.google.com') ||
    url.includes('r.jina.ai') ||
    url.includes('api.codetabs.com');
}

function networkFirst(request) {
  return fetch(request)
    .then((response) => {
      if (response.ok) {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
      }
      return response;
    })
    .catch(() => caches.match(request));
}

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  // Always prefer fresh fixture data, with cache as an offline fallback.
  if (isFixtureRequest(request.url)) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Navigations are network-first so app updates are picked up immediately.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(request)
    .then((cached) => cached || fetch(request).then((response) => {
      if (response.ok) {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
      }
      return response;
    }))
  );
});

// Push notifications handler
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    if (data.type === 'match_reminder') {
      event.waitUntil(
        self.registration.showNotification(`⚽ ${data.opponent}`, {
          body: `${data.competition} • ${data.time}\n📍 ${data.venue}`,
          icon: 'logo.png',
          badge: 'logo.png',
          tag: `match-${data.matchId}`,
          requireInteraction: true,
          data: { url: data.url || './index.html' }
        })
      );
    }
  } catch (err) {
    console.error('Push error:', err);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'view' || !event.action) {
    event.waitUntil(clients.openWindow(event.notification.data.url));
  }
});
