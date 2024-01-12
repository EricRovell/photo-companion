<script lang="ts">
	import { Event, GaugeTime, Sun, Timeline } from "@lib/components";
	import { getSunData, getSunEvents } from "@services/sun";
	import { dict, template } from "@lib/dict";
	import styles from "./sun.module.css";

	export let date: Date;
	export let lat: number;
	export let lon: number;

	let state: ReturnType<typeof getSunData> = getSunData(date, lat, lon);

	const sunSize = 30;

	$: state = getSunData(date, lat, lon);
</script>

<div class="{styles.page}">
	<section data-label="sun" class="card">
		<header>
			<h2>{dict["header-sun-moontimes"]}</h2>
		</header>
		<GaugeTime
			timeFrom="{state.sunrise}"
			timeTo="{state.sunset}"
		>
			<Sun
				x="-{sunSize / 2}"
				y="-{sunSize / 2}"
				width="{sunSize}"
				height="{sunSize}"
			/>
		</GaugeTime>
		<footer>
			<p>{dict["duration-daylight"]}</p>
			<output>
				{template["hours-and-minutes"](state.dayDuration)}
			</output>
		</footer>
	</section>
	<section data-label="timeline">
		<Timeline>
			{#each getSunEvents(date, lat, lon).sort((a, b) => a.timestamp - b.timestamp) as event (`${event.timestamp}/${event.name}`)}
				<Event {event} />
			{/each}
		</Timeline>
	</section>
</div>
