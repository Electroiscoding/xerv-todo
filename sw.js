const CACHE_NAME = "todo-alarm-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./android-chrome-192x192.png",
  "./android-chrome-512x512.png",
  "./logo.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
