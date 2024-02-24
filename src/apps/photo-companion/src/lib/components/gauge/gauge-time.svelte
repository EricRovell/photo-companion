<script lang="ts" context="module">
	import { tweened } from "svelte/motion";
	import Gauge from "./gauge.svelte";
	import { getAngleFromTime, renderDatetime } from "../../helpers";

	const getState = (timeFrom: Date | null, timeTo: Date | null) => ({
		angleStart: timeFrom ? getAngleFromTime(timeFrom) : 0,
		angleEnd:  timeTo ? getAngleFromTime(timeTo) : 360,
		labelStart: timeFrom ? renderDatetime(timeFrom, { timeStyle: "short" }) : "",
		labelEnd: timeTo ? renderDatetime(timeTo, { timeStyle: "short" }) : ""
	});
</script>

<script lang="ts">
	export let timeFrom: Date | null = null;
	export let timeTo: Date | null = null;
	export let pointerAngle: number | undefined = undefined;

	let {
		angleStart,
		angleEnd,
		labelStart,
		labelEnd
	} = getState(timeFrom, timeTo);

	const angles = tweened({
		start: angleStart,
		end: angleEnd
	}, { duration: 500 });

	const updateState = (timeFrom: Date | null, timeTo: Date | null) => {
		const state = getState(timeFrom, timeTo);

		void angles.set({
			start: state.angleStart,
			end: state.angleEnd
		});

		labelStart = state.labelStart;
		labelEnd = state.labelEnd;
	};

	$: updateState(timeFrom, timeTo);
</script>

<Gauge
	angleStart="{$angles.start}"
	angleEnd="{$angles.end}"
	{labelStart}
	{labelEnd}
	{pointerAngle}
	{...$$restProps}
>
	<slot />
</Gauge>
