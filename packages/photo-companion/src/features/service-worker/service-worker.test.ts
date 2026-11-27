// @vitest-environment node

import { afterEach, describe, expect, it, vi } from "vitest";

const ORIGIN = "https://photo-companion.example";
const SHELL = "<html><body>Offline Photo Companion</body></html>";
const SCRIPT = "/assets/index-test.js";
const STYLESHEET = "/assets/index-test.css";
const CURRENT_CACHE = "photo-companion-build-test-version";

function assetRequest(path = SCRIPT) {
	return new Request(new URL(path, ORIGIN));
}

function navigation(path: string) {
	const request = new Request(new URL(path, ORIGIN));
	Object.defineProperty(request, "mode", { value: "navigate" });

	return request;
}

function scriptResponse() {
	return new Response("export {};", { headers: { "Content-Type": "text/javascript; charset=utf-8" } });
}

async function setupWorker() {
	const entries = new Map<string, Response>();

	const cache = {
		match: vi.fn((request: Request) => Promise.resolve(entries.get(request.url)?.clone())),
		put: vi.fn((request: Request, response: Response) => {
			entries.set(request.url, response);

			return Promise.resolve();
		})
	};

	const cacheStorage = {
		delete: vi.fn<(name: string) => Promise<boolean>>().mockResolvedValue(true),
		keys: vi.fn<() => Promise<string[]>>().mockResolvedValue([]),
		open: vi.fn<(name: string) => Promise<typeof cache>>().mockResolvedValue(cache)
	};

	const fetchResponse = vi.fn<typeof fetch>();

	const claim = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);

	const worker = Object.assign(new EventTarget(), {
		clients: { claim },
		location: new URL(ORIGIN)
	});

	vi.stubGlobal("__SERVICE_WORKER_ASSETS__", [ SCRIPT, STYLESHEET ]);
	vi.stubGlobal("__SERVICE_WORKER_SHELL__", SHELL);
	vi.stubGlobal("__VERSION_HASH__", "test-version");
	vi.stubGlobal("caches", cacheStorage);
	vi.stubGlobal("fetch", fetchResponse);
	vi.stubGlobal("self", worker);
	vi.resetModules();

	await import("./service-worker");

	function fetchRequest(request: Request) {
		const respondWith = vi.fn<(promise: Promise<Response>) => void>();
		const waitUntil = vi.fn<(promise: Promise<unknown>) => void>();

		worker.dispatchEvent(Object.assign(new Event("fetch"), {
			request,
			respondWith,
			waitUntil
		}));

		return {
			response: respondWith.mock.calls.at(0)?.[0],
			waitUntil
		};
	}

	function runLifecycle(event: "activate" | "install") {
		const waitUntil = vi.fn<(promise: Promise<unknown>) => void>();
		worker.dispatchEvent(Object.assign(new Event(event), { waitUntil }));

		return waitUntil.mock.calls.at(0)?.[0];
	}

	return {
		cache,
		cacheStorage,
		claim,
		entries,
		fetchRequest,
		fetchResponse,
		runLifecycle
	};
}

afterEach(() => vi.unstubAllGlobals());

describe("service worker navigation", () => {
	it("returns the live response after an HTTP 402 and avoids caching navigation responses", async () => {
		const { cache, entries, fetchRequest, fetchResponse } = await setupWorker();
		const request = navigation("/sun");

		entries.set(request.url, new Response("Older page"));

		fetchResponse
			.mockResolvedValueOnce(new Response("Deployment disabled", { status: 402 }))
			.mockResolvedValueOnce(new Response("Updated page"));

		expect((await fetchRequest(request).response)?.status).toBe(402);

		const recovered = await fetchRequest(request).response;

		expect(await recovered?.text()).toBe("Updated page");
		expect(fetchResponse).toHaveBeenCalledTimes(2);
		expect(cache.put).not.toHaveBeenCalled();
		expect(cache.match).not.toHaveBeenCalled();
	});

	it("uses the same offline shell for unseen app routes and queries", async () => {
		const { fetchRequest, fetchResponse } = await setupWorker();

		fetchResponse.mockRejectedValue(new TypeError("Network unavailable"));

		for (const path of [ "/sun?latitude=59.9&longitude=30.3", "/about/?datetime=2026-11-26" ]) {
			const request = navigation(path);
			const response = await fetchRequest(request).response;
			expect(response?.headers.get("Content-Type")).toBe("text/html; charset=utf-8");
			expect(await response?.text()).toBe(SHELL);
			expect(fetchResponse).toHaveBeenCalledWith(request);
		}
	});

	it("leaves unknown assets, cross-origin requests, non-GETs and ranges to the browser", async () => {
		const { fetchRequest, fetchResponse } = await setupWorker();

		const requests = [
			navigation("/assets/not-in-this-build.js"),
			new Request(`https://somewhere.example${SCRIPT}`),
			new Request(`${ORIGIN}${SCRIPT}`, { method: "POST" }),
			new Request(`${ORIGIN}${SCRIPT}`, { headers: { Range: "bytes=0-5" } })
		];

		for (const request of requests) {
			expect(fetchRequest(request).response).toBeUndefined();
		}

		expect(fetchResponse).not.toHaveBeenCalled();
	});
});

