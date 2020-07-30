const cacheName = "colorName-1.0.0";

const precacheResources = [
  "/",
  "index.html",
  // CSS
  "css/style.css",
  // Images
  "images/icons.svg",
  "images/color-app-palettes-icons.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(precacheResources);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
