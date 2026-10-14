const CACHE_NAME = 'artballcalc-v9.0.0';
const ASSETS = [
  './app.html',
  './veiw.html',
  './data.js',
  './bg.webp',
  './bg_2.webp',
  './css/night-theme.css',
  './js/theme.js',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = e.request.url;
  // Запросы к version.json и Gist всегда идут напрямую через сеть без кэша
  if (url.includes('version.json') || url.includes('/gists')) {
    e.respondWith(fetch(e.request));
    return;
  }
  // Для остальных файлов: сначала свежая версия из сети, при отсутствии связи — из кэша
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});