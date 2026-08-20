const CACHE_NAME = 'sunlight-sweets-standalone-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/jalali.js',
  './js/db.js',
  './js/seed-data.js',
  './js/app.js',
  './vendor/xlsx.full.min.js',
  './vendor/Vazirmatn-Regular.woff2',
  './vendor/Vazirmatn-Bold.woff2',
  './vendor/Vazirmatn-Medium.woff2',
  './vendor/Vazirmatn-ExtraBold.woff2',
  './img/logo.png',
  './img/icon-192.png',
  './img/icon-512.png',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch((err) => console.error('SW cache error', err))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))))
  );
  self.clients.claim();
});

// Cache-first for everything: this app has no backend, all data lives in
// IndexedDB on the device, so once installed it must work fully offline.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      }).catch(() => cached);
    })
  );
});
