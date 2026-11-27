/// <reference lib="webworker" />

import { ROUTES } from "~/shared/consts";

declare const self: ServiceWorkerGlobalScope;
declare const __SERVICE_WORKER_ASSETS__: string[];
declare const __SERVICE_WORKER_SHELL__: string;
declare const __VERSION_HASH__: string;

const CACHE_PREFIX = "photo-companion-build-";
const CACHE_NAME = `${CACHE_PREFIX}${__VERSION_HASH__}`;
const ASSETS = new Set(__SERVICE_WORKER_ASSETS__);
const APP_ROUTES = new Set<string>(Object.values(ROUTES));

function isAssetResponse(path: string, response: Response | undefined): response is Response {
	if (!response?.ok || response.status === 206 || response.redirected) {
		return false;
	}

	const contentType = response.headers.get("Content-Type")?.split(";", 1)[0].trim().toLowerCase();

	return path.endsWith(".css")
		? contentType === "text/css"
		: /^(?:application|text)\/(?:ecmascript|javascript)$/.test(contentType ?? "");
}

async function precacheAssets() {
	const cache = await caches.open(CACHE_NAME);

	await Promise.all(Array.from(ASSETS, async path => {
		const request = new Request(new URL(path, self.location.origin));
		const cached = await cache.match(request);

		if (isAssetResponse(path, cached)) {
			return;
		}

		const response = await fetch(request);

		if (!isAssetResponse(path, response)) {
			throw new Error(`Could not precache ${path}`);
		}

		await cache.put(request, response);
	}));
}

async function removeOldCaches() {
	const keys = await caches.keys();
	const currentIndex = keys.indexOf(CACHE_NAME);

	// CacheStorage lists caches in creation order. Keep caches from newer installations.
	await Promise.all(keys
		.filter((name, index) => index < currentIndex && name.startsWith(CACHE_PREFIX))
		.map(name => caches.delete(name)));
}

async function loadAsset(event: FetchEvent, path: string) {
	const { request } = event;
	const cache = await caches.open(CACHE_NAME).catch(() => undefined);
	const cached = await cache?.match(request).catch(() => undefined);

	if (isAssetResponse(path, cached)) {
		return cached;
	}

	const response = await fetch(request);

	if (cache && isAssetResponse(path, response)) {
		event.waitUntil(cache.put(request, response.clone()).catch(() => undefined));
	}

	return response;
}

self.addEventListener("install", event => {
	event.waitUntil(precacheAssets());
});

self.addEventListener("message", event => {
	if (event.data?.action === "skipWaiting") {
		event.waitUntil(self.skipWaiting());
	}
});

self.addEventListener("activate", event => {
	event.waitUntil(removeOldCaches()
		.catch(() => undefined)
		.then(() => self.clients.claim()));
});

self.addEventListener("fetch", event => {
	const { request } = event;
	const url = new URL(request.url);

	if (request.method !== "GET" || url.origin !== self.location.origin) {
		return;
	}

	if (request.mode === "navigate" && APP_ROUTES.has(url.pathname.replace(/\/$/, "") || "/")) {
		event.respondWith(fetch(request).catch(() => new Response(__SERVICE_WORKER_SHELL__, {
			headers: { "Content-Type": "text/html; charset=utf-8" }
		})));

		return;
	}

	if (ASSETS.has(url.pathname) && !url.search && !request.headers.has("Range")) {
		event.respondWith(loadAsset(event, url.pathname));
	}
});
