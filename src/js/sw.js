workbox.skipWaiting();
workbox.clientsClaim();
workbox.googleAnalytics.initialize();
//https://developers.google.com/web/tools/workbox/modules/workbox-precaching
workbox.strategies.cacheFirst({cacheableResponse: {statuses: [0, 200]}})
//workbox.routing.registerRoute('/', workbox.strategies.cacheFirst());
workbox.routing.registerRoute(
  // Cache image files
  /.*\.(?:png|jpg|jpeg|svg|gif|css)/,
  // Use the cache if it's available
  workbox.strategies.cacheFirst({
    // Use a custom cache name
    cacheName: 'image-cache',
    plugins: [
      new workbox.expiration.Plugin({
        // Cache only 20 images
        maxEntries: 20,
        // Cache for a maximum of a week
        maxAgeSeconds: 7 * 24 * 60 * 60,
      })
    ],
  })
);
workbox.precaching.precacheAndRoute(self.__precacheManifest);

