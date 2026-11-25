const CACHE='hr-fluent-v17-10-closeout-r3-20261126';
const ROOT=new URL('./',self.location.href);
const HOME=new URL('index.html',ROOT).href;
const CORE=['index.html','app-v17-10.js','update-v17-10.js','manifest.webmanifest'].map(x=>new URL(x,ROOT).href);
self.addEventListener('install',e=>e.waitUntil((async()=>{
 const c=await caches.open(CACHE);
 await c.addAll(CORE.map(u=>new Request(u,{cache:'reload'})));
 const h=await c.match(HOME);
 if(!h)throw Error('deployment incomplete');
 const html=await h.text();
 if(!html.includes('name="hr-fluent-build" content="17.10"')||!html.includes('name="hr-fluent-build-id" content="hr-fluent-v17-10-closeout-r3"'))throw Error('deployment incomplete or build mismatch');
 await self.skipWaiting();
})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{
 const keys=await caches.keys();
 await Promise.all(keys.filter(k=>k.startsWith('hr-fluent-')&&k!==CACHE).map(k=>caches.delete(k)));
 await self.clients.claim();
})()));
self.addEventListener('message',e=>{if(e.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',e=>{
 const r=e.request,u=new URL(r.url);
 if(r.method!=='GET'||u.origin!==ROOT.origin||!u.pathname.startsWith(ROOT.pathname))return;
 if(u.pathname.endsWith('/version.json')||u.pathname.endsWith('/sw.js')||u.searchParams.has('check_build')){e.respondWith(fetch(r,{cache:'no-store'}));return}
 if(r.mode==='navigate'&&(u.pathname===ROOT.pathname||u.pathname===new URL(HOME).pathname)){
  if(u.searchParams.has('hr_refresh')){e.respondWith(fetch(r,{cache:'no-store'}).catch(()=>caches.open(CACHE).then(c=>c.match(HOME))));return}
  e.respondWith(caches.open(CACHE).then(async c=>await c.match(HOME)||fetch(r)));return;
 }
 if(CORE.includes(u.href))e.respondWith(caches.open(CACHE).then(async c=>await c.match(r)||fetch(r)));
});
