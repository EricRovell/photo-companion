<script lang="ts" context="module">
	import { tweened } from "svelte/motion";
	import Gauge from "./gauge.svelte";
	import { getAngleFromTime, renderDatetime } from "../../helpers";

	const getAngleState = (timeFrom: Date | null, timeTo: Date | null) => ({
		start: getAngleFromTime(timeFrom),
		end: getAngleFromTime(timeTo, 360)
	});
</script>

<script lang="ts">
	export let timeFrom: Date | null = null;
	export let timeTo: Date | null = null;
	export let pointerAngle: number | undefined = undefined;

	let { start, end } = getAngleState(timeFrom, timeTo);

	const angles = tweened({ start, end }, { duration: 500 });

	const updateState = (timeFrom: Date | null, timeTo: Date | null) => {
		const { start, end } = getAngleState(timeFrom, timeTo);
		void angles.set({ start, end });
	};

	$: updateState(timeFrom, timeTo);
</script>

<Gauge
	angleStart="{$angles.start}"
	angleEnd="{$angles.end}"
	labelStart="{renderDatetime(timeFrom, { timeStyle: "short" })}"
	labelEnd="{renderDatetime(timeTo, { timeStyle: "short" })}"
	{pointerAngle}
	{...$$restProps}
>
	<slot />
</Gauge>
