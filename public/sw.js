
// Service Worker para PWA e Notificações Push VAPID
self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: 'https://picsum.photos/seed/gold-icon-192/192/192',
      badge: 'https://picsum.photos/seed/gold-badge/96/96',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '1'
      },
      actions: [
        { action: 'explore', title: 'Ver Agenda' },
        { action: 'close', title: 'Fechar' }
      ]
    };
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/admin/dashboard')
    );
  } else {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Cache básico para funcionamento offline PWA
const CACHE_NAME = 'gold-cache-v1';
const urlsToCache = [
  '/',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
