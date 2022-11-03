const path = '/pakkaaja';
const app_prefix = 'pkaja';
const version = '0.0.11';
const urls = [
  `${path}/`,
  `${path}/index.html`,
  `${path}/index.css`,
  `${path}/index.js`,
  `${path}/webfonts`,
  `${path}/icon.png`
];

// cache app on install
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil((async () => {
    const cache = await caches.open(version);
    console.log('[Service Worker] Caching all: app shell and content');
    await cache.addAll(urls)
    .then(() => console.log('Assets added to cache'))
    .catch(err => console.log('Error while fetching assets', err));
  })());
});

// get cache when offline
self.addEventListener('fetch', (e) => {
  e.respondWith((async () => {
    const r = await caches.match(e.request);
    console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
    if (r) { return r; }
    const response = await fetch(e.request);
    const cache = await caches.open(version);
    console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
    cache.put(e.request, response.clone());
    return response;
  })());
});

// clear cache on activation
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keyList) => {
    return Promise.all(keyList.map((key) => {
      if (key === version) { return; }
      return caches.delete(key);
    }));
  }));
});