<svelte:options namespace="svg" />

<script lang="ts">
	import { describeArc, polarToCartesian, createMarksCoords } from "./gauge.helpers";
	import { isNonNegativeInteger } from "@shared/utils";
	import styles from "./gauge.module.css";

	export let angleStart = 0;
	export let angleEnd = 240;
	export let radius = 25;
	export let width = 10;
	export let labelStart: string | undefined = "";
	export let labelEnd: string | undefined = "";
	export let labelGap = 18;
	export let pointerGap = 8;
	export let pointerSize = 1;
	export let pointerAngle: number | undefined = undefined;

	const checkIsPointerActive = (angle: number, angleStart: number, angleEnd: number) => {
		if (angleEnd >= angleStart) {
			return angle >= angleStart && angle <= angleEnd;
		}

		return (angle >= angleStart && angle <= 360) || (angle >= 0 && angle <= angleEnd);
	};
</script>

<svg viewBox="-50 -50 100 100" class="{styles.gauge}">
	<circle
		class="{styles["progress-background"]}"
		cx="{0}"
		cy="{0}"
		r="{radius}"
		stroke-width="{width}"
	/>
	<path
		class="{styles.progress}"
		d="{describeArc(0, 0, radius, angleStart, angleEnd)}"
		stroke-width="{width}"
	/>
	<g class="{styles.marks}">
		{#each createMarksCoords(24, radius + width / 2, radius + 10) as { x1, y1, x2, y2 }}
			<line {x1} {y1} {x2} {y2} />
		{/each}
		{#each createMarksCoords(4, radius + width / 2, radius + 15) as { x1, y1, x2, y2 }}
			<line {x1} {y1} {x2} {y2} />
		{/each}
	</g>
	{#if angleStart > angleEnd}
		<line
			x1="{0}"
			y1="{-radius + width / 2}"
			x2="{0}" y2="{-radius - width / 2}"
			stroke="var(--color-surface-1)"
			stroke-width="0.5px"
		/>
	{/if}
	<slot />
	{#if isNonNegativeInteger(pointerAngle)}
		<circle
			cx="0"
			cy="-{radius + pointerGap}"
			r="{pointerSize}"
			class="{styles.pointer}"
			data-active="{checkIsPointerActive(pointerAngle, angleStart, angleEnd) ? "" : undefined}"
			style="--gauge-pointer-angle: {pointerAngle}deg;"
		/>
	{/if}
	<text
		class="{styles.label}"
		x="{polarToCartesian(0, 0, radius + labelGap, angleStart).x}"
		y="{polarToCartesian(0, 0, radius + labelGap, angleStart).y}"
		transform={angleStart > 180 ? `rotate(${angleStart - 270})` : `rotate(${angleStart - 90})`}
		transform-origin="center"
		dominant-baseline="central"
	>
		{labelStart}
	</text>
	<text
		class="{styles.label}"
		x="{polarToCartesian(0, 0, radius + labelGap, angleEnd).x}"
		y="{polarToCartesian(0, 0, radius + labelGap, angleEnd).y}"
		transform={angleEnd > 180 ? `rotate(${angleEnd - 270})` : `rotate(${angleEnd - 90})`}
		transform-origin="center center"
		dominant-baseline="central"
	>
		{labelEnd}
	</text>
</svg>
