<script lang="ts">
	import { Event, GaugeTime, Sun, Timeline } from "@lib/components";
	import { getSunData } from "@services/sun";
	import { dict, template } from "@lib/dict";
	import { initTimelineProvider } from "@services/events";
	import { settingsStore as store } from "@lib/settings-store";
	import styles from "./sun.module.css";

	export let date: Date;

	const timelineProvider = initTimelineProvider({
		sunEvents: []
	});

	let state: ReturnType<typeof getSunData> = getSunData(date, $store.latitude, $store.longitude);
	let events = timelineProvider.getEvents(date, $store.latitude, $store.longitude);

	const sunSize = 30;
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
			{#each events as event (`${event.timestamp}/${event.name}`)}
				<Event {event} />
			{/each}
		</Timeline>
	</section>
</div>
