<script lang="ts">
	import { click, query, path, prefs }from "svelte-pathfinder";
	import { App, ServiceWorker } from "@lib/layout";
	import { settingsStore } from "@lib/settings-store";

	prefs.scroll = true;

	const store = settingsStore.init();

	// TODO use redirect
	if (!$path[0]) {
		$path[0] = store.starting_page;
	}

	$query.latitude = store.latitude;
	$query.longitude = store.longitude;
</script>

<svelte:window on:click="{click}" />

{#if import.meta.env.PROD}
	<ServiceWorker />
{/if}

<App />
