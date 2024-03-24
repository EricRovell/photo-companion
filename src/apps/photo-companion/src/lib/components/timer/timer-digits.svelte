<script lang="ts">
	import { onMount, createEventDispatcher, afterUpdate } from "svelte";

	import { formatDatetime } from "@stores/locale";
	import Digit from "../seven-segment-display/seven-segment-digit.svelte";
	import Colon from "../seven-segment-display/segment-colon.svelte";
	import { createTimer } from "./timer-store";
	import { getTime } from "./timer.helpers";
	import styles from "./timer.module.css";

	export let timestamp: number;

	const dispatch = createEventDispatcher();

	const timer = createTimer(timestamp, {
		callback: () => dispatch("alarm")
	});

	$: time = getTime($timer);
	$: title = formatDatetime(new Date(timestamp));

	onMount(() => {
		timer.start();

		return () => timer.stop();
	});

	afterUpdate(() => {
		timer.set(timestamp);
	});
</script>

<time
	class="{styles["timer-digits"]}"
	datetime="{title}"
	{title}
>
	<Digit digit="{time.hours[0]}" />
	<Digit digit="{time.hours[1]}" />
	<Colon />
	<Digit digit="{time.minutes[0]}" />
	<Digit digit="{time.minutes[1]}" />
	<Colon />
	<Digit digit="{time.seconds[0]}" />
	<Digit digit="{time.seconds[1]}" />
</time>
