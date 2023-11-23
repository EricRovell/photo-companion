<script lang="ts">
	import { Event, GaugeTime, Sun, Timeline } from "@lib/components";
	import { getSunData, getSunEvents } from "@services/sun";
	import { dict } from "@lib/dict";
	import { LAT, LON } from "@lib/constants";
	import styles from "./sun.module.css";

	export let date: Date;

	let state: ReturnType<typeof getSunData> = getSunData(date, LAT, LON);

	const sunSize = 30;

	$: state = getSunData(date, LAT, LON);
</script>

<div class="{styles.page}">
	<section data-label="sun" class="card">
		<header>
			<h2>{dict["header-sun-moontimes"]}</h2>
		</header>
		<GaugeTime
			timeFrom="{state.sunriseStart.value}"
			timeTo="{state.sunsetEnd.value}"
		>
			<Sun
				x="-{sunSize / 2}"
				y="-{sunSize / 2}"
				width="{sunSize}"
				height="{sunSize}"
			/>
		</GaugeTime>
	</section>
	<section data-label="timeline">
		<Timeline>
			{#each getSunEvents(date, LAT, LON).sort((a, b) => a.timestamp - b.timestamp) as event (`${event.timestamp}/${event.name}`)}
				<Event {event} />
			{/each}
		</Timeline>
	</section>
</div>
