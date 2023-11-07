"use strict";

const CACHE_NAME = "v2.2.0";

self.addEventListener("activate", event => {
	self.skipWaiting();

	event.waitUntil(async () => {
		const keyList = await caches.keys();
		const promises = keyList.map(key => {
			if (key !== CACHE_NAME) {
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
	event.respondWith(caches.open(CACHE_NAME).then(async (cache) => {
		const cachedResponse = await cache.match(event.request.url);

		if (cachedResponse) {
			return cachedResponse;
		}

		const fetchedResponse = await fetch(event.request);
		cache.put(event.request, fetchedResponse.clone());

		return fetchedResponse;
	}));
});
