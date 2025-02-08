import { createContext, createSignal, DEV, onMount, type ParentProps, useContext } from "solid-js";
import { isNullable } from "utils/validators";

const SW_PATH = "/service-worker.js";

function createContextState() {
	const [ getServiceWorker, setServiceWorker ] = createSignal<Nullable<ServiceWorker>>(null);
	const [ getRegistration, setRegistration ] = createSignal<Nullable<ServiceWorkerRegistration>>(null);
	const [ getIsUpdating, setIsUpdating ] = createSignal(false);
	const [ getSuggestUpdate, setSuggestUpdate ] = createSignal(false);

	async function initServiceWorker() {
		if (!isNullable(getRegistration())) {
			return;
		}

		if (!("serviceWorker" in navigator)) {
			return;
		}

		navigator.serviceWorker.addEventListener("controllerchange", () => {
			if (!getIsUpdating()) {
				window.location.reload();
				setIsUpdating(true);
			}
		});

		try {
			const registration = await navigator.serviceWorker.register(SW_PATH, {
				scope: "/"
			});

			setRegistration(registration);

			registration.addEventListener("updatefound", () => {
				const worker = registration.installing;
				setServiceWorker(worker);

				if (isNullable(worker)) {
					return;
				}

				worker.addEventListener("statechange", () => {
					if (worker.state === "installed" && navigator.serviceWorker.controller) {
						setSuggestUpdate(true);
					}
				});
			});
		} catch (error) {
			console.error(`Service worker registration failed with ${error}`);
		}
	}

	function handleReload() {
		getServiceWorker()?.postMessage({
			action: "skipWaiting"
		});
	};

	return {
		getIsUpdating,
		getRegistration,
		getServiceWorker,
		getSuggestUpdate,
		handleReload,
		initServiceWorker,
		setSuggestUpdate
	};
}

const ServiceWorkerContext = createContext<ReturnType<typeof createContextState>>();

export function ServiceWorkerProvider(props: ParentProps) {
	const state = createContextState();

	onMount(() => {
		if (!DEV) {
			void state.initServiceWorker();
		}
	});

	return (
		<ServiceWorkerContext.Provider value={state}>
			{props.children}
		</ServiceWorkerContext.Provider>
	);
}

export function useServiceWorker() {
	const value = useContext(ServiceWorkerContext);

	if (isNullable(value)) {
		throw new Error("useSettings must be used with a ServiceWorker.Provider");
	}

	return value;
}
