<script lang="ts">
	import { tweened } from "svelte/motion";
	import Gauge from "./gauge.svelte";
	import { getAngleFromTime, formatTime } from "../../helpers";

	export let timeFrom: Date;
	export let timeTo: Date;

	let angles = tweened({
		start: getAngleFromTime(timeFrom),
		end: getAngleFromTime(timeTo)
	}, {
		duration: 500
	});

	let labelStart = formatTime(timeFrom.getTime());
	let labelEnd = formatTime(timeTo.getTime());

	const calcProps = (timeFrom: Date, timeTo: Date) => {
		void angles.set({
			start: getAngleFromTime(timeFrom),
			end: getAngleFromTime(timeTo)
		});

		labelStart = formatTime(timeFrom.getTime());
		labelEnd = formatTime(timeTo.getTime());
	};

	$: calcProps(timeFrom, timeTo);
</script>

<Gauge
	angleStart="{$angles.start}"
	angleEnd="{$angles.end}"
	{labelStart}
	{labelEnd}
	{...$$restProps}
>
	<slot />
</Gauge>