describe("service worker asset caching", () => {
	it("discards cached errors and serves a valid cached script after recovery", async () => {
		const { entries, fetchRequest, fetchResponse } = await setupWorker();

		const request = assetRequest();
		const healthy = scriptResponse();

		entries.set(request.url, new Response("Deployment disabled", { status: 402 }));

		fetchResponse.mockResolvedValueOnce(healthy);

		const first = fetchRequest(request);
		expect(await first.response).toBe(healthy);
		await first.waitUntil.mock.calls.at(0)?.[0];
		const cached = await fetchRequest(request).response;
		expect(await cached?.text()).toBe("export {};");
		expect(fetchResponse).toHaveBeenCalledOnce();
	});

	it("leaves HTTP errors and HTML fallbacks out of the asset cache", async () => {
		const { cache, fetchRequest, fetchResponse } = await setupWorker();

		const fallback = new Response(SHELL, { headers: { "Content-Type": "text/html" } });

		fetchResponse
			.mockResolvedValueOnce(new Response("Unavailable", { status: 503 }))
			.mockResolvedValueOnce(fallback)
			.mockResolvedValueOnce(scriptResponse());

		expect((await fetchRequest(assetRequest()).response)?.status).toBe(503);
		expect(await fetchRequest(assetRequest()).response).toBe(fallback);
		expect(cache.put).not.toHaveBeenCalled();
		expect((await fetchRequest(assetRequest()).response)?.status).toBe(200);
		expect(cache.put).toHaveBeenCalledOnce();
	});

	it("returns the network response when the cache cannot be opened or read", async () => {
		const { cache, cacheStorage, fetchRequest, fetchResponse } = await setupWorker();

		cacheStorage.open.mockRejectedValueOnce(new Error("Cache unavailable"));
		cache.match.mockRejectedValueOnce(new Error("Cache read failed"));

		fetchResponse.mockImplementation(() => Promise.resolve(scriptResponse()));

		expect((await fetchRequest(assetRequest()).response)?.status).toBe(200);
		expect((await fetchRequest(assetRequest()).response)?.status).toBe(200);
		expect(fetchResponse).toHaveBeenCalledTimes(2);
	});

	it("returns a valid response while the cache write is pending and tolerates its failure", async () => {
		const { cache, fetchRequest, fetchResponse } = await setupWorker();

		const healthy = scriptResponse();

		let failWrite: (error: Error) => void = () => undefined;

		cache.put.mockImplementationOnce(() => new Promise((_resolve, reject) => { failWrite = reject; }));
		fetchResponse.mockResolvedValueOnce(healthy);

		const load = fetchRequest(assetRequest());
		expect(await load.response).toBe(healthy);
		expect(load.waitUntil).toHaveBeenCalledOnce();
		failWrite(new Error("Cache quota exceeded"));
		await expect(load.waitUntil.mock.calls.at(0)?.[0]).resolves.toBeUndefined();
	});
});

describe("service worker lifecycle", () => {
	it("precaches only the listed build assets and reuses entries for the same version", async () => {
		const { cacheStorage, entries, fetchResponse, runLifecycle } = await setupWorker();

		fetchResponse
			.mockResolvedValueOnce(scriptResponse())
			.mockResolvedValueOnce(new Response("body {}", { headers: { "Content-Type": "text/css" } }));

		await runLifecycle("install");
		await runLifecycle("install");
		expect(cacheStorage.open).toHaveBeenCalledWith(CURRENT_CACHE);
		expect(fetchResponse).toHaveBeenCalledTimes(2);
		expect([ ...entries.keys() ]).toEqual([ `${ORIGIN}${SCRIPT}`, `${ORIGIN}${STYLESHEET}` ]);
	});

	it("rejects installation when a required bundle returns HTML", async () => {
		const { entries, fetchResponse, runLifecycle } = await setupWorker();

		fetchResponse.mockResolvedValue(new Response(SHELL, { headers: { "Content-Type": "text/html" } }));

		await expect(runLifecycle("install")).rejects.toThrow("Could not precache");
		expect(entries.size).toBe(0);
	});

	it("keeps unrelated caches and caches from installations that started later", async () => {
		const { cacheStorage, claim, runLifecycle } = await setupWorker();

		cacheStorage.keys.mockResolvedValue([
			"unrelated-cache",
			"photo-companion-build-old",
			CURRENT_CACHE,
			"photo-companion-build-installing"
		]);

		await runLifecycle("activate");
		expect(cacheStorage.delete.mock.calls).toEqual([[ "photo-companion-build-old" ]]);
		expect(claim).toHaveBeenCalledOnce();
	});
});
