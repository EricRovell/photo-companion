// @vitest-environment node

import { afterEach, describe, expect, it, vi } from "vitest";

import { createContextState } from "./service-worker-model";

function createWorker(state: ServiceWorkerState) {
	return Object.assign(new EventTarget(), {
		postMessage: vi.fn(),
		state
	});
}

type Worker = ReturnType<typeof createWorker>;

function setup(controller: Nullable<Worker>, waiting: Nullable<Worker> = null, installing: Nullable<Worker> = null) {
	const registration = Object.assign(new EventTarget(), {
		installing,
		waiting
	});

	const serviceWorker = Object.assign(new EventTarget(), {
		controller,
		register: vi.fn().mockResolvedValue(registration)
	});

	const reload = vi.fn();

	vi.stubGlobal("navigator", { serviceWorker });
	vi.stubGlobal("window", { location: { reload } });

	return {
		registration,
		reload,
		serviceWorker,
		state: createContextState()
	};
}

afterEach(() => vi.unstubAllGlobals());

describe("service worker updates", () => {
	it("keeps the initial page open and reloads once when its controller changes to a new version", async () => {
		const { reload, serviceWorker, state } = setup(null);
		await state.initServiceWorker();

		serviceWorker.controller = createWorker("activated");
		serviceWorker.dispatchEvent(new Event("controllerchange"));
		expect(reload).not.toHaveBeenCalled();

		serviceWorker.controller = createWorker("activated");
		serviceWorker.dispatchEvent(new Event("controllerchange"));
		serviceWorker.dispatchEvent(new Event("controllerchange"));
		expect(reload).toHaveBeenCalledOnce();
	});

	it("offers an update already waiting when the page opens", async () => {
		const waiting = createWorker("installed");
		const { state } = setup(createWorker("activated"), waiting);
		await state.initServiceWorker();

		expect(state.getSuggestUpdate()).toBe(true);
		state.handleReload();
		expect(waiting.postMessage).toHaveBeenCalledWith({ action: "skipWaiting" });
	});

	it.each([ true, false ])("offers the update when installation finishes (in progress on registration: %s)", async (inProgress) => {
		const installing = createWorker("installing");
		const { registration, state } = setup(createWorker("activated"), null, inProgress ? installing : null);
		await state.initServiceWorker();

		if (!inProgress) {
			registration.installing = installing;
			registration.dispatchEvent(new Event("updatefound"));
		}

		expect(state.getSuggestUpdate()).toBe(false);
		registration.installing = null;
		registration.waiting = installing;
		installing.state = "installed";
		installing.dispatchEvent(new Event("statechange"));

		expect(state.getSuggestUpdate()).toBe(true);
		state.handleReload();
		expect(installing.postMessage).toHaveBeenCalledWith({ action: "skipWaiting" });
	});
});
