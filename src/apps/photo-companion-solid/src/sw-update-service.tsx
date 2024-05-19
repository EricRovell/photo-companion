import { t } from "@lib/stores/lang";
import { onMount } from "solid-js";
import { Button, Modal } from "ui-solid";
import { createBoolean } from "ui-solid/primitives";

export function UpdateService() {
	const [ getShowModal, openModal, closeModal ] = createBoolean();

	let refreshing = false;
	let newWorker: Nullable<ServiceWorker> = null;

	const handleReload = () => {
		newWorker?.postMessage({ action: "skipWaiting" });
	};

	const initServiceWorker = async () => {
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker.addEventListener("controllerchange", () => {
				if (!refreshing) {
					window.location.reload();
					refreshing = true;
				}
			});

			try {
				const registration = await navigator.serviceWorker.register("/service-worker.js", {
					scope: "/"
				});

				registration.addEventListener("updatefound", () => {
					newWorker = registration.installing;
					newWorker?.addEventListener("statechange", () => {
						if (newWorker?.state === "installed" && navigator.serviceWorker.controller) {
							openModal();
						}
					});
				});
			} catch (error) {
				console.error(`Service worker registration failed with ${error}`);
			}
		}
	};

	onMount(() => {
		void initServiceWorker();
	});

	return (
		<Modal
			title={t().TITLE.UPDATE}
			open={getShowModal()}
			onClose={closeModal}
		>
			<p>{t().MESSAGE.UPDATE}</p>
			<Button onClick={handleReload}>
				{t().LABEL.RELOAD}
			</Button>
		</Modal>
	);
}
