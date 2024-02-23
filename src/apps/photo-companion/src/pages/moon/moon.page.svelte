<script lang="ts">
	import { query } from "svelte-pathfinder";
	import { GaugeTime, Moon, Datetime, Timeline, Event, Link } from "@lib/components";
	import { getMoonData } from "@services/moon";
	import { initTimelineProvider } from "@services/events";
	import { dict } from "@lib/dict";
	import { settingsStore as store } from "@lib/settings-store";
	import { createQueryDate, round } from "@lib/helpers";
	import { SUN_EVENT_NAMES } from "@lib/constants";
	import styles from "./moon.module.css";

	export let date: Date;

	const moonSize = 48;

	const timelineProvider = initTimelineProvider({
		moonEvents: [],
		sunEvents: SUN_EVENT_NAMES.filter(item => item !== "SUNRISE_START" && item !== "SUNSET_END"),
		secondaryEvents: new Set([ "SUNRISE_START", "SUNSET_END" ])
	});

	$: state = getMoonData(date, $store.latitude, $store.longitude);
	$: events = timelineProvider.getEvents(date, $store.latitude, $store.longitude);
</script>

<div class="{styles.page}">
	<section data-label="moon" class="card {styles.root}">
		<header>
			<h2>{dict.TITLE.MOON_TIMES}</h2>
		</header>
		<GaugeTime
			timeFrom="{state.moonrise}"
			timeTo="{state.moonset}"
		>
			<foreignObject
				xmlns="http://www.w3.org/2000/svg"
				x="-{moonSize / 2}"
				y="-{moonSize / 2}"
				width="{moonSize}"
				height="{moonSize}"
			>
				<Moon
					phase="{state.phaseValue}"
					rotation="{state.zenithAngle}"
					size="{moonSize}"
				/>
			</foreignObject>
		</GaugeTime>
		<footer>
			<p>{dict.MOON_PHASE[state.name]}</p>
			<output>{round(state.fraction * 100, 2)}%</output>
		</footer>
	</section>
	<section data-label="timeline">
		<Timeline>
			{#each events as event (`${event.timestamp}/${event.name}`)}
				<Event
					page="{event.secondary ? "moon" : undefined}"
					{event}
					secondary={event.secondary}
				/>
			{/each}
		</Timeline>
	</section>
	<section data-label="phases-calendar" class="card {styles.phases}">
		<header>{dict.TITLE.MOON_PHASE_CALENDAR}</header>
		<div>
			{#each state.phases as { phase, timestamp } (`${phase}/${timestamp}`)}
				<Link
					href="/moon?{new URLSearchParams({ ...$query, date: createQueryDate(new Date(timestamp)) })}"
				>
					<Moon phase="{phase}" size={75} />
					<Datetime date="{new Date(timestamp)}" />
				</Link>
			{/each}
		</div>
	</section>
</div>
