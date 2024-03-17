<script lang="ts">
	import { query } from "svelte-pathfinder";
	import { Datetime, Link } from "ui";
	import { getMoonPosition, getSunPosition } from "moon-sun-calc";

	import { CardInfo, GaugeTime, Moon, Timeline, Event, ElevationGraph } from "@lib/components";
	import { getMoonData } from "@services/moon";
	import { initTimelineProvider } from "@services/events";
	import { dict } from "@lib/dict";
	import { settingsStore as store } from "@lib/stores";
	import { createQueryDate } from "@lib/helpers";
	import { SUN_EVENT_NAMES } from "@lib/constants";
	import { getAngleFromTime } from "@lib/helpers";
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
			pointerAngle="{getAngleFromTime(date)}"
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
					rotation="{state.rotation}"
					size="{moonSize}"
				/>
			</foreignObject>
		</GaugeTime>
	</section>
	<section data-label="altitude" class="card">
		<header>
			<h2>{dict.TITLE.ELEVATION_MOON}</h2>
		</header>
		<ElevationGraph
			{date}
			entries="{[
				{
					className: styles["elevation-graph-sun"],
					getAltitude: getSunPosition,
					id: "sun",
					pointerSize: 5
				},
				{
					className: styles["elevation-graph-moon"],
					getAltitude: getMoonPosition,
					id: "moon",
					pointerSize: 7
				}
			]}"
		/>
	</section>
	<CardInfo data="{{
		[dict.LABEL.MOON_PHASE]: dict.MOON_PHASE[state.name],
		[dict.LABEL.MOON_ILLUMINATION]: state.fraction,
		[dict.LABEL.DURATION_MOONLIGHT]: state.duration,
		[dict.LABEL.ZENITH]: state.zenith,
		[dict.LABEL.ALTITUDE]: state.altitude,
		[dict.LABEL.AZIMUTH]: state.azimuth,
		[dict.LABEL.DISTANCE]: state.distance,
		[dict.LABEL.PARALLACTIC_ANGLE]: state.parallacticAngle
	}}" />
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
			{#each state.phases as { phaseValue, timestamp } (timestamp)}
				<Link
					href="/moon?{new URLSearchParams({ ...$query, date: createQueryDate(new Date(timestamp)) })}"
				>
					<Moon phase="{phaseValue}" size={75} />
					<Datetime date="{new Date(timestamp)}" />
				</Link>
			{/each}
		</div>
	</section>
</div>
