const V='ml-v6',CORE=['./','index.html','content.js','games.js','icon-192.png','icon-512.png','../img/owl.png','../img/penguin.png','../img/fox.png','../img/panda.png','../img/raccoon.png','../img/beaver.png','../img/bunny.png','audio/manifest.json?v=3'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(CORE.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
const put=(r,res)=>{try{if(res&&(res.ok||res.type==='opaque')){const c=res.clone();caches.open(V).then(x=>x.put(r,c)).catch(()=>{})}}catch(e){}return res};
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(u.hostname.endsWith('supabase.co')||u.hostname.includes('stripe.com'))return;
 if(u.origin!==location.origin){if(/fonts\.(googleapis|gstatic)\.com/.test(u.hostname)){e.respondWith(caches.match(r).then(h=>h||fetch(r).then(x=>put(r,x)).catch(()=>h)))}return}
 if(r.mode==='navigate'){e.respondWith(fetch(r).then(x=>put(r,x)).catch(()=>caches.match(r,{ignoreSearch:true}).then(h=>h||caches.match('index.html')).then(h=>h||caches.match('./'))));return}
 if(/\/(audio|img)\//.test(u.pathname)||/\.(png|jpg|mp3)$/.test(u.pathname)){e.respondWith(caches.match(r).then(h=>h||fetch(r).then(x=>put(r,x))));return}
 e.respondWith(fetch(r).then(x=>put(r,x)).catch(()=>caches.match(r,{ignoreSearch:true})))});
