const staticCatchName = 'pwa_static_catch_top_news';
const dynamicCatchName = 'pwa_dynamic_catche_top_news';
const assets = [
	'/',
	'/index.html',
	'./images/pwa.png',
	'./images/no_image_availavle.jpg',
	'https://fonts.googleapis.com/css?family=Roboto:200,300,400,500,700',
	'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css',
	'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
	'https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js',
	'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js',
	'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js',		
	'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js'
];
self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(staticCatchName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(assets);
    })
  );
});
self.addEventListener('activate',  event => {
  event.waitUntil(
		caches.keys().then(keys =>{
			console.log(keys);
			return Promise.all(keys
				.filter(key => key !==staticCatchName)
				.map(key => caches.delete(key))
				)
  })
  );
});
self.addEventListener('fetch', event => {
	console.log(event.request.url);
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(fetchRes =>{
		  return caches.open(dynamicCatchName).then(cache =>{
			  cache.put(event.request.url,fetchRes.clone());
			  return fetchRes;
		  });
	  });
    })
  );
});