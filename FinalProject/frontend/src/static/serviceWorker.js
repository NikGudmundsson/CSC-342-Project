function log(...data) {
  console.log("SWv1.0", ...data);
}

log("SW Script executing");



self.addEventListener('install', event => {
  log('install', event);
  event.waitUntil(
    caches.open('NFTS-cache-v1').then(cache => {
      return cache.addAll([
        //'/offline',
        //CSS
        '/css/home.css',
        '/css/login.css',
        '/css/notes.css',
        '/css/shared.css',
        //Images
        '/img/favicon-16x16.png',
        '/img/favicon-32x32.png',
        '/img/apple-touch-icon.png',
        '/img/safari-pinned-tab.svg',        
        //Scripts
        '/js/APIClient.js',
        '/js/common.js',
        '/js/home.js',
        '/js/HTTPClient.js',
        '/js/login.js',
        '/js/notes.js',
        //External Resources
        'https://fonts.googleapis.com/css?family=Pacifico',
        'https://use.typekit.net/oov2wcw.css',
        'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css',
        'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js',
        'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css'

      ]);
    })
  );
});

self.addEventListener('activate', event => {
  log('activate', event);
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName != 'NFTS-cache-v1';
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  log('fetch', event);
  var requestUrl = new URL(event.request.url);
  //Treat API calls (to our API) differently
  if(requestUrl.origin === location.origin && requestUrl.pathname.startsWith('/api')) {
    //If we are here, we are intercepting a call to our API
    if(event.request.method === "GET") {
      //Only intercept (and cache) GET API requests
      event.respondWith(
        fetchAndCache(event.request)
      );
    }
  }
  else {
    //If we are here, this was not a call to our API
    event.respondWith(
      fetchAndCache(event.request)
    );
  }
});


// function cacheFirst(request) {
//   return caches.match(request)
//   .then(response => {
//     //Return a response if we have one cached. Otherwise, get from the network
//     return response || fetchAndCache(request);
//   })
//   .catch(error => {
//     return caches.match('/home');
//   })
// }



function fetchAndCache(request) {
  return fetch(request).then(response => {
    var requestUrl = new URL(request.url);
    //Cache everything except login
    if(response.ok && !requestUrl.pathname.startsWith('/login') && !requestUrl.pathname.startsWith('/signup')) {
      caches.open('NFTS-cache-v1').then((cache) => {
        cache.put(request, response);
      });
    }
    return response.clone();
  });
}



self.addEventListener('message', event => {
  log('message', event.data);
  if(event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});