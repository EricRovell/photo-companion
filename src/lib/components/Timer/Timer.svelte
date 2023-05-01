<script lang="ts">
	import { onMount, createEventDispatcher } from "svelte";
	import { formatTime, calcSecondsLeft } from "./timer.helpers";
	import styles from "./timer.module.css";

	export let timestamp: number;

	const dispatch = createEventDispatcher();
	let secondsLeft: number = calcSecondsLeft(timestamp);
	let timer: number | undefined = undefined;

	onMount(() => {
		timer = setInterval(() => {
			secondsLeft -= 1;
		}, 1000);

		return () => clearInterval(timer);
	});

	$: time = formatTime(secondsLeft);
	$: if (secondsLeft <= 0) {
		dispatch("alarm");
	}
</script>

<output class="{styles.date}" lang="en">
	{time.hours}:{time.minutes}:{time.seconds}
</output>
