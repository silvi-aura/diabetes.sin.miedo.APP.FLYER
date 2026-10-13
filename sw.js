// Diabetes sin Miedo: caché versionada para distribuir actualizaciones de la app.
// No se modifica ni se borra localStorage: allí viven los registros de cada usuario.
const K = 'diabetes-sin-miedo-v3';

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(K);
    await cache.addAll(['./', 'index.html', 'manifest.json']);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    // Limpia solo cachés con nombre de esta app; conserva las de otras aplicaciones.
    const names = await caches.keys();
    await Promise.all(names.filter(name =>
      name === 'eq1' || (name.startsWith('diabetes-sin-miedo-') && name !== K)
    ).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

// Se conserva la estrategia original: internet primero; caché si no hay conexión.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).then(response => {
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(K).then(cache => cache.put(event.request, copy)).catch(() => {});
      }
      return response;
    }).catch(() => caches.match(event.request))
  );
});
