<svelte:options namespace="svg" />

<script lang="ts">
	import Label from "./gauge-label.svelte";
	import CurrentPointer from "./gauge-current-pointer.svelte";
	import Pointer from "./gauge-pointer.svelte";
	import { checkIsPointerActive, describeArc, createMarksCoords } from "./gauge.helpers";
	import { isNonNegativeInteger } from "@shared/utils";
	import styles from "./gauge.module.css";

	export let angleStart = 0;
	export let angleEnd = 240;
	export let radius = 25;
	export let width = 10;
	export let labelStart: string | undefined = "";
	export let labelEnd: string | undefined = "";
	export let labelGap = 17;
	export let pointerGap = 8;
	export let pointerSize = 1;
	export let pointerAngle: number | undefined = undefined;
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
			stroke-width="0.75px"
			opacity="0.5"
		/>
	{/if}
	<slot />
	<CurrentPointer
		angle="{pointerAngle}"
		cx="{0}"
		cy="{-radius - pointerGap}"
	/>
	{#if isNonNegativeInteger(pointerAngle)}
		<Pointer
			angle="{pointerAngle}"
			cx="{0}"
			cy="-{radius + pointerGap}"
			radius="{pointerSize}"
			active="{checkIsPointerActive(pointerAngle, angleStart, angleEnd)}"
		/>
	{/if}
	<Label
		angle="{angleStart}"
		label="{labelStart}"
		radius="{radius + labelGap}"
	/>
	<Label
		angle="{angleEnd}"
		label="{labelEnd}"
		radius="{radius + labelGap}"
	/>
</svg>
