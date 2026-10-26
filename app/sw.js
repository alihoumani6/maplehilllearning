const C='ml-v2';self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['./','content.js','../img/owl.png','../img/penguin.png','../img/fox.png','../img/panda.png','../img/raccoon.png','../img/beaver.png','../img/bunny.png']).catch(()=>{})));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(clients.claim()));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(C).then(x=>x.put(e.request,c)).catch(()=>{});return r}).catch(()=>caches.match(e.request)))});
