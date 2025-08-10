/// <reference lib="webworker" />

"use strict";

declare const self: ServiceWorkerGlobalScope;

export {};

// ! This file is transpiled by /plugins/compile-service-worker.ts

// @ts-expect-error: this variable will be replace during build
const VERSION_HASH = __VERSION_HASH__;
// @ts-expect-error: this variable will be replace during build
const ASSETS = __SERVICE_WORKER_ASSETS__;

self.addEventListener("install", event => {
	const cacheBundles = async () => {
		const cache = await caches.open(VERSION_HASH);
		return cache.addAll(ASSETS);
	};

	event.waitUntil(cacheBundles());
});

self.addEventListener("message", event => {
	if (event.data.action === "skipWaiting") {
		void self.skipWaiting();
	}
});

self.addEventListener("activate", event => {
	void self.clients.claim();

	const removePromiseList = async () => {
		const cacheKeys = await caches.keys();
		const cachePromiseList = cacheKeys.map((cacheName) => {
			if (cacheName !== VERSION_HASH) {
				return caches.delete(cacheName);
			}
		});

		await Promise.all(cachePromiseList);
	};

	event.waitUntil(removePromiseList());
});

/**
 * Cache first, falling back to network strategy
 * https://developer.chrome.com/docs/workbox/caching-strategies-overview/#cache_first_falling_back_to_network
 */
self.addEventListener("fetch", event => {
	event.respondWith(caches.open(VERSION_HASH).then(async (cache) => {
		const cachedResponse = await cache.match(event.request.url);

		if (cachedResponse) {
			return cachedResponse;
		}

		const fetchedResponse = await fetch(event.request);
		await cache.put(event.request, fetchedResponse.clone());

		return fetchedResponse;
	}));
});
