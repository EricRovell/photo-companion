<script lang="ts">
	import { onMount } from "svelte";
	import { Button, Icon } from "ui";
	import { iconClose } from "ui/icons";
	import { preventPageScroll } from "@lib/helpers";
	import { t } from "@stores/lang";
	import styles from "./service-worker.module.css";

	let newWorker: Nullish<ServiceWorker> = null;
	let refreshing = false;
	let dialog: HTMLDialogElement;

	const handleReload = () => {
		if (newWorker) {
			newWorker.postMessage({ action: "skipWaiting" });
		}
	};

	const handleClose = () => {
		dialog.close();
		preventPageScroll(false);
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
							dialog.showModal();
							preventPageScroll(true);
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
</script>

<dialog bind:this="{dialog}" class="{styles.dialog}">
	<aside>
		<header>
			<h2>{$t.TITLE.UPDATE}</h2>
			<Button on:click="{handleClose}" title="Close">
				<Icon path="{iconClose}" />
			</Button>
		</header>
		<div>
			<p>{$t.MESSAGE.UPDATE}</p>
			<Button on:click="{handleReload}">
				{$t.LABEL.RELOAD}
			</Button>
		</div>
	</aside>
</dialog>
