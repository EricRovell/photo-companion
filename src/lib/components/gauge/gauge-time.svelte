<script lang="ts">
	import Gauge from "./gauge.svelte";
	import { getAngleFromTime, formatTime, isValidDate } from "../../helpers";

	export let timeFrom: Date;
	export let timeTo: Date;
</script>

{#if !isValidDate(timeFrom) || !isValidDate(timeTo)}
	<Gauge
		angleStart={0}
		labelStart=""
		angleEnd={0}
		labelEnd=""
		{...$$restProps}
	>
		<slot />
	</Gauge>
{:else}
	<Gauge
		angleStart={getAngleFromTime(timeFrom)}
		labelStart="{formatTime(timeFrom.getTime())}"
		angleEnd={getAngleFromTime(timeTo)}
		labelEnd="{formatTime(timeTo.getTime())}"
		{...$$restProps}
		>
		<slot />
	</Gauge>
{/if}
