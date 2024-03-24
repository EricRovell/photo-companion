<script lang="ts" context="module">
	import { tweened } from "svelte/motion";
	
	import { formatTimeShort } from "@locale";
	import Gauge from "./gauge.svelte";
	import { getAngleFromTime } from "../../helpers";

	const getAngleState = (timeFrom: Nullish<DateLike>, timeTo: Nullish<DateLike>) => ({
		start: getAngleFromTime(timeFrom),
		end: getAngleFromTime(timeTo, 360)
	});
</script>

<script lang="ts">
	export let timeFrom: Nullish<DateLike> = null;
	export let timeTo: Nullish<DateLike> = null;
	export let pointerAngle: Undefinable<number> = undefined;

	let { start, end } = getAngleState(timeFrom, timeTo);

	const angles = tweened({ start, end }, { duration: 500 });

	const updateState = (timeFrom: Nullish<DateLike>, timeTo: Nullish<DateLike>) => {
		const { start, end } = getAngleState(timeFrom, timeTo);
		void angles.set({ start, end });
	};

	$: updateState(timeFrom, timeTo);
</script>

<Gauge
	angleStart="{$angles.start}"
	angleEnd="{$angles.end}"
	labelStart="{formatTimeShort(timeFrom)}"
	labelEnd="{formatTimeShort(timeTo)}"
	{pointerAngle}
	{...$$restProps}
>
	<slot />
</Gauge>
