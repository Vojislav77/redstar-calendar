const CACHE_NAME = 'redstar-calendar-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './ics-parser.js'
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

self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  if (request.method !== 'GET') return;
  
  // Calendar data: Always fetch fresh, cache fallback
  if (request.url.includes('calendar.google.com/calendar/ical')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }
  
  // Other assets: Cache-first
  event.respondWith(
    caches.match(request)
      .then((cached) => cached || fetch(request))
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
          icon: '/icons/icon-192.png',
          badge: '/icons/icon-192.png',
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