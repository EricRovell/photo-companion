<script lang="ts">
	import { tweened } from "svelte/motion";
	import styles from "./moon.module.css";

	export let phase = 0;
	export let rotation = 0;
	export let size = 100;
	export let radius = size / 2 - 10;
	export let precision = 0.025;

	let center = size / 2;
	const phaseTweened = tweened(phase);

	const getNormalizedPhase = (phase: number) => {
		return phase <= 0.5
			? phase
			: 1 - phase;
	};

	const getNormalizedAngleRad = (phase: number) => {
		const norm = getNormalizedPhase(phase);
		const radians = (Math.PI * norm) / 0.5;
		return radians;
	};

	$: void phaseTweened.set(phase);
</script>

<svg
	class="{styles.moon}"
	viewBox="0 0 {size} {size}"
	style="
		--moon-disk-angle: {getNormalizedAngleRad($phaseTweened)}rad;
		transform: rotate({rotation}rad);
	"
>
	<circle
		class="{styles.shadow}"
		cx="{center}"
		cy="{center}"
		r="{radius}"
	/>
	<circle
		class="{styles.semicircle}"
		class:visible="{$phaseTweened >= 0.5 && $phaseTweened < 1 - precision}"
		data-left
		cx="{center}"
		cy="{center}"
		r="{radius}"
	/>
	<circle
		class="{styles.semicircle}"
		class:visible="{$phaseTweened <= 0.5 && $phaseTweened >= precision}"
		data-right
		cx="{center}"
		cy="{center}"
		r="{radius}"
	/>
	<circle
		class="{styles.diff}"
		class:dark="{0.5 / getNormalizedPhase($phaseTweened) > 2}"
		cx="{center}"
		cy="{center}"
		r="{radius}"
	/>
</svg>
