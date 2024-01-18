<script lang="ts">
	import { click, query, prefs }from "svelte-pathfinder";
	import { App, ServiceWorker } from "@lib/layout";
	import { settingsStore } from "@lib/settings-store";

	prefs.scroll = true;

	const { lat, lon } = settingsStore.init();

	$query.lat = lat;
	$query.lon = lon;
</script>

<svelte:window on:click="{click}" />

{#if import.meta.env.PROD}
	<ServiceWorker />
{/if}

<App />
