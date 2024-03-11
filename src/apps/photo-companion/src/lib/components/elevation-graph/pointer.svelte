<svelte:options namespace="svg" />

<script lang="ts">
	import { settingsStore as store } from "@lib/stores";
	import { createObjectCoordsGetter } from "./elevation-graph.helpers";
	import { setAttribute } from "@lib/helpers";
	import type { AltitudeGetter } from "./elevation-graph.types";
	import styles from "./elevation-graph.module.css";

	export let date: Date;
	export let getAltitude: AltitudeGetter;

	const getPosition = createObjectCoordsGetter(getAltitude);

	$: position = getPosition(date, $store.latitude, $store.longitude);
</script>

<circle
	class="{styles.pointer}"
	data-above="{setAttribute(position.y >= 0)}"
	cx="{position.x}"
	cy="{position.y}"
/>
