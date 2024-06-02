<script lang="ts">
	import { click, query, path }from "svelte-pathfinder";

	import Routes from "./router/routes.svelte";
	import { ServiceWorker } from "@lib/layout";
	import { settingsStore, navigationStore } from "@lib/stores";
	import { getTabUrl } from "@lib/stores/navigation";

	const store = settingsStore.init();

	// TODO use redirect
	if (!$path[0]) {
		$path[0] = getTabUrl($navigationStore[0]).slice(1);
	}

	$query.latitude = store.latitude;
	$query.longitude = store.longitude;
</script>

<svelte:window on:click="{click}" />

{#if import.meta.env.PROD}
	<ServiceWorker />
{/if}

<Routes />
