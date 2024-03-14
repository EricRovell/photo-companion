<script lang="ts">
	import { getSunPosition } from "moon-sun-calc";

	import { CardInfo, Event, GaugeTime, Sun, Timeline, ElevationGraph } from "@lib/components";
	import { getSunData } from "@services/sun";
	import { dict } from "@lib/dict";
	import { initTimelineProvider } from "@services/events";
	import { settingsStore as store } from "@lib/stores";
	import { getAngleFromTime } from "@lib/helpers";
	import styles from "./sun.module.css";

	export let date: Date;

	const timelineProvider = initTimelineProvider({
		sunEvents: []
	});

	$: state = getSunData(date, $store.latitude, $store.longitude);
	$: events = timelineProvider.getEvents(date, $store.latitude, $store.longitude);

	const sunSize = 30;
</script>

<div class="{styles.page}">
	<section data-label="sun" class="card">
		<header>
			<h2>{dict.TITLE.SUN_TIMES}</h2>
		</header>
		<GaugeTime
			timeFrom="{state.sunrise}"
			timeTo="{state.sunset}"
			pointerAngle="{getAngleFromTime(date)}"
		>
			<Sun
				x="-{sunSize / 2}"
				y="-{sunSize / 2}"
				width="{sunSize}"
				height="{sunSize}"
			/>
		</GaugeTime>
		<footer class="{styles["gauge-footer"]}">
			<ol>
				<li>
					<span>{state.goldenHourDawn}</span>
					<span>{dict.SUN_TIMES.GOLDEN_HOUR}</span>
					<span>{state.goldenHourDusk}</span>
				</li>
				<li>
					<span>{state.blueHourDawn}</span>
					<span>{dict.SUN_TIMES.BLUE_HOUR}</span>
					<span>{state.blueHourDusk}</span>
				</li>
				<li>
					<span>... — {state.nightEnd}</span>
					<span>{dict.SUN_TIMES.NIGHT}</span>
					<span>{state.nightStart} — ...</span>
				</li>
			</ol>
		</footer>
	</section>
	<section data-label="altitude" class="card">
		<header>
			<h2>{dict.TITLE.ELEVATION_SUN}</h2>
		</header>
		<ElevationGraph
			{date}
			entries="{[
				{
					getAltitude: getSunPosition,
					id: "sun"
				}
			]}"
		/>
	</section>
	<CardInfo data="{{
		[dict.LABEL.DURATION_DAYLIGHT]: state.dayDuration,
		[dict.LABEL.ALTITUDE]: state.position.altitude,
		[dict.LABEL.AZIMUTH]: state.position.azimuth,
		[dict.LABEL.DECLINATION]: state.position.declination,
		[dict.LABEL.ZENITH]: state.position.zenith
	}}" />
	<section data-label="timeline">
		<Timeline>
			{#each events as event (`${event.timestamp}/${event.name}`)}
				<Event {event} />
			{/each}
		</Timeline>
	</section>
</div>
