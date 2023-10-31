<script lang="ts">
	import styles from "./moon.module.css";

	export let phase = 0;
	export let rotation = 0;

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
</script>

<div
	class="{styles.moon}"
	style="
		--transform: rotate({rotation})deg;
		--moon-disk-angle: {getNormalizedAngleRad(phase)}rad;
	"
>
	<div
		class="{styles.half}"
		class:visible="{phase >= 0.5}"
	>
		<div class="{styles.circle}" />
	</div>
	<div
		class="{styles.diff}"
		class:dark="{0.5 / getNormalizedPhase(phase) > 2}"
	/>
	<div
		class="{styles.half}"
		class:visible="{phase <= 0.5}"
	>
		<div class="{styles.circle}" />
	</div>
</div>
