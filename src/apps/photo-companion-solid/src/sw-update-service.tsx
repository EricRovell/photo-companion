import { onMount } from "solid-js";
import { Button, Modal } from "ui-solid";
import { createToggle } from "ui-solid/primitives";

import { useTranslation } from "@lib/context";

export function UpdateService() {
	const { t } = useTranslation();
	const [ getShowModal, toggle ] = createToggle();

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
							toggle(true);
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
			onClose={() => toggle(false)}
			open={getShowModal()}
			title={t().TITLE.UPDATE}
		>
			<p>{t().MESSAGE.UPDATE}</p>
			<Button onClick={handleReload}>
				{t().LABEL.RELOAD}
			</Button>
		</Modal>
	);
}
