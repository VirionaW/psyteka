/* Метолария: автономная библиотека рисунков и официальные логотипы. */
"use strict";
const CACHE = "psyteka-drawing-library-v8";
const fileUrl = name => new URL("./" + name, self.location.href).href;
const PAGE = fileUrl("drawing-library.html");
const ASSETS = [fileUrl("brand-mark.svg"), fileUrl("brand-mark-dark.svg"), fileUrl("brand-favicon.svg")];
const URLS = [PAGE, ...ASSETS];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(URLS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith("psyteka-drawing-library-") && k !== CACHE).map(k => caches.delete(k)))),
    self.clients.claim()
  ]));
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET" || !URLS.includes(event.request.url.split("?")[0])) return;
  const isPage = event.request.url.split("?")[0] === PAGE;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (!isPage) {
      const cachedAsset = await cache.match(event.request.url.split("?")[0]);
      if (cachedAsset) return cachedAsset;
    }
    try {
      const response = await fetch(event.request, isPage ? {cache:"no-store"} : undefined);
      if (response.ok) await cache.put(event.request.url.split("?")[0], response.clone());
      return response;
    } catch (error) {
      const fallback = await cache.match(event.request.url.split("?")[0]);
      return fallback || new Response("Библиотека еще не была открыта онлайн.", {status:503,headers:{"Content-Type":"text/plain; charset=utf-8"}});
    }
  })());
});
