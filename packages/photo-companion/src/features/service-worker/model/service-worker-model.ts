import { createSignal } from "solid-js";
import { isNullable } from "utils/validators";

const SW_PATH = "/service-worker.js";

export function createContextState() {
	const [ getSuggestUpdate, setSuggestUpdate ] = createSignal(false);

	let activateWaitingWorker: Nullable<() => void> = null;
	let registering = false;

	async function initServiceWorker() {
		if (activateWaitingWorker || registering || !("serviceWorker" in navigator)) {
			return;
		}

		registering = true;

		const serviceWorkers = navigator.serviceWorker;
		let controller = serviceWorkers.controller;

		let reloading = false;

		function handleControllerChange() {
			const nextController = serviceWorkers.controller;
			const isUpdate = (
				!isNullable(controller) &&
				!isNullable(nextController)
				&& nextController !== controller
			);

			controller = nextController;

			if (isUpdate && !reloading) {
				reloading = true;
				window.location.reload();
			}
		}

		serviceWorkers.addEventListener("controllerchange", handleControllerChange);

		try {
			const registration = await serviceWorkers.register(SW_PATH, { scope: "/" });

			activateWaitingWorker = () => registration.waiting?.postMessage({ action: "skipWaiting" });

			let watchedWorker: Nullable<ServiceWorker> = null;

			function showWaitingWorker() {
				setSuggestUpdate(!isNullable(registration.waiting) && !isNullable(serviceWorkers.controller));
			}

			function watchInstallation() {
				showWaitingWorker();
				const worker = registration.installing;

				if (isNullable(worker) || worker === watchedWorker) {
					return;
				}

				watchedWorker = worker;

				worker.addEventListener("statechange", () => {
					if (worker.state === "installed") {
						showWaitingWorker();
					}
				});
			}

			registration.addEventListener("updatefound", watchInstallation);

			watchInstallation();
		} catch (error) {
			serviceWorkers.removeEventListener("controllerchange", handleControllerChange);
			console.error(`Service worker registration failed with ${error}`);
		} finally {
			registering = false;
		}
	}

	return {
		getSuggestUpdate,
		handleReload: () => activateWaitingWorker?.(),
		initServiceWorker,
		setSuggestUpdate
	};
}
