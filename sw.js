// Diabetes sin Miedo: caché versionada para distribuir las actualizaciones de la app.
// No se modifica ni se borra localStorage: allí viven los registros de cada usuario.
const K = 'diabetes-sin-miedo-v2';

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(K);
    await cache.addAll(['./', 'index.html', 'manifest.json']);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    // Borra únicamente la caché que usaba la versión original, no las de otros proyectos.
    await caches.delete('eq1');
    await self.clients.claim();
  })());
});

// Se mantiene la estrategia original: internet primero; caché si no hay conexión.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(K).then(cache => cache.put(event.request, copy)).catch(() => {});
      return response;
    }).catch(() => caches.match(event.request))
  );
});
