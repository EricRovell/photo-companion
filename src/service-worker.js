"use strict";

const SERVICE_WORKER_CACHE_NAME = "__COMMIT_HASH__";

self.addEventListener("message", event => {
	if (event.data.action === "skipWaiting") {
		self.skipWaiting();
	}
});

self.addEventListener("activate", event => {
	self.skipWaiting();

	event.waitUntil(async () => {
		const keyList = await caches.keys();
		const promises = keyList.map(key => {
			if (key !== SERVICE_WORKER_CACHE_NAME) {
				return caches.delete(key);
			}
		});

		return await Promise.all(promises);
	});
});

/**
 * Network first, falling back to cache strategy
 * https://developer.chrome.com/docs/workbox/caching-strategies-overview/#network-first-falling-back-to-cache
 */
self.addEventListener("fetch", async (event) => {
	event.respondWith(caches.open(SERVICE_WORKER_CACHE_NAME).then(async (cache) => {
		const cachedResponse = await cache.match(event.request.url);

		if (cachedResponse) {
			return cachedResponse;
		}

		const fetchedResponse = await fetch(event.request);
		cache.put(event.request, fetchedResponse.clone());

		return fetchedResponse;
	}));
});
