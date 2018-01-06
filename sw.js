// Chrome's currently missing some useful cache methods,
// this polyfill adds them.
importScripts('js/serviceworker-cache-polyfill.js');

// Here comes the install event!
// This only happens once, when the browser sees this
// version of the ServiceWorker for the first time.
self.addEventListener('install', function(event) {
	// We pass a promise to event.waitUntil to signal how
	// long install takes, and if it failed
	event.waitUntil(
		// We open a cache…
		caches.open('tng-weather-v1.3.1').then(function(cache) {
			// And add resources to it
			return cache.addAll([
				//'./',
				//'style.css',
				//'logging.js'
				'index.html',
				//'http://cdn.trippnology.net/css/bootstrap-3.3.6.min.css',
				//'http://cdn.trippnology.net/fonts/glyphicons-halflings-regular.woff',
				//'http://cdn.trippnology.net/js/jquery-1.12.1.min.js',
				'js/jquery.xml2json.js',
				'js/script-bundle.js',
				'img/icon-128.png',
				'img/icon-512.png'
			]);
		})
	);
});

// The fetch event happens for the page request with the
// ServiceWorker's scope, and any request made within that
// page
self.addEventListener('fetch', function(event) {
	// Calling event.respondWith means we're in charge
	// of providing the response. We pass in a promise
	// that resolves with a response object
	event.respondWith(
		// First we look for something in the caches that
		// matches the request
		caches.match(event.request).then(function(response) {
			// If we get something, we return it, otherwise
			// it's null, and we'll pass the request to
			// fetch, which will use the network.
			return response || fetch(event.request);
		})
	);
});
