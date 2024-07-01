<svelte:options namespace="svg" />

<script lang="ts">
	import { isSameDay } from "utils/date";

	import { settingsStore as store } from "@lib/stores";
	import { createPathBuilder } from "./elevation-graph.helpers";
	import type { AltitudeGetter } from "./elevation-graph.types";
	import styles from "./elevation-graph.module.css";

	export let date: Date;
	export let getAltitude: AltitudeGetter;

	const buildPath = createPathBuilder(getAltitude);
	let lastDate = new Date(date);
	let path = buildPath(date, $store.latitude, $store.longitude);

	$: {
		// no need to build a path for the same date
		if (!isSameDay(date, lastDate)) {
			path = buildPath(date, $store.latitude, $store.longitude);
			lastDate = new Date(date);
		}
	}
</script>

<path
	class="{styles.graph}"
	d="{path}"
/>
