"use strict";
const CACHE="metolaria-additional-v3";
const ASSETS=["/additional/","/additional/dreams/","/additional/lectures/","/additional.html","/additional.js?v=20261110nav2","/additional.css?v=1","/brand-mark.svg","/brand-favicon.svg"];
self.addEventListener("install",event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("metolaria-additional-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",event=>{
 const req=event.request;
 if(req.method!=="GET"||new URL(req.url).origin!==self.location.origin)return;
 if(!["/additional/","/additional/dreams/","/additional/lectures/","/additional.html","/additional.js","/additional.css","/brand-mark.svg","/brand-favicon.svg"].includes(new URL(req.url).pathname))return;
 event.respondWith(fetch(req).then(response=>{
  if(response.ok){const clone=response.clone();caches.open(CACHE).then(cache=>cache.put(req,clone)).catch(()=>{})}
  return response;
 }).catch(()=>caches.match(req)));
});
