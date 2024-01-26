<script lang="ts">
	import { click, query, prefs }from "svelte-pathfinder";
	import { App, ServiceWorker } from "@lib/layout";
	import { settingsStore } from "@lib/settings-store";

	prefs.scroll = true;

	const { latitude, longitude } = settingsStore.init();

	$query.lat = latitude;
	$query.lon = longitude;
</script>

<svelte:window on:click="{click}" />

{#if import.meta.env.PROD}
	<ServiceWorker />
{/if}

<App />
