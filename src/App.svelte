<script lang="ts">
	import { click, query, prefs }from "svelte-pathfinder";
	import { App, ServiceWorker } from "@lib/layout";
	import { getUserLocation } from "@lib/helpers";
	import { LAT, LON } from "@lib/constants";

	prefs.scroll = true;

	const initLocation = async () => {
		if ($query.lat && $query.lon) {
			return;
		}

		try {
			$query.lat = LAT;
			$query.lon = LON;

			const position = await getUserLocation();

			console.log(position);

			if (position) {
				$query.lat = position.lat;
				$query.lon = position.lon;
			}
		} catch {
			$query.lat = LAT;
			$query.lon = LON;
		}
	};
</script>

<svelte:window on:click="{click}" />

{#if import.meta.env.PROD}
	<ServiceWorker />
{/if}

{#await initLocation()}
	<p>Loading...</p>
{:then}
	<App />
{/await}
