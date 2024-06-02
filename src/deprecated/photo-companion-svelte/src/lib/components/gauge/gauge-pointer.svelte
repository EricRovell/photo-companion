<svelte:options namespace="svg" />

<script lang="ts">
	import { setAttribute } from "@lib/helpers";
	import styles from "./gauge.module.css";

	export let active: boolean;
	export let cx: number | string;
	export let cy: number | string;
	export let radius: number;
	export let angle: number;
</script>

<circle
	class="{styles.pointer}"
	{cx}
	{cy}
	r="{radius}"
	data-active="{setAttribute(active)}"
	style="--gauge-pointer-angle: {angle}deg;"
/>
