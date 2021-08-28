var CACHE_NAME = 'budget-v1';
var DATA_CACHE_NAME = 'CACHE-v1';
const FILES_TO_CACHE = [
    '/',
    '/js/index.js',
    '/manifest.json',
    '/icons/icon-512x512.png',
    '/icons/icon-384x384.png',
    '/icons/icon-192x192.png',
    '/icons/icon-152x152.png',
    '/css/styles.css',
    '/js/idb.js'
]

self.addEventListener('install', function (e) {
    e.waitUntil(
      caches.open(CACHE_NAME).then(function (cache) {
        console.log('installing cache : ' + CACHE_NAME)
        return cache.addAll(FILES_TO_CACHE)
      })
    )
})

self.addEventListener('fetch', function (e) {
    console.log('fetch request : ' + e.request.url)
    e.respondWith(
      caches.match(e.request).then(function (request) {
        if (request) { // if cache is available, respond with cache
          console.log('responding with cache : ' + e.request.url)
          return request
        } else {       // if there are no cache, try fetching request
          console.log('file is not cached, fetching : ' + e.request.url)
          return fetch(e.request)
        }
      })
    )
})