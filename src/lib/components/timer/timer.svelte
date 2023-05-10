<script lang="ts">
	import { afterUpdate, onMount, createEventDispatcher } from "svelte";
	import Digit from "../seven-segment-display/seven-segment-digit.svelte";
	import Colon from "../seven-segment-display/segment-colon.svelte";
	import { formatTime, calcSecondsLeft } from "./timer.helpers";
	import styles from "./timer.module.css";

	export let timestamp: number;

	const dispatch = createEventDispatcher();
	let secondsLeft: number = calcSecondsLeft(timestamp);
	let intervalId: number | undefined = undefined;

	const startTimer = () => {
		intervalId = setInterval(() => {
			secondsLeft -= 1;
		}, 1000);
	};

	const stopTimer = () => {
		clearInterval(intervalId);
	};

	onMount(() => {
		startTimer();

		return () => stopTimer();
	});

	afterUpdate(() => {
		stopTimer();
		dispatch("alarm");
		secondsLeft = calcSecondsLeft(timestamp);
		startTimer();
	});

	$: time = formatTime(secondsLeft);
	$: if (secondsLeft <= 0) {
		stopTimer();
		dispatch("alarm");
	}
</script>

<output class="{styles.timer}">
	<Digit digit="{time.hours[0]}" />
	<Digit digit="{time.hours[1]}" />
	<Colon />
	<Digit digit="{time.minutes[0]}" />
	<Digit digit="{time.minutes[1]}" />
	<Colon />
	<Digit digit="{time.seconds[0]}" />
	<Digit digit="{time.seconds[1]}" />
</output>
