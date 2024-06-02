<svelte:options namespace="svg" />

<script lang="ts">
	import { polarToCartesian } from "./gauge.helpers";
	import styles from "./gauge.module.css";

	export let angle = 0;
	export let label: Undefinable<string> = undefined;
	export let radius: number;
</script>

<text
	class="{styles.label}"
	x="{polarToCartesian(0, 0, radius, angle).x}"
	y="{polarToCartesian(0, 0, radius, angle).y}"
	transform={angle > 180 ? `rotate(${angle - 270})` : `rotate(${angle - 90})`}
	transform-origin="center"
	dominant-baseline="central"
>
	{label}
</text>
