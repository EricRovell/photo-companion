<svelte:options namespace="svg" />

<script lang="ts">
	import { X_RANGE, Y_MIN, Y_RANGE, Y_RANGE_TICKS } from "./elevation-graph.consts";
	import styles from "./elevation-graph.module.css";

	const viewbox = {
		x: 0,
		y: Y_MIN - Y_RANGE_TICKS,
		width: X_RANGE,
		height: Y_RANGE
	};
</script>

<svg
	class="{styles.view}"
	viewBox="{viewbox.x} {viewbox.y} {viewbox.width} {viewbox.height + Y_RANGE_TICKS}"
>
	<line class="{styles["zero-axis"]}" x1="0" y1="0" x2="{X_RANGE}" y2="0" />
	<slot />
</svg>
