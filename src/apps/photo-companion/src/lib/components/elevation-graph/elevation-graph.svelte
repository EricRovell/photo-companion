<script lang="ts">
	import View from "./view.svelte";
	import Graph from "./path.svelte";
	import XTick from "./x-tick.svelte";
	import Pointer from "./pointer.svelte";
	import type { GraphEntry } from "./elevation-graph.types";

	export let date: Date = new Date();
	export let entries: GraphEntry[] = [];
</script>

<View>
	{#each entries as { getAltitude, className, id }}
		<g class="{className}" data-id="{id}">
			<Graph {date} {getAltitude} />
			<Pointer {date} {getAltitude} />
		</g>
	{/each}
	<XTick />
</View>
