/* Психотека. Отдельный автономный справочник рисуночных элементов. */
"use strict";
const CACHE = "psyteka-drawing-library-v1";
const PAGE = new URL("./drawing-library.html", self.location.href).pathname;
const ROOT = new URL("./drawing-library.html", self.location.href).href;
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.add(ROOT)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith("psyteka-drawing-library-") && k !== CACHE).map(k => caches.delete(k)))),
    self.clients.claim()
  ]));
});
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== self.location.origin || url.pathname !== PAGE) return;
  event.respondWith(fetch(event.request).then(response => {
    if (response.ok) {
      const copy = response.clone();
      event.waitUntil(caches.open(CACHE).then(cache => cache.put(ROOT, copy)));
    }
    return response;
  }).catch(async () => {
    const cached = await caches.match(ROOT);
    return cached || new Response("Библиотека еще не была открыта онлайн.", {status:503,headers:{"Content-Type":"text/plain; charset=utf-8"}});
  }));
});
