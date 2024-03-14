<svelte:options namespace="svg" />

<script lang="ts">
	import { onMount } from "svelte";
	import { isNonNegativeInteger } from "utils/validators";

	import { getAngleFromTime } from "@lib/helpers";
	import styles from "./gauge.module.css";

	export let angle: number | undefined;
	export let cx: number;
	export let cy: number;
	export let r = 1;

	let currentTimeAngle = getAngleFromTime(new Date());
	let timer: number | undefined = undefined;

	// Preventing from rendering both pointers when they are too close
	const getOpacity = (currentTimeAngle: number, angle?: number) => {
		if (!isNonNegativeInteger(angle)) {
			return 1;
		}

		return Math.abs(currentTimeAngle - angle) <= 3
			? 0
			: 1;
	};

	onMount(() => {
		// The are 86 400 000 ms per day
		// 1 degree = 240 000 ms
		timer = window.setInterval(() => {
			currentTimeAngle += 1;
		}, 240000);

		return () => window.clearInterval(timer);
	});
</script>

<path
	class="{styles.pointer} {styles["current-pointer"]}"
	d="M {cx - r},{cy + r} L {cx + r},{cy - r} M {cx - r},{cy - r} L {cx + r},{cy + r}"
	style="--gauge-pointer-angle: {currentTimeAngle}deg;"
	opacity="{getOpacity(currentTimeAngle, angle)}"
/>
