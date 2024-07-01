<svelte:options namespace="svg" />

<script lang="ts">
	import { getTicks } from "./elevation-graph.helpers";
	import styles from "./elevation-graph.module.css";
</script>

<g class="{styles.ticks}">
	{#each getTicks() as { x, y, text }}
		<text {x} {y} dominant-baseline="middle">
			{text}
		</text>
	{/each}
</g>
