const K='eq1';
self.addEventListener('install',e=>{e.waitUntil(caches.open(K).then(c=>c.addAll(['./','index.html','manifest.json'])));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(clients.claim()));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{const x=r.clone();caches.open(K).then(c=>c.put(e.request,x));return r}).catch(()=>caches.match(e.request)))});
